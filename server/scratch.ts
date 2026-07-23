import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE || '';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function testQuery() {
    const { data: tours, error } = await supabaseAdmin
        .from('tours')
        .select(`
            *,
            agent:profiles!tours_agent_id_fkey (full_name)
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Query 1 Failed:', error);
    } else {
        console.log('Query 1 Success:', tours?.length);
    }

    const { data: tours2, error: error2 } = await supabaseAdmin
        .from('tours')
        .select(`
            *,
            agent:profiles!agent_id (full_name)
        `)
        .order('created_at', { ascending: false });

    if (error2) {
        console.error('Query 2 Failed:', error2);
    } else {
        console.log('Query 2 Success:', tours2?.length);
    }

    const { data: tours3, error: error3 } = await supabaseAdmin
        .from('tours')
        .select(`
            *,
            agent:agent_id (full_name)
        `)
        .order('created_at', { ascending: false });

    if (error3) {
        console.error('Query 3 Failed:', error3);
    } else {
        console.log('Query 3 Success:', tours3?.length);
    }

    const { data: tours4, error: error4 } = await supabaseAdmin
        .from('tours')
        .select(`
            *,
            profiles(full_name)
        `)
        .order('created_at', { ascending: false });

    if (error4) {
        console.error('Query 4 Failed:', error4);
    } else {
        console.log('Query 4 Success:', tours4?.length);
    }
}

testQuery();
