import { Router } from 'express';
import * as tourController from '../controllers/tourController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Public Discovery Endpoints
router.get('/', tourController.getAllTours);
router.get('/id/:id', tourController.getTourById);
router.get('/:slug', tourController.getTourBySlug);

// Protected Booking Endpoints
router.post('/:id/book', authenticate, tourController.bookTour);
router.get('/bookings/:id', authenticate, tourController.getTourBookingById);

// Agent/Admin Endpoints
router.get('/my/listings', authenticate, authorize(['AGENT', 'ADMIN']), tourController.getAgentTours);
router.post('/', authenticate, authorize(['AGENT', 'ADMIN']), tourController.createTour);
router.patch('/:id', authenticate, authorize(['AGENT', 'ADMIN']), tourController.updateTour);

export default router;
