import { Router } from 'express';
import * as agentController from '../controllers/agentController.js';
import * as flightOverrideController from '../controllers/flightOverrideController.js';
import * as manualFlightController from '../controllers/manualFlightController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Secure ALL agent routes
router.use(authenticate);
router.use(authorize(['AGENT', 'ADMIN']));

router.get('/requests', agentController.getAllRequests);
router.get('/requests/:id', agentController.getRequestById);
router.patch('/requests/:id', agentController.updateRequestStatus);
router.delete('/requests/:id', agentController.deleteRequest);
router.post('/verify-price', agentController.verifyFlightPrice);
router.patch('/bookings/:id', agentController.updateBookingStatus);

// Flight Price Overrides
router.get('/flight-overrides', flightOverrideController.getOverrides);
router.post('/flight-overrides', flightOverrideController.upsertOverride);
router.delete('/flight-overrides/:id', flightOverrideController.deleteOverride);

// Manual Flights
router.get('/manual-flights', manualFlightController.getManualFlights);
router.post('/manual-flights', manualFlightController.createManualFlight);
router.delete('/manual-flights/:id', manualFlightController.deleteManualFlight);

export default router;

