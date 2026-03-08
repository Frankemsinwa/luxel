import { Request, Response } from 'express';
import { supabase, supabaseAdmin } from '../config/supabase.js';
import * as paymentService from '../services/paymentService.js';

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
        const { flightData, totalPrice, passengers, contactInfo } = req.body;
        const userId = req.user?.id; // From auth middleware

        if (!flightData || !totalPrice || !passengers) {
            return res.status(400).json({ message: 'Missing booking details' });
        }

        // 1. Create Booking record
        const { data: booking, error: bookingError } = await supabaseAdmin
            .from('bookings')
            .insert({
                user_id: userId,
                flight_data: flightData,
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
                    passengers: passengers,
                    contact: contactInfo,
                    itinerary: `${flightData.departureCode} → ${flightData.arrivalCode}`,
                    flight_id: flightData.id
                },
                status: 'OPEN',
                priority: 'NORMAL'
            })
            .select()
            .single();

        if (requestError) throw requestError;

        return res.status(201).json({
            message: 'Booking request received. Our agents are verifying availability.',
            bookingId: booking.id,
            bookingRef: booking.booking_reference,
            requestId: request.id
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

        // 1. Verify with Paystack
        const verification = await paymentService.verifyTransaction(reference);

        if (verification.data.status === 'success') {
            const bookingId = verification.data.metadata.booking_id;

            // Optional: Check current status to prevent duplicate emails
            const { data: existingBooking } = await supabaseAdmin
                .from('bookings')
                .select('status')
                .eq('id', bookingId)
                .single();

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
                    const email = req.user?.email || 'passenger@luxel.travel';
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
        const userId = req.user?.id;

        // 1. Verify the booking exists and belongs to this user
        const { data: booking, error: fetchError } = await supabaseAdmin
            .from('bookings')
            .select('*')
            .eq('id', id)
            .eq('user_id', userId)
            .single();

        if (fetchError || !booking) {
            return res.status(404).json({ message: 'Booking not found' });
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
            const email = req.user?.email || 'passenger@luxel.travel';
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

        const { data, error } = await supabaseAdmin
            .from('bookings')
            .select('id, status, booking_reference, payment_reference, total_price, confirmed_price, updated_at')
            .eq('id', id)
            .single();

        if (error || !data) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        return res.json(data);
    } catch (error: any) {
        return res.status(500).json({ message: 'Error fetching booking status', error: error.message });
    }
};
