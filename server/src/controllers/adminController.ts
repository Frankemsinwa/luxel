import { Request, Response } from 'express';
import { supabase, supabaseAdmin } from '../config/supabase.js';
import { sendETicketEmail, sendTourConfirmationEmail } from '../services/emailService.js';
import { generateTicketPdf, generateTourTicketPdf } from '../services/ticketService.js';

/**
 * Get overall financial statistics across flights and tours
 */
export const getFinanceOverview = async (req: Request, res: Response) => {
    try {
        const [{ data: flightStats, error: flightErr }, { data: tourStats, error: tourErr }] = await Promise.all([
            supabase
                .from('bookings')
                .select('total_price, confirmed_price, status, payment_method'),
            supabase
                .from('tour_bookings')
                .select('total_price, status, payment_method')
        ]);

        if (flightErr || tourErr) throw flightErr || tourErr;

        const all = [
            ...(flightStats || []).map(b => ({ ...b, source: 'FLIGHT' })),
            ...(tourStats || []).map(b => ({ ...b, source: 'TOUR' }))
        ];

        const confirmedRevenue = all
            .filter(b => ['CONFIRMED', 'SUCCESS', 'COMPLETED'].includes(String(b.status).toUpperCase()))
            .reduce((acc, b) => acc + (Number((b as any).confirmed_price) || Number(b.total_price) || 0), 0);

        const pendingRevenue = all
            .filter(b => b.status === 'AWAITING_VERIFICATION')
            .reduce((acc, b) => acc + (Number((b as any).confirmed_price) || Number(b.total_price) || 0), 0);

        const methodBreakdown = all.reduce((acc: any, b) => {
            const method = b.payment_method || 'PAYSTACK';
            acc[method] = (acc[method] || 0) + (Number((b as any).confirmed_price) || Number(b.total_price) || 0);
            return acc;
        }, {});

        res.json({
            confirmedRevenue,
            pendingRevenue,
            methodBreakdown,
            totalBookingsCount: all.length,
            pendingCount: all.filter(b => b.status === 'AWAITING_VERIFICATION').length
        });
    } catch (error: any) {
        console.error('Finance Overview Error:', error);
        res.status(500).json({ message: error.message || 'Internal server error while fetching finance stats' });
    }
};

/**
 * Get all manual payments awaiting admin verification
 */
export const getPendingPayments = async (req: Request, res: Response) => {
    try {
        const { data: flights, error: fErr } = await supabase
            .from('bookings')
            .select('*, user_id')
            .eq('status', 'AWAITING_VERIFICATION')
            .order('created_at', { ascending: false });

        const { data: tours, error: tErr } = await supabase
            .from('tour_bookings')
            .select('*, tour:tours(*)')
            .eq('status', 'AWAITING_VERIFICATION')
            .order('created_at', { ascending: false });

        if (fErr || tErr) throw fErr || tErr;

        const allPending = [
            ...(flights || []).map(f => ({ ...f, serviceType: 'FLIGHT' })),
            ...(tours || []).map(t => ({ ...t, serviceType: 'TOUR' }))
        ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        res.json(allPending);
    } catch (error: any) {
        console.error('Get Pending Payments Error:', error);
        res.status(500).json({ message: error.message || 'Internal server error while fetching pending payments' });
    }
};

/**
 * Admin manually confirms a payment (Bank Transfer)
 */
export const approvePayment = async (req: Request, res: Response) => {
    try {
        const { bookingId, serviceType } = req.body;

        if (!bookingId || !serviceType) {
            return res.status(400).json({ message: 'Missing bookingId or serviceType' });
        }

        const table = serviceType === 'TOUR' ? 'tour_bookings' : 'bookings';

        // 1. Update status to CONFIRMED
        const { data: booking, error: updateErr } = await supabaseAdmin
            .from(table)
            .update({ 
                status: 'CONFIRMED', 
                updated_at: new Date()
            })
            .eq('id', bookingId)
            .select('*')
            .single();

        if (updateErr) throw updateErr;

        // 2. Dispatch Tickets / Notifications
        if (serviceType === 'FLIGHT' && booking.flight_data) {
             try {
                const contact = (booking as any).flight_data?.contact || {};
                const passengerName = `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || 'VIP Passenger';
                const recipientEmail = contact.email || 'traveler@luxel.travel';

                const pdfBuffer = await generateTicketPdf(booking, passengerName, recipientEmail);
                await sendETicketEmail(recipientEmail, (booking as any).booking_reference, pdfBuffer);
             } catch (err) {
                console.error('Flight Ticket Dispatch Error:', err);
             }
        } else if (serviceType === 'TOUR') {
            try {
                // Re-fetch with tour data for ticket template
                const { data: fullTourBooking } = await supabaseAdmin
                    .from('tour_bookings')
                    .select('*, tour:tours(*)')
                    .eq('id', bookingId)
                    .single();

                if (fullTourBooking) {
                    const pdfBuffer = await generateTourTicketPdf(fullTourBooking);
                    const email = fullTourBooking.contact_info?.email;
                    if (email) {
                        await sendTourConfirmationEmail(email, fullTourBooking.tour?.title, fullTourBooking.id, pdfBuffer);
                    }
                }
            } catch (err) {
                console.error('Tour Ticket Dispatch Error:', err);
            }
        }

        res.json({ 
            message: 'Payment verified and booking confirmed successfully.', 
            booking 
        });

    } catch (error: any) {
        console.error('Approve Payment Error:', error);
        res.status(500).json({ message: error.message || 'Internal server error during payment approval' });
    }
};
