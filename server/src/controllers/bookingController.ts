import { Request, Response } from 'express';
import { supabase, supabaseAdmin } from '../config/supabase.js';
import * as paymentService from '../services/paymentService.js';
import { getAgentNotificationEmails, sendAgentFlightNotification } from '../services/emailService.js';
import crypto from 'crypto';

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a new flight booking request
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - flightData
 *               - totalPrice
 *               - passengers
 *             properties:
 *               flightData:
 *                 type: object
 *               totalPrice:
 *                 type: number
 *               passengers:
 *                 type: array
 *                 items:
 *                   type: object
 *               contactInfo:
 *                 type: object
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export const createBooking = async (req: any, res: Response) => {
    try {
        const { flightData, totalPrice, passengers, contactInfo, tripDetails, pricing } = req.body;
        const userId = req.user?.id || null; // optional (guest allowed)

        if (!flightData || !totalPrice || !passengers) {
            return res.status(400).json({ message: 'Missing booking details' });
        }

        // Never persist passport numbers (privacy). If older clients still send it, strip it here.
        const safePassengers = Array.isArray(passengers)
            ? passengers.map((p: any) => {
                if (!p || typeof p !== 'object') return p;
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { passportNumber, ...rest } = p;
                return rest;
            })
            : passengers;

        // Guest tracking token: used for resuming status without logging in.
        const guestToken = userId
            ? null
            : crypto.randomBytes(24).toString('base64url'); // URL-safe token

        // 1. Create Booking record
        const { data: booking, error: bookingError } = await supabaseAdmin
            .from('bookings')
            .insert({
                user_id: userId,
                guest_access_token: guestToken,
                flight_data: {
                    ...flightData,
                    passengers: safePassengers,
                    contact: contactInfo,
                    trip_details: tripDetails,
                    pricing
                },
                total_price: totalPrice,
                status: 'PENDING',
                booking_reference: `LX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
            })
            .select()
            .single();

        if (bookingError) throw bookingError;

        // 2. Create Agent Request record
        const { data: request, error: requestError } = await supabaseAdmin
            .from('requests')
            .insert({
                user_id: userId,
                service_type: 'FLIGHT',
                details: {
                    booking_id: booking.id,
                    passengers: safePassengers,
                    contact: contactInfo,
                    itinerary: `${flightData.departureCode} -> ${flightData.arrivalCode}`,
                    flight_id: flightData.id,
                    flight_data: flightData,
                    trip_details: tripDetails,
                    pricing,
                    guest_access_token: guestToken
                },
                status: 'OPEN',
                priority: 'NORMAL'
            })
            .select()
            .single();

        if (requestError) throw requestError;

        // 3. Notify agents via email (do not fail booking creation if email fails)
        try {
            const recipients = await getAgentNotificationEmails();

            if (recipients.length > 0) {
                const origin = (req.headers.origin as string) || (req.headers.referer as string) || '';
                await Promise.allSettled(
                    recipients.map((email) =>
                        sendAgentFlightNotification(email, {
                            requestId: request.id,
                            bookingRef: booking.booking_reference,
                            itinerary: `${flightData.departureCode} -> ${flightData.arrivalCode}`,
                            totalPrice,
                            contact: contactInfo,
                            passengers: safePassengers,
                            tripDetails,
                            agentLink: origin ? `${origin.replace(/\/$/, '')}/agent/requests/${request.id}` : undefined
                        })
                    )
                );
            }
        } catch (notifyErr) {
            console.error('Agent flight notification failed:', notifyErr);
        }

        return res.status(201).json({
            message: 'Booking request received. Our agents are verifying availability.',
            bookingId: booking.id,
            bookingRef: booking.booking_reference,
            requestId: request.id,
            guestToken: guestToken
        });

    } catch (error: any) {
        console.error('Booking creation error:', error);
        return res.status(500).json({ message: 'Error processing your booking', error: error.message });
    }
};

/**
 * @swagger
 * /api/bookings/my-trips:
 *   get:
 *     summary: Get all bookings for the authenticated user
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user bookings
 */
export const getMyTrips = async (req: any, res: Response) => {
    const userId = req.user?.id;
    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
};

/**
 * @swagger
 * /api/bookings/{id}/pay:
 *   post:
 *     summary: Initialize payment for a booking
 *     tags: [Bookings, Payment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment initialized, returns authorization_url
 */
export const initializePayment = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        // 1. Get booking details
        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .select('*')
            .eq('id', id)
            .eq('user_id', userId)
            .single();

        if (bookingError || !booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // 2. Initialize Paystack Transaction
        const paymentData = await paymentService.initializeTransaction({
            email: req.user.email || 'traveler@luxel.travel', // Fallback for prototype
            amount: booking.total_price * 100, // Convert to Kobo
            metadata: {
                booking_id: booking.id,
                reference: booking.booking_reference
            },
            callback_url: `${req.headers.origin}/flights/status/success?ref=${booking.booking_reference}`
        });

        // 3. Update booking with payment reference (optional but good practice)
        await supabaseAdmin
            .from('bookings')
            .update({
                payment_reference: paymentData.data.reference
            })
            .eq('id', booking.id);

        return res.json({
            message: 'Payment initialized',
            authorization_url: paymentData.data.authorization_url,
            reference: paymentData.data.reference
        });

    } catch (error: any) {
        console.error('Payment initialization error:', error);
        return res.status(500).json({ message: error.message });
    }
};

import { generateTicketPdf } from '../services/ticketService.js';
import { sendETicketEmail } from '../services/emailService.js';

/**
 * @swagger
 * /api/bookings/verify-payment/{reference}:
 *   get:
 *     summary: Verify a Paystack transaction and update booking
 *     tags: [Bookings, Payment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reference
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment verified and booking updated
 */
export const verifyPayment = async (req: any, res: Response) => {
    try {
        const { reference } = req.params;
        const userId = req.user?.id || null;
        const guestToken = (req.headers['x-guest-token'] as string | undefined) || (req.query.guestToken as string | undefined);

        // 1. Verify with Paystack
        const verification = await paymentService.verifyTransaction(reference);

        if (verification.data.status === 'success') {
            const bookingId = verification.data.metadata.booking_id;

            // Fetch booking and authorize either the logged-in owner or the guest token holder.
            const { data: existingBooking, error: existingErr } = await supabaseAdmin
                .from('bookings')
                .select('id, status, user_id, guest_access_token, booking_reference, flight_data')
                .eq('id', bookingId)
                .single();

            if (existingErr || !existingBooking) {
                return res.status(404).json({ message: 'Booking not found' });
            }

            if (existingBooking.user_id) {
                if (!userId || existingBooking.user_id !== userId) {
                    return res.status(403).json({ message: 'Forbidden' });
                }
            } else {
                if (!guestToken || existingBooking.guest_access_token !== guestToken) {
                    return res.status(403).json({ message: 'Forbidden' });
                }
            }

            const isAlreadyConfirmed = existingBooking?.status === 'CONFIRMED';

            // 2. Update booking status
            const { data, error } = await supabaseAdmin
                .from('bookings')
                .update({
                    status: 'CONFIRMED',
                    updated_at: new Date()
                })
                .eq('id', bookingId)
                .select()
                .single();

            if (error) throw error;

            // 3. Dispatch E-Ticket Email if this is the first time confirming
            if (!isAlreadyConfirmed) {
                try {
                    const email =
                        req.user?.email ||
                        existingBooking?.flight_data?.contact?.email ||
                        'passenger@luxel.travel';
                    const passengerName = email.split('@')[0].toUpperCase();

                    // Generate PDF Buffer secretly in background
                    const pdfBuffer = await generateTicketPdf(data, passengerName, email);

                    // Fire Off Email (await it to ensure it sends, or let it run async)
                    await sendETicketEmail(email, data.booking_reference, pdfBuffer);
                } catch (emailErr) {
                    console.error('Failed to send auto-ticket email:', emailErr);
                    // We do not fail the request if the email fails, the booking is still confirmed.
                }
            }

            return res.json({
                message: 'Payment successful and booking confirmed',
                booking: data
            });
        }

        return res.status(400).json({ message: 'Payment verification failed', status: verification.data.status });

    } catch (error: any) {
        console.error('Payment verification error:', error);
        return res.status(500).json({ message: error.message });
    }
};

/**
 * @swagger
 * /api/bookings/{id}/confirm-payment:
 *   patch:
 *     summary: Mark a booking as payment completed (bank transfer)
 *     tags: [Bookings, Payment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment confirmed and booking finalized
 */
export const confirmPayment = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id || null;
        const guestToken = (req.headers['x-guest-token'] as string | undefined) || (req.query.guestToken as string | undefined);

        // 1. Fetch booking and authorize either the logged-in owner or the guest token holder.
        const { data: booking, error: fetchError } = await supabaseAdmin
            .from('bookings')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError || !booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.user_id) {
            if (!userId || booking.user_id !== userId) {
                return res.status(403).json({ message: 'Forbidden' });
            }
        } else {
            if (!guestToken || booking.guest_access_token !== guestToken) {
                return res.status(403).json({ message: 'Forbidden' });
            }
        }

        // 2. Update booking to CONFIRMED with a payment reference
        const paymentRef = 'BANK_' + Math.random().toString(36).substring(2, 10).toUpperCase();

        const { data, error } = await supabaseAdmin
            .from('bookings')
            .update({
                status: 'CONFIRMED',
                payment_reference: paymentRef,
                updated_at: new Date()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        try {
            const email =
                req.user?.email ||
                booking?.flight_data?.contact?.email ||
                'passenger@luxel.travel';
            const passengerName = email.split('@')[0].toUpperCase();

            // Generate PDF Buffer
            const pdfBuffer = await generateTicketPdf(data, passengerName, email);

            // Dispatch Email
            await sendETicketEmail(email, data.booking_reference, pdfBuffer);
        } catch (emailErr) {
            console.error('Failed to send auto-ticket email for bank confirm:', emailErr);
            // Non-blocking
        }

        return res.json({
            message: 'Payment confirmed. Your tickets has been issued.',
            booking: data
        });

    } catch (error: any) {
        console.error('Confirm payment error:', error);
        return res.status(500).json({ message: 'Error confirming payment', error: error.message });
    }
};

/**
 * @swagger
 * /api/bookings/{id}/status:
 *   get:
 *     summary: Get the current status of a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Current booking status
 */
export const getBookingStatus = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id || null;
        const guestToken = (req.headers['x-guest-token'] as string | undefined) || (req.query.guestToken as string | undefined);

        const { data, error } = await supabaseAdmin
            .from('bookings')
            .select('id, status, booking_reference, airline_booking_reference, payment_reference, total_price, confirmed_price, updated_at, user_id, guest_access_token')
            .eq('id', id)
            .single();

        if (error || !data) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Authz: either logged-in owner, or guest token match when booking is guest.
        if (data.user_id) {
            if (!userId || data.user_id !== userId) {
                return res.status(403).json({ message: 'Forbidden' });
            }
        } else {
            if (!guestToken || data.guest_access_token !== guestToken) {
                return res.status(403).json({ message: 'Forbidden' });
            }
        }

        return res.json({
            id: data.id,
            status: data.status,
            booking_reference: data.booking_reference,
            airline_booking_reference: data.airline_booking_reference,
            payment_reference: data.payment_reference,
            total_price: data.total_price,
            confirmed_price: data.confirmed_price,
            updated_at: data.updated_at
        });
    } catch (error: any) {
        return res.status(500).json({ message: 'Error fetching booking status', error: error.message });
    }
};

/**
 * Public request status endpoint used for guest tracking flows.
 * Authz: request owner (logged-in) OR guest token match via linked booking.
 */
export const getRequestStatus = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id || null;
        const guestToken = (req.headers['x-guest-token'] as string | undefined) || (req.query.guestToken as string | undefined);

        const { data: request, error } = await supabaseAdmin
            .from('requests')
            .select('id, status, priority, updated_at, user_id, details')
            .eq('id', id)
            .single();

        if (error || !request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // Logged in owner can read it.
        if (request.user_id) {
            if (!userId || request.user_id !== userId) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            return res.json({
                id: request.id,
                status: request.status,
                priority: request.priority,
                updated_at: request.updated_at
            });
        }

        // Guest: must validate guest token against linked booking.
        const bookingId = request.details?.booking_id;
        if (!bookingId) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const { data: booking } = await supabaseAdmin
            .from('bookings')
            .select('id, guest_access_token')
            .eq('id', bookingId)
            .single();

        if (!booking || !guestToken || booking.guest_access_token !== guestToken) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        return res.json({
            id: request.id,
            status: request.status,
            priority: request.priority,
            updated_at: request.updated_at
        });
    } catch (error: any) {
        return res.status(500).json({ message: 'Error fetching request status', error: error.message });
    }
};
