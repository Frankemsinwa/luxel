import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Admin Registration — Luxel',
    description: 'Create your Luxel administrator account',
};

export default function AdminLuxelLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
