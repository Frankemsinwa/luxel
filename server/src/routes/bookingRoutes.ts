import { Router } from 'express';
import * as bookingController from '../controllers/bookingController.js';
import * as ticketController from '../controllers/ticketController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Secure all booking routes
router.use(authenticate);

router.post('/', bookingController.createBooking);
router.get('/my-trips', bookingController.getMyTrips);
router.post('/:id/pay', bookingController.initializePayment);
router.get('/verify-payment/:reference', bookingController.verifyPayment);
router.patch('/:id/confirm-payment', bookingController.confirmPayment);
router.get('/:id/status', bookingController.getBookingStatus);
router.get('/:id/ticket', ticketController.downloadTicket);

export default router;
