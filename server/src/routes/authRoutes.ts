import { Router } from 'express';
import * as authController from '../controllers/authController.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User and Agent authentication management
 */

router.post('/agent/signup', authController.signUpAgent);

export default router;
