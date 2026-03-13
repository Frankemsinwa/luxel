'use client'

import api from '@/lib/api';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingStatusHeader from "@/components/BookingStatusHeader";
import ReservationSummaryCard from "@/components/ReservationSummaryCard";
import { motion } from "framer-motion";
import { FileText, Loader2, ShieldCheck, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function VerifyingContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const bookingId = searchParams.get('id');

        const confirmAndFinalize = async () => {
            try {
                if (!bookingId) {
                    setError('Missing booking reference.');
                    return;
                }

                // Call the backend to confirm payment — using our centralized api client
                const response = await api.patch(`/bookings/${bookingId}/confirm-payment`);

                if (response.status === 200 || response.status === 204) {
                    router.push(`/flights/status/finalized?${searchParams.toString()}`);
                } else {
                    setError(response.data?.message || 'Payment confirmation failed.');
                }
            } catch (err: any) {
                console.error('Confirm payment error:', err);
                setError(err.response?.data?.message || 'A connection error occurred during verification.');
            }
        };

        // Progress bar animation — calls API at 100%
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    confirmAndFinalize();
                    return 100;
                }
                return prev + 1;
            });
        }, 100);

        return () => clearInterval(timer);
    }, [router, searchParams]);

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
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-black rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 shadow-2xl shadow-black/20 border border-black/20 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                                <Loader2 size={200} className="animate-spin text-white" />
                            </div>

                            <div className="relative z-10">
                                <span className="px-4 py-1.5 rounded-full bg-flight-card text-black text-caption font-medium uppercase tracking-[0.2em] mb-8 inline-block shadow-lg shadow-black/5">
                                    Processing
                                </span>

                                <h2 className="text-heading-xl text-white mb-6 leading-tight max-w-xl">
                                    Payment Verification in Progress
                                </h2>
                                <p className="text-body-lg text-zinc-400 leading-relaxed mb-12 max-w-xl">
                                    We have received your proof of payment. Our finance team is currently verifying the transaction. You will be notified as soon as your tickets are issued.
                                </p>

                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 mb-8">
                                        <p className="text-body text-red-400 font-medium">{error}</p>
                                    </div>
                                )}

                                <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/10 flex flex-col gap-6 max-w-lg group">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-flight-card">
                                                <FileText size={32} />
                                            </div>
                                            <div>
                                                <div className="text-body font-medium text-white mb-1">receipt_LX492781.pdf</div>
                                                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Uploaded just now • 1.2 MB</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-caption font-medium text-emerald-500 uppercase tracking-widest">Verified</span>
                                        </div>
                                    </div>

                                    {/* Verification Progress */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-caption font-medium uppercase tracking-widest">
                                            <span className="text-zinc-500">System Verification</span>
                                            <span className="text-flight-card">{Math.round(progress)}%</span>
                                        </div>
                                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                className="h-full bg-flight-card"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <ReservationSummaryCard />
                    </div>

                    {/* Activity Log Sidebar */}
                    <aside className="space-y-6 md:space-y-8">
                        <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-sm border border-zinc-100">
                            <h3 className="text-caption font-medium text-zinc-400 uppercase tracking-[0.2em] mb-8 md:mb-12">Activity Log</h3>

                            <div className="space-y-12 relative overflow-hidden">
                                <div className="absolute top-0 left-[1.125rem] w-[1px] h-full bg-zinc-50" />

                                <div className="flex items-start gap-6 relative z-10">
                                    <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center ring-8 ring-black/5 shadow-lg shadow-black/5">
                                        <Loader2 size={16} className="text-flight-card animate-spin" />
                                    </div>
                                    <div>
                                        <div className="text-caption font-medium text-flight-card uppercase tracking-widest mb-1">Now</div>
                                        <h4 className="text-body font-medium text-zinc-900 mb-1">Finance team verifying payment</h4>
                                        <p className="text-caption text-zinc-400 leading-relaxed">Transaction ID validation in process.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 relative z-10">
                                    <div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center">
                                        <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                                    </div>
                                    <div>
                                        <div className="text-caption font-medium text-zinc-400 uppercase tracking-widest mb-1">Just Now</div>
                                        <h4 className="text-body font-medium text-zinc-700 mb-1">Proof of payment uploaded</h4>
                                        <p className="text-caption text-zinc-400 leading-relaxed">Document successfully stored in system.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-100 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 flex items-center gap-4 md:gap-6 group hover:translate-y-[-4px] transition-all">
                            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
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

export default function VerifyingPage() {
    return (
        <Suspense fallback={<div>Verifying Payment...</div>}>
            <VerifyingContent />
        </Suspense>
    );
}
