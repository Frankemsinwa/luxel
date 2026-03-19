import { Router } from 'express';
import * as tourController from '../controllers/tourController.js';
import { authenticate, authorize, authenticateOptional } from '../middleware/auth.js';

const router = Router();

// Public Discovery Endpoints
router.get('/', tourController.getAllTours);
router.get('/id/:id', tourController.getTourById);
router.get('/:slug', tourController.getTourBySlug);

// Protected Booking Endpoints
router.post('/:id/book', authenticateOptional, tourController.bookTour);
router.get('/bookings/:id', authenticate, tourController.getTourBookingById);
router.get('/bookings/:id/download', authenticateOptional, tourController.downloadTourTicket);

// Agent/Admin Endpoints
router.get('/my/listings', authenticate, authorize(['AGENT', 'ADMIN']), tourController.getAgentTours);
router.get('/agent/bookings', authenticate, authorize(['AGENT', 'ADMIN']), tourController.getAgentTourBookings);
router.get('/agent/bookings/:id', authenticate, authorize(['AGENT', 'ADMIN']), tourController.getAgentTourBookingById);
router.post('/', authenticate, authorize(['AGENT', 'ADMIN']), tourController.createTour);
router.patch('/:id', authenticate, authorize(['AGENT', 'ADMIN']), tourController.updateTour);

export default router;
