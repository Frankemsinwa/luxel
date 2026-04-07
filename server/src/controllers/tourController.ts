import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import * as tourService from '../services/tourService.js';
import * as bookingService from '../services/bookingService.js';
import * as ticketService from '../services/ticketService.js';
import { logAgentAction } from '../services/logService.js';

/**
 * @swagger
 * /api/tours:
 *   get:
 *     summary: Fetch all published tours
 *     tags: [Tours]
 */
export const getAllTours = async (req: Request, res: Response) => {
    try {
        const { theme, location, minPrice, maxPrice } = req.query;
        const tours = await tourService.searchTours({
            theme: typeof theme === 'string' ? theme : undefined,
            location: typeof location === 'string' ? location : undefined,
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined
        });
        return res.json(tours);
    } catch (error: any) {
        console.error('Fetch tours [Public Discovery] error:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint,
            stack: error.stack
        });
        return res.status(500).json({ message: 'Internal server error while fetching tours' });
    }
};

/**
 * @swagger
 * /api/tours/{slug}:
 *   get:
 *     summary: Get tour details by slug
 *     tags: [Tours]
 */
export const getTourBySlug = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
        const tour = await tourService.getTourBySlug(slug as string);
        if (!tour) return res.status(404).json({ message: 'Tour not found' });
        return res.json(tour);
    } catch (error: any) {
        console.error('Fetch tour by slug error:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
        });
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * @swagger
 * /api/tours/bookings/{id}/download:
 *   get:
 *     summary: Download tour ticket PDF
 *     tags: [Tours]
 */
