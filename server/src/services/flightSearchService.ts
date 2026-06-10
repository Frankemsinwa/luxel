import * as amadeusService from './amadeusService.js';
import * as ibomAirService from './ibomAirService.js';
import { supabaseAdmin } from '../config/supabase.js';

type FlightSearchQuery = Parameters<typeof amadeusService.searchFlights>[0];

type ProviderResult =
    | { ok: true; provider: string; flights: any[]; meta: any }
    | { ok: false; provider: string; error: any };

const toBool = (v: string | undefined) => (v || '').toLowerCase() === 'true' || v === '1';

const withTimeout = async <T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> => {
    let timeoutHandle: NodeJS.Timeout | undefined;
    const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutHandle = setTimeout(() => reject(new Error(`Timeout: ${label}`)), timeoutMs);
    });
    try {
        return await Promise.race([promise, timeoutPromise]);
    } finally {
        if (timeoutHandle) clearTimeout(timeoutHandle);
    }
};

const normalizeError = (error: any) => ({
    name: error?.name,
    message: error?.message,
    provider: error?.provider,
    code: error?.code,
    details: error?.details
});

const sortByPrice = (a: any, b: any) => {
    const ap = typeof a?.price === 'number' ? a.price : Number.POSITIVE_INFINITY;
    const bp = typeof b?.price === 'number' ? b.price : Number.POSITIVE_INFINITY;
    return ap - bp;
};

const extractIATA = (val: string) => {
    const match = val.match(/\(([A-Z]{3})\)/);
    return match ? match[1] : val.toUpperCase();
};

/**
 * Applies price overrides based on route, airline, and date.
 * Prioritizes date-specific overrides over global ones.
 * Ignores expired overrides.
 */
const applyOverrides = async (flights: any[], origin: string, destination: string, departureDate: string) => {
    try {
        const originCode = extractIATA(origin);
        const destinationCode = extractIATA(destination);

        const { data: overrides, error } = await supabaseAdmin
            .from('flight_price_overrides')
            .select('*')
            .eq('origin', originCode)
            .eq('destination', destinationCode)
            .eq('is_active', true);

        if (error || !overrides || overrides.length === 0) return flights;

        const now = new Date();

        return flights.map(flight => {
            const airlineCode = flight.airlineCode || flight.carrierCode;
            if (!airlineCode) return flight;

            // Find matching overrides for this airline
            const airlineOverrides = overrides.filter(o => o.airline_code === airlineCode);
            if (airlineOverrides.length === 0) return flight;

            // Sort so date-specific comes before global (null date)
            const sorted = airlineOverrides.sort((a, b) => {
                if (a.departure_date && !b.departure_date) return -1;
                if (!a.departure_date && b.departure_date) return 1;
                return 0;
            });

            // Find first match that isn't expired
            const match = sorted.find(o => {
                // Check date match if specified
                if (o.departure_date && o.departure_date !== departureDate) return false;
                
                // Check expiration
                if (o.valid_until && new Date(o.valid_until) < now) return false;

                return true;
            });

            if (match) {
                return {
                    ...flight,
                    originalPrice: flight.price,
                    price: Number(match.override_price),
                    isOverridden: true
                };
            }

            return flight;
        });
    } catch (error) {
        console.error('Error applying overrides:', error);
        return flights;
    }
};

const fetchManualFlights = async (origin: string, destination: string, departureDate: string) => {
    try {
        const originCode = extractIATA(origin);
        const destinationCode = extractIATA(destination);

        const { data, error } = await supabaseAdmin
            .from('manual_flights')
            .select('*')
            .eq('origin', originCode)
            .eq('destination', destinationCode)
            .eq('departure_date', departureDate);

        if (error || !data) return [];

        return data.map(f => ({
            id: `manual-${f.id}`,
            airlineCode: f.airline_code,
            airline: f.airline_name,
            logo: `https://www.gstatic.com/flights/airline_logos/70px/${f.airline_code}.png`,
            departureTime: f.departure_time,
            departureCode: f.origin,
            departureCity: f.origin,
            arrivalTime: f.arrival_time,
            arrivalCode: f.destination,
            arrivalCity: f.destination,
            duration: f.duration,
            stops: f.stops,
            price: Number(f.price),
            currency: f.currency || 'NGN',
            itineraries: f.itineraries, // Include structured itinerary
            isManual: true,
            baggage: { weight: 23, weightUnit: 'KG' } // Default for manual
        }));
    } catch (error) {
        console.error('Error fetching manual flights:', error);
        return [];
    }
};

export const searchFlights = async (query: FlightSearchQuery) => {
    const enableIbomAir = toBool(process.env.FLIGHT_ENABLE_IBOM_AIR);
    const providerTimeoutMs = Number.parseInt(process.env.FLIGHT_PROVIDER_TIMEOUT_MS || '15000', 10) || 15000;

    const tasks: Array<Promise<ProviderResult>> = [];

    // 1. Amadeus Task
    tasks.push(
        withTimeout(amadeusService.searchFlights(query), providerTimeoutMs, 'amadeus.searchFlights')
            .then((result) => ({ ok: true as const, provider: 'amadeus', flights: result.flights, meta: result.meta }))
            .catch((error) => ({ ok: false as const, provider: 'amadeus', error }))
    );

    // 2. Ibom Air Task (if enabled)
    if (enableIbomAir) {
        tasks.push(
            withTimeout(ibomAirService.searchFlights(query as any), providerTimeoutMs, 'ibom_air.searchFlights')
                .then((result: any) => ({ ok: true as const, provider: 'ibom_air', flights: result.flights, meta: result.meta }))
                .catch((error) => ({ ok: false as const, provider: 'ibom_air', error }))
        );
    }

    const settled = await Promise.all(tasks);

    const successes = settled.filter((r): r is Extract<ProviderResult, { ok: true }> => r.ok);
    const failures = settled.filter((r): r is Extract<ProviderResult, { ok: false }> => !r.ok);

    // Fetch Manual Flights in parallel
    const manualFlightsPromise = fetchManualFlights(query.from, query.to, query.departureDate);

    if (failures.length > 0) {
        failures.forEach((f) => {
            const err = normalizeError(f.error);
            console.warn('[FlightSearch] Provider failed:', { provider: f.provider, name: err.name, code: err.code, message: err.message });
        });
    }

    // Merge successes
    let flights = successes.flatMap((s) => (s.flights || []).map((f: any) => ({ ...f, provider: s.provider })));
    
    // Add Manual Flights
    const manualFlights = await manualFlightsPromise;
    flights = [...flights, ...manualFlights];

    // Apply Overrides
    flights = await applyOverrides(flights, query.from, query.to, query.departureDate);

    flights.sort(sortByPrice);

    const meta = {
        source: 'aggregate',
        providers: {
            ...(successes.find((s) => s.provider === 'amadeus') && {
                amadeus: { ok: true, meta: successes.find((s) => s.provider === 'amadeus')?.meta, count: successes.find((s) => s.provider === 'amadeus')?.flights?.length || 0 }
            }),
            ...(successes.find((s) => s.provider === 'ibom_air') && {
                ibom_air: { ok: true, meta: successes.find((s) => s.provider === 'ibom_air')?.meta, count: successes.find((s) => s.provider === 'ibom_air')?.flights?.length || 0 }
            }),
            ...(manualFlights.length > 0 && {
                manual: { ok: true, count: manualFlights.length }
            }),
            ...failures.reduce((acc: any, f) => {
                acc[f.provider] = { ok: false, error: normalizeError(f.error) };
                return acc;
            }, {})
        }
    };

    return { flights, meta };
};
