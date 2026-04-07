import { supabaseAdmin } from '../config/supabase.js';

export type LogAction =
    | 'PUBLISH_TOUR'
    | 'ARCHIVE_TOUR'
    | 'UPDATE_TOUR'
    | 'APPROVE_FLIGHT'
    | 'UPDATE_BOOKING'
    | 'BAN_AGENT'
    | 'UNBAN_AGENT'
    | 'LOGIN'
    | 'UPDATE_PRICE_OVERRIDE';

export type EntityType = 'TOUR' | 'BOOKING' | 'PROFILE' | 'PRICE_OVERRIDE';

export const logAgentAction = async (
    actorId: string,
    action: LogAction,
    entityType?: EntityType,
    entityId?: string,
    details: any = {}
) => {
    try {
        const { error } = await supabaseAdmin
            .from('agent_logs')
            .insert([{
                actor_id: actorId,
                action,
                entity_type: entityType,
                entity_id: entityId,
                details
            }]);

        if (error) {
            console.error('Failed to log agent action:', error);
        }
    } catch (err) {
        console.error('Log service error:', err);
    }
};
