import { Request, Response } from 'express';
import * as amadeusService from '../services/amadeusService.js';
import { getAgentNotificationEmails } from '../services/emailService.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

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

        const result = await amadeusService.searchFlights({
            from: from as string,
            to: to as string,
            // Normalize date format for providers (Amadeus expects YYYY-MM-DD)
            departureDate: (departureDate as string).split('T')[0],
            tripType: tripType as any,
            returnDate: rawReturnDate ? rawReturnDate.split('T')[0] : undefined,
            adults: adults as string,
            children: children as string,
            travelClass: travelClass as string
        });

        return res.json({
            count: result.flights.length,
            flights: result.flights,
            meta: result.meta
        });

    } catch (error: any) {
        const correlationId = crypto.randomBytes(10).toString('hex');
        console.error('Search controller error:', {
            correlationId,
            message: error?.message,
            name: error?.name,
            provider: error?.provider,
            code: error?.code,
            details: error?.details
        });

        // Provider outage / intermittent failures should be handled as a temporary unavailability (no mock data).
        if (error?.name === 'ProviderUnavailableError' || error?.code === 'PROVIDER_UNAVAILABLE') {
            res.setHeader('x-correlation-id', correlationId);
            res.setHeader('Retry-After', '30');
            return res.status(503).json({
                message: "We couldn't fetch live flight offers right now. Please try again in a moment.",
                code: 'FLIGHTS_PROVIDER_UNAVAILABLE',
                correlationId
            });
        }

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

/**
 * @swagger
 * /api/flights/request-assistance:
 *   post:
 *     summary: Customer requests Luxel team to find a flight for them
 *     tags: [Flights]
 */
export const requestFlightAssistance = async (req: Request, res: Response) => {
    try {
        const { customerEmail, searchPayload } = req.body;

        if (!customerEmail || !searchPayload) {
            return res.status(400).json({ message: 'Customer email and search details are required.' });
        }

        const agentEmails = await getAgentNotificationEmails();
        if (agentEmails.length === 0) {
            console.warn('No agent emails found for flight assistance notification');
            return res.status(200).json({ message: 'Request received. Our team will get back to you.' });
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.ethereal.email',
            port: Number(process.env.SMTP_PORT) || 587,
            secure: Number(process.env.SMTP_PORT) === 465,
            auth: {
                user: process.env.SMTP_USER || 'test@ethereal.email',
                pass: process.env.SMTP_PASS || 'password',
            },
        });

        const { from, to, departure, returnDate, tripType, adults, children, travelClass } = searchPayload;

        const mailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 680px; margin: auto; padding: 24px; border: 1px solid #eee; border-radius: 16px;">
                <h2 style="margin: 0 0 16px 0; color: #111;">🔍 Flight Assistance Request</h2>
                <p style="margin: 0 0 16px 0; color: #444; line-height: 1.6;">
                    A customer could not find flights and has requested the Luxel team to find availability for them.
                </p>

                <div style="background:#fafafa; border:1px solid #f0f0f0; padding:16px; border-radius:12px; margin: 16px 0;">
                    <p style="margin:0; font-size:12px; color:#777; text-transform:uppercase; letter-spacing:0.08em;">Search Details</p>
                    <p style="margin:8px 0 0 0; font-size:14px; color:#444;"><strong>Route:</strong> ${from || 'N/A'} → ${to || 'N/A'}</p>
                    <p style="margin:4px 0 0 0; font-size:14px; color:#444;"><strong>Departure:</strong> ${departure || 'N/A'}</p>
                    <p style="margin:4px 0 0 0; font-size:14px; color:#444;"><strong>Return:</strong> ${returnDate || 'N/A'}</p>
                    <p style="margin:4px 0 0 0; font-size:14px; color:#444;"><strong>Trip Type:</strong> ${tripType || 'ONE_WAY'}</p>
                    <p style="margin:4px 0 0 0; font-size:14px; color:#444;"><strong>Passengers:</strong> ${adults || 1} Adults, ${children || 0} Children</p>
                    <p style="margin:4px 0 0 0; font-size:14px; color:#444;"><strong>Class:</strong> ${travelClass || 'ECONOMY'}</p>
                </div>

                <div style="margin: 16px 0;">
                    <p style="margin:0; font-size:12px; color:#777; text-transform:uppercase; letter-spacing:0.08em;">Customer Contact</p>
                    <p style="margin:6px 0 0 0; font-size:14px; color:#444;"><strong>Email:</strong> ${customerEmail}</p>
                </div>

                <p style="margin: 18px 0 0 0; font-size: 12px; color: #888;">
                    Please respond to the customer directly.
                </p>
            </div>
        `;

        await Promise.allSettled(
            agentEmails.map((email: string) =>
                transporter.sendMail({
                    from: process.env.SMTP_FROM || '"Luxel System" <system@luxel.travel>',
                    to: email,
                    subject: `Flight Assistance Request: ${from || '?'} → ${to || '?'}`,
                    html: mailHtml,
                })
            )
        );

        console.log(`Flight assistance request sent to ${agentEmails.length} agent(s)`);
        return res.status(200).json({ message: 'Your request has been sent to our travel team. We will contact you shortly.' });
    } catch (error: any) {
        console.error('Flight assistance request error:', error);
        return res.status(500).json({ message: 'Error sending flight request', error: error.message });
    }
};
