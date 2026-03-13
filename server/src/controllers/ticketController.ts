import { Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { generateTicketPdf } from '../services/ticketService.js';

export const downloadTicket = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id || null;
        const guestToken = (req.headers['x-guest-token'] as string | undefined) || (req.query.guestToken as string | undefined);

        const { data: booking, error } = await supabaseAdmin
            .from('bookings')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Authz: either logged-in owner, or guest token match when booking is guest.
        if (booking.user_id) {
            if (!userId || booking.user_id !== userId) {
                return res.status(403).json({ error: 'Forbidden', details: { reason: 'user mismatch', bookingUserId: booking.user_id, userId } });
            }
        } else {
            if (!guestToken || booking.guest_access_token !== guestToken) {
                return res.status(403).json({ error: 'Forbidden', details: { reason: 'guest token mismatch', guestToken, expected: booking.guest_access_token } });
            }
        }

        if (booking.status !== 'CONFIRMED') {
            return res.status(400).json({ error: 'Tickets are only available for confirmed bookings.' });
        }

        const email =
                req.user?.email ||
                booking?.flight_data?.contact?.email ||
                'passenger@luxel.travel';
        const passengerName = email.split('@')[0].toUpperCase();

        const pdfBuffer = await generateTicketPdf(booking, passengerName, email);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Luxel_Ticket_${booking.booking_reference}.pdf`);
        res.end(pdfBuffer);

    } catch (err: any) {
        console.error('Error generating ticket:', err);
        res.status(500).json({ error: 'Failed to generate ticket' });
    }
};
