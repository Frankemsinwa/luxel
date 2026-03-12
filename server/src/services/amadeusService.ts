import Amadeus from 'amadeus';
import dotenv from 'dotenv';

dotenv.config();

let amadeusInstance: any = null;

const getAmadeus = () => {
    if (!process.env.AMADEUS_CLIENT_ID || !process.env.AMADEUS_CLIENT_SECRET) {
        return null;
    }
    if (!amadeusInstance) {
        amadeusInstance = new Amadeus({
            clientId: process.env.AMADEUS_CLIENT_ID,
            clientSecret: process.env.AMADEUS_CLIENT_SECRET
        });
    }
    return amadeusInstance;
};

/**
 * Maps IATA code or name to coordinates/codes (simple mapping for prototype)
 * In a real app, use Amadeus location search.
 */
const getIataCode = (location: string): string => {
    const match = location.match(/\((.*?)\)/);
    return match ? match[1] : location.split(',')[0].substring(0, 3).toUpperCase();
};

const EUR_TO_NGN_RATE = 1750; // Current estimated rate or configurable

// Simple in-memory cache for the prototype
let searchCache: Map<string, any> = new Map();
let queryCache: Map<string, { flights: any[]; cachedAt: number }> = new Map();

const QUERY_CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

export class ProviderUnavailableError extends Error {
    provider: string;
    code: string;
    details?: any;

    constructor(message: string, details?: any) {
        super(message);
        this.name = 'ProviderUnavailableError';
        this.provider = 'amadeus';
        this.code = 'PROVIDER_UNAVAILABLE';
        this.details = details;
    }
}

/**
 * Searches for airports and cities
 */
export const searchLocations = async (keyword: string) => {
    try {
        const amadeus = getAmadeus();
        if (!amadeus) throw new Error('Amadeus credentials missing');

        const response = await amadeus.referenceData.locations.get({
            keyword,
            subType: Amadeus.location.any,
            max: 10
        });

        return response.data.map((loc: any) => ({
            name: loc.name,
            iataCode: loc.iataCode,
            city: loc.address.cityName,
            country: loc.address.countryName,
            type: loc.subType
        }));
    } catch (error: any) {
        console.warn('Amadeus Location search failed, attempting global fallback:', error.message);
        
        try {
            // Global Fallback using Travelpayouts (No Key Required)
            const response = await fetch(`https://autocomplete.travelpayouts.com/places2?term=${keyword}&locale=en&types[]=city&types[]=airport`);
            const data: any = await response.json();
            
            return data.map((item: any) => ({
                name: item.name || item.main_airport_name,
                iataCode: item.code,
                city: item.city_name || item.name,
                country: item.country_name,
                type: item.type?.toUpperCase() || 'LOCATION'
            }));
        } catch (fallbackError) {
            console.error('All location search methods failed');
            // Hardcoded Nigerian fallback as last resort
            const nigeriaCities = [
                { name: 'Murtala Muhammed', iataCode: 'LOS', city: 'Lagos', country: 'Nigeria', type: 'AIRPORT' },
                { name: 'Nnamdi Azikiwe', iataCode: 'ABV', city: 'Abuja', country: 'Nigeria', type: 'AIRPORT' },
                { name: 'Port Harcourt', iataCode: 'PHC', city: 'Port Harcourt', country: 'Nigeria', type: 'AIRPORT' },
                { name: 'Mallam Aminu Kano', iataCode: 'KAN', city: 'Kano', country: 'Nigeria', type: 'AIRPORT' },
                { name: 'Akwa Ibom', iataCode: 'QUO', city: 'Uyo', country: 'Nigeria', type: 'AIRPORT' }
            ];
            return nigeriaCities.filter(c => 
                c.city.toLowerCase().includes(keyword.toLowerCase()) || 
                c.iataCode.toLowerCase().includes(keyword.toLowerCase())
            );
        }
    }
};

/**
 * Searches for flight offers using Amadeus API
 */
