import { Request, Response } from 'express';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { supabaseAdmin } from '../config/supabase.js';

/**
 * @swagger
 * /api/auth/2fa/setup:
 *   post:
 *     summary: Generate a TOTP secret and QR code for the authenticated admin
 *     tags: [Two-Factor Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: QR code and secret returned
 *       401:
 *         description: Unauthorized
 */
export const setup2FA = async (req: any, res: Response) => {
    try {
        const user = req.user;
        if (!user) return res.status(401).json({ message: 'Unauthorized' });

        const secret = speakeasy.generateSecret({
            name: `Luxel Admin (${user.email})`,
            length: 32,
        });

        // Store the temporary secret in user metadata (not yet confirmed)
        const { error } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
            user_metadata: {
                ...user.user_metadata,
                two_fa_temp_secret: secret.base32,
            },
        });

        if (error) throw error;

        const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url!);

        return res.json({
            secret: secret.base32,
            qrCode: qrCodeDataUrl,
            otpauthUrl: secret.otpauth_url,
        });
    } catch (error: any) {
        console.error('2FA Setup Error:', error);
        return res.status(500).json({ message: error.message || 'Error setting up 2FA' });
    }
};

/**
 * @swagger
 * /api/auth/2fa/verify-setup:
 *   post:
 *     summary: Confirm 2FA setup by verifying the first TOTP code
 *     tags: [Two-Factor Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token]
 *             properties:
 *               token:
 *                 type: string
 *                 description: 6-digit TOTP code from authenticator app
 *     responses:
 *       200:
 *         description: 2FA enabled successfully
 *       400:
 *         description: Invalid token
 */
export const verifyAndEnable2FA = async (req: any, res: Response) => {
    try {
        const user = req.user;
        const { token } = req.body;

        if (!user || !token) return res.status(400).json({ message: 'Missing token' });

        const tempSecret = user.user_metadata?.two_fa_temp_secret;
        if (!tempSecret) {
            return res.status(400).json({ message: '2FA setup not initiated. Call /api/auth/2fa/setup first.' });
        }

        const isValid = speakeasy.totp.verify({
            secret: tempSecret,
            encoding: 'base32',
            token: String(token),
            window: 1,
        });

        if (!isValid) {
            return res.status(400).json({ message: 'Invalid verification code. Please try again.' });
        }

        // Promote temp secret to confirmed secret, enable 2FA
        const { error } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
            user_metadata: {
                ...user.user_metadata,
                two_fa_secret: tempSecret,
                two_fa_enabled: true,
                two_fa_temp_secret: null,
            },
        });

        if (error) throw error;

        return res.json({ message: '2FA has been enabled successfully.' });
    } catch (error: any) {
        console.error('2FA Verify Setup Error:', error);
        return res.status(500).json({ message: error.message || 'Error verifying 2FA setup' });
    }
};

/**
 * @swagger
 * /api/auth/2fa/disable:
 *   post:
 *     summary: Disable 2FA for the authenticated admin
 *     tags: [Two-Factor Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token]
 *             properties:
 *               token:
 *                 type: string
 *                 description: Current 6-digit TOTP code to confirm disable
 *     responses:
 *       200:
 *         description: 2FA disabled successfully
 *       400:
 *         description: Invalid token
 */
export const disable2FA = async (req: any, res: Response) => {
    try {
        const user = req.user;
        const { token } = req.body;

        if (!user || !token) return res.status(400).json({ message: 'Missing token' });

        const secret = user.user_metadata?.two_fa_secret;
        if (!secret) {
            return res.status(400).json({ message: '2FA is not currently enabled for this account.' });
        }

        const isValid = speakeasy.totp.verify({
            secret,
            encoding: 'base32',
            token: String(token),
            window: 1,
        });

        if (!isValid) {
            return res.status(400).json({ message: 'Invalid code. 2FA has not been disabled.' });
        }

        const { error } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
            user_metadata: {
                ...user.user_metadata,
                two_fa_secret: null,
                two_fa_enabled: false,
                two_fa_temp_secret: null,
            },
        });

        if (error) throw error;

        return res.json({ message: '2FA has been disabled.' });
    } catch (error: any) {
        console.error('2FA Disable Error:', error);
        return res.status(500).json({ message: error.message || 'Error disabling 2FA' });
    }
};

/**
 * @swagger
 * /api/auth/2fa/validate:
 *   post:
 *     summary: Validate a TOTP code during login (call after password login succeeds)
 *     tags: [Two-Factor Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, token]
 *             properties:
 *               userId:
 *                 type: string
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token is valid - access granted
 *       400:
 *         description: Invalid token
 */
export const validate2FALogin = async (req: Request, res: Response) => {
    try {
        const { userId, token } = req.body;

        if (!userId || !token) return res.status(400).json({ message: 'Missing userId or token' });

        const { data: userData, error } = await supabaseAdmin.auth.admin.getUserById(userId);
        if (error || !userData.user) return res.status(404).json({ message: 'User not found' });

        const secret = userData.user.user_metadata?.two_fa_secret;
        if (!secret) {
            return res.status(400).json({ message: '2FA is not enabled for this user.' });
        }

        const isValid = speakeasy.totp.verify({
            secret,
            encoding: 'base32',
            token: String(token),
            window: 1,
        });

        if (!isValid) {
            return res.status(400).json({ message: 'Invalid 2FA code. Access denied.' });
        }

        return res.json({ message: '2FA validated. Access granted.', valid: true });
    } catch (error: any) {
        console.error('2FA Validate Error:', error);
        return res.status(500).json({ message: error.message || 'Error validating 2FA' });
    }
};

/**
 * @swagger
 * /api/auth/2fa/status:
 *   get:
 *     summary: Check if 2FA is enabled for a given userId (used during login)
 *     tags: [Two-Factor Authentication]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: 2FA status returned
 */
export const get2FAStatus = async (req: Request, res: Response) => {
    try {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ message: 'Missing userId' });

        const { data: userData, error } = await supabaseAdmin.auth.admin.getUserById(String(userId));
        if (error || !userData.user) return res.status(404).json({ message: 'User not found' });

        const enabled = userData.user.user_metadata?.two_fa_enabled === true;
        return res.json({ two_fa_enabled: enabled });
    } catch (error: any) {
        console.error('2FA Status Error:', error);
        return res.status(500).json({ message: error.message || 'Error checking 2FA status' });
    }
};
