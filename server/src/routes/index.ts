import { Router } from 'express';
import flightRoutes from './flightRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import agentRoutes from './agentRoutes.js';
import authRoutes from './authRoutes.js';
import tourRoutes from './tourRoutes.js';
import uploadRoutes from './uploadRoutes.js';

const router = Router();

// Test Route
router.get('/', (req, res) => {
    res.json({ message: 'Welcome to Luxel API' });
});

// Routes
router.use('/flights', flightRoutes);
router.use('/bookings', bookingRoutes);
router.use('/agent', agentRoutes);
router.use('/auth', authRoutes);
router.use('/tours', tourRoutes);
router.use('/uploads', uploadRoutes);

export default router;
