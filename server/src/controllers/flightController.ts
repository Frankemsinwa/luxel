import { Request, Response } from 'express';
import * as amadeusService from '../services/amadeusService.js';
import * as flightSearchService from '../services/flightSearchService.js';
import { getAgentNotificationEmails } from '../services/emailService.js';
import { supabaseAdmin } from '../config/supabase.js';
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

        const result = await flightSearchService.searchFlights({
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
        const id = req.params.id as string;

        if (id.startsWith('manual-')) {
            const uuid = id.replace('manual-', '');
            const { data, error } = await supabaseAdmin
                .from('manual_flights')
                .select('*')
                .eq('id', uuid)
                .single();

            if (error || !data) {
                return res.status(404).json({ message: 'Manual flight not found' });
            }

            // Map to standard search result format for the frontend details page
            return res.json({
                id: `manual-${data.id}`,
                airlineCode: data.airline_code,
                airline: data.airline_name,
                logo: `https://www.gstatic.com/flights/airline_logos/70px/${data.airline_code}.png`,
                departureTime: data.departure_time,
                departureCode: data.origin,
                departureCity: data.origin,
                arrivalTime: data.arrival_time,
                arrivalCode: data.destination,
                arrivalCity: data.destination,
                duration: data.duration,
                stops: data.stops,
                price: Number(data.price),
                currency: data.currency || 'NGN',
                itineraries: data.itineraries, // Include structured itinerary
                isManual: true,
                baggage: { weight: 23, weightUnit: 'KG' }
            });
        }

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
        const { customerEmail, customerName, customerPhone, specialRequests, searchPayload, userId } = req.body;

        if (!customerEmail || !searchPayload) {
            return res.status(400).json({ message: 'Customer email and search details are required.' });
        }

        // Create request record in database
        const requestData = {
            user_id: userId || null,
            service_type: 'FLIGHT',
            status: 'OPEN',
            priority: 'HIGH',
            request_type: 'LUXEL_ASSISTANCE',
            details: {
                customer_email: customerEmail,
                customer_name: customerName || '',
                customer_phone: customerPhone || '',
                special_requests: specialRequests || '',
                request_source: 'flight_search_no_results',
                search_payload: searchPayload,
                from: searchPayload.from,
                to: searchPayload.to,
                departure: searchPayload.departure,
                return_date: searchPayload.returnDate,
                trip_type: searchPayload.tripType,
                adults: searchPayload.adults,
                children: searchPayload.children,
                travel_class: searchPayload.travelClass,
            },
        };

        const { data: request, error: requestError } = await supabaseAdmin
            .from('requests')
            .insert(requestData)
            .select()
            .single();

        if (requestError) {
            console.error('Error creating assistance request:', requestError);
            return res.status(500).json({ message: 'Error creating request', error: requestError.message });
        }

        const agentEmails = await getAgentNotificationEmails();
        if (agentEmails.length === 0) {
            console.warn('No agent emails found for flight assistance notification');
            return res.status(200).json({ message: 'Request received. Our team will get back to you.', requestId: request.id });
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
        const agentDashboardUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/agent/requests/${request.id}`;

        const mailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 680px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 16px; background: #ffffff;">
                <div style="text-align: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #f0f0f0;">
                    <h1 style="margin: 0 0 8px 0; color: #1a1a1a; font-size: 24px;">✈️ Flight Assistance Request</h1>
                    <p style="margin: 0; color: #666; font-size: 14px;">Request ID: <strong>${request.id.substring(0, 8)}</strong></p>
                </div>

                <p style="margin: 0 0 20px 0; color: #444; line-height: 1.6; font-size: 15px;">
                    A customer could not find suitable flights and has requested the Luxel team to manually search and book for them.
                </p>

                <!-- Customer Information -->
                <div style="background: #fafafa; border: 1px solid #f0f0f0; padding: 20px; border-radius: 12px; margin: 20px 0;">
                    <p style="margin: 0 0 16px 0; font-size: 12px; color: #777; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600;">Customer Information</p>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; font-size: 14px; color: #777; width: 120px;">Name</td>
                            <td style="padding: 8px 0; font-size: 14px; color: #333; font-weight: 500;">${customerName || 'Not provided'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-size: 14px; color: #777;">Email</td>
                            <td style="padding: 8px 0; font-size: 14px; color: #333; font-weight: 500;"><a href="mailto:${customerEmail}" style="color: #d4a017; text-decoration: none;">${customerEmail}</a></td>
                        </tr>
                        ${customerPhone ? `
                        <tr>
                            <td style="padding: 8px 0; font-size: 14px; color: #777;">Phone</td>
                            <td style="padding: 8px 0; font-size: 14px; color: #333; font-weight: 500;"><a href="tel:${customerPhone}" style="color: #d4a017; text-decoration: none;">${customerPhone}</a></td>
                        </tr>` : ''}
                        ${specialRequests ? `
                        <tr>
                            <td style="padding: 8px 0; font-size: 14px; color: #777; vertical-align: top;">Special Requests</td>
                            <td style="padding: 8px 0; font-size: 14px; color: #333; font-weight: 500;">${specialRequests}</td>
                        </tr>` : ''}
                    </table>
                </div>

                <!-- Flight Search Details -->
                <div style="background: #fafafa; border: 1px solid #f0f0f0; padding: 20px; border-radius: 12px; margin: 20px 0;">
                    <p style="margin: 0 0 16px 0; font-size: 12px; color: #777; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600;">Flight Search Parameters</p>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; font-size: 14px; color: #777; width: 120px;">Route</td>
                            <td style="padding: 8px 0; font-size: 14px; color: #333; font-weight: 600;">${from || 'N/A'} → ${to || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-size: 14px; color: #777;">Departure</td>
                            <td style="padding: 8px 0; font-size: 14px; color: #333;">${departure || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-size: 14px; color: #777;">Return</td>
                            <td style="padding: 8px 0; font-size: 14px; color: #333;">${returnDate || '<span style="color: #999;">One Way</span>'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-size: 14px; color: #777;">Trip Type</td>
                            <td style="padding: 8px 0; font-size: 14px; color: #333;">${tripType || 'ONE_WAY'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-size: 14px; color: #777;">Passengers</td>
                            <td style="padding: 8px 0; font-size: 14px; color: #333;">${adults || 1} Adult${(adults || 1) > 1 ? 's' : ''}${children && Number(children) > 0 ? `, ${children} Child${Number(children) > 1 ? 'ren' : ''}` : ''}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-size: 14px; color: #777;">Cabin Class</td>
                            <td style="padding: 8px 0; font-size: 14px; color: #333; text-transform: capitalize;">${(travelClass || 'ECONOMY').toLowerCase()}</td>
                        </tr>
                    </table>
                </div>

                <!-- Action Required -->
                <div style="background: #fff8e1; border: 1px solid #ffe082; padding: 16px; border-radius: 12px; margin: 20px 0; text-align: center;">
                    <p style="margin: 0 0 12px 0; font-size: 13px; color: #8d6e00; font-weight: 600;">Action Required</p>
                    <a href="${agentDashboardUrl}" style="display: inline-block; background: #1a1a1a; color: #f5e6a0; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
                        View & Handle Request
                    </a>
                    <p style="margin: 12px 0 0 0; font-size: 12px; color: #888;">Or reply directly to ${customerEmail}</p>
                </div>

                <p style="margin: 20px 0 0 0; font-size: 12px; color: #999; text-align: center;">
                    Luxel Travel Concierge System
                </p>
            </div>
        `;

        await Promise.allSettled(
            agentEmails.map((email: string) =>
                transporter.sendMail({
                    from: process.env.SMTP_FROM || '"Luxel System" <system@luxel.travel>',
                    to: email,
                    subject: `✈️ Flight Assistance: ${from || '?'} → ${to || '?'} | ${customerName || 'Customer'}`,
                    html: mailHtml,
                })
            )
        );

        console.log(`Flight assistance request ${request.id} sent to ${agentEmails.length} agent(s)`);
        return res.status(200).json({ 
            message: 'Your request has been sent to our travel team. We will contact you shortly.', 
            requestId: request.id 
        });
    } catch (error: any) {
        console.error('Flight assistance request error:', error);
        return res.status(500).json({ message: 'Error sending flight request', error: error.message });
    }
};
