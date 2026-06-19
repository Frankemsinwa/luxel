import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';

/**
 * Get all flight taxes
 */
export const getAllTaxes = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('flight_taxes')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) throw error;
        return res.json(data);
    } catch (error: any) {
        console.error('Fetch taxes error:', error);
        return res.status(500).json({ message: 'Internal server error while fetching taxes' });
    }
};

/**
 * Create a new flight tax
 */
export const createTax = async (req: Request, res: Response) => {
    try {
        const { name, amount } = req.body;
        if (!name || amount === undefined) {
            return res.status(400).json({ message: 'Name and amount are required' });
        }

        const { data, error } = await supabaseAdmin
            .from('flight_taxes')
            .insert([{ name, amount }])
            .select()
            .single();

        if (error) throw error;
        return res.status(201).json(data);
    } catch (error: any) {
        console.error('Create tax error:', error);
        return res.status(500).json({ message: 'Internal server error while creating tax' });
    }
};

/**
 * Update an existing flight tax
 */
export const updateTax = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, amount } = req.body;

        const { data, error } = await supabaseAdmin
            .from('flight_taxes')
            .update({ name, amount, updated_at: new Date() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return res.json(data);
    } catch (error: any) {
        console.error('Update tax error:', error);
        return res.status(500).json({ message: 'Internal server error while updating tax' });
    }
};

/**
 * Delete a flight tax
 */
export const deleteTax = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const { error } = await supabaseAdmin
            .from('flight_taxes')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return res.status(204).send();
    } catch (error: any) {
        console.error('Delete tax error:', error);
        return res.status(500).json({ message: 'Internal server error while deleting tax' });
    }
};
