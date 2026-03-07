'use client'

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Briefcase,
    Calendar,
    MapPin,
    Plane,
    ChevronRight,
    Search,
    Filter,
    ArrowUpRight,
    CircleCheck,
    Clock,
    XCircle,
    Download,
    CreditCard
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function TripsPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [bookings, setBookings] = useState<any[]>([]);
    const [filter, setFilter] = useState<'ALL' | 'CONFIRMED' | 'PENDING' | 'CANCELLED'>('ALL');

    useEffect(() => {
        const fetchBookings = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setUser(session.user);

                const { data, error } = await supabase
                    .from('bookings')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .order('created_at', { ascending: false });

                if (data) {
                    setBookings(data);
                }
            }
            setLoading(false);
        };

        fetchBookings();
    }, []);

    const filteredBookings = filter === 'ALL'
        ? bookings
        : bookings.filter(b => b.status === filter);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border-4 border-amber border-t-transparent animate-spin" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-amber/10 flex items-center justify-center text-amber mb-6">
                    <Briefcase size={40} />
                </div>
                <h1 className="text-3xl font-black text-zinc-900 mb-4">Itinerary Locked</h1>
                <p className="text-zinc-500 max-w-sm mb-8">Access your personalized luxury itineraries and flight confirmations by logging in.</p>
                <button
                    onClick={() => window.location.href = '/'}
                    className="bg-zinc-900 text-white px-10 py-4 rounded-2xl font-bold text-xs tracking-widest uppercase hover:bg-zinc-800 transition-all font-satoshi shadow-xl"
                >
                    Return to Lobby
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-32">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber text-black text-[10px] font-black uppercase tracking-[0.2em] mb-4"
                        >
                            <Calendar size={12} />
                            Your Itinerary
                        </motion.div>
                        <h1 className="text-5xl md:text-7xl font-black text-zinc-900 tracking-tight">Manage <span className="text-zinc-300">Trips</span></h1>
                        <p className="text-zinc-400 font-medium text-lg mt-4 max-w-xl">Review and manage your elite travel experiences from one central luxury dashboard.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-white rounded-[1.5rem] p-4 flex items-center gap-6 border border-zinc-100 shadow-sm">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Total Bookings</span>
                                <span className="text-xl font-black text-zinc-900">{bookings.length}</span>
                            </div>
                            <div className="w-px h-8 bg-zinc-100" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Confirmed trips</span>
                                <span className="text-xl font-black text-amber">{bookings.filter(b => b.status === 'CONFIRMED').length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-2">
                        {['ALL', 'CONFIRMED', 'PENDING', 'CANCELLED'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f as any)}
                                className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${filter === f ? 'bg-zinc-900 text-white border-zinc-900 shadow-xl' : 'bg-white text-zinc-400 border-zinc-100 hover:border-zinc-300'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    <div className="relative group flex-1 md:flex-none">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by locator or city..."
                            className="bg-white border-none rounded-2xl py-4 pl-14 pr-6 text-[10px] font-black placeholder:text-zinc-300 uppercase tracking-[0.1em] focus:ring-2 focus:ring-amber/20 w-full md:w-80 shadow-sm"
                        />
                    </div>
                </div>

                {/* Trips List */}
                <div className="space-y-6">
                    <AnimatePresence mode="popLayout">
                        {filteredBookings.length > 0 ? (
                            filteredBookings.map((booking, i) => (
                                <motion.div
                                    key={booking.id}
                                    layout
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.5, delay: i * 0.05 }}
                                    className="group bg-white rounded-[2.5rem] p-8 md:p-12 border border-zinc-100 hover:border-amber/20 transition-all hover:shadow-2xl hover:shadow-amber/5"
                                >
                                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                                        <div className="flex-1 flex items-center gap-8">
                                            <div className="w-20 h-20 rounded-[1.5rem] bg-zinc-950 flex items-center justify-center text-amber relative overflow-hidden group-hover:scale-110 transition-transform">
                                                <div className="absolute inset-0 bg-gradient-to-br from-amber/20 to-transparent" />
                                                <Plane size={32} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="px-3 py-1 bg-amber text-black text-[9px] font-black rounded-lg uppercase tracking-widest">
                                                        {booking.booking_reference || 'LX-REF'}
                                                    </span>
                                                    <StatusBadge status={booking.status} />
                                                </div>
                                                <h3 className="text-2xl font-black text-zinc-900 tracking-tight uppercase group-hover:text-amber transition-colors">
                                                    {booking.flight_data?.origin?.city || 'Flight'} to {booking.flight_data?.destination?.city || booking.flight_data?.itineraries?.[0]?.segments?.[0]?.arrival?.iataCode || 'World'}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-6 mt-4">
                                                    <div className="flex items-center gap-2 text-zinc-400">
                                                        <Calendar size={14} className="text-zinc-300" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">{new Date(booking.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-zinc-400">
                                                        <MapPin size={14} className="text-zinc-300" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">One Way</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-zinc-400">
                                                        <CreditCard size={14} className="text-zinc-300" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Paid via Bank</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-full lg:w-auto flex items-center justify-between lg:justify-end gap-12 pt-8 lg:pt-0 border-t lg:border-none border-zinc-50">
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Elite Amount</p>
                                                <p className="text-2xl font-black text-zinc-900">₦{booking.total_price.toLocaleString()}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button className="w-12 h-12 rounded-2xl bg-zinc-50 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all flex items-center justify-center border border-zinc-100 shadow-sm">
                                                    <Download size={18} />
                                                </button>
                                                <Link
                                                    href={`/flights/status/${booking.id}`}
                                                    className="px-8 py-4 rounded-2xl bg-zinc-950 text-white hover:bg-amber hover:text-black text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all transform active:scale-95"
                                                >
                                                    View Pass
                                                    <ArrowUpRight size={16} />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-white rounded-[3rem] p-24 text-center border-2 border-dashed border-zinc-100"
                            >
                                <div className="w-24 h-24 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-200 mx-auto mb-8">
                                    <Briefcase size={40} />
                                </div>
                                <h3 className="text-2xl font-black text-zinc-900 mb-2">No expeditions found</h3>
                                <p className="text-zinc-400 font-medium max-w-sm mx-auto mb-10">Your itineraries and bookings will appear here once you take flight.</p>
                                <Link
                                    href="/flights"
                                    className="bg-amber text-black px-10 py-5 rounded-[1.5rem] text-[10px] font-black tracking-widest uppercase hover:bg-black hover:text-white transition-all inline-flex items-center gap-3 active:scale-95"
                                >
                                    Begin Discovery
                                    <Plane size={14} />
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Elite Support Section */}
                <section className="mt-32 p-12 bg-amber rounded-[3rem] text-black relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-black/5 rounded-full blur-[100px] -mr-40 -mt-40 transition-all group-hover:bg-black/10" />
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-[2rem] bg-black text-amber flex items-center justify-center flex-shrink-0 animate-bounce-slow">
                                <Briefcase size={32} />
                            </div>
                            <div>
                                <h4 className="text-3xl font-black tracking-tight mb-1">Need Concierge Help?</h4>
                                <p className="text-black/60 font-black text-[10px] uppercase tracking-widest">Your assigned agent is standing by for trip modifications.</p>
                            </div>
                        </div>
                        <button className="bg-black text-white px-10 py-5 rounded-[1.5rem] font-black text-[10px] tracking-widest uppercase hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/20">
                            Connect Now
                        </button>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case 'CONFIRMED':
            return (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[8px] font-black uppercase tracking-widest border border-emerald-100">
                    <CircleCheck size={10} />
                    Confirmed
                </div>
            );
        case 'PENDING':
            return (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-amber/10 text-amber rounded-lg text-[8px] font-black uppercase tracking-widest border border-amber/10">
                    <Clock size={10} />
                    Processing
                </div>
            );
        case 'CANCELLED':
            return (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-500 rounded-lg text-[8px] font-black uppercase tracking-widest border border-red-100">
                    <XCircle size={10} />
                    Cancelled
                </div>
            );
        default:
            return null;
    }
}
