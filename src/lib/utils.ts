export const getSiteUrl = () => {
    // Check if we are in a browser environment
    if (typeof window !== 'undefined') {
        return window.location.origin;
    }
    
    // Fallback for server-side or CI environment
    if (process.env.NEXT_PUBLIC_SITE_URL) {
        return process.env.NEXT_PUBLIC_SITE_URL;
    }
    
    // Vercel deployment URL
    if (process.env.NEXT_PUBLIC_VERCEL_URL) {
        return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    }
    
    return 'http://localhost:3000';
};
