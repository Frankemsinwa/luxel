import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';

/**
 * @swagger
 * /api/auth/agent/signup:
 *   post:
 *     summary: Register a new agent (Admin/Internal use)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - fullName
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               fullName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Agent created successfully
 *       400:
 *         description: Error creating agent
 */
export const signUpAgent = async (req: Request, res: Response) => {
    try {
        const { email, password, fullName } = req.body;

        if (!email || !password || !fullName) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Create user via Supabase Admin API to force the AGENT role
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                full_name: fullName,
                role: 'AGENT'
            }
        });

        if (error) {
            console.error('Supabase Admin CreateUser Error:', error);
            return res.status(400).json({ message: error.message });
        }

        return res.status(201).json({
            message: 'Agent account created successfully',
            user: data.user
        });

    } catch (error: any) {
        console.error('Agent Signup Error:', error);
        return res.status(500).json({ message: 'Internal server error during agent signup' });
    }
};
/**
 * @swagger
 * /api/auth/promote-admin:
 *   post:
 *     summary: Elevate a user to ADMIN and set their password (Requires secret key)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - secret
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               secret:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User elevated to ADMIN and password updated successfully
 *       403:
 *         description: Forbidden - Invalid secret
 *       404:
 *         description: User not found
 */
export const promoteToAdmin = async (req: Request, res: Response) => {
    try {
        const { email, secret, password } = req.body;

        if (!email || !secret || !password) {
            return res.status(400).json({ message: 'Missing email, secret, or new password' });
        }

        const adminSecret = process.env.ADMIN_CREATION_SECRET || 'luxel-admin-supervision-2024';
        if (secret !== adminSecret) {
            return res.status(403).json({ message: 'Forbidden: Invalid admin creation secret' });
        }

        // Supabase Admin API to update user metadata
        const { data: userData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        
        if (listError) {
            throw listError;
        }

        const user = userData.users.find(u => u.email?.toLowerCase() === email.toLowerCase());

        if (!user) {
            return res.status(404).json({ message: 'User not found in system' });
        }

        // Update role AND password
        const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
            user.id,
            { 
                password,
                user_metadata: { 
                    ...user.user_metadata,
                    role: 'ADMIN' 
                } 
            }
        );

        if (error) {
            throw error;
        }

        return res.json({
            message: `User ${email} has been elevated to ADMIN role and password has been reset.`,
            user: data.user
        });

    } catch (error: any) {
        console.error('Promote Admin Error:', error);
        return res.status(500).json({ message: error.message || 'Internal server error' });
    }
};

/**
 * @swagger
 * /api/auth/admin/register:
 *   post:
 *     summary: Register a new ADMIN account (requires ADMIN_CREATION_SECRET)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - fullName
 *               - secret
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               fullName:
 *                 type: string
 *               secret:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin account created successfully
 *       403:
 *         description: Forbidden - Invalid secret
 */
export const registerAdmin = async (req: Request, res: Response) => {
    try {
        const { email, password, fullName, secret } = req.body;

        if (!email || !password || !fullName || !secret) {
            return res.status(400).json({ message: 'Missing required fields: email, password, fullName, secret' });
        }

        const adminSecret = process.env.ADMIN_CREATION_SECRET || 'luxel-admin-supervision-2024';
        if (secret !== adminSecret) {
            return res.status(403).json({ message: 'Forbidden: Invalid admin creation secret' });
        }

        // Create admin user via Supabase Admin API
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                full_name: fullName,
                role: 'ADMIN',
                two_fa_enabled: false,
            },
        });

        if (error) {
            console.error('Admin Register Error:', error);
            // Provide friendly duplicate-email message
            if (error.message?.toLowerCase().includes('already')) {
                return res.status(409).json({ message: 'An account with this email already exists.' });
            }
            return res.status(400).json({ message: error.message });
        }

        return res.status(201).json({
            message: 'Admin account created successfully. Please log in and enable 2FA.',
            user: data.user,
        });
    } catch (error: any) {
        console.error('Admin Register Error:', error);
        return res.status(500).json({ message: 'Internal server error during admin registration' });
    }
};
