import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
    // We can use a test SMTP service like Ethereal or Gmail.
    // Ethereal is great for testing locally without actual credentials.
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER || 'test@ethereal.email',
        pass: process.env.SMTP_PASS || 'password',
    },
});

export const sendETicketEmail = async (
    recipientEmail: string,
    pnr: string,
    pdfBuffer: Buffer
) => {
    try {
        const logoPath = path.join(__dirname, '../../public/assets/logo.png');

        const mailOptions = {
            from: process.env.SMTP_FROM || '"Luxel Charters" <concierge@luxel.travel>',
            to: recipientEmail,
            subject: `Your Luxel E-Ticket - Booking Ref: ${pnr}`,
            text: `Dear Passenger,\n\nYour premium charter flight is confirmed (PNR: ${pnr}).\n\nPlease find your official E-Ticket PDF attached to this email. You may present this ticket at the private terminal.\n\nWarm regards,\nThe Luxel Concierge Team`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; color: #333; background-color: #f9f9f9; border-radius: 8px;">
                    <div style="text-align: left; padding-bottom: 20px; border-bottom: 1px solid #eee;">
                        <img src="cid:luxel-logo" alt="LUXEL" style="height: 40px; width: auto;">
                    </div>
                    <br>
                    <h2 style="color: #0d0d0d;">Your Charter is Confirmed</h2>
                    <p>Booking Reference: <strong style="color: #dbb35e;">${pnr}</strong></p>
                    <p>Dear Passenger,</p>
                    <p>Your premium charter flight is successfully confirmed. We are thrilled to welcome you aboard Luxel.</p>
                    <p>Please find your official <strong>E-Ticket PDF</strong> attached to this email. You may present this ticket at the FBO private terminal.</p>
                    <br>
                    <p>Warm regards,<br>The Luxel Concierge Team</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;">
                    <p style="font-size: 11px; color: #999;">Luxel Charters Ltd. | Premium Jet Services</p>
                </div>
            `,
            attachments: [
                {
                    filename: 'logo.png',
                    path: logoPath,
                    cid: 'luxel-logo' // Same cid value as in the html img src
                },
                {
                    filename: `Luxel_Ticket_${pnr}.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf',
                },
            ],
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('E-Ticket Email sent: %s', info.messageId);

        // If using Ethereal, you can log the preview URL
        if (process.env.SMTP_HOST === 'smtp.ethereal.email' || !process.env.SMTP_HOST) {
            console.log('Ethereal Email Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }

        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

/**
 * Notify User about Tour Booking
 */
export const sendTourConfirmationEmail = async (userEmail: string, tourTitle: string, bookingRef: string) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_FROM || '"Luxel Concierge" <concierge@luxel.travel>',
            to: userEmail,
            subject: `Experience Confirmed: ${tourTitle}`,
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #111; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #eee; border-radius: 20px;">
                    <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 24px;">Your Journey Begins.</h1>
                    <p style="font-size: 16px; color: #555; line-height: 1.6;">Your reservation for <strong>${tourTitle}</strong> has been received by our global desk.</p>
                    <div style="background: #fcfcfc; padding: 20px; border-radius: 12px; margin: 30px 0;">
                        <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #999; margin: 0;">Reservation Reference</p>
                        <p style="font-size: 20px; font-weight: bold; margin: 5px 0; color: #dbb35e;">#${bookingRef.substring(0, 8).toUpperCase()}</p>
                    </div>
                    <p style="font-size: 14px; color: #555;">An expert travel designer will contact you within 24 hours to personalize your itinerary details.</p>
                </div>
            `
        };
        return await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Tour email error:', error);
    }
};

/**
 * Notify Agent about incoming high-intent lead
 */
export const sendAgentTourNotification = async (agentEmail: string, tourTitle: string, guestName: string) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_FROM || '"Luxel System" <system@luxel.travel>',
            to: agentEmail,
            subject: `🔥 NEW High-Intent Lead: ${tourTitle}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ffd700;">
                    <h2>New Tour Booking Request</h2>
                    <p><strong>Experience:</strong> ${tourTitle}</p>
                    <p><strong>Guest:</strong> ${guestName}</p>
                    <p>Please log in to the Agent Dashboard to review requirements and reach out to the guest.</p>
                </div>
            `
        };
        return await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Agent notification error:', error);
    }
};
