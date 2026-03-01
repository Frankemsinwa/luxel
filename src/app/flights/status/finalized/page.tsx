'use client'

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingStatusHeader from "@/components/BookingStatusHeader";
import ReservationSummaryCard from "@/components/ReservationSummaryCard";
import { motion } from "framer-motion";
import { Download, CheckCircle2, Star, Share2, ShieldCheck } from "lucide-react";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function FinalizedContent() {
    const searchParams = useSearchParams();

    return (
        <div className="min-h-screen bg-amber/5 flex flex-col">
            <Navbar />

            <BookingStatusHeader currentStep={5} />

            <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-6 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Status Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-amber rounded-[3rem] p-16 shadow-2xl shadow-amber/20 border border-amber/20 relative overflow-hidden text-center"
                        >
                            <div className="flex flex-col items-center max-w-2xl mx-auto relative z-10">
                                <motion.div
                                    initial={{ scale: 0, rotate: -45 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", damping: 12, stiffness: 200 }}
                                    className="w-24 h-24 rounded-full bg-amber flex items-center justify-center text-white mb-10 shadow-xl shadow-amber/20 ring-12 ring-amber/5"
                                >
                                    <Star size={40} fill="currentColor" />
                                </motion.div>

                                <h2 className="text-5xl font-black text-zinc-900 mb-6 leading-tight">
                                    Your trip is ready.
                                </h2>
                                <p className="text-zinc-500 leading-relaxed font-light mb-12 text-lg">
                                    Your ticket has been issued and sent to your email and WhatsApp. You may now download your priority access passes.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
                                    <button className="flex-1 bg-amber text-white px-10 py-6 rounded-2xl flex items-center justify-center gap-4 font-bold text-sm shadow-xl shadow-amber/20 hover:scale-105 transition-all active:scale-95 group">
                                        <Download size={20} className="group-hover:translate-y-1 transition-transform" />
                                        Download E-Ticket
                                    </button>
                                    <button className="px-6 py-6 rounded-2xl border border-zinc-100 flex items-center justify-center text-zinc-400 hover:bg-zinc-50 transition-all active:scale-95">
                                        <Share2 size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Decorative background elements */}
                            <div className="absolute top-0 left-0 w-64 h-64 bg-amber/5 rounded-full blur-3xl -ml-24 -mt-24 pointer-events-none" />
                            <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber/5 rounded-full blur-3xl -mr-24 -mb-24 pointer-events-none" />
                        </motion.div>

                        <ReservationSummaryCard />
                    </div>

                    {/* Activity Log Sidebar */}
                    <aside className="space-y-8">
                        <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-zinc-100">
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em] mb-12">Activity Log</h3>

                            <div className="space-y-12 relative overflow-hidden">
                                <div className="absolute top-0 left-[1.125rem] w-[1px] h-full bg-zinc-50" />

                                <div className="flex items-start gap-6 relative z-10">
                                    <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center ring-8 ring-emerald-50 shadow-lg shadow-emerald-100">
                                        <CheckCircle2 size={18} className="text-white" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Now</div>
                                        <h4 className="font-bold text-zinc-900 text-sm mb-1">Booking Finalized</h4>
                                        <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">Tickets issued and sent via priority channels.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 relative z-10">
                                    <div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center">
                                        <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Just Now</div>
                                        <h4 className="font-bold text-zinc-700 text-sm mb-1">Payment Verified</h4>
                                        <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">Finance team confirmed receipt of funds.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-100 rounded-[2.5rem] p-8 flex items-center gap-6 group hover:translate-y-[-4px] transition-all">
                            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-emerald-500 shadow-sm">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-emerald-900 text-sm mb-1 uppercase tracking-widest">Protected</h4>
                                <p className="text-[10px] text-emerald-700/60 font-medium leading-relaxed">Your request is secured by Luxel Shield™</p>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function FinalizedPage() {
    return (
        <Suspense fallback={<div>Finalizing Your Trip...</div>}>
            <FinalizedContent />
        </Suspense>
    );
}
