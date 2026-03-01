'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import {
    User,
    Mail,
    Phone,
    Check,
    Lock,
    ChevronDown,
    Calendar,
    Contact,
    Shield,
    Globe
} from "lucide-react";

const countries = [
    "United Kingdom", "United States", "Nigeria", "United Arab Emirates",
    "Singapore", "Canada", "Germany", "France", "Japan", "Australia"
];

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function PassengerDetailsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get context from URL
    const passengerCountStr = searchParams.get('passengers') || '1 Passenger';
    const passengerCount = parseInt(passengerCountStr.split(' ')[0]) || 1;
    const totalPrice = Number(searchParams.get('price')) || 540;
    const baseFare = totalPrice - 40;

    const [passengerData, setPassengerData] = useState<any[]>([]);

    useEffect(() => {
        setPassengerData(
            Array.from({ length: passengerCount }, (_, i) => ({
                id: i + 1,
                title: 'Mr.',
                firstName: '',
                lastName: '',
                gender: 'Male',
                nationality: 'United Kingdom'
            }))
        );
    }, [passengerCount]);

    const updatePassenger = (id: number, field: string, value: string) => {
        setPassengerData(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    return (
        <div className="min-h-screen bg-amber/5 flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
                <div className="flex flex-col lg:flex-row gap-10">

                    {/* Left Column - Forms */}
                    <div className="flex-1 space-y-12">
                        {passengerData.map((p, index) => (
                            <motion.div
                                key={p.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-amber rounded-[3rem] p-10 shadow-sm border border-amber/20"
                            >
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-12 h-12 rounded-2xl bg-black/10 flex items-center justify-center text-black">
                                        <User size={24} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-black">Passenger {p.id}</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-black/50 uppercase tracking-widest pl-1">Title</label>
                                        <div className="relative">
                                            <select
                                                value={p.title}
                                                onChange={(e) => updatePassenger(p.id, 'title', e.target.value)}
                                                className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm font-bold text-black focus:ring-2 focus:ring-black/20 appearance-none cursor-pointer"
                                            >
                                                <option>Mr.</option>
                                                <option>Mrs.</option>
                                                <option>Ms.</option>
                                                <option>Dr.</option>
                                            </select>
                                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/50 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-black/50 uppercase tracking-widest pl-1">First name</label>
                                        <input
                                            type="text"
                                            placeholder="As shown on passport"
                                            className="bg-black/5 border-none rounded-2xl p-4 text-sm font-bold text-black placeholder:text-black/30 focus:ring-2 focus:ring-black/20"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-black/50 uppercase tracking-widest pl-1">Last name</label>
                                        <input
                                            type="text"
                                            placeholder="As shown on passport"
                                            className="bg-black/5 border-none rounded-2xl p-4 text-sm font-bold text-black placeholder:text-black/30 focus:ring-2 focus:ring-black/20"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2 lg:col-span-2">
                                        <label className="text-xs font-bold text-black/50 uppercase tracking-widest pl-1">Date of birth</label>
                                        <div className="grid grid-cols-3 gap-4">
                                            <input type="number" placeholder="DD" className="bg-black/5 border-none rounded-2xl p-4 text-sm font-bold text-black text-center focus:ring-2 focus:ring-black/20" />
                                            <div className="relative">
                                                <select className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm font-bold text-black appearance-none cursor-pointer focus:ring-2 focus:ring-black/20">
                                                    <option value="">Month</option>
                                                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                                                </select>
                                                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/50" />
                                            </div>
                                            <input type="number" placeholder="YYYY" className="bg-black/5 border-none rounded-2xl p-4 text-sm font-bold text-black text-center focus:ring-2 focus:ring-black/20" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-black/50 uppercase tracking-widest pl-1">Gender</label>
                                        <div className="flex items-center gap-8 h-full">
                                            {['Male', 'Female'].map(g => (
                                                <label key={g} className="flex items-center gap-3 cursor-pointer group" onClick={() => updatePassenger(p.id, 'gender', g)}>
                                                    <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center p-1 ${p.gender === g ? 'border-black bg-black' : 'border-black/30'}`}>
                                                        {p.gender === g && <div className="w-full h-full bg-amber rounded-full" />}
                                                    </div>
                                                    <span className={`text-sm font-bold transition-colors ${p.gender === g ? 'text-black' : 'text-black/50'}`}>{g}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-black/50 uppercase tracking-widest pl-1">Nationality</label>
                                        <div className="relative">
                                            <select className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm font-bold text-black appearance-none cursor-pointer focus:ring-2 focus:ring-black/20">
                                                {countries.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                            <Globe size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 lg:col-span-2">
                                        <label className="text-xs font-bold text-black/50 uppercase tracking-widest pl-1">Passport Number</label>
                                        <input
                                            type="text"
                                            placeholder="Letter & digits"
                                            className="bg-black/5 border-none rounded-2xl p-4 text-sm font-bold text-black placeholder:text-black/30 focus:ring-2 focus:ring-black/20"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {/* Contact Information Card */}
                        <div className="bg-amber rounded-[3rem] p-10 shadow-sm border border-amber/20">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 rounded-2xl bg-black/10 flex items-center justify-center text-black">
                                    <Contact size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-black">Contact Information</h2>
                                    <p className="text-xs text-black/50 font-medium tracking-tight">Booking confirmation will be sent here</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-black/50 uppercase tracking-widest pl-1">Email address</label>
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        className="bg-black/5 border-none rounded-2xl p-4 text-sm font-bold text-black focus:ring-2 focus:ring-black/20"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-black/50 uppercase tracking-widest pl-1">Phone number</label>
                                    <div className="flex gap-2">
                                        <select className="bg-black/5 border-none rounded-2xl p-4 text-sm font-bold text-black w-28 appearance-none cursor-pointer">
                                            <option>+44 (UK)</option>
                                            <option>+1 (USA)</option>
                                            <option>+234 (NG)</option>
                                            <option>+971 (UAE)</option>
                                        </select>
                                        <input
                                            type="tel"
                                            placeholder="Mobile number"
                                            className="flex-1 bg-black/5 border-none rounded-2xl p-4 text-sm font-bold text-black focus:ring-2 focus:ring-black/20"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Steps & Summary */}
                    <div className="w-full lg:w-96 flex flex-col gap-8">

                        {/* Booking Steps */}
                        <div className="bg-amber p-10 rounded-[3rem] shadow-sm border border-amber/20">
                            <h3 className="text-xs font-bold text-black/50 uppercase tracking-widest mb-10">Booking Steps</h3>
                            <div className="space-y-12 relative overflow-hidden">
                                <div className="absolute top-0 left-[1.125rem] w-[1px] h-full bg-black/10" />

                                <div className="flex items-start gap-5 relative z-10">
                                    <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white ring-8 ring-emerald-600/10">
                                        <Check size={18} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-black">Flight Details</h4>
                                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-0.5">Verified</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-5 relative z-10">
                                    <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-amber ring-8 ring-black/10">
                                        <span className="text-sm font-black">2</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-black">Passenger Info</h4>
                                        <p className="text-[10px] font-bold text-black animate-pulse uppercase tracking-widest mt-0.5">In Progress</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-5 relative z-10 opacity-40">
                                    <div className="w-9 h-9 rounded-full bg-black/10 flex items-center justify-center text-black/50">
                                        <span className="text-sm font-black">3</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-black">Payment</h4>
                                        <p className="text-[10px] font-bold text-black/50 uppercase tracking-widest mt-0.5">Pending</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="bg-amber p-10 rounded-[3rem] shadow-xl shadow-amber/20 border border-amber/20">
                            <h3 className="text-xs font-bold text-black/50 uppercase tracking-widest mb-8">Price Summary</h3>
                            <div className="space-y-5 mb-8 pb-8 border-b border-black/10">
                                <div className="flex justify-between">
                                    <span className="text-black/60 font-medium">Base Fare ({passengerCount} Passengers)</span>
                                    <span className="font-bold text-black">₦{baseFare * passengerCount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-black/60 font-medium">Taxes & Fees</span>
                                    <span className="font-bold text-black">₦{40 * passengerCount}</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-2 mb-8">
                                <span className="text-[10px] font-bold text-black/50 uppercase tracking-widest">Total Amount</span>
                                <span className="text-5xl font-bold text-black">₦{totalPrice * passengerCount}</span>
                            </div>

                            <button
                                onClick={() => router.push(`/flights/confirmation?${searchParams.toString()}`)}
                                className="w-full bg-black text-amber py-6 rounded-2xl font-bold text-sm shadow-lg shadow-black/20 hover:bg-black/80 transition-all active:scale-95 mb-4 font-outfit"
                            >
                                Request Reservation
                            </button>
                            <p className="text-[10px] text-black/50 font-bold text-center uppercase tracking-tighter">Instant confirmation upon approval</p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function PassengerDetailsPage() {
    return (
        <Suspense fallback={<div>Loading Booking...</div>}>
            <PassengerDetailsContent />
        </Suspense>
    );
}
