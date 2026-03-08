import { Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { generateTicketPdf } from '../services/ticketService.js';

export const downloadTicket = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { data: booking, error } = await supabaseAdmin
            .from('bookings')
            .select('*')
            .eq('id', id)
            .eq('user_id', userId)
            .single();

        if (error || !booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        if (booking.status !== 'CONFIRMED') {
            return res.status(400).json({ error: 'Tickets are only available for confirmed bookings.' });
        }

        const email = req.user?.email || 'passenger@luxel.travel';
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
