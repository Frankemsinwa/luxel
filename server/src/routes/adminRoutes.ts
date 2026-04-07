import { Router } from 'express';
import * as adminController from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Dashboard - Statistics
router.get('/finance/stats', authenticate, authorize(['ADMIN']), adminController.getFinanceOverview);

// Dashboard - Verification Page
router.get('/payments/pending', authenticate, authorize(['ADMIN']), adminController.getPendingPayments);

// Dashboard - Verification Action
router.patch('/payments/verify', authenticate, authorize(['ADMIN']), adminController.approvePayment);

// Agent Management
router.get('/agents', authenticate, authorize(['ADMIN']), adminController.getAllAgents);
router.patch('/agents/:id/ban', authenticate, authorize(['ADMIN']), adminController.toggleAgentBan);

// Activity Logs
router.get('/logs', authenticate, authorize(['ADMIN']), adminController.getAgentLogs);

// Oversight
router.get('/tours', authenticate, authorize(['ADMIN']), adminController.getAllToursOversight);
router.get('/bookings', authenticate, authorize(['ADMIN']), adminController.getAllBookingsOversight);

export default router;
