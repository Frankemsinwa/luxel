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

    // Formatting the date from 'departure' (ISO string) and fallback to depTime if needed
    const departureDateStr = searchParams.get('departure');
    let displayDate = searchParams.get('depTime') || 'October 24, 2026';

    if (departureDateStr) {
        try {
            const d = new Date(departureDateStr);
            displayDate = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        } catch (e) {
            console.error("Invalid departure date:", departureDateStr);
        }
    }

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
                    <h1 className="text-display text-zinc-900 tracking-tight mb-6">
                        Request Received
                    </h1>
                    <p className="text-body-lg text-zinc-500 max-w-xl mx-auto mb-12">
                        Your private travel inquiry has been transmitted to our VIP Concierge Desk. An elite agent is currently verifying aircraft availability and seat assignments.
                    </p>
                </motion.div>

                {/* Booking Brief */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-full bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 border border-zinc-100 shadow-sm mb-12 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                        <Plane size={120} />
                    </div>

                    <div className="flex flex-col md:flex-row items-center md:justify-between gap-6 md:gap-8 relative z-10">
                        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-center md:text-left">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-zinc-900 flex items-center justify-center text-amber">
                                <Plane size={28} />
                            </div>
                            <div className="text-left">
                                <p className="text-caption font-medium text-zinc-400 uppercase tracking-widest mb-1">Reference Number</p>
                                <h3 className="text-heading-sm text-zinc-900">#{ref}</h3>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                            <div>
                                <p className="text-caption font-medium text-zinc-400 uppercase tracking-widest mb-1">Itinerary</p>
                                <p className="text-sm font-semibold text-zinc-900">{depCode} → {arrCode}</p>
                            </div>
                            <div className="w-8 h-px md:w-px md:h-8 bg-zinc-100 hidden md:block" />
                            <div>
                                <p className="text-caption font-medium text-zinc-400 uppercase tracking-widest mb-1">Date</p>
                                <p className="text-body text-zinc-900 underline decoration-amber decoration-2 underline-offset-4">{displayDate}</p>
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
                        className="flex-1 bg-zinc-900 text-white px-10 py-6 rounded-3xl flex items-center justify-center gap-4 text-body-sm font-medium tracking-widest uppercase shadow-xl shadow-zinc-200 hover:scale-[1.02] active:scale-95 transition-all group"
                    >
                        Track Reservation
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="px-8 py-6 rounded-3xl border border-zinc-100 text-zinc-400 text-body-sm font-medium tracking-widest uppercase hover:bg-zinc-50 transition-all active:scale-95"
                    >
                        Return Home
                    </button>
                </motion.div>

                {/* Trust Badges */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 mt-16"
                >
                    <div className="flex items-center gap-2 text-zinc-400">
                        <Clock size={16} />
                        <span className="text-caption font-medium uppercase tracking-widest">Verification: ~10 Mins</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-400">
                        <ShieldCheck size={16} className="text-emerald-500" />
                        <span className="text-caption font-medium uppercase tracking-widest">Secure Concierge</span>
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
