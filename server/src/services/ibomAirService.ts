import dotenv from 'dotenv';

dotenv.config();

type TripType = 'ONE_WAY' | 'ROUND_TRIP';

type FlightSearchQuery = {
    from: string;
    to: string;
    departureDate: string; // YYYY-MM-DD
    returnDate?: string; // YYYY-MM-DD
    tripType?: TripType;
    adults?: string;
    children?: string;
    travelClass?: string;
};

type IbomAvailableDatesResponse = {
    startDate?: string;
    endDate?: string;
    availableDates?: string[];
};

const BASE_URL = 'https://book-ibomair.crane.aero/ibe';

const QUERY_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes (scrape-like behavior; keep short)
const REQUEST_TIMEOUT_MS = 12_000;

const queryCache: Map<string, { flights: any[]; cachedAt: number; meta: any }> = new Map();

export class IbomAirProviderUnavailableError extends Error {
    provider: string;
    code: string;
    details?: any;

    constructor(message: string, details?: any) {
        super(message);
        this.name = 'ProviderUnavailableError';
        this.provider = 'ibom_air';
        this.code = 'PROVIDER_UNAVAILABLE';
        this.details = details;
    }
}

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

const toIbomDate = (yyyyMmDd: string): string => {
    // Crane endpoints used by Ibom Air return/expect dd.MM.yyyy in several search endpoints.
    const [yyyy, mm, dd] = yyyyMmDd.split('-');
    if (!yyyy || !mm || !dd) return yyyyMmDd;
    return `${dd}.${mm}.${yyyy}`;
};

const buildQueryKey = (query: FlightSearchQuery) =>
    [
        query.from,
        query.to,
        query.departureDate,
        query.tripType || '',
        query.returnDate || '',
        query.adults || '',
        query.children || '',
        query.travelClass || ''
    ].join('|');

const safeJson = async (res: Response) => {
    const text = await res.text();
    try {
        return JSON.parse(text);
    } catch {
        return { __raw: text };
    }
};

const fetchAvailableDates = async (params: {
    depPort: string;
    arrPort: string;
    tripType: TripType;
    adult: number;
    child: number;
    infant: number;
}): Promise<IbomAvailableDatesResponse> => {
    const u = new URL(`${BASE_URL}/search/availableFlightDates`);
    u.searchParams.set('depPort', params.depPort);
    u.searchParams.set('arrPort', params.arrPort);
    u.searchParams.set('tripType', params.tripType);
    u.searchParams.set('adult', String(params.adult));
    u.searchParams.set('child', String(params.child));
    u.searchParams.set('infant', String(params.infant));

    const res = await withTimeout(fetch(u.toString(), { redirect: 'follow' }), REQUEST_TIMEOUT_MS, 'ibom_air.availableFlightDates');
    if (!res.ok) {
        throw new Error(`Ibom Air available dates HTTP ${res.status}`);
    }
    return (await safeJson(res)) as IbomAvailableDatesResponse;
};

/**
 * Ibom Air search integration notes:
 * - Their booking engine is hosted on Crane (HititCS IBE).
 * - Some availability endpoints appear to be protected by Cloudflare and may intermittently return a challenge page.
 * - We currently use the unprotected "availableFlightDates" endpoint as a fast route/date sanity check, and
 *   surface a provider-unavailable error when live offers cannot be fetched.
 *
 * This module is intentionally isolated so we can iterate on the "live offers" portion without touching
 * the rest of the flight search pipeline.
 */
export const searchFlights = async (query: FlightSearchQuery) => {
    const queryKey = buildQueryKey(query);
    const cached = queryCache.get(queryKey);
    const now = Date.now();
    if (cached && now - cached.cachedAt <= QUERY_CACHE_TTL_MS) {
        return { flights: cached.flights, meta: { ...cached.meta, source: 'cache', cachedAt: cached.cachedAt } };
    }

    const tripType: TripType = (query.tripType ||
        (query.returnDate ? 'ROUND_TRIP' : 'ONE_WAY')) as TripType;

    const adult = Math.max(1, Number.parseInt(query.adults || '1', 10) || 1);
    const child = Math.max(0, Number.parseInt(query.children || '0', 10) || 0);
    const infant = 0;

    const departureDateIbom = toIbomDate(query.departureDate);

    try {
        const available = await fetchAvailableDates({
            depPort: query.from,
            arrPort: query.to,
            tripType,
            adult,
            child,
            infant
        });

        const availableDates = Array.isArray(available?.availableDates) ? available.availableDates : [];
        if (availableDates.length > 0 && !availableDates.includes(departureDateIbom)) {
            const meta = {
                source: 'ibom_air',
                stale: false,
                coverage: 'available_dates_only',
                note: 'Route/date not available per Ibom Air booking engine',
                blocked: false
            };
            queryCache.set(queryKey, { flights: [], cachedAt: Date.now(), meta });
            return { flights: [], meta };
        }

        // Live offers extraction (fares, times) is currently blocked by Cloudflare for automated requests
        // in many environments. We fail fast so the aggregator can fall back to other providers.
        throw new IbomAirProviderUnavailableError('Ibom Air live availability is currently blocked by anti-bot protection', {
            stage: 'live_offers',
            hint: 'Requires Cloudflare clearance / browser-fingerprint hardening or an official API feed',
            availableDatesCount: availableDates.length
        });
    } catch (error: any) {
        const details = {
            message: error?.message,
            name: error?.name,
            code: error?.code,
            provider: error?.provider,
            details: error?.details
        };
        throw error instanceof IbomAirProviderUnavailableError
            ? error
            : new IbomAirProviderUnavailableError('Ibom Air provider temporarily unavailable', details);
    }
};

