'use client'

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingStatusHeader from "@/components/BookingStatusHeader";
import ReservationSummaryCard from "@/components/ReservationSummaryCard";
import { motion } from "framer-motion";
import { Wallet, MessageSquare, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function AgentConfirmedContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const passengerCountStr = searchParams.get('passengers') || '1 Passenger';
    const passengerCount = parseInt(passengerCountStr.split(' ')[0]) || 1;
    const pricePerPerson = Number(searchParams.get('price')) || 540;
    const totalPrice = pricePerPerson * passengerCount;

    return (
        <div className="min-h-screen bg-amber/5 flex flex-col">
            <Navbar />

            {/* Step Indicator Section */}
            <div className="bg-amber border-b border-amber/20">
                <BookingStatusHeader currentStep={3} />
            </div>

            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
                <div className="flex flex-col lg:flex-row gap-16">

                    {/* Left Side: Status & Timeline (Primary Focus) */}
                    <div className="flex-1 space-y-12">

                        {/* Status Section */}
                        <div className="space-y-8">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest mb-4">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                        Availability Confirmed
                                    </div>
                                    <h1 className="text-4xl font-black text-zinc-900 tracking-tight mb-2">Price & Routing Verified</h1>
                                    <p className="text-zinc-500 font-medium">Your private rate has been locked. Please complete payment to issue your tickets.</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Total Confirmed Price</div>
                                    <div className="text-5xl font-black text-zinc-900">₦{totalPrice.toFixed(2)}</div>
                                </div>
                            </div>

                            {/* Payment Progress Helper */}
                            <div className="bg-white border border-zinc-100 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-amber/5 flex items-center justify-center text-amber relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-amber/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                        <Wallet size={24} className="relative z-10" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-zinc-900">Payment Instructions</h3>
                                        <p className="text-xs text-zinc-400 font-medium">Secure private jet rates for next 2 hours</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <button
                                        onClick={() => router.push(`/flights/status/payment?${searchParams.toString()}`)}
                                        className="flex-1 md:flex-none bg-amber text-white px-10 py-5 rounded-2xl font-bold text-sm shadow-xl shadow-amber/20 hover:bg-amber-dark transition-all active:scale-95 whitespace-nowrap"
                                    >
                                        Proceed to Payment
                                    </button>
                                    <button className="w-14 h-14 rounded-2xl border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-amber hover:border-amber/20 transition-all">
                                        <MessageSquare size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Activity Log */}
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] pl-1">Live Updates</h3>
                            <div className="space-y-4">
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className="bg-emerald-50/30 p-6 rounded-2xl border border-emerald-100/50 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-50">
                                            <CheckCircle2 size={16} />
                                        </div>
                                        <p className="text-sm font-bold text-zinc-900">Price confirmed at ₦{totalPrice.toFixed(2)}</p>
                                    </div>
                                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-100/50 px-3 py-1 rounded-md">NOW</span>
                                </motion.div>
                                <div className="bg-white p-6 rounded-2xl border border-zinc-100 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 border border-zinc-100">
                                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                                        </div>
                                        <p className="text-sm font-medium text-zinc-500">Routing verification complete (LHR-JFK)</p>
                                    </div>
                                    <span className="text-[10px] font-medium text-zinc-400">3 min ago</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Sticky Details */}
                    <div className="w-full lg:w-[450px] space-y-8">
                        <div className="sticky top-32">
                            <div className="flex items-center gap-3 mb-6 pl-4">
                                <div className="w-2 h-2 rounded-full bg-zinc-900 shadow-[0_0_8px_rgba(0,0,0,0.5)]" />
                                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-900">Final Itinerary</h2>
                            </div>
                            <Suspense fallback={<div>Loading Summary...</div>}>
                                <ReservationSummaryCard />
                            </Suspense>

                            {/* Trust Banner */}
                            <div className="mt-8 p-8 rounded-[2rem] border border-zinc-100 bg-zinc-50/50 flex items-center gap-6">
                                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-emerald-500 shadow-sm">
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Protected Request</h4>
                                    <p className="text-xs font-bold text-zinc-700">Secured by Luxel Shield™</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function AgentConfirmedPage() {
    return (
        <Suspense fallback={<div>Loading Details...</div>}>
            <AgentConfirmedContent />
        </Suspense>
    );
}
