'use client'

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import {
    ShieldCheck,
    CreditCard,
    Calendar,
    Users,
    MapPin,
    Info,
    CheckCircle2,
    Headset,
    Lock
} from 'lucide-react';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TourBookingPage() {
    const params = useParams();
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        dietary: '',
        requests: '',
        cardName: '',
        cardNumber: '',
        expiry: '',
        cvv: ''
    });

    const tourSummary = {
        title: "Swiss Alpine Grand Retreat",
        dates: "Oct 14, 2024 — Oct 21, 2024 (7 Nights)",
        guests: "2 Adults",
        location: "Zermatt & St. Moritz, Switzerland",
        basePrice: 12400.00,
        taxes: 942.50,
        fee: 450.00,
        total: 13792.50
    };

    const handleCompleteBooking = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`/tour/${params.id}/confirmation`);
    };

    return (
        <div className="bg-[#F8F9FA] min-h-screen">
            <Navbar />
            <div className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                        {/* Form Side (Left) */}
                        <div className="lg:col-span-8 space-y-8">

                            <header className="flex items-center gap-4 mb-2">
                                <div className="w-10 h-10 rounded-full bg-amber/10 flex items-center justify-center text-amber">
                                    <span className="font-bold">1</span>
                                </div>
                                <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Traveler Details</h1>
                            </header>

                            {/* Primary Traveler */}
                            <div className="bg-white rounded-[2.5rem] p-10 border border-zinc-100 shadow-sm space-y-8">
                                <div className="flex items-center gap-2 text-zinc-900">
                                    <Users size={20} className="text-amber" />
                                    <h3 className="font-bold tracking-tight">Primary Traveler</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">First Name as per Passport</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Julian"
                                            className="w-full bg-zinc-50 border-none rounded-xl py-4 px-6 text-sm font-bold text-zinc-900 focus:ring-2 focus:ring-amber/10 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Last Name as per Passport</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Thorne"
                                            className="w-full bg-zinc-50 border-none rounded-xl py-4 px-6 text-sm font-bold text-zinc-900 focus:ring-2 focus:ring-amber/10 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="julian.thorne@luxury-travel.com"
                                        className="w-full bg-zinc-50 border-none rounded-xl py-4 px-6 text-sm font-bold text-zinc-900 focus:ring-2 focus:ring-amber/10 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Preferences */}
                            <div className="bg-white rounded-[2.5rem] p-10 border border-zinc-100 shadow-sm space-y-8">
                                <div className="flex items-center gap-2 text-zinc-900">
                                    <ShieldCheck size={20} className="text-amber" />
                                    <h3 className="font-bold tracking-tight">Preferences & Special Requests</h3>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Dietary Requirements</label>
                                    <textarea
                                        rows={3}
                                        className="w-full bg-zinc-50 border-none rounded-xl py-4 px-6 text-sm font-bold text-zinc-900 focus:ring-2 focus:ring-amber/10 transition-all resize-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Special Requests / Occasions</label>
                                    <textarea
                                        rows={3}
                                        className="w-full bg-zinc-50 border-none rounded-xl py-4 px-6 text-sm font-bold text-zinc-900 focus:ring-2 focus:ring-amber/10 transition-all resize-none"
                                    />
                                </div>
                            </div>

                            {/* Payment */}
                            <div className="bg-white rounded-[2.5rem] p-10 border border-zinc-100 shadow-sm space-y-8">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-zinc-900">
                                        <Lock size={20} className="text-amber" />
                                        <h3 className="font-bold tracking-tight">Secure Payment Method</h3>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="w-10 h-6 bg-zinc-100 rounded border border-zinc-200" />
                                        <div className="w-10 h-6 bg-zinc-100 rounded border border-zinc-200" />
                                    </div>
                                </div>

                                <div className="bg-emerald-50 text-emerald-700 px-6 py-4 rounded-2xl flex items-center gap-3 text-xs font-bold border border-emerald-100">
                                    <ShieldCheck size={18} />
                                    Your payment information is encrypted and processed securely.
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Cardholder Name</label>
                                        <input
                                            type="text"
                                            placeholder="Full name as on card"
                                            className="w-full bg-zinc-50 border-none rounded-xl py-4 px-6 text-sm font-bold text-zinc-900 focus:ring-2 focus:ring-amber/10 transition-all"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Card Number</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="0000 0000 0000 0000"
                                                className="w-full bg-zinc-50 border-none rounded-xl py-4 px-6 text-sm font-bold text-zinc-900 focus:ring-2 focus:ring-amber/10 transition-all"
                                            />
                                            <CreditCard className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-300" size={20} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Expiry Date</label>
                                            <input
                                                type="text"
                                                placeholder="MM / YY"
                                                className="w-full bg-zinc-50 border-none rounded-xl py-4 px-6 text-sm font-bold text-zinc-900 focus:ring-2 focus:ring-amber/10 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">CVV / CVC</label>
                                            <input
                                                type="password"
                                                placeholder="123"
                                                className="w-full bg-zinc-50 border-none rounded-xl py-4 px-6 text-sm font-bold text-zinc-900 focus:ring-2 focus:ring-amber/10 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Summary Side (Right) */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-xl overflow-hidden sticky top-28">
                                <div className="relative h-48">
                                    <Image src="/tour-img/img-1.jpg" alt="Tour Preview" fill className="object-cover" />
                                    <div className="absolute top-4 left-4 bg-amber text-black text-[10px] font-black px-3 py-1 rounded flex items-center">Premium Tour</div>
                                </div>
                                <div className="p-8 space-y-6">
                                    <div>
                                        <h3 className="text-xl font-black text-zinc-900 leading-tight mb-2">{tourSummary.title}</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-zinc-400">
                                                <Calendar size={14} className="text-amber" />
                                                <span className="text-xs font-bold leading-none">{tourSummary.dates}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-zinc-400">
                                                <Users size={14} className="text-amber" />
                                                <span className="text-xs font-bold leading-none">{tourSummary.guests}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-zinc-400">
                                                <MapPin size={14} className="text-amber" />
                                                <span className="text-xs font-bold leading-none">{tourSummary.location}</span>
                                            </div>
                                        </div>
                                    </div>

<div className="pt-6 border-t border-zinc-50 space-y-4">
                                        <div className="flex justify-between text-xs font-bold text-zinc-400">
                                            <span>Base Tour Price</span>
                                            <span className="text-zinc-900">₦{tourSummary.basePrice.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-bold text-zinc-400">
                                            <span>Taxes & Local Fees</span>
                                            <span className="text-zinc-900">₦{tourSummary.taxes.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-bold text-zinc-400">
                                            <div className="flex items-center gap-1.5">
                                                Luxel Service Fee <Info size={12} className="text-zinc-300" />
                                            </div>
                                            <span className="text-zinc-900">₦{tourSummary.fee.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-zinc-50 flex items-center justify-between">
                                        <span className="text-lg font-black text-zinc-900">Total Amount</span>
                                        <span className="text-3xl font-black text-amber">₦{tourSummary.total.toLocaleString()}</span>
                                    </div>

                                    <button
                                        onClick={handleCompleteBooking}
                                        className="w-full bg-amber hover:bg-amber-dark text-black py-5 rounded-2xl font-black text-xs tracking-widest uppercase flex items-center justify-center gap-3 shadow-xl shadow-amber/10 transition-all"
                                    >
                                        <CheckCircle2 size={18} />
                                        Complete Booking
                                    </button>

                                    <p className="text-[10px] text-center text-zinc-400 leading-relaxed">
                                        By clicking 'Complete Booking', you agree to our Terms of Service and Privacy Policy. Your booking will be confirmed immediately.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-amber/5 rounded-[2rem] p-8 border border-amber/10 flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-amber shadow-sm">
                                    <Headset size={28} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-zinc-900 mb-1">Personal Concierge Assigned</h4>
                                    <p className="text-xs text-zinc-500 font-medium leading-relaxed">A dedicated travel expert will contact you within 24 hours.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
