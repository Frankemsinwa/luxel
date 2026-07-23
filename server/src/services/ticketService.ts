import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import ejs from 'ejs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to determine if we're running on Vercel
const isVercel = process.env.VERCEL || process.env.AWS_EXECUTION_ENV;

const getLocalExecutablePath = () => {
    if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
    switch (process.platform) {
        case 'win32':
            return 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
        case 'darwin':
            return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
        default:
            return '/usr/bin/google-chrome';
    }
};

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
        // Prefer airline PNR when available, fallback to Luxel internal reference.
        pnr: booking.airline_booking_reference || booking.booking_reference || booking.id.split('-')[0].toUpperCase(),
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
        airlineLogo: booking.flight_data?.airlineCode 
            ? `https://www.gstatic.com/flights/airline_logos/70px/${booking.flight_data.airlineCode}.png`
            : null,
        cabinClass: 'First Class Premium',
        dateIssued: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    };

    // 2. Render EJS to HTML
    const templatePath = path.join(__dirname, '../templates/ticket.ejs');
    const html = await ejs.renderFile(templatePath, templateData);

    // 3. Generate PDF using Puppeteer Core + Chromium
    const browser = await puppeteer.launch({
        args: isVercel ? chromium.args : ['--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: (chromium as any).defaultViewport,
        executablePath: isVercel 
            ? await chromium.executablePath() 
            : getLocalExecutablePath(),
        headless: isVercel ? (chromium as any).headless : true,
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

export const generateTourTicketPdf = async (booking: any): Promise<Buffer> => {
    // Read logo
    const logoFullSizePath = path.join(__dirname, '../../public/assets/logo.png');
    const logoBase64 = fs.readFileSync(logoFullSizePath, { encoding: 'base64' });
    const logoDataUrl = `data:image/png;base64,${logoBase64}`;

    // Prepare Template Data
    const templateData = {
        logoPath: logoDataUrl,
        bookingRef: booking.id.substring(0, 8).toUpperCase(),
        guestName: booking.contact_info?.fullName || `${booking.contact_info?.firstName || ''} ${booking.contact_info?.lastName || ''}`.trim() || 'Valued Guest',
        tourTitle: booking.tour?.title || 'Luxury Experience',
        location: booking.tour?.location || 'Premium Destination',
        date: booking.booking_date ? new Date(booking.booking_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'To be scheduled',
        guestCount: booking.guest_count || 1,
        meetingPoint: booking.tour?.meeting_point || 'Luxel Priority Lounge - Terminal 1, Gate B-12',
        tourImage: booking.tour?.hero_image || 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80',
        dateIssued: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    };

    // Render EJS to HTML
    const templatePath = path.join(__dirname, '../templates/tour_ticket.ejs');
    const html = await ejs.renderFile(templatePath, templateData);

    // Generate PDF using Puppeteer Core + Chromium
    const browser = await puppeteer.launch({
        args: isVercel ? chromium.args : ['--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: (chromium as any).defaultViewport,
        executablePath: isVercel
            ? await chromium.executablePath()
            : getLocalExecutablePath(),
        headless: isVercel ? (chromium as any).headless : true,
    });

    try {
        const page = await browser.newPage();
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
