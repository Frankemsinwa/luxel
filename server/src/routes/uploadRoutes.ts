import { Router } from 'express';
import * as uploadController from '../controllers/uploadController.js';

const router = Router();

/**
 * @swagger
 * /api/uploads/signature:
 *   get:
 *     summary: Get Cloudinary upload signature
 *     tags: [Uploads]
 */
router.get('/signature', uploadController.getCloudinarySignature);

export default router;
