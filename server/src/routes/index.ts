import { Router } from 'express';
import flightRoutes from './flightRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import agentRoutes from './agentRoutes.js';
import authRoutes from './authRoutes.js';

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

export default router;
