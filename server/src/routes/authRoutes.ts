import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import * as twoFAController from '../controllers/twoFAController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User and Agent authentication management
 */

// Agent
router.post('/agent/signup', authController.signUpAgent);

// Admin promotion (dev/internal use via Swagger)
router.post('/promote-admin', authController.promoteToAdmin);

// Admin registration (from /admin-luxel frontend page)
router.post('/admin/register', authController.registerAdmin);

// ── 2FA Routes ───────────────────────────────────────────────────────────────
// Initiate setup — generates secret + QR code (must be logged in as ADMIN)
router.post('/2fa/setup', authenticate, twoFAController.setup2FA);

// Confirm setup by entering first code from authenticator app
router.post('/2fa/verify-setup', authenticate, twoFAController.verifyAndEnable2FA);

// Disable 2FA (must present current TOTP code to confirm)
router.post('/2fa/disable', authenticate, twoFAController.disable2FA);

// Validate 2FA at login time (called after Supabase signIn, before granting full access)
router.post('/2fa/validate', twoFAController.validate2FALogin);

// Check if 2FA is enabled for a user (used on login screen)
router.get('/2fa/status', twoFAController.get2FAStatus);

export default router;
