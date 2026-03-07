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
