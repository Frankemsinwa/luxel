'use client'

import { motion } from "framer-motion";
import {
    ChevronLeft,
    Calendar,
    User,
    Plane,
    Clock,
    ShieldCheck,
    MessageSquare,
    CheckCircle2,
    XCircle,
    Copy,
    ExternalLink,
    ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function RequestDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    // Mock data based on the ID
    const request = {
        id: id || "LX-492781",
        client: "Jonathan Wick",
        email: "j.wick@high-table.com",
        tier: "VIP Member",
        status: "Active Tracking",
        itinerary: {
            from: "London (LHR)",
            to: "New York (JFK)",
            date: "Oct 24, 2026",
            cabin: "First Class",
            passengers: "2 Adults",
            aircraftPref: "Gulfstream G650"
        },
        timeline: [
            { time: "10:15 AM", event: "Agent Sarah accepted request", status: "Done" },
            { time: "10:12 AM", event: "Initial search performed by client", status: "Done" },
            { time: "10:10 AM", event: "System received new inquiry", status: "Done" }
        ]
    };

    return (
        <div className="max-w-6xl mx-auto space-y-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => router.back()}
                        className="w-12 h-12 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-all shadow-sm"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-black text-zinc-900 tracking-tight">{request.id}</h1>
                            <div className="px-3 py-1 rounded-full bg-amber/10 text-amber text-[10px] font-black uppercase tracking-widest animate-pulse">
                                Live Request
                            </div>
                        </div>
                        <p className="text-zinc-500 font-medium">Flight Concierge Management Dashboard</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="px-6 py-4 rounded-xl border border-zinc-100 font-bold text-xs text-zinc-500 hover:bg-zinc-50 transition-all">
                        Archive Request
                    </button>
                    <button className="px-8 py-4 rounded-xl bg-zinc-900 text-white font-bold text-xs shadow-xl shadow-zinc-200 hover:scale-[1.02] active:scale-95 transition-all">
                        Assign to Desk
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-10">

                    {/* Itinerary Card */}
                    <div className="bg-white rounded-[3rem] p-10 border border-zinc-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50" />

                        <div className="relative z-10 flex items-center justify-between mb-10 pb-10 border-b border-zinc-50">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-3xl bg-zinc-900 flex items-center justify-center text-amber">
                                    <Plane size={32} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-1">Route Overview</h3>
                                    <p className="text-2xl font-black text-zinc-900 tracking-tight">{request.itinerary.from} → {request.itinerary.to}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-amber uppercase tracking-widest mb-1">Cabin Class</p>
                                <p className="text-lg font-black text-zinc-900">{request.itinerary.cabin}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-8 relative z-10">
                            <div>
                                <h4 className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-2">Departure Date</h4>
                                <div className="flex items-center gap-2 text-zinc-900 font-bold text-sm">
                                    <Calendar size={16} className="text-zinc-400" />
                                    {request.itinerary.date}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-2">Travelers</h4>
                                <div className="flex items-center gap-2 text-zinc-900 font-bold text-sm">
                                    <User size={16} className="text-zinc-400" />
                                    {request.itinerary.passengers}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-2">Preferred Aircraft</h4>
                                <div className="flex items-center gap-2 text-zinc-900 font-bold text-sm">
                                    <ShieldCheck size={16} className="text-emerald-500" />
                                    {request.itinerary.aircraftPref}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Panel */}
                    <div className="grid grid-cols-2 gap-8">
                        <div className="bg-emerald-50/50 rounded-[2.5rem] p-8 border border-emerald-100 flex flex-col justify-between group hover:bg-emerald-50 transition-all cursor-pointer">
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-white border border-emerald-100 flex items-center justify-center text-emerald-500 shadow-sm">
                                    <CheckCircle2 size={24} />
                                </div>
                                <ArrowUpRight className="text-emerald-300 group-hover:text-emerald-500 transition-colors" />
                            </div>
                            <div>
                                <h4 className="text-lg font-black text-emerald-900 mb-1">Verify Seat & Rate</h4>
                                <p className="text-xs text-emerald-700/60 font-medium leading-relaxed">Agent has confirmed the booking for available aircraft tail-number.</p>
                            </div>
                        </div>

                        <div className="bg-zinc-900 rounded-[2.5rem] p-8 border border-zinc-800 flex flex-col justify-between group hover:bg-black transition-all cursor-pointer">
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-amber">
                                    <MessageSquare size={24} />
                                </div>
                                <ArrowUpRight className="text-zinc-700 group-hover:text-amber transition-colors" />
                            </div>
                            <div>
                                <h4 className="text-lg font-black text-white mb-1">Open Direct Chat</h4>
                                <p className="text-xs text-white/40 font-medium leading-relaxed">Secure communication line with client for custom logistics.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Sidebar */}
                <div className="space-y-10">

                    {/* Client Profile */}
                    <div className="bg-white rounded-[3rem] p-10 border border-zinc-100 shadow-sm">
                        <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-8">Client Profile</h3>
                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-16 h-16 rounded-full bg-zinc-100 border border-zinc-200 overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 to-zinc-400 opacity-20" />
                            </div>
                            <div>
                                <p className="text-lg font-black text-zinc-900 mb-1">{request.client}</p>
                                <span className="text-[10px] font-bold text-amber px-2.5 py-1 rounded-md bg-amber/10 uppercase tracking-widest">{request.tier}</span>
                            </div>
                        </div>
                        <div className="space-y-4 pt-8 border-t border-zinc-50">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-zinc-400">Email Address</span>
                                <button className="text-xs font-black text-zinc-900 flex items-center gap-2 hover:text-amber transition-colors">
                                    {request.email}
                                    <Copy size={12} />
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-zinc-400">Total Bookings</span>
                                <span className="text-xs font-black text-zinc-900">42 Flights</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-zinc-400">Last Active</span>
                                <span className="text-xs font-black text-zinc-900">Now</span>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white rounded-[3rem] p-10 border border-zinc-100 shadow-sm">
                        <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-8">Internal Log</h3>
                        <div className="space-y-8 relative">
                            <div className="absolute top-0 left-[2.25rem] w-[1px] h-full bg-zinc-50" />
                            {request.timeline.map((item, i) => (
                                <div key={i} className="flex gap-6 relative z-10">
                                    <div className="w-9 h-9 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 text-[10px] font-bold">
                                        {item.time.split(' ')[0]}
                                    </div>
                                    <div className="flex-1 pt-1">
                                        <p className="text-xs font-bold text-zinc-900 mb-1">{item.event}</p>
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Logged by System</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
