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
    const isManual = preferences?.payment_method === 'BANK_TRANSFER';
    const finalStatus = isManual ? 'AWAITING_VERIFICATION' : 'CONFIRMED';

    const { data: booking, error: bookingError } = await supabaseAdmin
        .from('tour_bookings')
        .insert([{
            tour_id: tourId,
            user_id: userId,
            guest_count: guestCount,
            total_price: totalPrice,
            contact_info: contactInfo,
            preferences: preferences || {},
            receipt_url: preferences?.receipt_url || null,
            payment_method: preferences?.payment_method || 'PAYSTACK',
            status: finalStatus
        }])
        .select()
        .single();

    if (bookingError) throw bookingError;

    // 3. Update Inventory (only if confirmed, or maybe pre-reserve?)
    // For now we still decrement inventory on submission to avoid overbooking.
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

    // Notify Admin (High Priority for manual pay)
    if (isManual) {
        try {
            const adminEmails = await emailService.getAgentNotificationEmails();
            if (adminEmails.length > 0) {
                await Promise.allSettled(
                    adminEmails.map(email =>
                        emailService.sendAdminPaymentNotification(email, {
                            bookingRef: booking.id, // Or reference if added
                            serviceType: 'TOUR',
                            amount: totalPrice,
                            receiptUrl: preferences.receipt_url,
                            customerName: guestName
                        })
                    )
                );
            }
        } catch (adminErr) {
            console.error('Admin notification failed for tour booking:', adminErr);
        }
    }

    // 5. Generate Ticket PDF & Notify Guest (ONLY if CONFIRMED)
    if (finalStatus === 'CONFIRMED') {
        let pdfBuffer: Buffer | undefined;
        try {
            pdfBuffer = await ticketService.generateTourTicketPdf(fullBooking);
        } catch (err) {
            console.error('Failed to generate tour ticket PDF:', err);
        }

        // Notify Guest
        emailService.sendTourConfirmationEmail(contactInfo.email, tour.title, booking.id, pdfBuffer);
    } else {
        // Send a "Payment Received / Verification Pending" email to guest?
        // (Optional: for now just let it be, but user said "intense notice alert email to admin")
    }

    // Notify Agent (if assigned)
    if (tour.agent_id) {
        const { data: agent } = await supabaseAdmin.auth.admin.getUserById(tour.agent_id);
        if (agent?.user?.email) {
            emailService.sendAgentTourNotification(agent.user.email, tour.title, guestName);
        }
    }

    return booking;
};
