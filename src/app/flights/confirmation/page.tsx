'use client'

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from "framer-motion";
import {
    CheckCircle2,
    ArrowRight,
    Clock,
    ShieldCheck,
    Plane,
    MapPin,
    Calendar,
    Search
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingStatusHeader from "@/components/BookingStatusHeader";

function ConfirmationContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Extract flight details for the summary
    const ref = searchParams.get('ref') || 'LX-PENDING';
    const depCity = searchParams.get('depCity') || 'London';
    const arrCity = searchParams.get('arrCity') || 'New York';
    const depCode = searchParams.get('depCode') || 'LHR';
    const arrCode = searchParams.get('arrCode') || 'JFK';
    const date = searchParams.get('depTime') || 'October 24, 2026';

    const handleTrackReservation = () => {
        router.push(`/flights/status/agent-confirming?${searchParams.toString()}`);
    };

    return (
        <div className="min-h-screen bg-amber/5 flex flex-col">
            <Navbar />

            <BookingStatusHeader currentStep={1} />

            <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 flex flex-col items-center justify-center text-center">

                {/* Success Icon */}
                <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 12, stiffness: 200 }}
                    className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center text-white mb-10 shadow-xl shadow-emerald-100 ring-12 ring-emerald-50"
                >
                    <CheckCircle2 size={48} strokeWidth={2.5} />
                </motion.div>

                {/* Main Message */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight mb-6">
                        Request Received
                    </h1>
                    <p className="text-zinc-500 text-lg font-medium max-w-xl mx-auto mb-12 leading-relaxed">
                        Your private travel inquiry has been transmitted to our VIP Concierge Desk. An elite agent is currently verifying aircraft availability and seat assignments.
                    </p>
                </motion.div>

                {/* Booking Brief */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-full bg-white rounded-[3rem] p-10 border border-zinc-100 shadow-sm mb-12 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                        <Plane size={120} />
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-zinc-900 flex items-center justify-center text-amber">
                                <Plane size={28} />
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Reference Number</p>
                                <h3 className="text-xl font-black text-zinc-900">#{ref}</h3>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Itinerary</p>
                                <p className="text-sm font-bold text-zinc-900">{depCode} → {arrCode}</p>
                            </div>
                            <div className="w-px h-8 bg-zinc-100" />
                            <div className="text-left">
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Date</p>
                                <p className="text-sm font-bold text-zinc-900">{date}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-6 w-full max-w-md"
                >
                    <button
                        onClick={handleTrackReservation}
                        className="flex-1 bg-zinc-900 text-white px-10 py-6 rounded-3xl flex items-center justify-center gap-4 font-black text-xs tracking-widest uppercase shadow-xl shadow-zinc-200 hover:scale-[1.02] active:scale-95 transition-all group"
                    >
                        Track Reservation
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="px-8 py-6 rounded-3xl border border-zinc-100 text-zinc-400 font-black text-xs tracking-widest uppercase hover:bg-zinc-50 transition-all active:scale-95"
                    >
                        Return Home
                    </button>
                </motion.div>

                {/* Trust Badges */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center gap-8 mt-16"
                >
                    <div className="flex items-center gap-2 text-zinc-400">
                        <Clock size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Verification: ~10 Mins</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-400">
                        <ShieldCheck size={16} className="text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Secure Concierge</span>
                    </div>
                </motion.div>

            </main>

            <Footer />
        </div>
    );
}

export default function ConfirmationPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Finalizing Request...</div>}>
            <ConfirmationContent />
        </Suspense>
    );
}
