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

export default router;
