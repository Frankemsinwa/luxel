import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';

export const getRooms = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const role = user.user_metadata?.role || 'USER';

        let query = supabaseAdmin
            .from('chat_rooms')
            .select(`
                *,
                customer:profiles!chat_rooms_customer_id_fkey(*),
                agent:profiles!chat_rooms_agent_id_fkey(*),
                request:requests(*)
            `)
            .order('last_message_at', { ascending: false });

        if (role !== 'AGENT' && role !== 'ADMIN') {
            query = query.eq('customer_id', user.id);
        }

        const { data, error } = await query;

        if (error) throw error;
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getMessages = async (req: Request, res: Response) => {
    try {
        const { roomId } = req.params;
        const user = (req as any).user;

        // Verify user has access to this room
        const { data: room, error: roomError } = await supabaseAdmin
            .from('chat_rooms')
            .select('*')
            .eq('id', roomId)
            .single();

        if (roomError || !room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        const role = user.user_metadata?.role || 'USER';
        if (role !== 'AGENT' && role !== 'ADMIN' && room.customer_id !== user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { data: messages, error } = await supabaseAdmin
            .from('chat_messages')
            .select(`
                *,
                sender:profiles(*)
            `)
            .eq('room_id', roomId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        res.json(messages);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createOrGetRoom = async (req: Request, res: Response) => {
    try {
        const { requestId } = req.body;
        const user = (req as any).user;

        // Check if a room already exists for this request
        let query = supabaseAdmin
            .from('chat_rooms')
            .select('*')
            .eq('customer_id', user.id);
        
        if (requestId) {
            query = query.eq('request_id', requestId);
        } else {
            query = query.is('request_id', null);
        }

        const { data: existingRoom, error: fetchError } = await query.maybeSingle();

        if (existingRoom) {
            return res.json(existingRoom);
        }

        // Create new room
        const { data: newRoom, error: createError } = await supabaseAdmin
            .from('chat_rooms')
            .insert({
                customer_id: user.id,
                request_id: requestId || null,
                status: 'ACTIVE'
            })
            .select()
            .single();

        if (createError) throw createError;
        res.status(201).json(newRoom);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
