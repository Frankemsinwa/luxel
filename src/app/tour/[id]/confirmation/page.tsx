'use client'

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
    CheckCircle2,
    Download,
    LayoutDashboard,
    MapPin,
    Calendar,
    Users,
    Briefcase,
    Navigation,
    ExternalLink,
    ShieldCheck,
    CreditCard
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TourConfirmationPage() {
    const params = useParams();

    const bookingDetails = {
        id: "LUX-882910",
        title: "Mediterranean Sunset Yacht Tour",
        image: "/tour-img/img-1.jpg",
        dates: "September 14 - September 21, 2024",
        guests: "2 Travelers",
        location: "Amalfi Coast, Italy",
        summary: [
            { label: "Base Fare (2 travelers)", value: "$4,200.00" },
            { label: "Concierge Service", value: "$250.00" },
            { label: "Insurance & Taxes", value: "$345.50" }
        ],
        total: "$4,795.50"
    };

    return (
        <div className="bg-[#F8F9FA] min-h-screen">
            <Navbar />
            <div className="py-24 px-6">
                <div className="max-w-6xl mx-auto space-y-16">

                    {/* Success Header */}
                    <div className="text-center space-y-4">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto shadow-xl shadow-emerald-500/20 mb-8"
                        >
                            <CheckCircle2 size={40} />
                        </motion.div>
                        <h1 className="text-5xl md:text-6xl font-black text-zinc-900 tracking-tight">Your journey begins soon</h1>
                        <p className="text-zinc-500 font-medium text-lg">A confirmation email has been sent to your inbox.</p>
                        <div className="inline-block bg-zinc-100 px-6 py-2.5 rounded-full border border-zinc-200 mt-6">
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mr-2">Booking ID:</span>
                            <span className="text-[10px] font-black text-amber uppercase tracking-widest">{bookingDetails.id}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                        {/* Left Side: Info */}
                        <div className="lg:col-span-8 space-y-12">

                            {/* Main Card */}
                            <div className="bg-white rounded-[3rem] border border-zinc-100 shadow-sm overflow-hidden group">
                                <div className="relative h-96">
                                    <Image src={bookingDetails.image} alt={bookingDetails.title} fill className="object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    <div className="absolute bottom-10 left-10 right-10">
                                        <div className="bg-amber text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md inline-block mb-4">Confirmed</div>
                                        <h2 className="text-4xl font-black text-white mb-6 uppercase tracking-tight">{bookingDetails.title}</h2>
                                        <div className="flex flex-wrap gap-6 text-white/80">
                                            <div className="flex items-center gap-2 text-xs font-bold">
                                                <Calendar size={16} className="text-amber" />
                                                {bookingDetails.dates}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-bold">
                                                <Users size={16} className="text-amber" />
                                                {bookingDetails.guests}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-bold">
                                                <MapPin size={16} className="text-amber" />
                                                {bookingDetails.location}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Preparation Guide */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-1 h-8 bg-amber rounded-full" />
                                    <h3 className="text-2xl font-black text-zinc-900 tracking-tight">Preparation Guide</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* What to Pack */}
                                    <div className="bg-white rounded-[2.5rem] p-8 border border-zinc-100 shadow-sm space-y-6">
                                        <div className="w-10 h-10 rounded-2xl bg-zinc-50 flex items-center justify-center text-amber">
                                            <Briefcase size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-zinc-900 mb-2">What to Pack</h4>
                                            <p className="text-xs text-zinc-500 font-medium leading-relaxed">Essential items and weather-appropriate attire for your trip.</p>
                                        </div>
                                        <button className="text-[10px] font-black text-amber uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform">
                                            View Checklist <ExternalLink size={12} />
                                        </button>
                                    </div>

                                    {/* Meeting Point */}
                                    <div className="bg-white rounded-[2.5rem] p-8 border border-zinc-100 shadow-sm space-y-6">
                                        <div className="w-10 h-10 rounded-2xl bg-zinc-50 flex items-center justify-center text-amber">
                                            <Navigation size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-zinc-900 mb-2">Meeting Point</h4>
                                            <p className="text-xs text-zinc-500 font-medium leading-relaxed">Detailed directions and map to the Amalfi Harbor pier.</p>
                                        </div>
                                        <div className="h-24 rounded-2xl bg-zinc-100 overflow-hidden relative">
                                            {/* Map placeholder */}
                                            <div className="absolute inset-0 bg-zinc-200" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <MapPin className="text-amber" size={24} />
                                            </div>
                                        </div>
                                        <button className="text-[10px] font-black text-amber uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform">
                                            Get Directions <ExternalLink size={12} />
                                        </button>
                                    </div>

                                    {/* Your Guide */}
                                    <div className="bg-white rounded-[2.5rem] p-8 border border-zinc-100 shadow-sm space-y-6">
                                        <div className="w-10 h-10 rounded-2xl bg-zinc-50 flex items-center justify-center text-amber">
                                            <Users size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-zinc-900 mb-2">Your Guide</h4>
                                            <p className="text-xs text-zinc-500 font-medium leading-relaxed">Meet Alessandro, your local expert for this journey.</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-[10px] font-black text-white">AV</div>
                                            <span className="text-xs font-black text-zinc-900">Alessandro V.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Summary & Actions */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="bg-white rounded-[3rem] border border-zinc-100 shadow-xl p-10 space-y-8">
                                <h3 className="text-2xl font-black text-zinc-900 tracking-tight">Booking Summary</h3>

                                <div className="space-y-6">
                                    {bookingDetails.summary.map((item, i) => (
                                        <div key={i} className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-zinc-400">{item.label}</span>
                                            <span className="text-sm font-black text-zinc-900">{item.value}</span>
                                        </div>
                                    ))}

                                    <div className="pt-6 border-t border-zinc-50 flex items-center justify-between">
                                        <span className="text-lg font-black text-zinc-900">Total Paid</span>
                                        <span className="text-3xl font-black text-amber">{bookingDetails.total}</span>
                                    </div>
                                </div>

                                <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100 space-y-4">
                                    <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center justify-between">
                                        Payment Method
                                        <ShieldCheck size={14} className="text-emerald-500" />
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-8 bg-zinc-900 rounded-md flex items-center justify-center text-[8px] font-black text-white italic">VISA</div>
                                        <span className="text-sm font-bold text-zinc-900">•••• 4429</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Link href="/dashboard" className="w-full bg-amber hover:bg-amber-dark text-black py-5 rounded-2xl font-black text-xs tracking-widest uppercase flex items-center justify-center gap-3 transition-all shadow-xl shadow-amber/10">
                                        <LayoutDashboard size={18} />
                                        Go to Dashboard
                                    </Link>
                                    <button className="w-full bg-white border border-zinc-100 hover:bg-zinc-50 text-zinc-900 py-5 rounded-2xl font-black text-xs tracking-widest uppercase flex items-center justify-center gap-3 transition-all">
                                        <Download size={18} />
                                        Download Itinerary
                                    </button>
                                </div>
                            </div>

                            <div className="bg-amber/5 rounded-[2.5rem] p-8 border border-amber/10 text-center">
                                <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                                    Need help? Contact our 24/7 priority concierge at <span className="text-zinc-900 font-black">support@luxel.com</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
