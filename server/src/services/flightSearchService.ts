import * as amadeusService from './amadeusService.js';
import * as ibomAirService from './ibomAirService.js';

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

export const searchFlights = async (query: FlightSearchQuery) => {
    const enableIbomAir = toBool(process.env.FLIGHT_ENABLE_IBOM_AIR);
    const providerTimeoutMs = Number.parseInt(process.env.FLIGHT_PROVIDER_TIMEOUT_MS || '15000', 10) || 15000;

    if (!enableIbomAir) {
        return amadeusService.searchFlights(query);
    }

    const tasks: Array<Promise<ProviderResult>> = [];

    tasks.push(
        withTimeout(amadeusService.searchFlights(query), providerTimeoutMs, 'amadeus.searchFlights')
            .then((result) => ({ ok: true as const, provider: 'amadeus', flights: result.flights, meta: result.meta }))
            .catch((error) => ({ ok: false as const, provider: 'amadeus', error }))
    );

    tasks.push(
        withTimeout(ibomAirService.searchFlights(query as any), providerTimeoutMs, 'ibom_air.searchFlights')
            .then((result: any) => ({ ok: true as const, provider: 'ibom_air', flights: result.flights, meta: result.meta }))
            .catch((error) => ({ ok: false as const, provider: 'ibom_air', error }))
    );

    const settled = await Promise.all(tasks);

    const successes = settled.filter((r): r is Extract<ProviderResult, { ok: true }> => r.ok);
    const failures = settled.filter((r): r is Extract<ProviderResult, { ok: false }> => !r.ok);

    if (failures.length > 0) {
        failures.forEach((f) => {
            const err = normalizeError(f.error);
            console.warn('[FlightSearch] Provider failed:', { provider: f.provider, name: err.name, code: err.code, message: err.message });
        });
    }

    if (successes.length === 0) {
        // Preserve existing controller behavior: throw a ProviderUnavailableError so callers can return 503.
        // Prefer amadeus error shape when present.
        const primary = failures.find((f) => f.provider === 'amadeus')?.error || failures[0]?.error;
        throw primary;
    }

    const flights = successes.flatMap((s) => (s.flights || []).map((f: any) => ({ ...f, provider: s.provider })));
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
            ...failures.reduce((acc: any, f) => {
                acc[f.provider] = { ok: false, error: normalizeError(f.error) };
                return acc;
            }, {})
        }
    };

    return { flights, meta };
};
