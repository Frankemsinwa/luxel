'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import {
    ChevronRight,
    Backpack,
    Briefcase,
    RefreshCcw,
    Undo2,
    Headphones,
    CheckCircle2,
    LayoutGrid,
    Plane,
    MapPin,
    ArrowRight,
    Clock,
    PenTool
} from "lucide-react";

function FlightDetailsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Capture search params with defaults
    const flight = {
        price: Number(searchParams.get('price')) || 540,
        airline: searchParams.get('airline') || "British Airways",
        logo: searchParams.get('logo') || "BA",
        depTime: searchParams.get('depTime') || "10:30 AM",
        depCode: searchParams.get('depCode') || "LHR",
        depCity: searchParams.get('depCity') || "London",
        arrTime: searchParams.get('arrTime') || "06:45 PM",
        arrCode: searchParams.get('arrCode') || "JFK",
        arrCity: searchParams.get('arrCity') || "New York",
        duration: searchParams.get('duration') || "8h 15m",
        stops: searchParams.get('stops') || "NON-STOP"
    };

    const passengerCountStr = searchParams.get('passengers') || '1 Passenger';
    const passengerCount = parseInt(passengerCountStr.split(' ')[0]) || 1;
    const baseFare = flight.price - 40; // Simulated tax logic
    const totalFare = flight.price * passengerCount;

    return (
        <div className="min-h-screen bg-amber/5 flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-amber">
                        <LayoutGrid size={20} />
                    </div>
                    <h1 className="text-2xl font-bold text-black">Flight Breakdown</h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Left Column - Flight Info */}
                    <div className="flex-1 space-y-8">

                        {/* Route Highlights */}
                        <div className="bg-amber rounded-[3rem] p-10 shadow-sm border border-amber/20 flex flex-col gap-12 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-black/5 rounded-full blur-3xl -mr-32 -mt-32" />

                            {/* Departure */}
                            <div className="relative z-10 flex gap-8">
                                <div className="flex flex-col items-center">
                                    <div className="w-14 h-14 rounded-2xl bg-black/10 flex items-center justify-center text-black font-bold text-sm">{flight.logo}</div>
                                    <div className="w-[2px] flex-1 bg-black/10 my-4" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-bold text-black uppercase tracking-widest">Departure</span>
                                        <span className="text-xs font-semibold text-black/50 font-mono">Terminal 5 • Sat, Oct 12</span>
                                    </div>
                                    <h2 className="text-4xl font-bold text-black mb-2">{flight.depTime}</h2>
                                    <p className="text-lg font-bold text-black mb-6">{flight.depCity} ({flight.depCode})</p>
                                    <div className="flex items-center gap-4 text-xs font-medium text-black/50">
                                        <span>{flight.airline}</span>
                                        <div className="w-1 h-1 rounded-full bg-black/20" />
                                        <span>BA005</span>
                                        <div className="w-1 h-1 rounded-full bg-black/20" />
                                        <span>Boeing 787-9</span>
                                    </div>
                                </div>
                            </div>

                            {/* Layover - Only show if not non-stop (simulated) */}
                            {flight.stops !== "NON-STOP" && (
                                <div className="relative z-10 flex gap-8">
                                    <div className="flex flex-col items-center">
                                        <div className="w-14 h-14 rounded-full border-2 border-black/10 flex items-center justify-center text-black/50">
                                            <Clock size={20} />
                                        </div>
                                        <div className="w-[2px] flex-1 bg-black/10 my-4" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="bg-black/5 border border-black/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-black">Layover Connection</span>
                                                <div className="w-1 h-1 rounded-full bg-black" />
                                                <span className="text-sm text-black/60">2h 15m wait</span>
                                            </div>
                                            <span className="text-[10px] font-bold text-black/50 uppercase tracking-widest">Connection</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Arrival */}
                            <div className="relative z-10 flex gap-8">
                                <div className="flex flex-col items-center">
                                    <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center text-amber font-bold text-sm">{flight.logo}</div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-bold text-black uppercase tracking-widest">Arrival</span>
                                        <span className="text-xs font-semibold text-black/50 font-mono">Terminal 3 • Sun, Oct 13</span>
                                    </div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className="text-4xl font-bold text-black">{flight.arrTime}</h2>
                                        <span className="px-3 py-1 bg-black text-amber text-[10px] font-bold rounded-full uppercase">+1 Day</span>
                                    </div>
                                    <p className="text-lg font-bold text-black mb-6">{flight.arrCity} ({flight.arrCode})</p>
                                    <div className="flex items-center gap-4 text-xs font-medium text-black/50">
                                        <span>{flight.airline}</span>
                                        <div className="w-1 h-1 rounded-full bg-black/20" />
                                        <span>QR812</span>
                                        <div className="w-1 h-1 rounded-full bg-black/20" />
                                        <span>Airbus A350-1000</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Baggage & Fare Rules Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Baggage Allowance */}
                            <div className="bg-amber p-10 rounded-[2.5rem] shadow-sm border border-amber/20">
                                <div className="flex items-center gap-3 mb-8">
                                    <Briefcase className="text-black" size={24} />
                                    <h3 className="text-xl font-bold text-black">Baggage Allowance</h3>
                                </div>
                                <div className="space-y-6">
                                    <div className="bg-black/5 rounded-2xl p-6 flex items-center gap-5">
                                        <div className="w-10 h-10 rounded-xl bg-black/10 flex items-center justify-center text-black/50">
                                            <Backpack size={18} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-black">1 Carry-on bag</div>
                                            <div className="text-xs text-black/50 uppercase tracking-widest mt-0.5">Up to 7kg • Included</div>
                                        </div>
                                    </div>
                                    <div className="bg-black/5 rounded-2xl p-6 flex items-center gap-5">
                                        <div className="w-10 h-10 rounded-xl bg-black/10 flex items-center justify-center text-black/50">
                                            <Briefcase size={18} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-black">2 Checked bags</div>
                                            <div className="text-xs text-black/50 uppercase tracking-widest mt-0.5">32kg each • Included</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Fare Rules */}
                            <div className="bg-amber p-10 rounded-[2.5rem] shadow-sm border border-amber/20">
                                <div className="flex items-center gap-3 mb-8">
                                    <PenTool className="text-black" size={24} />
                                    <h3 className="text-xl font-bold text-black">Fare Rules</h3>
                                </div>
                                <div className="space-y-6">
                                    <div className="bg-emerald-900/10 border border-emerald-900/20 rounded-2xl p-6 flex items-center gap-5">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-900/20 flex items-center justify-center text-emerald-700">
                                            <RefreshCcw size={18} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-emerald-900">Change Policy</div>
                                            <div className="text-[10px] text-emerald-800 font-medium leading-relaxed mt-0.5">Free changes up to 24h before departure.</div>
                                        </div>
                                    </div>
                                    <div className="bg-black/5 rounded-2xl p-6 flex items-center gap-5">
                                        <div className="w-10 h-10 rounded-xl bg-black/10 flex items-center justify-center text-black/50">
                                            <Undo2 size={18} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-black">Refundability</div>
                                            <div className="text-[10px] text-black/50 font-medium leading-relaxed mt-0.5">Refundable with a fee of ₦150 per person.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Pricing Summary */}
                    <div className="w-full lg:w-96 flex flex-col gap-8">
                        <div className="bg-amber p-10 rounded-[3rem] shadow-xl shadow-amber/20 border border-amber/20">
                            <h3 className="text-xs font-bold text-black/50 uppercase tracking-[0.2em] mb-10">Price Summary</h3>

                            <div className="space-y-6 mb-10 pb-10 border-b border-black/10">
                                <div className="flex items-center justify-between">
                                    <span className="text-black/60 font-medium">Base Fare ({passengerCount} Passenger{passengerCount > 1 ? 's' : ''})</span>
                                    <span className="font-bold text-black">₦{baseFare * passengerCount}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-black/60 font-medium">Taxes & Fees</span>
                                    <span className="font-bold text-black">₦{40 * passengerCount}</span>
                                </div>
                            </div>

                            <div className="flex flex-col items-center mb-10">
                                <div className="text-[10px] font-bold text-black/50 uppercase tracking-widest mb-2">Total Price</div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-bold text-black">₦{totalFare}</span>
                                    <span className="text-lg font-bold text-black">USD</span>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    const params = new URLSearchParams(searchParams.toString());
                                    // Ensure price and other context are explicitly included
                                    params.set('price', flight.price.toString());
                                    params.set('airline', flight.airline);
                                    router.push(`/flights/booking?${params.toString()}`);
                                }}
                                className="w-full bg-black text-amber py-6 rounded-2xl font-bold text-sm shadow-lg shadow-black/20 hover:bg-black/80 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group mb-8"
                            >
                                Continue to Booking
                                <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                                    <ArrowRight size={18} />
                                </motion.div>
                            </button>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-[10px] font-bold text-black/50 uppercase">
                                    <CheckCircle2 size={14} className="text-emerald-600" />
                                    No payment required yet
                                </div>
                                <div className="flex items-center gap-3 text-[10px] font-bold text-black/50 uppercase">
                                    <CheckCircle2 size={14} className="text-emerald-600" />
                                    Final price confirmed
                                </div>
                            </div>
                        </div>

                        {/* Help Desk */}
                        <div className="bg-black text-amber p-8 rounded-[2.5rem] flex items-center gap-6 group hover:translate-y-[-4px] transition-all cursor-pointer">
                            <div className="w-14 h-14 rounded-2xl bg-amber/10 flex items-center justify-center group-hover:bg-amber group-hover:text-black transition-colors">
                                <Headphones size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold mb-1">Need help booking?</h4>
                                <p className="text-xs text-amber/60 font-light">Call our concierge 24/7</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function FlightDetailsPage() {
    return (
        <Suspense fallback={<div>Loading details...</div>}>
            <FlightDetailsContent />
        </Suspense>
    );
}
