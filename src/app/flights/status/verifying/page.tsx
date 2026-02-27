'use client'

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingStatusHeader from "@/components/BookingStatusHeader";
import ReservationSummaryCard from "@/components/ReservationSummaryCard";
import { motion } from "framer-motion";
import { FileText, Loader2, ShieldCheck, Clock } from "lucide-react";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function VerifyingContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    router.push(`/flights/status/finalized?${searchParams.toString()}`);
                    return 100;
                }
                return prev + 1;
            });
        }, 100); // 10 seconds total

        return () => clearInterval(timer);
    }, [router, searchParams]);

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col">
            <Navbar />

            <BookingStatusHeader currentStep={4} />

            <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-6 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Status Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-zinc-900 rounded-[3rem] p-12 shadow-2xl shadow-zinc-200/50 border border-white/5 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                                <Loader2 size={200} className="animate-spin text-white" />
                            </div>

                            <div className="relative z-10">
                                <span className="px-4 py-1.5 rounded-full bg-amber text-black text-[10px] font-black uppercase tracking-[0.2em] mb-8 inline-block shadow-lg shadow-amber/20">
                                    Processing
                                </span>

                                <h2 className="text-4xl font-bold text-white mb-6 leading-tight max-w-xl">
                                    Payment Verification in Progress
                                </h2>
                                <p className="text-zinc-400 leading-relaxed font-light mb-12 max-w-xl text-lg">
                                    We have received your proof of payment. Our finance team is currently verifying the transaction. You will be notified as soon as your tickets are issued.
                                </p>

                                <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 flex flex-col gap-6 max-w-lg group">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-amber">
                                                <FileText size={32} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white mb-1">receipt_LX492781.pdf</div>
                                                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Uploaded just now • 1.2 MB</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Verified</span>
                                        </div>
                                    </div>

                                    {/* Verification Progress */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                                            <span className="text-zinc-500">System Verification</span>
                                            <span className="text-amber">{Math.round(progress)}%</span>
                                        </div>
                                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                className="h-full bg-amber"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                                    <div className="w-9 h-9 rounded-full bg-amber flex items-center justify-center ring-8 ring-amber/10 shadow-lg shadow-amber/10">
                                        <Loader2 size={16} className="text-white animate-spin" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-amber uppercase tracking-widest mb-1">Now</div>
                                        <h4 className="font-bold text-zinc-900 text-sm mb-1">Finance team verifying payment</h4>
                                        <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">Transaction ID validation in process.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 relative z-10">
                                    <div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center">
                                        <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Just Now</div>
                                        <h4 className="font-bold text-zinc-700 text-sm mb-1">Proof of payment uploaded</h4>
                                        <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">Document successfully stored in system.</p>
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

export default function VerifyingPage() {
    return (
        <Suspense fallback={<div>Verifying Payment...</div>}>
            <VerifyingContent />
        </Suspense>
    );
}
