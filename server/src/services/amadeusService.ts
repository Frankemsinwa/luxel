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

    try {
        const amadeus = getAmadeus();
        if (!amadeus) throw new Error('Amadeus credentials missing');

        const query: any = {
            originLocationCode: originCode,
            destinationLocationCode: destinationCode,
            departureDate: departureDate.split('T')[0],
            adults: adults || '1',
            max: '20'
        };

        if ((tripType || '').toUpperCase() === 'ROUND_TRIP' && returnDate) {
            query.returnDate = returnDate.split('T')[0];
        }

        if (children && parseInt(children) > 0) query.children = children;
        if (travelClass && travelClass !== 'ECONOMY') query.travelClass = travelClass;

        const response = await amadeus.shopping.flightOffersSearch.get(query);

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

        return mappedFlights;

    } catch (error: any) {
        console.warn('Amadeus API failed or not configured, using enhanced mock data:', error.message);

        const mockResult = [
            {
                id: 'MOCK-' + Math.random().toString(36).substr(2, 9),
                airline: 'British Airways',
                logo: 'https://pics.avs.io/al/BA.png',
                departureTime: '10:30',
                departureCode: originCode,
                departureCity: from.split(',')[0],
                arrivalTime: '18:45',
                arrivalCode: destinationCode,
                arrivalCity: to.split(',')[0],
                duration: '8h 15m',
                stops: 'NON-STOP',
                price: 945000,
                currency: 'NGN',
                itineraries: [
                    {
                        duration: '8h 15m',
                        segments: [
                            {
                                departure: { iataCode: originCode, at: '2026-10-12T10:30:00', terminal: '5' },
                                arrival: { iataCode: destinationCode, at: '2026-10-12T18:45:00', terminal: '3' },
                                carrierCode: 'BA',
                                logo: 'https://pics.avs.io/al/BA.png',
                                number: '005',
                                aircraft: '787-9',
                                duration: '8h 15m'
                            }
                        ]
                    }
                ],
                baggage: { quantity: 2 }
            }
        ];

        mockResult.forEach(f => searchCache.set(f.id, f));
        return mockResult;
    }
};

/**
 * Retrieves a flight from the search cache
 */
export const getFlightById = async (id: string) => {
    return searchCache.get(id) || null;
};
