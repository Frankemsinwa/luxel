import { Router } from 'express';
import { getRooms, getMessages, createOrGetRoom } from '../controllers/chatController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// All chat routes are protected
router.use(authenticate);

/**
 * @swagger
 * /api/chat/rooms:
 *   get:
 *     summary: Get all chat rooms for the user (or all rooms for agents)
 *     tags: [Chat]
 */
router.get('/rooms', getRooms);

/**
 * @swagger
 * /api/chat/rooms:
 *   post:
 *     summary: Create or fetch an existing chat room for a request
 *     tags: [Chat]
 */
router.post('/rooms', createOrGetRoom);

/**
 * @swagger
 * /api/chat/rooms/{roomId}/messages:
 *   get:
 *     summary: Get message history for a room
 *     tags: [Chat]
 */
router.get('/rooms/:roomId/messages', getMessages);

export default router;
