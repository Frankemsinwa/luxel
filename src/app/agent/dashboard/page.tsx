'use client'

import api from '@/lib/api';
import { motion } from "framer-motion";
import {
    Clock,
    CheckCircle2,
    AlertCircle,
    ArrowUpRight,
    Search,
    Filter,
    MoreHorizontal,
    PlaneTakeoff,
    User
} from "lucide-react";
import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AgentDashboard() {
    const router = useRouter();
    const [requestsData, setRequestsData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const stats = [
        { label: "Active Requests", value: requestsData.filter(r => r.status === 'OPEN' || r.status === 'IN_PROGRESS').length.toString(), change: "+12%", icon: <Clock className="text-amber" />, color: "bg-amber/10" },
        { label: "Confirmed Today", value: "12", change: "+8%", icon: <CheckCircle2 className="text-emerald-500" />, color: "bg-emerald-500/10" },
        { label: "Elite Members", value: "892", change: "+24%", icon: <User className="text-blue-500" />, color: "bg-blue-500/10" },
        { label: "System Uptime", value: "99.9%", change: "Stable", icon: <AlertCircle className="text-zinc-400" />, color: "bg-zinc-100" },
    ];

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await api.get('/agent/requests');
                setRequestsData(response.data);
            } catch (error: any) {
                console.error('Error fetching agent requests:', error);
                if (error.response?.status === 401) {
                    router.push('/');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchRequests();
    }, [router]);

    return (
        <div className="space-y-6 lg:space-y-10">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-heading-lg font-medium text-zinc-900 tracking-tight mb-2">Workspace Overview</h1>
                    <p className="text-sm lg:text-body font-medium text-zinc-500">Welcome back, Agent. You have {requestsData.length} inquiries.</p>
                </div>
                <button className="bg-zinc-900 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl lg:rounded-2xl text-xs lg:text-body-sm font-medium shadow-xl shadow-zinc-200 hover:scale-[1.02] active:scale-95 transition-all w-full sm:w-auto">
                    Generate Daily Report
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={stat.label}
                        className="bg-white p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] border border-zinc-100 shadow-sm hover:shadow-xl transition-all group"
                    >
                        <div className="flex items-center justify-between mb-4 lg:mb-6">
                            <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                {stat.icon}
                            </div>
                            <div className="text-[10px] lg:text-caption font-medium text-emerald-500 bg-emerald-50 px-2 py-0.5 lg:px-2.5 lg:py-1 rounded-lg">
                                {stat.change}
                            </div>
                        </div>
                        <p className="text-[10px] lg:text-caption font-medium text-zinc-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <h3 className="text-xl lg:text-heading-lg font-medium text-zinc-900 tracking-tighter">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            {/* Request Queue */}
            <div className="bg-white rounded-[2rem] lg:rounded-[3rem] border border-zinc-100 shadow-sm overflow-hidden">
                <div className="p-6 lg:p-10 border-b border-zinc-50 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg lg:text-heading-sm font-medium text-zinc-900 tracking-tight">Live Request Queue</h3>
                        <p className="text-[10px] lg:text-caption font-medium text-zinc-400 mt-1">Real-time incoming flight inquiries</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px] lg:min-w-0">
                        <thead>
                            <tr className="bg-zinc-50/50">
                                <th className="px-6 lg:px-10 py-4 lg:py-6 text-[10px] lg:text-caption font-medium text-zinc-400 uppercase tracking-widest">Inquiry ID</th>
                                <th className="px-6 lg:px-10 py-4 lg:py-6 text-[10px] lg:text-caption font-medium text-zinc-400 uppercase tracking-widest">Client Name</th>
                                <th className="px-6 lg:px-10 py-4 lg:py-6 text-[10px] lg:text-caption font-medium text-zinc-400 uppercase tracking-widest">Itinerary</th>
                                <th className="px-6 lg:px-10 py-4 lg:py-6 text-[10px] lg:text-caption font-medium text-zinc-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 lg:px-10 py-4 lg:py-6 text-[10px] lg:text-caption font-medium text-zinc-400 uppercase tracking-widest">Tier</th>
                                <th className="px-6 lg:px-10 py-4 lg:py-6 text-[10px] lg:text-caption font-medium text-zinc-400 uppercase tracking-widest"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-20 text-body font-medium text-zinc-400">Synchronizing with system...</td>
                                </tr>
                            ) : requestsData.length > 0 ? requestsData.map((req, i) => (
                                <tr
                                    key={req.id}
                                    onClick={() => router.push(`/agent/requests/${req.id}`)}
                                    className="hover:bg-zinc-50 transition-colors group cursor-pointer"
                                >
                                    <td className="px-6 lg:px-10 py-4 lg:py-6 text-sm lg:text-body font-medium text-zinc-900 tracking-tighter">LX-{req.id.substring(0, 6)}</td>
                                    <td className="px-6 lg:px-10 py-4 lg:py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200" />
                                            <span className="text-sm lg:text-body font-medium text-zinc-700">{req.profiles?.full_name || 'Anonymous User'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 lg:px-10 py-4 lg:py-6">
                                        <div className="flex items-center gap-2">
                                            <PlaneTakeoff size={14} className="text-zinc-400" />
                                            <span className="text-sm lg:text-body font-medium text-zinc-900">{req.details?.itinerary || 'Flight Search'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 lg:px-10 py-4 lg:py-6 text-xs lg:text-body-sm font-medium">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] lg:text-caption font-medium uppercase tracking-widest ${req.status === 'OPEN' ? 'bg-amber/5 text-amber' :
                                            req.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'
                                            }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${req.status === 'OPEN' ? 'bg-amber animate-pulse' :
                                                req.status === 'RESOLVED' ? 'bg-emerald-500' : 'bg-red-500'
                                                }`} />
                                            {req.status}
                                        </div>
                                    </td>
                                    <td className="px-6 lg:px-10 py-4 lg:py-6">
                                        <span className={`text-[10px] lg:text-caption font-medium px-2 py-1 rounded border-l-2 ${req.priority === 'VIP' ? 'bg-zinc-900 text-white border-amber' : 'bg-zinc-100 text-zinc-500 border-zinc-300'
                                            }`}>
                                            {req.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 lg:px-10 py-4 lg:py-6 text-right">
                                        <button className="p-2 rounded-lg hover:bg-zinc-100 transition-colors text-zinc-400 group-hover:text-amber">
                                            <ArrowUpRight size={20} />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-20 text-body font-medium text-zinc-400">No active traveler requests.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-6 lg:p-8 border-t border-zinc-50 text-center">
                    <button className="text-[10px] lg:text-caption font-medium text-amber uppercase tracking-widest hover:underline">View All Active Requests</button>
                </div>
            </div>
        </div>
    );
}
