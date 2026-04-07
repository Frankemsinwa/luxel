'use client';

import { ShieldCheck, LayoutDashboard, CreditCard, LogOut, Loader2, Shield, AlertTriangle, Users, History, Palmtree, Plane } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [verifying, setVerifying] = useState(true);
    const [twoFAEnabled, setTwoFAEnabled] = useState(true); // assume true until we know

    useEffect(() => {
        const checkAdmin = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user || user.user_metadata?.role !== 'ADMIN') {
                router.push('/admin-login');
            } else {
                setTwoFAEnabled(user.user_metadata?.two_fa_enabled === true);
                setVerifying(false);
            }
        };
        checkAdmin();
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/admin-login');
    };

    const navItems = [
        { label: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Pending Verification', href: '/admin/payments', icon: CreditCard },
        { label: 'Manage Agents', href: '/admin/agents', icon: Users },
        { label: 'Activity Logs', href: '/admin/logs', icon: History },
        { label: 'All Tours', href: '/admin/tours', icon: Palmtree },
        { label: 'All Flights', href: '/admin/bookings', icon: Plane },
        { label: 'Security & 2FA', href: '/admin/security', icon: Shield },
        { label: 'System Settings', href: '/admin/settings', icon: Settings },
    ];

    if (verifying) return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
            <Loader2 className="animate-spin text-amber-500" size={32} />
        </div>
    );

    return (
        <div className="min-h-screen bg-zinc-50 flex">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-zinc-200 flex flex-col fixed inset-y-0">
                <div className="p-8 border-b border-zinc-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white">
                        <ShieldCheck size={18} />
                    </div>
                    <span className="text-body font-bold tracking-tighter uppercase">Luxel Admin</span>
                </div>

                <nav className="flex-1 p-6 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-body-sm font-medium transition-all ${
                                    isActive
                                        ? 'bg-black text-white shadow-lg shadow-black/10'
                                        : 'text-zinc-500 hover:bg-zinc-50 hover:text-black'
                                }`}
                            >
                                <Icon size={18} />
                                {item.label}
                                {item.href === '/admin/security' && !twoFAEnabled && (
                                    <span className="ml-auto w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-zinc-100">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-body-sm font-medium text-red-500 hover:bg-red-50 transition-all"
                    >
                        <LogOut size={18} />
                        Exit Terminal
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-72 p-10">
                <div className="max-w-7xl mx-auto">
                    {/* 2FA Nudge Banner */}
                    {!twoFAEnabled && pathname !== '/admin/security' && (
                        <div className="mb-8 flex items-start gap-4 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
                            <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-amber-800">Two-Factor Authentication is not enabled</p>
                                <p className="text-sm text-amber-600 mt-0.5">
                                    Secure your admin account by enabling 2FA. It&apos;s quick and adds a critical layer of protection.
                                </p>
                            </div>
                            <Link
                                href="/admin/security"
                                className="shrink-0 text-xs font-semibold bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
                            >
                                Enable Now
                            </Link>
                        </div>
                    )}

                    {children}
                </div>
            </main>
        </div>
    );
}
