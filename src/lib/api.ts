import axios from 'axios';
import { supabase } from './supabase';
import { readTracker } from './bookingTracker';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://luxel-8o9h.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    // Guest booking support: if no auth token, attach guest token so guests can access their own booking endpoints.
    if (!config.headers.Authorization && typeof window !== 'undefined') {
      const tracker = readTracker();
      if (tracker?.guestToken) {
        (config.headers as any)['x-guest-token'] = tracker.guestToken;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
