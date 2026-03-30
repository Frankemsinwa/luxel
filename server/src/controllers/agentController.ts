import { Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import * as amadeusService from '../services/amadeusService.js';

/**
 * @swagger
 * /api/agent/requests:
 *   get:
 *     summary: Fetch all open/active traveler requests (Agent Only)
 *     tags: [Agent Dashboard]
 */
export const getAllRequests = async (req: any, res: Response) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.user_metadata?.role;

        let query = supabaseAdmin
            .from('requests')
            .select(`
                *,
                profiles:user_id (full_name, role)
            `)
            .order('created_at', { ascending: false });

        // If not ADMIN, filter: assigned to them OR not assigned to anyone yet (OPEN)
        if (userRole !== 'ADMIN') {
            query = query.or(`assigned_agent_id.eq.${userId},assigned_agent_id.is.null`);
        }

        const { data, error } = await query;

        if (error) throw error;
        return res.json(data);
    } catch (error: any) {
        console.error('Agent requests fetch error:', error);
        return res.status(500).json({ message: 'Error fetching requests', error: error.message });
    }
};

/**
 * @swagger
 * /api/agent/requests/{id}:
 *   get:
 *     summary: Fetch a single request with full details including linked booking (Agent Only)
 *     tags: [Agent Dashboard]
 */
export const getRequestById = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const { data: request, error } = await supabaseAdmin
            .from('requests')
            .select(`
                *,
                profiles:user_id (full_name, role, phone)
            `)
            .eq('id', id)
            .single();

        if (error) throw error;

        // Also fetch the linked booking details
        let booking = null;
        if (request.details?.booking_id) {
            const { data: bookingData } = await supabaseAdmin
                .from('bookings')
                .select('*')
                .eq('id', request.details.booking_id)
                .single();
            booking = bookingData;
        }

        return res.json({ ...request, booking });
    } catch (error: any) {
        return res.status(500).json({ message: 'Error fetching request details', error: error.message });
    }
};

/**
 * @swagger
 * /api/agent/requests/{id}:
 *   patch:
 *     summary: Update request status with confirmed price, syncs linked booking (Agent Only)
 *     tags: [Agent Dashboard]
 */
export const updateRequestStatus = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const { status, priority, confirmedPrice, airlineBookingReference } = req.body;

        // Fetch existing request so we can safely merge details JSON when needed.
        const { data: existingRequest, error: existingErr } = await supabaseAdmin
            .from('requests')
            .select('id, details')
            .eq('id', id)
            .single();
        if (existingErr) throw existingErr;

        const mergedDetails = airlineBookingReference
            ? { ...(existingRequest?.details || {}), airline_booking_reference: airlineBookingReference }
            : undefined;

        const updateFields: any = { updated_at: new Date() };
        if (typeof status !== 'undefined') updateFields.status = status;
        if (typeof priority !== 'undefined') updateFields.priority = priority;
        if (mergedDetails) updateFields.details = mergedDetails;

        // 1. Update the request status
        const { data: request, error } = await supabaseAdmin
            .from('requests')
            .update(updateFields)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        // 2. Sync the linked booking status + confirmed price
        const bookingId = request.details?.booking_id;
        if (bookingId) {
            const updateData: any = { updated_at: new Date() };

            if (status === 'RESOLVED') {
                updateData.status = 'CONFIRMED';
                if (confirmedPrice) {
                    updateData.confirmed_price = confirmedPrice;
                }
            } else if (status === 'CLOSED') {
                updateData.status = 'CANCELLED';
            }

            if (airlineBookingReference) {
                updateData.airline_booking_reference = airlineBookingReference;
                updateData.airline_booking_confirmed_at = new Date();
            }

            const { error: bookingError } = await supabaseAdmin
                .from('bookings')
                .update(updateData)
                .eq('id', bookingId);

            if (bookingError) {
                console.error('Failed to sync booking status:', bookingError);
            }
        }

        // Return the same shape as GET /agent/requests/:id (include booking).
        let booking = null;
        if (bookingId) {
            const { data: bookingData } = await supabaseAdmin
                .from('bookings')
                .select('*')
                .eq('id', bookingId)
                .single();
            booking = bookingData;
        }

        return res.json({ ...request, booking });
    } catch (error: any) {
        return res.status(500).json({ message: 'Error updating request', error: error.message });
    }
};

/**
 * @swagger
 * /api/agent/verify-price:
 *   post:
 *     summary: Use Amadeus API to verify flight price for a request (Agent Only)
 *     tags: [Agent Dashboard]
 */
export const verifyFlightPrice = async (req: any, res: Response) => {
    try {
        const { from, to, departureDate, passengers } = req.body;

        if (!from || !to || !departureDate) {
            return res.status(400).json({ message: 'Missing route details for verification' });
        }

        const flights = await amadeusService.searchFlights({
            from,
            to,
            departureDate,
            adults: passengers || '1'
        });

        return res.json({
            verified: true,
            flights: flights.flights,
            meta: flights.meta,
            verifiedAt: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('Price verification error:', error);
        return res.status(500).json({ message: 'Error verifying flight prices', error: error.message });
    }
};

/**
 * @swagger
 * /api/agent/bookings/{id}:
 *   patch:
 *     summary: Update booking status (Agent Only)
 *     tags: [Agent Dashboard]
 */
export const updateBookingStatus = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const { data, error } = await supabaseAdmin
            .from('bookings')
            .update({ status, updated_at: new Date() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return res.json(data);
    } catch (error: any) {
        return res.status(500).json({ message: 'Error updating booking', error: error.message });
    }
};

/**
 * @swagger
 * /api/agent/requests/{id}:
 *   delete:
 *     summary: Delete a request (Admin/Assigned Agent only)
 *     tags: [Agent Dashboard]
 */
export const deleteRequest = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.user_metadata?.role;

        // Verify assignment unless admin
        if (userRole !== 'ADMIN') {
            const { data: request } = await supabaseAdmin
                .from('requests')
                .select('assigned_agent_id')
                .eq('id', id)
                .single();
            
            if (request && request.assigned_agent_id && request.assigned_agent_id !== userId) {
                return res.status(403).json({ message: 'You do not have permission to delete this request (assigned to another agent)' });
            }
        }

        const { error } = await supabaseAdmin
            .from('requests')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return res.status(204).send();
    } catch (error: any) {
        return res.status(500).json({ message: 'Error deleting request', error: error.message });
    }
};
