import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase.js';

/**
 * Middleware to verify Supabase JWT
 */
export const authenticate = async (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized: Error verifying token' });
    }
};

/**
 * Middleware to restrict access based on roles
 */
export const authorize = (roles: string[]) => {
    return async (req: any, res: Response, next: NextFunction) => {
        const userRole = req.user?.user_metadata?.role || 'USER';

        if (!roles.includes(userRole)) {
            return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
        }

        next();
    };
};
