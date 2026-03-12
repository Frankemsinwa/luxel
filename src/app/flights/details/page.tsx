'use client'

import api from '@/lib/api';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
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
    PenTool,
    Loader2
} from "lucide-react";

function FlightDetailsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const flightId = searchParams.get('id');

    const [fullFlight, setFullFlight] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initial data from search params (used as fallback or for skeleton)
    const initialFlight = {
        price: Number(searchParams.get('price')) || 0,
        airline: searchParams.get('airline') || "",
        logo: searchParams.get('logo') || "",
        depTime: searchParams.get('depTime') || "---",
        depCode: searchParams.get('depCode') || "---",
        depCity: searchParams.get('depCity') || "---",
        arrTime: searchParams.get('arrTime') || "---",
        arrCode: searchParams.get('arrCode') || "---",
        arrCity: searchParams.get('arrCity') || "---",
        duration: searchParams.get('duration') || "---",
        stops: searchParams.get('stops') || "---"
    };

    useEffect(() => {
        const fetchDetails = async () => {
            if (!flightId) {
                setIsLoading(false);
                return;
            }
            try {
                const response = await api.get(`/flights/${flightId}`);
                setFullFlight(response.data);
            } catch (error) {
                console.error("Error fetching flight details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetails();
    }, [flightId]);

    const passengerCountStr = searchParams.get('passengers') || '1 Passenger';
    const passengerCount = parseInt(passengerCountStr.split(' ')[0]) || 1;
    const taxes = 45000;
    const baseFare = (fullFlight?.price || initialFlight.price) - taxes;
    const totalFare = (fullFlight?.price || initialFlight.price) * passengerCount;

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-amber/5 flex flex-col items-center justify-center">
                <Loader2 size={40} className="text-amber animate-spin mb-4" />
                <p className="text-body text-zinc-500">Synchronizing elite itineraries...</p>
            </div>
        );
    }

    // Determine current display data
    const displayFlight = fullFlight || initialFlight;
    const segments = fullFlight?.itineraries?.[0]?.segments || [];

    // Handle case where flight is not found in cache (e.g. server restart)
    if (!isLoading && !fullFlight && flightId) {
        return (
            <div className="min-h-screen bg-amber/5 flex flex-col">
                <Navbar />
                <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-24 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 rounded-full bg-amber/10 flex items-center justify-center text-amber mb-8">
                        <RefreshCcw size={40} />
                    </div>
                    <h2 className="text-heading-xl text-black mb-4">Itinerary Data Expired</h2>
                    <p className="text-body text-zinc-500 max-w-md mb-10">
                        For security and real-time accuracy, flight details are held in a temporary secure session. Your session has timed out or the server synchronized.
                    </p>
                    <button
                        onClick={() => router.push('/flights')}
                        className="bg-black text-white px-10 py-5 rounded-2xl text-body-sm font-medium shadow-xl hover:scale-105 transition-all flex items-center gap-3"
                    >
                        <ArrowRight size={18} className="rotate-180" />
                        Return to Search Results
                    </button>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-amber/5 flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-flight-card">
                        <LayoutGrid size={20} />
                    </div>
                    <h1 className="text-heading-md text-black">Flight Breakdown</h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Left Column - Flight Info */}
                    <div className="flex-1 space-y-8">

                        <div className="bg-black rounded-[3rem] p-10 shadow-sm border border-white/10 flex flex-col gap-12 relative overflow-hidden text-flight-card">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-amber/10 rounded-full blur-3xl -mr-32 -mt-32" />

                            {segments.length > 0 ? (
                                segments.map((segment: any, idx: number) => (
                                    <div key={idx} className="relative z-10">
                                        <div className="flex gap-8">
                                            <div className="flex flex-col items-center">
                                                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center p-2 overflow-hidden relative">
                                                    <img
                                                        src={`/flight-logos/${segment.carrierCode}.png`}
                                                        alt={segment.carrierCode}
                                                        className="w-full h-full object-contain relative z-10"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.style.display = 'none';
                                                            const fallback = target.nextElementSibling as HTMLElement;
                                                            if (fallback) fallback.style.display = 'flex';
                                                        }}
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-50 text-zinc-400">
                                                        <span className="text-[10px] font-black uppercase tracking-tighter">
                                                            {segment.carrierCode || 'Air'}
                                                        </span>
                                                    </div>
                                                </div>
                                                {idx < segments.length - 1 && (
                                                    <div className="w-[2px] flex-1 bg-white/10 my-4" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-[10px] font-semibold text-flight-card uppercase tracking-widest">
                                                        {idx === 0 ? "Departure" : "Connection"}
                                                    </span>
                                                    <span className="text-xs font-semibold text-flight-card/50 font-mono">
                                                        Terminal {segment.departure?.terminal || '1'} • {formatDate(segment.departure?.at)}
                                                    </span>
                                                </div>
                                                <h2 className="text-4xl font-semibold text-flight-card mb-2">
                                                    {segment.departure?.at?.split('T')[1]?.substring(0, 5) || '--:--'}
                                                </h2>
                                                <p className="text-lg font-semibold text-flight-card mb-6">
                                                    {segment.departure?.iataCode}
                                                </p>
                                                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-flight-card/50">
                                                    <span>{segment.carrierCode} {segment.number}</span>
                                                    <div className="w-1 h-1 rounded-full bg-white/20" />
                                                    <span>{segment.aircraft}</span>
                                                    <div className="w-1 h-1 rounded-full bg-white/20" />
                                                    <span>{segment.duration}</span>
                                                </div>

                                                {idx < segments.length - 1 && (
                                                    <div className="mt-12 mb-4 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-semibold text-flight-card">Layover at {segment.arrival?.iataCode}</span>
                                                            <div className="w-1 h-1 rounded-full bg-white" />
                                                            <span className="text-sm text-flight-card/60 font-semibold uppercase tracking-widest">Connect to next flight</span>
                                                        </div>
                                                        <span className="text-[10px] font-semibold text-flight-card/50 uppercase tracking-widest">Layover</span>
                                                    </div>
                                                )}

                                                {idx === segments.length - 1 && (
                                                    <div className="mt-12">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-[10px] font-semibold text-flight-card uppercase tracking-widest">Arrival</span>
                                                            <span className="text-xs font-semibold text-flight-card/50 font-mono">
                                                                Terminal {segment.arrival?.terminal || '1'} • {formatDate(segment.arrival?.at)}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h2 className="text-4xl font-semibold text-flight-card">
                                                                {segment.arrival?.at?.split('T')[1]?.substring(0, 5) || '--:--'}
                                                            </h2>
                                                            {(() => {
                                                                const startAt = segments[0]?.departure?.at;
                                                                const endAt = segment.arrival?.at;
                                                                if (!startAt || !endAt) return null;

                                                                const start = new Date(startAt.split('T')[0]);
                                                                const end = new Date(endAt.split('T')[0]);
                                                                const diff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                                                                return diff > 0 ? (
                                                                    <span className="px-3 py-1 bg-amber text-black text-[10px] font-semibold rounded-full uppercase">
                                                                        +{diff} Day{diff > 1 ? 's' : ''}
                                                                    </span>
                                                                ) : null;
                                                            })()}
                                                        </div>
                                                        <p className="text-lg font-semibold text-flight-card">{segment.arrival?.iataCode}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                // Fallback if segments missing (redundant now but safe)
                                <div className="text-flight-card/50 text-center py-10 font-semibold">
                                    Itinerary verification in progress...
                                </div>
                            )}
                        </div>

                        {/* Baggage & Fare Rules Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-flight-card p-10 rounded-[2.5rem] shadow-sm border border-black/5">
                                <div className="flex items-center gap-3 mb-8">
                                    <Briefcase className="text-black" size={24} />
                                    <h3 className="text-heading-sm text-black">Baggage Allowance</h3>
                                </div>
                                <div className="space-y-6">
                                    <div className="bg-black/5 rounded-2xl p-6 flex items-center gap-5">
                                        <div className="w-10 h-10 rounded-xl bg-black/10 flex items-center justify-center text-black/50">
                                            <Backpack size={18} />
                                        </div>
                                        <div>
                                            <div className="text-body font-medium text-black">1 Carry-on bag</div>
                                            <div className="text-caption font-medium text-black/50 uppercase tracking-widest mt-0.5">Included in cabin</div>
                                        </div>
                                    </div>
                                    <div className="bg-black/5 rounded-2xl p-6 flex items-center gap-5">
                                        <div className="w-10 h-10 rounded-xl bg-black/10 flex items-center justify-center text-black/50">
                                            <Briefcase size={18} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-black">
                                                {fullFlight?.baggage?.quantity || 2} Checked bags
                                            </div>
                                            <div className="text-xs text-black/50 uppercase tracking-widest mt-0.5 font-semibold">
                                                {fullFlight?.airline === 'BA' ? '32kg each' : '23kg each'} • Included
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-flight-card p-10 rounded-[2.5rem] shadow-sm border border-black/5">
                                <div className="flex items-center gap-3 mb-8">
                                    <PenTool className="text-black" size={24} />
                                    <h3 className="text-heading-sm text-black">Fare Rules</h3>
                                </div>
                                <div className="space-y-6">
                                    <div className="bg-emerald-900/10 border border-emerald-900/20 rounded-2xl p-6 flex items-center gap-5">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-900/20 flex items-center justify-center text-emerald-700">
                                            <RefreshCcw size={18} />
                                        </div>
                                        <div>
                                            <div className="text-body font-medium text-emerald-900">Change Policy</div>
                                            <div className="text-caption font-medium text-emerald-800 leading-relaxed mt-0.5 uppercase tracking-wider">Free changes up to 24h</div>
                                        </div>
                                    </div>
                                    <div className="bg-black/5 rounded-2xl p-6 flex items-center gap-5">
                                        <div className="w-10 h-10 rounded-xl bg-black/10 flex items-center justify-center text-black/50">
                                            <Undo2 size={18} />
                                        </div>
                                        <div>
                                            <div className="text-body font-medium text-black">Refundability</div>
                                            <div className="text-caption font-medium text-black/50 leading-relaxed mt-0.5 uppercase tracking-wider">Standard fee applies</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Pricing Summary */}
                    <div className="w-full lg:w-96 flex flex-col gap-8">
                        <div className="bg-flight-card p-10 rounded-[3rem] shadow-xl shadow-black/5 border border-black/5">
                            <h3 className="text-caption font-medium text-black/50 uppercase tracking-[0.2em] mb-10">Price Summary</h3>

                            <div className="space-y-6 mb-10 pb-10 border-b border-black/10">
                                <div className="flex items-center justify-between">
                                    <span className="text-black/60 font-semibold">Base Fare ({passengerCount} Traveler{passengerCount > 1 ? 's' : ''})</span>
                                    <span className="font-semibold text-black">₦{(baseFare * passengerCount).toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-black/60 font-semibold">Taxes & Fees</span>
                                    <span className="font-semibold text-black">₦{(taxes * passengerCount).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="flex flex-col items-center mb-10">
                                <div className="text-[10px] font-semibold text-black/50 uppercase tracking-widest mb-2">Total Price</div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-semibold text-black">₦{totalFare.toLocaleString()}</span>
                                    <span className="text-lg font-semibold text-black">NGN</span>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    const params = new URLSearchParams(searchParams.toString());
                                    params.set('price', (fullFlight?.price || initialFlight.price).toString());
                                    params.set('airline', fullFlight?.airline || initialFlight.airline);
                                    router.push(`/flights/booking?${params.toString()}`);
                                }}
                                className="w-full bg-black text-flight-card py-6 rounded-2xl font-semibold text-sm shadow-lg shadow-black/20 hover:bg-black/80 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group mb-8"
                            >
                                Continue to Booking
                                <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                                    <ArrowRight size={18} />
                                </motion.div>
                            </button>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-[10px] font-semibold text-black/50 uppercase">
                                    <CheckCircle2 size={14} className="text-emerald-600" />
                                    No immediate payment
                                </div>
                                <div className="flex items-center gap-3 text-[10px] font-semibold text-black/50 uppercase">
                                    <CheckCircle2 size={14} className="text-emerald-600" />
                                    Live price check complete
                                </div>
                            </div>
                        </div>

                        {/* Help Desk */}
                        <div className="bg-black text-flight-card p-8 rounded-[2.5rem] flex items-center gap-6 group hover:translate-y-[-4px] transition-all cursor-pointer">
                            <div className="w-14 h-14 rounded-2xl bg-amber/10 flex items-center justify-center group-hover:bg-amber group-hover:text-black transition-colors">
                                <Headphones size={24} />
                            </div>
                            <div>
                                <h4 className="font-semibold mb-1">Need Concierge help?</h4>
                                <p className="text-xs text-flight-card/60 font-light">Contact our 24/7 elite support</p>
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
