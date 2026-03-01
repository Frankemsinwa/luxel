'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import {
    Check,
    PlaneTakeoff,
    PlaneLanding,
    Users,
    Briefcase,
    MessageCircle,
    ShieldCheck,
    Lock,
    Headphones,
    MessageSquare
} from "lucide-react";

function ConfirmationContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const passengerCountStr = searchParams.get('passengers') || '1 Passenger';
    const passengerCount = parseInt(passengerCountStr.split(' ')[0]) || 1;
    const pricePerPerson = Number(searchParams.get('price')) || 540;
    const totalPrice = pricePerPerson * passengerCount;

    const route = {
        from: searchParams.get('depCity') || "London",
        fromCode: searchParams.get('depCode') || "LHR",
        to: searchParams.get('arrCity') || "New York",
        toCode: searchParams.get('arrCode') || "JFK",
        depTime: searchParams.get('depTime') || "10:30 AM",
        arrTime: searchParams.get('arrTime') || "06:45 PM",
        date: searchParams.get('date') || "Oct 12, 2026",
        cabin: searchParams.get('class') || "First Class"
    };

    // Generate a semi-random reference for demo
    const reference = `LX-${Math.floor(100000 + Math.random() * 900000)}`;

    return (
        <div className="min-h-screen bg-amber/5 flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-20 flex flex-col items-center">

                {/* Success Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="w-24 h-24 rounded-full bg-black/10 flex items-center justify-center text-black mb-10"
                >
                    <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center text-amber ring-8 ring-black/10">
                        <Check size={32} strokeWidth={3} />
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl md:text-5xl font-bold text-black text-center mb-6 leading-tight max-w-2xl font-newton italic"
                >
                    Your reservation request has been received.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-black/60 text-center mb-16 max-w-lg font-light text-lg"
                >
                    A dedicated Luxel travel agent will contact you shortly to finalize your luxury itinerary for <span className="text-black font-bold">{route.to}</span>.
                </motion.p>

                {/* Detail Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="w-full bg-amber rounded-[3rem] shadow-xl shadow-amber/20 border border-amber/20 overflow-hidden mb-10"
                >
                    <div className="p-10 border-b border-black/10 flex flex-wrap items-center justify-between gap-6">
                        <div>
                            <span className="text-[10px] font-bold text-black/50 uppercase tracking-widest block mb-1">Reservation Reference</span>
                            <span className="text-2xl font-bold text-black tracking-tight">{reference}</span>
                        </div>
                        <div className="px-6 py-2 rounded-full bg-black/10 text-black text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                            Pending Specialist Review
                        </div>
                    </div>

                    <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-10">
                            <div className="flex gap-6">
                                <div className="w-10 h-10 rounded-xl bg-black/10 flex items-center justify-center text-black/50">
                                    <PlaneTakeoff size={20} />
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-black/50 uppercase tracking-widest block mb-1">Full Itinerary</span>
                                    <div className="font-bold text-black">{route.from} ({route.fromCode}) → {route.to} ({route.toCode})</div>
                                    <div className="text-xs text-black/50 mt-1">{route.date} • {route.depTime}</div>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="w-10 h-10 rounded-xl bg-black/10 flex items-center justify-center text-black/50">
                                    <Users size={20} />
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-black/50 uppercase tracking-widest block mb-1">Travel Group</span>
                                    <div className="font-bold text-black">{passengerCount} {passengerCount > 1 ? 'Guests' : 'Guest'} • {route.cabin}</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center gap-10 border-l border-black/10 pl-12 bg-black/5 rounded-r-[3rem]">
                            <div>
                                <span className="text-[10px] font-bold text-black/50 uppercase tracking-widest block mb-1">Service Level</span>
                                <div className="font-bold text-black text-lg uppercase tracking-widest">Ultra-Luxury</div>
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-black/50 uppercase tracking-widest block mb-1">Status</span>
                                <div className="font-bold text-emerald-600 text-lg uppercase tracking-widest">Priority Queue</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-black p-10 flex items-center justify-between">
                        <div>
                            <span className="text-sm font-medium text-amber/60">Estimated Total</span>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-black text-amber tracking-tight">₦{totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                            <div className="text-[10px] font-bold text-amber/50 uppercase tracking-widest mt-1">Pending Concierge Lock</div>
                        </div>
                    </div>
                </motion.div>

                {/* WhatsApp Widget */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="w-full bg-amber border border-amber/20 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center gap-8 mb-12"
                >
                    <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center text-amber shadow-lg shadow-black/20 ring-8 ring-black/10">
                        <MessageSquare size={28} />
                    </div>
                    <div>
                        <h4 className="text-black font-bold text-lg mb-1">Priority Concierge Active</h4>
                        <p className="text-black/60 text-sm font-medium leading-relaxed">
                            Our team is reviewing the flight availability. Watch for a WhatsApp notification from a Luxel verified business account.
                        </p>
                    </div>
                </motion.div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push(`/flights/status/agent-confirming?${searchParams.toString()}`)}
                    className="bg-black text-amber px-16 py-6 rounded-[2rem] font-bold text-sm shadow-xl shadow-black/20 hover:bg-black/80 transition-all"
                >
                    Track Reservation
                </motion.button>

                {/* Trust Badges */}
                <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 w-full pt-12 border-t border-black/10">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-black/10 flex items-center justify-center text-black">
                            <ShieldCheck size={24} />
                        </div>
                        <p className="text-[10px] font-bold text-black/50 uppercase tracking-widest">Secure & Encrypted Payments</p>
                    </div>
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-black/10 flex items-center justify-center text-black">
                            <Check size={24} />
                        </div>
                        <p className="text-[10px] font-bold text-black/50 uppercase tracking-widest">No Hidden Fees Guaranteed</p>
                    </div>
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-black/10 flex items-center justify-center text-black">
                            <Headphones size={24} />
                        </div>
                        <p className="text-[10px] font-bold text-black/50 uppercase tracking-widest">24/7 Dedicated Support</p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function ConfirmationPage() {
    return (
        <Suspense fallback={<div>Loading Confirmation...</div>}>
            <ConfirmationContent />
        </Suspense>
    );
}
