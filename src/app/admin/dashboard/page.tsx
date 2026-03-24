'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Package, BarChart3, Wallet, Activity } from 'lucide-react';

export default function AdminDashboardOverview() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/finance/stats');
                setStats(res.data);
            } catch (err) {
                console.error('Failed to fetch finance stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="animate-pulse space-y-8">
            <div className="h-12 w-48 bg-zinc-200 rounded-xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-zinc-200 rounded-3xl" />)}
            </div>
            <div className="h-96 bg-zinc-200 rounded-3xl" />
        </div>
    );

    const cards = [
        { 
            label: 'Confirmed Revenue', 
            value: `₦${stats?.confirmedRevenue.toLocaleString()}`, 
            icon: Wallet, 
            color: 'bg-emerald-500', 
            trend: '+12.5% from last month' 
        },
        { 
            label: 'Awaiting Verification', 
            value: `₦${stats?.pendingRevenue.toLocaleString()}`, 
            icon: Clock, 
            color: 'bg-amber', 
            trend: `${stats?.pendingCount} bookings need attention` 
        },
        { 
            label: 'Total Bookings', 
            value: stats?.totalBookingsCount, 
            icon: Package, 
            color: 'bg-black', 
            trend: 'Combined Flight & Tour volume' 
        },
        { 
            label: 'Payment Method: Bank', 
            value: `₦${(stats?.methodBreakdown?.BANK_TRANSFER || 0).toLocaleString()}`, 
            icon: BarChart3, 
            color: 'bg-indigo-500', 
            trend: 'Showing adoption of manual transfer' 
        },
    ];

    return (
        <div className="space-y-12">
            <header className="flex items-end justify-between">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-widest mb-4">
                        <Activity size={12} />
                        Live Intelligence
                    </div>
                    <h1 className="text-heading-xl text-zinc-900 tracking-tight">Executive Overview</h1>
                </div>
                <div className="text-right">
                    <p className="text-caption font-medium text-zinc-400 mb-1">Last Update</p>
                    <p className="text-body-sm font-medium text-zinc-900">{new Date().toLocaleTimeString()}</p>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {cards.map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <motion.div
                            key={card.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all group"
                        >
                            <div className={`w-12 h-12 rounded-2xl ${card.color} flex items-center justify-center text-white mb-6 shadow-lg shadow-black/5`}>
                                <Icon size={20} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-caption font-medium text-zinc-400 uppercase tracking-widest">{card.label}</p>
                                <h3 className="text-heading-md font-black text-black">{card.value}</h3>
                            </div>
                            <div className="mt-6 pt-6 border-t border-zinc-50 flex items-center gap-2">
                                <TrendingUp size={14} className={card.color === 'bg-amber' ? 'text-amber' : 'text-emerald-500'} />
                                <span className="text-caption font-medium text-zinc-500">{card.trend}</span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Detailed Graphs / Info for future */}
            <div className="bg-black rounded-[3rem] p-12 text-white overflow-hidden relative min-h-[400px]">
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">
                    <div>
                        <h2 className="text-heading-lg mb-6 leading-tight">Growth & Performance Optimization</h2>
                        <p className="text-zinc-400 text-body leading-relaxed mb-8 max-w-sm">
                            Luxel is currently processing manual verification with an average turnaround time of 42 minutes. 
                            Consider activating automated bank hooks to reduce overhead.
                        </p>
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col">
                                <span className="text-heading-md font-bold text-amber">94%</span>
                                <span className="text-caption text-zinc-500 font-medium uppercase tracking-widest">Efficiency</span>
                            </div>
                            <div className="w-[1px] h-12 bg-white/10" />
                            <div className="flex flex-col">
                                <span className="text-heading-md font-bold text-emerald-500">12</span>
                                <span className="text-caption text-zinc-500 font-medium uppercase tracking-widest">Active Exp.</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Abstract Visual Placeholder */}
                    <div className="h-full bg-zinc-900/50 rounded-[2rem] border border-white/5 backdrop-blur-3xl p-10 flex items-center justify-center relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="text-center space-y-4">
                            <BarChart3 size={64} className="text-zinc-700 mx-auto" />
                            <p className="text-caption font-medium text-zinc-500 uppercase tracking-widest">Analytics Module Loading...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
