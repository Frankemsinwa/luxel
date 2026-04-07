import { Router } from 'express';
import * as adminController from '../controllers/adminController.js';
import * as agentController from '../controllers/agentController.js';
import * as tourController from '../controllers/tourController.js';
import * as flightOverrideController from '../controllers/flightOverrideController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Secure ALL admin routes
router.use(authenticate);
router.use(authorize(['ADMIN']));

// Dashboard - Statistics
router.get('/finance/stats', adminController.getFinanceOverview);

// Dashboard - Verification Page
router.get('/payments/pending', adminController.getPendingPayments);

// Dashboard - Verification Action
router.patch('/payments/verify', adminController.approvePayment);

// --- Shared Functionality (Exposed at /admin/) ---

// Requests Management (Flight/General)
router.get('/requests', agentController.getAllRequests);
router.get('/requests/:id', agentController.getRequestById);
router.patch('/requests/:id', agentController.updateRequestStatus);
router.delete('/requests/:id', agentController.deleteRequest);
router.post('/verify-price', agentController.verifyFlightPrice);
router.patch('/bookings/:id', agentController.updateBookingStatus);

// Tours Management
router.get('/tours/my/listings', tourController.getAgentTours);
router.get('/tours/agent/bookings', tourController.getAgentTourBookings);
router.get('/tours/agent/bookings/:id', tourController.getAgentTourBookingById);
router.post('/tours', tourController.createTour);
router.patch('/tours/:id', tourController.updateTour);
router.delete('/tours/:id', tourController.deleteTour);

// Flight Price Overrides
router.get('/flight-overrides', flightOverrideController.getOverrides);
router.post('/flight-overrides', flightOverrideController.upsertOverride);
router.delete('/flight-overrides/:id', flightOverrideController.deleteOverride);

// Agent Management
router.get('/agents', authenticate, authorize(['ADMIN']), adminController.getAllAgents);
router.patch('/agents/:id/ban', authenticate, authorize(['ADMIN']), adminController.toggleAgentBan);

// Activity Logs
router.get('/logs', authenticate, authorize(['ADMIN']), adminController.getAgentLogs);

// Oversight
router.get('/tours', authenticate, authorize(['ADMIN']), adminController.getAllToursOversight);
router.get('/bookings', authenticate, authorize(['ADMIN']), adminController.getAllBookingsOversight);

export default router;
