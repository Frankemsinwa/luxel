import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE || '';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function testQuery() {
    const { data: logs, error } = await supabaseAdmin
        .from('agent_logs')
        .select(`
            *,
            actor:actor_id (full_name, avatar_url)
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Logs Query Failed:', error);
    } else {
        console.log('Logs Query Success:', logs?.length);
    }
}

testQuery();
