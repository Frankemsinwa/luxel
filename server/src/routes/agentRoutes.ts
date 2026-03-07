import { Router } from 'express';
import * as agentController from '../controllers/agentController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Secure ALL agent routes
router.use(authenticate);
router.use(authorize(['AGENT', 'ADMIN']));

router.get('/requests', agentController.getAllRequests);
router.get('/requests/:id', agentController.getRequestById);
router.patch('/requests/:id', agentController.updateRequestStatus);
router.post('/verify-price', agentController.verifyFlightPrice);
router.patch('/bookings/:id', agentController.updateBookingStatus);

export default router;

