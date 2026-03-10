import { supabase, supabaseAdmin } from '../config/supabase.js';

export interface TourSearchParams {
    theme?: string;
    location?: string;
    date?: string;
    minPrice?: number;
    maxPrice?: number;
}

/**
 * Service to handle Tour-related business logic
 */
export const searchTours = async (params: TourSearchParams) => {
    let query = supabaseAdmin
        .from('tours')
        .select('*')
        .eq('status', 'PUBLISHED');

    if (params.theme) {
        query = query.contains('themes', [params.theme]);
    }
    if (params.location) {
        query = query.ilike('location', `%${params.location}%`);
    }
    if (params.minPrice !== undefined) {
        query = query.gte('price', params.minPrice);
    }
    if (params.maxPrice !== undefined) {
        query = query.lte('price', params.maxPrice);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
};

export const getTourBySlug = async (slug: string) => {
    const { data, error } = await supabaseAdmin
        .from('tours')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) return null;
    return data;
};

export const getTourById = async (id: string) => {
    const { data, error } = await supabaseAdmin
        .from('tours')
        .select('*')
        .eq('id', id)
        .single();

    if (error) return null;
    return data;
};

/**
 * Uploads an image to Supabase storage
 * @param bucket 'tours'
 * @param path 'itinerary/img.jpg'
 * @param fileBuffer Buffer
 */
export const uploadImage = async (bucket: string, path: string, fileBuffer: Buffer, contentType: string) => {
    const { data, error } = await supabaseAdmin.storage
        .from(bucket)
        .upload(path, fileBuffer, {
            contentType,
            upsert: true
        });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
        .from(bucket)
        .getPublicUrl(path);

    return publicUrl;
};