export const downloadTourTicket = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id || null;

        const { data: booking, error } = await supabaseAdmin
            .from('tour_bookings')
            .select(`
                *,
                tour:tours(*)
            `)
            .eq('id', id)
            .single();

        if (error || !booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Authorization: If booking has user_id, must match req.user.id (or be an AGENT/ADMIN)
        const userRole = req.user?.user_metadata?.role;
        const isAuthorized = userRole === 'AGENT' || userRole === 'ADMIN' || (booking.user_id === userId);

        if (booking.user_id && !isAuthorized) {
            return res.status(403).json({ message: 'Unauthorized to download this ticket' });
        }

        const pdfBuffer = await ticketService.generateTourTicketPdf(booking);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Luxel_Experience_Pass_${id.substring(0, 8).toUpperCase()}.pdf`);
        return res.send(pdfBuffer);

    } catch (error: any) {
        console.error('Download tour ticket error:', error);
        return res.status(500).json({ message: 'Internal server error while generating ticket' });
    }
};

/**
 * @swagger
 * /api/tours/agent/bookings:
 *   get:
 *     summary: Get all bookings for tours managed by the authenticated agent
 *     tags: [Agent]
 */
export const getAgentTourBookings = async (req: any, res: Response) => {
    try {
        const agentId = req.user.id;
        const userRole = req.user.user_metadata?.role;

        let query = supabaseAdmin
            .from('tour_bookings')
            .select(`
                *,
                tour:tours!inner(*)
            `)
            .order('created_at', { ascending: false });

        // If not ADMIN, filter by agent_owned tours
        if (userRole !== 'ADMIN') {
            query = query.eq('tour.agent_id', agentId);
        }

        const { data, error } = await query;

        if (error) throw error;
        return res.json(data);
    } catch (error) {
        console.error('Fetch agent tour bookings error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * @swagger
 * /api/tours/agent/bookings/{id}:
 *   get:
 *     summary: Get a specific tour booking detail (Agent only)
 *     tags: [Agent]
 */
export const getAgentTourBookingById = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const agentId = req.user.id;
        const userRole = req.user.user_metadata?.role;

        let query = supabaseAdmin
            .from('tour_bookings')
            .select(`
                *,
                tour:tours!inner(*),
                user:profiles(*)
            `)
            .eq('id', id);

        // If not ADMIN, filter by agent ownership
        if (userRole !== 'ADMIN') {
            query = query.eq('tour.agent_id', agentId);
        }

        const { data, error } = await query.single();

        if (error || !data) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        return res.json(data);
    } catch (error) {
        console.error('Fetch agent tour booking by ID error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * @swagger
 * /api/tours/id/{id}:
 *   get:
 *     summary: Get tour details by id
 *     tags: [Tours]
 */
export const getTourById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const tour = await tourService.getTourById(id as string);
        if (!tour) return res.status(404).json({ message: 'Tour not found' });
        return res.json(tour);
    } catch (error) {
        console.error('Fetch tour by ID error:', error);
        return res.status(500).json({ message: 'Internal server error while fetching tour' });
    }
};

/**
 * @swagger
 * /api/tours:
 *   post:
 *     summary: Create a new tour (Agent/Admin only)
 *     tags: [Tours]
 */
export const createTour = async (req: any, res: Response) => {
    try {
        const tourData = req.body;
        const agentId = req.user.id;

        const { data, error } = await supabaseAdmin
            .from('tours')
            .insert([{ ...tourData, agent_id: agentId }])
            .select()
            .single();

        if (error) throw error;
        await logAgentAction(agentId, 'UPDATE_TOUR', 'TOUR', data.id, { action: 'CREATE' });
        return res.status(201).json(data);
    } catch (error) {
        console.error('Create tour error:', error);
        return res.status(500).json({ message: 'Internal server error while creating tour' });
    }
};

/**
 * @swagger
 * /api/tours/{id}:
 *   patch:
 *     summary: Update tour metadata
 *     tags: [Tours]
 */
export const updateTour = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const userId = req.user.id;
        const userRole = req.user.user_metadata?.role;

        // Verify ownership unless admin
        if (userRole !== 'ADMIN') {
            const tour = await tourService.getTourById(id);
            if (!tour || tour.agent_id !== userId) {
                return res.status(403).json({ message: 'You do not have permission to update this tour' });
            }
        }

        const { data, error } = await supabaseAdmin
            .from('tours')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        if (updates.status === 'PUBLISHED') {
            await logAgentAction(userId, 'PUBLISH_TOUR', 'TOUR', id);
        } else if (updates.status === 'ARCHIVED') {
            await logAgentAction(userId, 'ARCHIVE_TOUR', 'TOUR', id);
        } else {
            await logAgentAction(userId, 'UPDATE_TOUR', 'TOUR', id, { updates });
        }

        return res.json(data);
    } catch (error) {
        console.error('Update tour error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * @swagger
 * /api/tours/{id}:
 *   delete:
 *     summary: Delete a tour (Admin/Owner only)
 *     tags: [Tours]
 */
export const deleteTour = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.user_metadata?.role;

        // Verify ownership unless admin
        if (userRole !== 'ADMIN') {
            const tour = await tourService.getTourById(id);
            if (!tour || tour.agent_id !== userId) {
                return res.status(403).json({ message: 'You do not have permission to delete this tour' });
            }
        }

        const { error } = await supabaseAdmin
            .from('tours')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return res.status(204).send();
    } catch (error) {
        console.error('Delete tour error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * @swagger
 * /api/agent/tours:
 *   get:
 *     summary: Get tours managed by agent
 *     tags: [Agent]
 */
export const getAgentTours = async (req: any, res: Response) => {
    try {
        const agentId = req.user.id;
        const userRole = req.user.user_metadata?.role;

        let query = supabaseAdmin
            .from('tours')
            .select('*')
            .order('created_at', { ascending: false });

        // If not ADMIN, filter to only the agent's owned listings
        if (userRole !== 'ADMIN') {
            query = query.eq('agent_id', agentId);
        }

        const { data, error } = await query;

        if (error) throw error;
        return res.json(data);
    } catch (error) {
        console.error('Fetch agent tours error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * @swagger
 * /api/tours/{id}/book:
 *   post:
 *     summary: Book a tour
 *     tags: [Tours]
 */
export const bookTour = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const { guestCount, contactInfo, preferences, paymentReference } = req.body;
        const userId = req.user?.id || null;

        const booking = await bookingService.processTourBooking(
            id as string,
            userId,
            guestCount,
            contactInfo,
            preferences,
            paymentReference
        );

        return res.status(201).json(booking);
    } catch (error: any) {
        console.error('Tour booking error:', error);
        const status = error.message?.includes('not found') ? 404 : 400;
        return res.status(status).json({ message: error.message || 'Internal server error during booking' });
    }
};

/**
 * @swagger
 * /api/tours/bookings/{id}:
 *   get:
 *     summary: Get tour booking details
 *     tags: [Tours]
 */
export const getTourBookingById = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const { data, error } = await supabaseAdmin
            .from('tour_bookings')
            .select(`
                *,
                tour:tours(*)
            `)
            .eq('id', id)
            .eq('user_id', userId)
            .single();

        if (error || !data) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        return res.json(data);
    } catch (error: any) {
        console.error('Fetch tour booking error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
