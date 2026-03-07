'use client'

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingStatusHeader from "@/components/BookingStatusHeader";
import ReservationSummaryCard from "@/components/ReservationSummaryCard";
import { motion } from "framer-motion";
import { MessageSquare, Clock, ShieldCheck, Headphones, ArrowRight, XCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

function AgentConfirmingContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
    const [rejected, setRejected] = useState(false);
    const reqId = searchParams.get('reqId');

    useEffect(() => {
        if (!reqId) return;

        // 1. Check the CURRENT status first (handles page refresh)
        const checkCurrentStatus = async () => {
            const { data, error } = await supabase
                .from('requests')
                .select('status')
                .eq('id', reqId)
                .single();

            if (!error && data) {
                if (data.status === 'RESOLVED') {
                    router.push(`/flights/status/agent-confirmed?${searchParams.toString()}`);
                    return;
                }
                if (data.status === 'CLOSED') {
                    setRejected(true);
                    return;
                }
            }
        };

        checkCurrentStatus();

        // 2. Real-time listener for future status changes
        const channel = supabase
            .channel(`request-tracking-${reqId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'requests',
                    filter: `id=eq.${reqId}`
                },
                (payload) => {
                    console.log('Request updated:', payload);
                    if (payload.new.status === 'RESOLVED') {
                        router.push(`/flights/status/agent-confirmed?${searchParams.toString()}`);
                    } else if (payload.new.status === 'CLOSED') {
                        setRejected(true);
                    }
                }
            )
            .subscribe();

        // 3. Countdown Timer
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // 4. Fallback Polling (in case Realtime websockets fail or aren't enabled in Supabase Dashboard)
        const pollingInterval = setInterval(async () => {
            await checkCurrentStatus();
        }, 15000); // Check every 15 seconds as a backup

        return () => {
            clearInterval(timer);
            clearInterval(pollingInterval);
            supabase.removeChannel(channel);
        };
    }, [reqId, router, searchParams]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Rejection screen
    if (rejected) {
        return (
            <div className="min-h-screen bg-amber/5 flex flex-col">
                <Navbar />
                <BookingStatusHeader currentStep={2} />
                <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 flex flex-col items-center justify-center text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center text-red-500 mb-10 ring-12 ring-red-50"
                    >
                        <XCircle size={48} strokeWidth={2.5} />
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight mb-6">
                        Request Unavailable
                    </h1>
                    <p className="text-zinc-500 text-lg font-medium max-w-xl mx-auto mb-12 leading-relaxed">
                        Unfortunately, our concierge team was unable to confirm availability for this route. No charges have been made. Please try a different flight or contact our support team.
                    </p>
                    <button
                        onClick={() => router.push('/flights')}
                        className="bg-zinc-900 text-white px-10 py-6 rounded-3xl flex items-center justify-center gap-4 font-black text-xs tracking-widest uppercase shadow-xl shadow-zinc-200 hover:scale-[1.02] active:scale-95 transition-all group"
                    >
                        Search New Flights
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-amber/5 flex flex-col">
            <Navbar />

            {/* Step Indicator Section */}
            <div className="bg-amber border-b border-amber/20">
                <BookingStatusHeader currentStep={2} />
            </div>

            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
                <div className="flex flex-col lg:flex-row gap-16">

                    {/* Left Side: Status & Timeline */}
                    <div className="flex-1 space-y-12">

                        {/* Status Section */}
                        <div className="space-y-8">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div>
                                    <h1 className="text-4xl font-bold text-black tracking-tight mb-2">
                                        {timeLeft === 0 ? "High Request Volume" : "Verifying Availability"}
                                    </h1>
                                    <p className="text-black/60 font-medium">
                                        {timeLeft === 0
                                            ? "We are currently experiencing high volume. Your request is queued and will be confirmed shortly."
                                            : "Your request is being handled by our VIP desk."}
                                    </p>
                                </div>
                                <div className="bg-black/5 border border-black/10 rounded-2xl px-6 py-4 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-amber shadow-lg shadow-black/20">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-black uppercase tracking-widest">Expected in</div>
                                        <div className="text-xl font-black text-black">{formatTime(timeLeft)}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Animated Loading Bar */}
                            <div className="relative h-1 w-full bg-black/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: '0%' }}
                                    animate={{ width: `${((600 - timeLeft) / 600) * 100}%` }}
                                    className="absolute inset-y-0 left-0 bg-black shadow-[0_0_15px_rgba(0,0,0,0.3)]"
                                />
                            </div>
                        </div>

                        {/* Quick Actions Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <button className="bg-zinc-900 text-white p-8 rounded-[2rem] flex items-center justify-between group hover:scale-[1.02] transition-all cursor-pointer">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                                        <MessageSquare size={22} className="text-amber" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-bold text-white uppercase tracking-widest text-[10px] mb-1">Direct Access</h3>
                                        <p className="text-white/60 text-xs">Chat with Concierge</p>
                                    </div>
                                </div>
                                <ArrowRight size={20} className="text-white/20 group-hover:translate-x-1 group-hover:text-amber transition-all" />
                            </button>

                            <div className="bg-white border border-zinc-100 p-8 rounded-[2rem] flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center">
                                        <ShieldCheck size={22} className="text-emerald-500" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-bold text-zinc-400 uppercase tracking-widest text-[10px] mb-1">Security</h3>
                                        <p className="text-zinc-600 font-bold text-xs uppercase tracking-tighter">Luxel Shield™ Active</p>
                                    </div>
                                </div>
                                <div className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">Verified</div>
                            </div>
                        </div>

                        {/* Live Radar / Animation */}
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] pl-1">Live Tracking Radar</h3>
                            <div className="bg-black rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/20 border border-white/5 relative group">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none" />
                                <video
                                    src="/plane.webm"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full aspect-video object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                                />
                                <div className="absolute bottom-8 left-8 z-20 flex items-center gap-4">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Signal Active: Tracking Request</span>
                                </div>
                            </div>
                        </div>

                        {/* Minimal Timeline */}
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] pl-1">Live Activity</h3>
                            <div className="space-y-4">
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className="bg-white p-6 rounded-2xl border border-zinc-100 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-2 h-2 rounded-full bg-amber animate-pulse" />
                                        <p className="text-sm font-bold text-zinc-700">Verifying {searchParams.get('depCode') || "LHR"} → {searchParams.get('arrCode') || "JFK"} routing...</p>
                                    </div>
                                    <span className="text-[10px] font-medium text-zinc-400">Just now</span>
                                </motion.div>
                                <div className="bg-zinc-50 p-6 rounded-2xl border border-dotted border-zinc-200 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-2 h-2 rounded-full bg-zinc-300" />
                                        <p className="text-sm font-medium text-zinc-500">Request received by Agent desk</p>
                                    </div>
                                    <span className="text-[10px] font-medium text-zinc-400">2 min ago</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Details Summary */}
                    <div className="w-full lg:w-[450px] space-y-8">
                        <div className="sticky top-32">
                            <div className="flex items-center gap-3 mb-6 pl-4">
                                <div className="w-2 h-2 rounded-full bg-zinc-900" />
                                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-900">Itinerary Overview</h2>
                            </div>
                            <Suspense fallback={<div>Loading Summary...</div>}>
                                <ReservationSummaryCard />
                            </Suspense>

                            {/* Help Banner */}
                            <div className="mt-8 bg-zinc-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-amber/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-amber/20 transition-all duration-700" />
                                <Headphones className="text-amber mb-4" size={24} />
                                <h4 className="text-lg font-bold mb-2">Priority Support</h4>
                                <p className="text-white/50 text-xs leading-relaxed mb-6 font-light">As a VIP member, you have a dedicated desk for this reservation. Call us 24/7 at <span className="text-white font-bold tracking-widest">+1 (800) LUXEL-ELITE</span></p>
                                <button className="text-[10px] font-black tracking-widest text-amber uppercase border-b border-amber/30 hover:border-amber transition-all pb-1">Request Callback</button>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function AgentConfirmingPage() {
    return (
        <Suspense fallback={<div>Loading Tracking...</div>}>
            <AgentConfirmingContent />
        </Suspense>
    );
}
