'use client'

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingStatusHeader from "@/components/BookingStatusHeader";
import ReservationSummaryCard from "@/components/ReservationSummaryCard";
import { motion } from "framer-motion";
import { Download, CheckCircle2, Star, Share2, ShieldCheck, Loader2, QrCode, Smartphone, Ticket } from "lucide-react";
import { supabase } from "@/lib/supabase";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function FinalizedContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const bookingId = searchParams.get('id');
    const [isVerified, setIsVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [booking, setBooking] = useState<any>(null);

    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownloadTicket = async () => {
        if (!bookingId) return;
        setIsDownloading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/ticket`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            });

            if (!response.ok) throw new Error('Failed to download ticket');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `Luxel_Ticket_${booking?.booking_reference || bookingId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading ticket:', error);
            alert('Failed to download ticket at this time. Please try again later.');
        } finally {
            setIsDownloading(false);
        }
    };

    useEffect(() => {
        const verifyBookingStatus = async () => {
            if (!bookingId) {
                router.push('/flights');
                return;
            }

            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    router.push('/');
                    return;
                }

                const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
                    headers: {
                        'Authorization': `Bearer ${session.access_token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.status === 'CONFIRMED') {
                        setIsVerified(true);
                        setBooking(data);
                    } else {
                        router.push(`/flights/status/agent-confirming?${searchParams.toString()}`);
                    }
                } else {
                    router.push('/flights');
                }
            } catch (err) {
                console.error('Status check error:', err);
                router.push('/flights');
            } finally {
                setIsLoading(false);
            }
        };

        verifyBookingStatus();
    }, [bookingId, router, searchParams]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-amber/5 flex flex-col items-center justify-center">
                <Loader2 size={40} className="text-amber animate-spin mb-4" />
                <p className="text-zinc-500 font-bold text-sm">Verifying your booking...</p>
            </div>
        );
    }

    if (!isVerified) return null;

    return (
        <div className="min-h-screen bg-amber/5 flex flex-col">
            <Navbar />

            <BookingStatusHeader currentStep={5} />

            <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-6 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-black rounded-[3rem] p-16 shadow-2xl shadow-black/20 border border-white/10 relative overflow-hidden text-center"
                        >
                            <div className="flex flex-col items-center max-w-2xl mx-auto relative z-10">
                                <motion.div
                                    initial={{ scale: 0, rotate: -45 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", damping: 12, stiffness: 200 }}
                                    className="w-24 h-24 rounded-full bg-black flex items-center justify-center text-flight-card mb-10 shadow-xl shadow-black/20 ring-12 ring-white/5"
                                >
                                    <Star size={40} fill="currentColor" />
                                </motion.div>

                                <h2 className="text-5xl font-bold text-flight-card mb-6 leading-tight">
                                    Your trip is ready.
                                </h2>

                                <div className="bg-white/5 rounded-3xl p-6 mb-10 inline-block border border-white/10 mx-auto transform transition-all hover:scale-105">
                                    <div className="flex items-center gap-6">
                                        <QrCode size={48} className="text-flight-card" />
                                        <div className="text-left">
                                            <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest block mb-1">Booking Reference (PNR)</span>
                                            <span className="text-3xl font-black text-white tracking-widest">{booking?.booking_reference || bookingId?.split('-')[0].toUpperCase() || 'LX-592849'}</span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-white/60 leading-relaxed font-light mb-12 text-base max-w-lg mx-auto">
                                    Your ticket has been issued and securely sent to your email. You may now download your priority access passes or add them to your mobile wallet.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center text-left">
                                    <button
                                        onClick={handleDownloadTicket}
                                        disabled={isDownloading}
                                        className="flex-1 max-w-[200px] bg-flight-card text-black px-6 py-4 rounded-xl flex items-center justify-center gap-4 font-bold text-sm shadow-xl shadow-black/20 hover:scale-[1.02] transition-all active:scale-95 group disabled:opacity-75 disabled:cursor-not-allowed disabled:hover:scale-100"
                                    >
                                        {isDownloading ? (
                                            <Loader2 size={24} className="animate-spin" />
                                        ) : (
                                            <Download size={24} className="group-hover:translate-y-1 transition-transform" />
                                        )}
                                        <div className="leading-tight">
                                            <span>{isDownloading ? 'Generating...' : 'Download'}</span>
                                            <span className="block text-[10px] font-bold text-black/60 uppercase tracking-wider mt-0.5">E-Ticket (PDF)</span>
                                        </div>
                                    </button>

                                    <button className="flex-1 max-w-[200px] bg-white/5 text-white border border-white/20 px-6 py-4 rounded-xl flex items-center justify-center gap-4 font-bold text-sm shadow-xl hover:bg-white/10 hover:scale-[1.02] transition-all active:scale-95 group">
                                        <Smartphone size={24} className="group-hover:-translate-y-1 transition-transform" />
                                        <div className="leading-tight">
                                            <span>Add to Wallet</span>
                                            <span className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mt-0.5">Apple / Google</span>
                                        </div>
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
