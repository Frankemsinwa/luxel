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

/**
 * Searches for flight offers using Amadeus API
 */
export const searchFlights = async (searchParams: {
    from: string;
    to: string;
    departureDate: string;
    passengers: string;
}) => {
    const { from, to, departureDate, passengers } = searchParams;
    const originCode = getIataCode(from);
    const destinationCode = getIataCode(to);
    const adults = parseInt(passengers) || 1;

    try {
        // Get lazy instance
        const amadeus = getAmadeus();

        // Check if Amadeus credentials exist
        if (!amadeus) {
            throw new Error('Amadeus credentials missing');
        }

        const response = await amadeus.shopping.flightOffersSearch.get({
            originLocationCode: originCode,
            destinationLocationCode: destinationCode,
            departureDate: departureDate.split('T')[0],
            adults: adults.toString(),
            max: '20'
        });

        return response.data.map((offer: any) => {
            const rawPrice = parseFloat(offer.price.total);
            const convertedPrice = Math.round(rawPrice * EUR_TO_NGN_RATE);

            return {
                id: offer.id,
                airline: offer.validatingAirlineCodes[0] || 'Unknown',
                logo: offer.validatingAirlineCodes[0],
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
                raw: offer // Keep original data for booking phase
            };
        });
    } catch (error: any) {
        console.warn('Amadeus API failed or not configured, using enhanced mock data:', error.message);
        // Return enhanced mock data if live API fails
        return [
            {
                id: 'MOCK-1',
                airline: 'British Airways',
                logo: 'BA',
                departureTime: '10:30',
                departureCode: originCode,
                departureCity: from.split(',')[0],
                arrivalTime: '18:45',
                arrivalCode: destinationCode,
                arrivalCity: to.split(',')[0],
                duration: '8h 15m',
                stops: 'NON-STOP',
                price: 945000, // Pre-calculated mock NGN price
                currency: 'NGN'
            }
        ];
    }
};
