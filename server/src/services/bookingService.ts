import { supabaseAdmin } from '../config/supabase.js';
import * as emailService from './emailService.js';
import * as ticketService from './ticketService.js';

/**
 * Service to handle Tour Booking workflows
 */
export const processTourBooking = async (
    tourId: string,
    userId: string | null,
    guestCount: number,
    contactInfo: any,
    preferences: any,
    paymentReference: string
) => {
    // 1. Fetch tour details & check slots
    const { data: tour, error: tourError } = await supabaseAdmin
        .from('tours')
        .select('*')
        .eq('id', tourId)
        .single();

    if (tourError || !tour) throw new Error('Tour not found');
    if (tour.available_slots < guestCount) throw new Error('Insufficient slots available');

    const totalPrice = tour.price * guestCount;

    // 2. Create Booking
    const { data: booking, error: bookingError } = await supabaseAdmin
        .from('tour_bookings')
        .insert([{
            tour_id: tourId,
            user_id: userId,
            guest_count: guestCount,
            total_price: totalPrice,
            contact_info: contactInfo,
            preferences: { ...preferences, payment_reference: paymentReference },
            status: 'CONFIRMED' // Since payment is verified by frontend callback
        }])
        .select()
        .single();

    if (bookingError) throw bookingError;

    // 3. Update Inventory
    await supabaseAdmin
        .from('tours')
        .update({ available_slots: tour.available_slots - guestCount })
        .eq('id', tourId);

    // 4. Trigger Notifications (Async)
    const guestName = contactInfo.fullName || `${contactInfo.firstName} ${contactInfo.lastName}`.trim() || contactInfo.email || 'Valued Guest';

    // Prepare full booking data for ticket generation
    const fullBooking = {
        ...booking,
        tour: tour
    };

    // Generate Ticket PDF
    let pdfBuffer: Buffer | undefined;
    try {
        pdfBuffer = await ticketService.generateTourTicketPdf(fullBooking);
    } catch (err) {
        console.error('Failed to generate tour ticket PDF:', err);
    }

    // Notify Guest
    emailService.sendTourConfirmationEmail(contactInfo.email, tour.title, booking.id, pdfBuffer);

    // Notify Agent (if assigned)
    if (tour.agent_id) {
        const { data: agent } = await supabaseAdmin.auth.admin.getUserById(tour.agent_id);
        if (agent?.user?.email) {
            emailService.sendAgentTourNotification(agent.user.email, tour.title, guestName);
        }
    }

    return booking;
};
