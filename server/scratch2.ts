import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE || '';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function testQuery() {
    const { data: tours, error } = await supabaseAdmin
        .from('tours')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Query Failed:', error);
    } else {
        console.log('Sample Tour:', tours?.[0]);
    }
}

testQuery();
