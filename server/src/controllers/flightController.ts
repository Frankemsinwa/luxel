import { Request, Response } from 'express';
import * as amadeusService from '../services/amadeusService.js';

/**
 * @swagger
 * /api/flights/locations:
 *   get:
 *     summary: Search for airports and cities
 *     tags: [Flights]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *         example: "Lagos"
 *     responses:
 *       200:
 *         description: List of locations
 */
export const searchLocations = async (req: Request, res: Response) => {
    try {
        const { keyword } = req.query;
        if (!keyword) return res.json([]);
        const locations = await amadeusService.searchLocations(keyword as string);
        res.json(locations);
    } catch (error) {
        console.error('Location search controller error:', error);
        res.status(500).json({ message: 'Error searching locations' });
    }
};

/**
 * @swagger
 * /api/flights/search:
 *   get:
 *     summary: Search for flight offers
 *     tags: [Flights]
 *     parameters:
 *       - in: query
 *         name: from
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: to
 *         required: true
 *         schema:
 *           type: string
  *       - in: query
  *         name: departureDate
  *         required: true
  *         schema:
  *           type: string
  *       - in: query
  *         name: tripType
  *         schema:
  *           type: string
  *           enum: [ONE_WAY, ROUND_TRIP]
  *       - in: query
  *         name: returnDate
  *         schema:
  *           type: string
  *       - in: query
  *         name: adults
  *         schema:
  *           type: string
 *       - in: query
 *         name: children
 *         schema:
 *           type: string
 *       - in: query
 *         name: travelClass
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of flight offers
 */
export const searchFlights = async (req: Request, res: Response) => {
    try {
        const { from, to, departureDate, adults, children, travelClass } = req.query;
        const rawTripType = (req.query.tripType as string | undefined) || undefined;
        const rawReturnDate = (req.query.returnDate as string | undefined) || (req.query.return as string | undefined) || undefined;

        if (!from || !to || !departureDate) {
            return res.status(400).json({
                message: 'Missing required search parameters. Needs from, to, and departureDate'
            });
        }

        const tripType = (rawTripType || (rawReturnDate ? 'ROUND_TRIP' : 'ONE_WAY')).toString().toUpperCase();
        if (tripType === 'ROUND_TRIP' && !rawReturnDate) {
            return res.status(400).json({
                message: 'Missing required search parameters for round-trip. Needs returnDate'
            });
        }

        const flights = await amadeusService.searchFlights({
            from: from as string,
            to: to as string,
            departureDate: departureDate as string,
            tripType: tripType as any,
            returnDate: rawReturnDate,
            adults: adults as string,
            children: children as string,
            travelClass: travelClass as string
        });

        return res.json({
            count: flights.length,
            flights: flights
        });

    } catch (error) {
        console.error('Search controller error:', error);
        return res.status(500).json({ message: 'Internal server error while searching flights' });
    }
};

/**
 * @swagger
 * /api/flights/{id}:
 *   get:
 *     summary: Get flight details
 *     tags: [Flights]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Flight details
 */
export const getFlightDetails = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const flight = await amadeusService.getFlightById(id as string);

        if (!flight) {
            return res.status(404).json({ message: 'Flight details not found or expired' });
        }

        return res.json(flight);
    } catch (error) {
        console.error('Flight details controller error:', error);
        return res.status(500).json({ message: 'Internal server error while fetching flight details' });
    }
};
