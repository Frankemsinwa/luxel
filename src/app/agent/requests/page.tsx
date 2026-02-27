'use client'

import { motion } from "framer-motion";
import {
    Search,
    Filter,
    ChevronRight,
    PlaneTakeoff,
    Calendar,
    ArrowUpRight,
    SearchX
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function FlightRequestsPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    const requests = [
        { id: "LX-492781", user: "Jonathan Wick", route: "LHR → JFK", class: "First Class", status: "Confirming", priority: "VIP", date: "Oct 24, 2026" },
        { id: "LX-492802", user: "Sofia Al-Aziz", route: "DXB → NRT", class: "Private Suite", status: "Action Required", priority: "Elite", date: "Oct 25, 2026" },
        { id: "LX-492815", user: "Michael Chen", route: "SIN → SYD", class: "Business", status: "Verified", priority: "Regular", date: "Oct 26, 2026" },
        { id: "LX-492833", user: "Elena Rossi", route: "CDG → MIA", class: "First Class", status: "Confirming", priority: "VIP", date: "Oct 27, 2026" },
        { id: "LX-492901", user: "David Beckham", route: "LHR → LAX", class: "First Class", status: "Confirming", priority: "VIP", date: "Oct 28, 2026" },
        { id: "LX-492945", user: "Amara Okoro", route: "LOS → LHR", class: "Business", status: "Action Required", priority: "Elite", date: "Oct 29, 2026" },
    ];

    const filteredRequests = requests.filter(req =>
        req.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.route.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-2">Flight Requests</h1>
                    <p className="text-zinc-500 font-medium">Manage and process incoming luxury travel inquiries.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group w-80">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-amber transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by ID, name or route..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border-none rounded-2xl py-4 pl-12 pr-4 text-xs font-bold text-zinc-900 shadow-sm focus:ring-2 focus:ring-amber/10 transition-all"
                        />
                    </div>
                    <button className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-zinc-400 hover:text-zinc-900 shadow-sm transition-all">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-[3rem] border border-zinc-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50/50">
                                <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Inquiry ID</th>
                                <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Client Name</th>
                                <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Itinerary</th>
                                <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Date</th>
                                <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Status</th>
                                <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Tier</th>
                                <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest"></th>
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
                                        <td className="px-10 py-6 font-bold text-zinc-900 text-sm tracking-tighter">{req.id}</td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200" />
                                                <span className="text-sm font-bold text-zinc-700">{req.user}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-2">
                                                <PlaneTakeoff size={14} className="text-zinc-400" />
                                                <span className="text-sm font-bold text-zinc-900">{req.route}</span>
                                                <span className="text-[10px] font-medium text-zinc-400 ml-2">{req.class}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-sm text-zinc-500">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} />
                                                <span className="font-bold">{req.date}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-sm">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${req.status === 'Confirming' ? 'bg-amber/5 text-amber' :
                                                    req.status === 'Verified' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${req.status === 'Confirming' ? 'bg-amber animate-pulse' :
                                                        req.status === 'Verified' ? 'bg-emerald-500' : 'bg-red-500'
                                                    }`} />
                                                {req.status}
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className={`text-[10px] font-black px-2 py-1 rounded border-l-2 ${req.priority === 'VIP' ? 'bg-zinc-900 text-white border-amber' : 'bg-zinc-100 text-zinc-500 border-zinc-300'
                                                }`}>
                                                {req.priority}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <button className="p-2 rounded-lg hover:bg-zinc-100 transition-colors text-zinc-400 group-hover:text-amber">
                                                <ArrowUpRight size={20} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-10 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-200">
                                                <SearchX size={32} />
                                            </div>
                                            <p className="text-zinc-400 font-bold">No results found for "{searchQuery}"</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-8 border-t border-zinc-50 text-center">
                    <div className="flex items-center justify-center gap-4">
                        <button className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-all font-bold text-xs">1</button>
                        <button className="w-10 h-10 rounded-xl hover:bg-zinc-50 flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-all font-bold text-xs">2</button>
                        <button className="w-10 h-10 rounded-xl hover:bg-zinc-50 flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-all font-bold text-xs">3</button>
                        <div className="h-4 w-px bg-zinc-100 mx-2" />
                        <button className="flex items-center gap-2 text-zinc-400 hover:text-amber transition-all font-black text-[10px] uppercase tracking-widest">
                            Next Page
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
