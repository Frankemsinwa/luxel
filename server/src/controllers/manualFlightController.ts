import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';

export const createManualFlight = async (req: any, res: Response) => {
    try {
        const flightData = req.body;
        const agentId = req.user.id;

        const { data, error } = await supabaseAdmin
            .from('manual_flights')
            .insert({
                ...flightData,
                origin: flightData.origin.toUpperCase(),
                destination: flightData.destination.toUpperCase(),
                agent_id: agentId,
                updated_at: new Date()
            })
            .select()
            .single();

        if (error) throw error;
        return res.json(data);
    } catch (error) {
        console.error('Create manual flight error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getManualFlights = async (req: any, res: Response) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('manual_flights')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return res.json(data);
    } catch (error) {
        console.error('Fetch manual flights error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteManualFlight = async (req: any, res: Response) => {
    try {
        const { id } = req.params;

        const { error } = await supabaseAdmin
            .from('manual_flights')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return res.json({ message: 'Manual flight deleted successfully' });
    } catch (error) {
        console.error('Delete manual flight error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
