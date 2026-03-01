'use client'

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingStatusHeader from "@/components/BookingStatusHeader";
import { motion } from "framer-motion";
import {
    Building2,
    Copy,
    Globe,
    UploadCloud,
    Check,
    AlertCircle,
    ArrowRight,
    TrendingUp
} from "lucide-react";
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function PaymentContent() {
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
        depTime: searchParams.get('depTime') || "Oct 24, 2026",
        airline: searchParams.get('airline') || "British Airways"
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="min-h-screen bg-amber/5 flex flex-col">
            <Navbar />

            <BookingStatusHeader currentStep={3} />

            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-6 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Left Side: Summary & Reward */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-amber rounded-[3rem] p-10 shadow-sm border border-amber/20">
                            <div className="flex items-center gap-3 mb-10">
                                <div className="px-3 py-1 rounded-full bg-emerald-900/20 text-emerald-700 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                    Availability Confirmed
                                </div>
                                <span className="text-[10px] font-bold text-black/50">Ref: #LX-99281</span>
                            </div>

                            <div className="flex items-baseline justify-between mb-8">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Departure</span>
                                    <span className="text-xl font-bold text-zinc-900">{route.from} ({route.fromCode})</span>
                                </div>
                                <div className="flex-1 mx-4 h-px border-t-2 border-dashed border-zinc-100" />
                                <div className="flex flex-col text-right">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Arrival</span>
                                    <span className="text-xl font-bold text-zinc-900">{route.to} ({route.toCode})</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8 mb-12">
                                <div>
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Date</span>
                                    <span className="text-sm font-bold text-zinc-900">{route.depTime}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Cabin Class</span>
                                    <span className="text-sm font-bold text-amber">First Class (Suite)</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Passengers</span>
                                    <span className="text-sm font-bold text-zinc-900">{passengerCount} {passengerCount > 1 ? 'Passengers' : 'Passenger'}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Airline</span>
                                    <span className="text-sm font-bold text-zinc-900">{route.airline}</span>
                                </div>
                            </div>

                            <div className="pt-10 border-t border-zinc-100 flex items-center justify-between">
                                <span className="text-sm font-medium text-zinc-500">Total Due</span>
                                <div className="text-right">
                                    <span className="text-3xl font-black text-zinc-900">₦{totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                            <p className="text-[9px] text-zinc-400 font-medium mt-4 flex items-center gap-2">
                                <AlertCircle size={10} className="text-amber" />
                                Final price includes all taxes, lounge access, and premium handling.
                            </p>
                        </div>

                        {/* Reward Card */}
                        <div className="bg-amber/5 border border-amber/10 rounded-[2.5rem] p-8 flex items-start gap-6 relative overflow-hidden group hover:scale-[1.02] transition-transform">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <TrendingUp size={80} />
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-amber flex items-center justify-center text-white shrink-0">
                                <span className="font-black text-xl">L</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-zinc-900 mb-2">Luxel Platinum Reward</h4>
                                <p className="text-xs text-zinc-500 leading-relaxed font-light">
                                    This booking earns you <span className="font-bold text-amber">{(totalPrice * 10).toLocaleString()} Luxel Points</span> toward your next private charter.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Payment Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Bank Transfer Details */}
                        <div className="bg-white rounded-[3rem] shadow-sm border border-zinc-100 overflow-hidden">
                            <div className="bg-zinc-50/50 px-10 py-6 border-b border-zinc-100 flex items-center gap-4">
                                <Building2 size={20} className="text-amber" />
                                <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Bank Transfer Details</h2>
                            </div>
                            <div className="p-10">
                                <p className="text-sm text-zinc-500 font-light mb-10 max-w-2xl">
                                    Please transfer the total amount to the account details provided below. Use your Reference Code as the transfer narration.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                                    <div className="space-y-8">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Bank Name</span>
                                            <span className="text-lg font-bold text-zinc-900">Zenith Bank PLC</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Account Name</span>
                                            <span className="text-lg font-bold text-zinc-900">Luxel Travel & Concierge Ltd</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Account Number</span>
                                            <div className="flex items-center gap-4">
                                                <span className="text-3xl font-black text-zinc-900 tracking-tighter">1018823774</span>
                                                <button onClick={() => copyToClipboard('1018823774')} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-50 text-[10px] font-bold text-zinc-400 hover:bg-amber hover:text-white transition-all uppercase">
                                                    <Copy size={12} /> Copy
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">SWIFT / BIC</span>
                                            <span className="text-lg font-bold text-zinc-900 tracking-wider">ZENINILAX</span>
                                        </div>
                                        <div className="bg-amber/5 rounded-3xl p-8 border border-amber/10 flex items-center justify-between group">
                                            <div>
                                                <span className="text-[8px] font-black text-amber uppercase tracking-[0.2em] block mb-2">Payment Reference</span>
                                                <span className="text-xl font-black text-zinc-900">LUX-8829-STR</span>
                                            </div>
                                            <button onClick={() => copyToClipboard('LUX-8829-STR')} className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-zinc-300 group-hover:text-amber transition-colors shadow-sm">
                                                <Copy size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Process & Upload */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-zinc-100">
                                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-10">Payment Process</h3>
                                <div className="space-y-10 relative overflow-hidden">
                                    <div className="absolute top-0 left-[1.125rem] w-[1px] h-full bg-zinc-50" />
                                    {[
                                        { step: 1, title: "Complete Transfer", desc: "Send exact amount via your bank app or branch." },
                                        { step: 2, title: "Capture Receipt", desc: "Take a screenshot or scan your proof of payment." },
                                        { step: 3, title: "Upload & Confirm", desc: "Attach the file below and click 'Completed'." }
                                    ].map((p, i) => (
                                        <div key={i} className="flex gap-6 relative z-10">
                                            <div className="w-9 h-9 rounded-full bg-amber flex items-center justify-center text-white text-xs font-black ring-8 ring-amber/5 shrink-0 shadow-lg shadow-amber/10">
                                                {p.step}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-zinc-900 text-sm mb-1">{p.title}</h4>
                                                <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">{p.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-zinc-100">
                                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-10">Upload Proof of Payment</h3>
                                <div className="border-2 border-dashed border-zinc-100 rounded-[2rem] p-10 flex flex-col items-center text-center group hover:border-amber transition-colors bg-zinc-50/30 cursor-pointer">
                                    <div className="w-16 h-16 rounded-full bg-amber/10 flex items-center justify-center text-amber mb-6 group-hover:scale-110 transition-transform">
                                        <UploadCloud size={28} />
                                    </div>
                                    <p className="text-sm font-bold text-zinc-900 mb-2">Drop files here</p>
                                    <p className="text-[10px] text-zinc-400 font-medium mb-8">PDF, JPG or PNG (Max 5MB)</p>
                                    <button className="px-8 py-3 bg-white rounded-xl text-[10px] font-bold text-zinc-900 border border-zinc-200 hover:border-amber transition-colors">
                                        CHOOSE FILE
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center">
                            <button
                                onClick={() => router.push(`/flights/status/verifying?${searchParams.toString()}`)}
                                className="w-full max-w-md bg-amber text-white py-6 rounded-3xl font-bold flex items-center justify-center gap-4 shadow-2xl shadow-amber/20 hover:scale-[1.02] transition-all active:scale-95"
                            >
                                <Check size={20} strokeWidth={3} />
                                I HAVE COMPLETED PAYMENT
                            </button>
                            <p className="text-[10px] text-zinc-400 font-bold mt-6 tracking-widest flex items-center gap-2">
                                Booking will be held for <span className="text-amber">01:59:42</span> while awaiting confirmation.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={<div>Loading Payment Details...</div>}>
            <PaymentContent />
        </Suspense>
    );
}
