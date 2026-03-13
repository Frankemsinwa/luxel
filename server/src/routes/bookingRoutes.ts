import { Router } from 'express';
import * as bookingController from '../controllers/bookingController.js';
import * as ticketController from '../controllers/ticketController.js';
import { authenticate, authenticateOptional } from '../middleware/auth.js';

const router = Router();

// Create booking can be done as a guest (optional auth)
router.post('/', authenticateOptional, bookingController.createBooking);

// Public status endpoints (guest token supported; optional auth supported)
router.get('/:id/status', authenticateOptional, bookingController.getBookingStatus);
router.get('/requests/:id/status', authenticateOptional, bookingController.getRequestStatus);
router.get('/verify-payment/:reference', authenticateOptional, bookingController.verifyPayment);
router.patch('/:id/confirm-payment', authenticateOptional, bookingController.confirmPayment);
router.get('/:id/ticket', authenticateOptional, ticketController.downloadTicket);

// Everything else remains authenticated
router.use(authenticate);

router.get('/my-trips', bookingController.getMyTrips);
router.post('/:id/pay', bookingController.initializePayment);

export default router;
