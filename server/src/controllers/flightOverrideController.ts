import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';

/**
 * @swagger
 * /api/agent/flight-overrides:
 *   get:
 *     summary: Get all flight price overrides
 *     tags: [Agent]
 */
export const getOverrides = async (req: any, res: Response) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('flight_price_overrides')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return res.json(data);
    } catch (error) {
        console.error('Fetch overrides error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * @swagger
 * /api/agent/flight-overrides:
 *   post:
 *     summary: Create or update a flight price override
 *     tags: [Agent]
 */
export const upsertOverride = async (req: any, res: Response) => {
    try {
        const { origin, destination, airline_code, override_price, is_active } = req.body;
        const agentId = req.user.id;

        const { data, error } = await supabaseAdmin
            .from('flight_price_overrides')
            .upsert({
                origin: origin.toUpperCase(),
                destination: destination.toUpperCase(),
                airline_code: airline_code.toUpperCase(),
                override_price,
                is_active: is_active ?? true,
                agent_id: agentId,
                updated_at: new Date()
            }, {
                onConflict: 'origin,destination,airline_code'
            })
            .select()
            .single();

        if (error) throw error;
        return res.json(data);
    } catch (error) {
        console.error('Upsert override error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * @swagger
 * /api/agent/flight-overrides/{id}:
 *   delete:
 *     summary: Delete a flight price override
 *     tags: [Agent]
 */
export const deleteOverride = async (req: any, res: Response) => {
    try {
        const { id } = req.params;

        const { error } = await supabaseAdmin
            .from('flight_price_overrides')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return res.json({ message: 'Override deleted successfully' });
    } catch (error) {
        console.error('Delete override error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
