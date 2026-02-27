'use client'

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

export default function AgentDashboard() {
    const router = useRouter();
    const stats = [
        { label: "Active Requests", value: "24", change: "+12%", icon: <Clock className="text-amber" />, color: "bg-amber/10" },
        { label: "Confirmed Today", value: "142", change: "+8%", icon: <CheckCircle2 className="text-emerald-500" />, color: "bg-emerald-500/10" },
        { label: "Elite Members", value: "892", change: "+24%", icon: <User className="text-blue-500" />, color: "bg-blue-500/10" },
        { label: "System Uptime", value: "99.9%", change: "Stable", icon: <AlertCircle className="text-zinc-400" />, color: "bg-zinc-100" },
    ];

    const requests = [
        { id: "LX-492781", user: "Jonathan Wick", route: "LHR → JFK", class: "First Class", status: "Confirming", priority: "VIP" },
        { id: "LX-492802", user: "Sofia Al-Aziz", route: "DXB → NRT", class: "Private Suite", status: "Action Required", priority: "Elite" },
        { id: "LX-492815", user: "Michael Chen", route: "SIN → SYD", class: "Business", status: "Verified", priority: "Regular" },
        { id: "LX-492833", user: "Elena Rossi", route: "CDG → MIA", class: "First Class", status: "Confirming", priority: "VIP" },
    ];

    return (
        <div className="space-y-10">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-2">Workspace Overview</h1>
                    <p className="text-zinc-500 font-medium">Welcome back, Sarah. You have 8 urgent requests pending.</p>
                </div>
                <button className="bg-zinc-900 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-zinc-200 hover:scale-[1.02] active:scale-95 transition-all">
                    Generate Daily Report
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={stat.label}
                        className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm hover:shadow-xl transition-all group"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                {stat.icon}
                            </div>
                            <div className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-lg">
                                {stat.change}
                            </div>
                        </div>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-black text-zinc-900 tracking-tighter">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            {/* Request Queue */}
            <div className="bg-white rounded-[3rem] border border-zinc-100 shadow-sm overflow-hidden">
                <div className="p-10 border-b border-zinc-50 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black text-zinc-900 tracking-tight">Live Request Queue</h3>
                        <p className="text-xs text-zinc-400 font-medium mt-1">Real-time incoming flight inquiries from Luxel Elite</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="w-12 h-12 rounded-2xl border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-all">
                            <Filter size={18} />
                        </button>
                        <button className="w-12 h-12 rounded-2xl border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-all">
                            <Search size={18} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50/50">
                                <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Inquiry ID</th>
                                <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Client Name</th>
                                <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Itinerary</th>
                                <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Status</th>
                                <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Tier</th>
                                <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {requests.map((req, i) => (
                                <tr
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-8 border-t border-zinc-50 text-center">
                    <button className="text-[10px] font-black text-amber uppercase tracking-widest hover:underline">View All Active Requests</button>
                </div>
            </div>
        </div>
    );
}
