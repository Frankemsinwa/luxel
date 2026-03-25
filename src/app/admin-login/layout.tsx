import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Admin Sign In — Luxel',
    description: 'Sign in to the Luxel admin portal',
};

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
