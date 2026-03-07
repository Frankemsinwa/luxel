import { Request, Response } from 'express';
import * as amadeusService from '../services/amadeusService.js';

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
 *         example: "London (LHR)"
 *       - in: query
 *         name: to
 *         required: true
 *         schema:
 *           type: string
 *         example: "New York (JFK)"
 *       - in: query
 *         name: departureDate
 *         required: true
 *         schema:
 *           type: string
 *         example: "2026-10-12"
 *       - in: query
 *         name: passengers
 *         schema:
 *           type: string
 *         default: "1"
 *     responses:
 *       200:
 *         description: List of flight offers
 *       400:
 *         description: Missing required search parameters
 */
export const searchFlights = async (req: Request, res: Response) => {
    try {
        const { from, to, departureDate, passengers } = req.query;

        if (!from || !to || !departureDate) {
            return res.status(400).json({
                message: 'Missing required search parameters. Needs from, to, and departureDate'
            });
        }

        const flights = await amadeusService.searchFlights({
            from: from as string,
            to: to as string,
            departureDate: departureDate as string,
            passengers: passengers as string || '1'
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
    const { id } = req.params;
    res.json({ id, message: 'Flight details coming soon in Phase 3' });
};
