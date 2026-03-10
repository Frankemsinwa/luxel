import puppeteer from 'puppeteer';
import ejs from 'ejs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateTicketPdf = async (booking: any, passengerName: string, email: string): Promise<Buffer> => {
    // Read logo and convert to base64 for reliable PDF rendering
    const logoFullSizePath = path.join(__dirname, '../../public/assets/logo.png');
    const logoBase64 = fs.readFileSync(logoFullSizePath, { encoding: 'base64' });
    const logoDataUrl = `data:image/png;base64,${logoBase64}`;

    const firstPassenger = booking.flight_data?.passengers?.[0];
    const passengerDisplayName = firstPassenger
        ? `${firstPassenger.firstName} ${firstPassenger.lastName}`.toUpperCase()
        : (passengerName || email?.split('@')[0].toUpperCase() || 'VIP PASSENGER');

    // 1. Prepare Template Data
    const templateData = {
        logoPath: logoDataUrl,
        pnr: booking.booking_reference || booking.id.split('-')[0].toUpperCase(),
        passengerName: passengerDisplayName,
        email: email || booking.flight_data?.contact?.email || 'passenger@luxel.travel',
        flight: {
            from: booking.flight_data?.departureCode || 'LHR',
            fromCity: booking.flight_data?.departureCity || 'London',
            to: booking.flight_data?.arrivalCode || 'JFK',
            toCity: booking.flight_data?.arrivalCity || 'New York',
            departureTime: booking.flight_data?.departureTime || 'October 24, 2026 10:30 AM',
            airline: booking.flight_data?.airline || 'Luxel Charters',
            aircraft: booking.flight_data?.aircraft || 'Luxel Jet',
        },
        cabinClass: 'First Class Premium',
        dateIssued: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    };

    // 2. Render EJS to HTML
    const templatePath = path.join(__dirname, '../templates/ticket.ejs');
    const html = await ejs.renderFile(templatePath, templateData);

    // 3. Generate PDF using Puppeteer
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--allow-file-access-from-files',
            '--disable-web-security'
        ]
    });

    try {
        const page = await browser.newPage();

        // Wait until network is idle ensures webfonts are loaded
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '0', right: '0', bottom: '0', left: '0' }
        });

        return Buffer.from(pdfBuffer);
    } finally {
        await browser.close();
    }
};
