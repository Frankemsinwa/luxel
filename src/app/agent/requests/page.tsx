'use client'

import api from '@/lib/api';
import { motion } from "framer-motion";
import {
    Search,
    Filter,
    ChevronRight,
    PlaneTakeoff,
    Calendar,
    ArrowUpRight,
    SearchX,
    RefreshCw
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export default function FlightRequestsPage() {
    const router = useRouter();
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchRequests = useCallback(async (showFullLoading = true) => {
        if (showFullLoading) setLoading(true);
        else setIsRefreshing(true);

        try {
            const response = await api.get('/agent/requests');
            setRequests(response.data);
        } catch (error: any) {
            console.error('Error fetching agent requests:', error);
            if (error.response?.status === 401) {
                router.push('/');
            }
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    }, [router]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const filteredRequests = requests.filter(req =>
        (req.profiles?.full_name || "Unknown").toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (req.details?.itinerary || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 lg:space-y-10">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl lg:text-heading-lg font-medium text-zinc-900 tracking-tight mb-2">Flight Requests</h1>
                    <p className="text-sm lg:text-body text-zinc-500 font-medium">Manage and process incoming traveler inquiries.</p>
                </div>
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="relative group flex-1 md:w-80">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-amber transition-colors" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border-none rounded-xl lg:rounded-2xl py-3.5 lg:py-4 pl-12 pr-4 text-xs lg:text-body-sm font-medium text-zinc-900 shadow-sm focus:ring-2 focus:ring-amber/10 transition-all"
                        />
                    </div>
                    <button
                        onClick={() => fetchRequests(false)}
                        disabled={isRefreshing}
                        className="w-12 h-12 lg:w-14 lg:h-14 bg-white rounded-xl lg:rounded-2xl flex items-center justify-center text-zinc-400 hover:text-amber shadow-sm transition-all disabled:opacity-50 flex-shrink-0"
                    >
                        <motion.div
                            animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                            <RefreshCw size={20} />
                        </motion.div>
                    </button>
                    <button className="w-12 h-12 lg:w-14 lg:h-14 bg-white rounded-xl lg:rounded-2xl flex items-center justify-center text-zinc-400 hover:text-zinc-900 shadow-sm transition-all flex-shrink-0">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-[2rem] lg:rounded-[3rem] border border-zinc-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-zinc-50/50">
                                <th className="px-6 lg:px-10 py-5 lg:py-6 text-[10px] lg:text-caption font-medium text-zinc-400 uppercase tracking-widest">Inquiry ID</th>
                                <th className="px-6 lg:px-10 py-5 lg:py-6 text-[10px] lg:text-caption font-medium text-zinc-400 uppercase tracking-widest">Client Name</th>
                                <th className="px-6 lg:px-10 py-5 lg:py-6 text-[10px] lg:text-caption font-medium text-zinc-400 uppercase tracking-widest">Itinerary</th>
                                <th className="px-6 lg:px-10 py-5 lg:py-6 text-[10px] lg:text-caption font-medium text-zinc-400 uppercase tracking-widest">Date</th>
                                <th className="px-6 lg:px-10 py-5 lg:py-6 text-[10px] lg:text-caption font-medium text-zinc-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 lg:px-10 py-5 lg:py-6 text-[10px] lg:text-caption font-medium text-zinc-400 uppercase tracking-widest">Tier</th>
                                <th className="px-6 lg:px-10 py-5 lg:py-6 text-[10px] lg:text-caption font-medium text-zinc-400 uppercase tracking-widest"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {filteredRequests.length > 0 ? (
                                filteredRequests.map((req, i) => (
                                    <motion.tr
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        key={req.id}
                                        onClick={() => router.push(`/agent/requests/${req.id}`)}
                                        className="hover:bg-zinc-50 transition-colors group cursor-pointer"
                                    >
                                        <td className="px-6 lg:px-10 py-5 lg:py-6 font-medium text-zinc-900 text-sm lg:text-body tracking-tighter">{req.id.substring(0, 10)}...</td>
                                        <td className="px-6 lg:px-10 py-5 lg:py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200" />
                                                <span className="text-sm lg:text-body font-medium text-zinc-700">{req.profiles?.full_name || "Unknown"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 lg:px-10 py-5 lg:py-6">
                                            <div className="flex items-center gap-2">
                                                <PlaneTakeoff size={14} className="text-zinc-400" />
                                                <span className="text-sm lg:text-body font-medium text-zinc-900">{req.details?.itinerary || "N/A"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 lg:px-10 py-5 lg:py-6 text-xs lg:text-body text-zinc-500">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} />
                                                <span className="font-medium">{new Date(req.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 lg:px-10 py-5 lg:py-6">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] lg:text-caption font-medium uppercase tracking-widest ${req.status === 'OPEN' ? 'bg-amber/5 text-amber' :
                                                req.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${req.status === 'OPEN' ? 'bg-amber animate-pulse' :
                                                    req.status === 'RESOLVED' ? 'bg-emerald-500' : 'bg-red-500'
                                                    }`} />
                                                {req.status}
                                            </div>
                                        </td>
                                        <td className="px-6 lg:px-10 py-5 lg:py-6">
                                            <span className={`text-[10px] lg:text-caption font-medium px-2 py-1 rounded border-l-2 ${req.priority === 'VIP' ? 'bg-zinc-900 text-white border-amber' : 'bg-zinc-100 text-zinc-500 border-zinc-300'
                                                }`}>
                                                {req.priority || 'REGULAR'}
                                            </span>
                                        </td>
                                        <td className="px-6 lg:px-10 py-5 lg:py-6 text-right">
                                            <button className="p-2 rounded-lg hover:bg-zinc-100 transition-colors text-zinc-400 group-hover:text-amber">
                                                <ArrowUpRight size={20} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 lg:px-10 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-200">
                                                <SearchX size={32} />
                                            </div>
                                            <p className="text-sm lg:text-body font-medium text-zinc-400">No results found for "{searchQuery}"</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-6 lg:p-8 border-t border-zinc-50 text-center">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 lg:gap-8">
                        <div className="flex items-center gap-2">
                            <button className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center text-xs font-bold">1</button>
                            <button className="w-10 h-10 rounded-xl hover:bg-zinc-50 flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-all text-xs font-bold">2</button>
                            <button className="w-10 h-10 rounded-xl hover:bg-zinc-50 flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-all text-xs font-bold">3</button>
                        </div>
                        <div className="hidden sm:block h-4 w-px bg-zinc-100" />
                        <button className="flex items-center gap-2 text-zinc-400 hover:text-amber transition-all text-[10px] font-bold uppercase tracking-widest">
                            Next Page
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
