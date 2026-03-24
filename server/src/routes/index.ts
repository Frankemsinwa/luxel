import { Router } from 'express';
import flightRoutes from './flightRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import agentRoutes from './agentRoutes.js';
import authRoutes from './authRoutes.js';
import tourRoutes from './tourRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import chatRoutes from './chatRoutes.js';
import adminRoutes from './adminRoutes.js';

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
router.use('/chat', chatRoutes);
router.use('/admin', adminRoutes);

export default router;