export const searchFlights = async (searchParams: {
    from: string;
    to: string;
    departureDate: string;
    tripType?: 'ONE_WAY' | 'ROUND_TRIP';
    returnDate?: string;
    adults?: string;
    children?: string;
    travelClass?: string;
}) => {
    const { from, to, departureDate, tripType, returnDate, adults, children, travelClass } = searchParams;
    const originCode = getIataCode(from);
    const destinationCode = getIataCode(to);

    const depDateOnly = (departureDate || '').includes('T') ? departureDate.split('T')[0] : departureDate;
    const retDateOnly = returnDate
        ? ((returnDate || '').includes('T') ? returnDate.split('T')[0] : returnDate)
        : undefined;

    const queryKey = JSON.stringify({
        originCode,
        destinationCode,
        depDateOnly,
        retDateOnly,
        tripType: (tripType || (retDateOnly ? 'ROUND_TRIP' : 'ONE_WAY')).toString().toUpperCase(),
        adults: adults || '1',
        children: children || '0',
        travelClass: travelClass || 'ECONOMY'
    });

    try {
        const amadeus = getAmadeus();
        if (!amadeus) throw new ProviderUnavailableError('Amadeus credentials missing');

        const query: any = {
            originLocationCode: originCode,
            destinationLocationCode: destinationCode,
            departureDate: depDateOnly,
            adults: adults || '1',
            max: '20'
        };

        if ((tripType || '').toUpperCase() === 'ROUND_TRIP' && retDateOnly) {
            query.returnDate = retDateOnly;
        }

        if (children && parseInt(children) > 0) query.children = children;
        if (travelClass && travelClass !== 'ECONOMY') query.travelClass = travelClass;

        const shouldRetry = (err: any) => {
            const status = err?.response?.statusCode || err?.response?.status || err?.statusCode;
            // Common transient cases: rate limits, upstream errors, timeouts/network
            return status === 429 || (typeof status === 'number' && status >= 500) || err?.code === 'ETIMEDOUT' || err?.code === 'ECONNRESET';
        };

        let response: any = null;
        for (let attempt = 1; attempt <= 2; attempt++) {
            try {
                response = await amadeus.shopping.flightOffersSearch.get(query);
                break;
            } catch (err: any) {
                if (attempt < 2 && shouldRetry(err)) {
                    await new Promise((r) => setTimeout(r, 300));
                    continue;
                }
                throw err;
            }
        }

        const mappedFlights = response.data.map((offer: any) => {
            const rawPrice = parseFloat(offer.price.total);
            const convertedPrice = Math.round(rawPrice * EUR_TO_NGN_RATE);

            const detailedItineraries = offer.itineraries.map((itinerary: any) => ({
                duration: itinerary.duration.replace('PT', '').toLowerCase(),
                segments: itinerary.segments.map((segment: any) => ({
                    departure: segment.departure,
                    arrival: segment.arrival,
                    carrierCode: segment.carrierCode,
                    logo: `https://pics.avs.io/al/${segment.carrierCode}.png`,
                    number: segment.number,
                    aircraft: segment.aircraft.code,
                    duration: segment.duration.replace('PT', '').toLowerCase(),
                }))
            }));

            const baggageInfo = offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.includedCheckedBags;

            return {
                id: offer.id,
                airline: offer.validatingAirlineCodes[0] || 'Unknown',
                logo: `https://pics.avs.io/al/${offer.validatingAirlineCodes[0]}.png`,
                departureTime: offer.itineraries[0].segments[0].departure.at.split('T')[1].substring(0, 5),
                departureCode: offer.itineraries[0].segments[0].departure.iataCode,
                departureCity: originCode,
                arrivalTime: offer.itineraries[0].segments[offer.itineraries[0].segments.length - 1].arrival.at.split('T')[1].substring(0, 5),
                arrivalCode: offer.itineraries[0].segments[offer.itineraries[0].segments.length - 1].arrival.iataCode,
                arrivalCity: destinationCode,
                duration: offer.itineraries[0].duration.replace('PT', '').toLowerCase(),
                stops: offer.itineraries[0].segments.length > 1 ? `${offer.itineraries[0].segments.length - 1} STOP(S)` : 'NON-STOP',
                price: convertedPrice,
                currency: 'NGN',
                originalPrice: rawPrice,
                originalCurrency: offer.price.currency,
                itineraries: detailedItineraries,
                baggage: baggageInfo,
                raw: offer // Important for final booking
            };
        });

        // Cache results so they can be retrieved by ID
        mappedFlights.forEach((f: any) => searchCache.set(f.id, f));
        queryCache.set(queryKey, { flights: mappedFlights, cachedAt: Date.now() });

        return { flights: mappedFlights, meta: { source: 'amadeus', stale: false } };

    } catch (error: any) {
        const cached = queryCache.get(queryKey);
        const now = Date.now();
        if (cached && now - cached.cachedAt <= QUERY_CACHE_TTL_MS) {
            return { flights: cached.flights, meta: { source: 'cache', stale: true, cachedAt: cached.cachedAt } };
        }

        const details = {
            message: error?.message,
            code: error?.code,
            description: error?.description,
            statusCode: error?.response?.statusCode,
            result: error?.response?.result
        };

        // Production-safe behavior: no mock data. Surface a provider-unavailable error.
        throw (error instanceof ProviderUnavailableError)
            ? error
            : new ProviderUnavailableError('Live flight search is temporarily unavailable', details);
    }
};

/**
 * Retrieves a flight from the search cache
 */
export const getFlightById = async (id: string) => {
    return searchCache.get(id) || null;
};
