'use client'

import api from '@/lib/api';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
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
import { Suspense, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function ConfirmationContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const bookingId = searchParams.get('bookingId');
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooking = async () => {
            if (!bookingId) {
                setLoading(false);
                return;
            }

            try {
                const response = await api.get(`/tours/bookings/${bookingId}`);
                setBooking(response.data);
            } catch (err: any) {
                console.error('Error fetching booking details:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [bookingId]);

    if (loading) return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-amber border-t-transparent rounded-full animate-spin" />
            <p className="text-caption font-medium text-zinc-400 uppercase tracking-widest">Retrieving Secure Itinerary...</p>
        </div>
    );

    if (!booking) return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6">
            <h2 className="text-heading-md font-medium text-zinc-900 tracking-tight">Booking Not Found</h2>
            <p className="text-zinc-500 font-medium max-w-xs text-center">We couldn't locate your itinerary. If you just completed payment, it may take a moment to synchronize.</p>
            <Link href="/dashboard" className="px-8 py-3 bg-amber text-black text-body-sm font-medium uppercase tracking-widest rounded-xl">Go to Dashboard</Link>
        </div>
    );

    const tour = booking.tour;
    const bookingRef = booking.id.split('-')[0].toUpperCase();
    const guestsText = `${booking.guest_count} Traveler${booking.guest_count > 1 ? 's' : ''}`;
    const formattedDate = new Date(booking.created_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    // Reconstruct summary
    const baseTourPrice = tour.price * booking.guest_count;
    const taxes = baseTourPrice * 0.075;
    const serviceFee = 85000;
    const totalPaid = booking.total_price;

    const summaryItems = [
        { label: `Base Fare (${guestsText})`, value: `₦${baseTourPrice.toLocaleString()}` },
        { label: "Concierge & Service fee", value: `₦${serviceFee.toLocaleString()}` },
        { label: "Taxes & Luxel Insurance", value: `₦${taxes.toLocaleString()}` }
    ];

    const guide = tour.guides?.[0] || { name: 'Alessandro V.', role: 'Senior Expedition Leader' };

    return (
        <div className="bg-[#F8F9FA] min-h-screen">
            <Navbar />
            <main className="min-h-screen bg-[#F8F9FA] pt-32 pb-20 px-6">
                <style jsx global>{`
                    @media print {
                        .no-print, 
                        nav, 
                        footer, 
                        button {
                            display: none !important;
                        }
                        main {
                            padding-top: 0 !important;
                        }
                        .print-only {
                            display: block !important;
                        }
                    }
                `}</style>
                <div className="max-w-7xl mx-auto space-y-16">

                    {/* Success Header */}
                    <div className="text-center space-y-4">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto shadow-xl shadow-emerald-500/20 mb-8"
                        >
                            <CheckCircle2 size={40} />
                        </motion.div>
                        <h1 className="text-heading-xl font-medium text-zinc-900 tracking-tight">Your journey begins soon</h1>
                        <p className="text-body-lg font-medium text-zinc-500">A confirmation email has been sent to your inbox.</p>
                        <div className="inline-block bg-zinc-100 px-6 py-2.5 rounded-full border border-zinc-200 mt-6">
                            <span className="text-caption font-medium text-zinc-400 uppercase tracking-widest mr-2">Booking ID:</span>
                            <span className="text-caption font-medium text-amber uppercase tracking-widest">{bookingRef}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                        {/* Left Side: Info */}
                        <div className="lg:col-span-8 space-y-12">

                            {/* Main Card */}
                            <div className="bg-white rounded-[3rem] border border-zinc-100 shadow-sm overflow-hidden group">
                                <div className="relative h-96">
                                    <Image src={tour.hero_image || '/tour-img/fallback.jpg'} alt={tour.title} fill className="object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    <div className="absolute bottom-10 left-10 right-10">
                                        <div className="bg-amber text-black text-caption font-medium uppercase tracking-widest px-3 py-1 rounded-md inline-block mb-4">
                                            {booking.status}
                                        </div>
                                        <h2 className="text-heading-xl font-medium text-white mb-6 uppercase tracking-tight">{tour.title}</h2>
                                        <div className="flex flex-wrap gap-6 text-white/80">
                                            <div className="flex items-center gap-2 text-body-sm font-medium">
                                                <Calendar size={16} className="text-amber" />
                                                {formattedDate} ({tour.duration})
                                            </div>
                                            <div className="flex items-center gap-2 text-body-sm font-medium">
                                                <Users size={16} className="text-amber" />
                                                {guestsText}
                                            </div>
                                            <div className="flex items-center gap-2 text-body-sm font-medium">
                                                <MapPin size={16} className="text-amber" />
                                                {tour.location}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Preparation Guide */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-1 h-8 bg-amber rounded-full" />
                                    <h3 className="text-heading-md font-medium text-zinc-900 tracking-tight">Preparation Guide</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* What to Pack */}
                                    <div className="bg-white rounded-[2.5rem] p-8 border border-zinc-100 shadow-sm space-y-6">
                                        <div className="w-10 h-10 rounded-2xl bg-zinc-50 flex items-center justify-center text-amber">
                                            <Briefcase size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-heading-sm font-medium text-zinc-900 mb-2">What to Pack</h4>
                                            <p className="text-body-sm font-medium text-zinc-500 leading-relaxed">
                                                {tour.packing_list?.length > 0
                                                    ? `Don't forget: ${tour.packing_list.slice(0, 3).join(', ')}...`
                                                    : 'Essential items and weather-appropriate attire for your trip.'
                                                }
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {tour.packing_list?.slice(0, 5).map((item: string, i: number) => (
                                                <span key={i} className="text-caption font-medium text-zinc-400 bg-zinc-50 px-2 py-1 rounded-md uppercase tracking-tight">✓ {item}</span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Meeting Point */}
                                    <div className="bg-white rounded-[2.5rem] p-8 border border-zinc-100 shadow-sm space-y-6">
                                        <div className="w-10 h-10 rounded-2xl bg-zinc-50 flex items-center justify-center text-amber">
                                            <Navigation size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-heading-sm font-medium text-zinc-900 mb-2">Meeting Point</h4>
                                            <p className="text-body-sm font-medium text-zinc-500 leading-relaxed">
                                                {tour.meeting_point || 'Detailed directions and map to the local harbor pier.'}
                                            </p>
                                        </div>
                                        <div className="h-24 rounded-2xl bg-zinc-100 overflow-hidden relative">
                                            <div className="absolute inset-0 bg-zinc-200" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <MapPin className="text-amber" size={24} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Your Guide */}
                                    <div className="bg-white rounded-[2.5rem] p-8 border border-zinc-100 shadow-sm space-y-6">
                                        <div className="w-10 h-10 rounded-2xl bg-zinc-50 flex items-center justify-center text-amber">
                                            <Users size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-heading-sm font-medium text-zinc-900 mb-2">Your Guide</h4>
                                            <p className="text-body-sm font-medium text-zinc-500 leading-relaxed">Meet your local expert for this journey.</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-caption font-medium text-white italic overflow-hidden">
                                                {guide.image ? <Image src={guide.image} alt={guide.name} width={40} height={40} className="object-cover" /> : guide.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <span className="text-body-sm font-medium text-zinc-900">{guide.name}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Summary & Actions */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="bg-white rounded-[3rem] border border-zinc-100 shadow-xl p-10 space-y-8">
                                <h3 className="text-heading-md font-medium text-zinc-900 tracking-tight">Booking Summary</h3>

                                <div className="space-y-6">
                                    {summaryItems.map((item, i) => (
                                        <div key={i} className="flex justify-between items-center">
                                            <span className="text-body-sm font-medium text-zinc-400">{item.label}</span>
                                            <span className="text-body font-medium text-zinc-900">{item.value}</span>
                                        </div>
                                    ))}

                                    <div className="pt-6 border-t border-zinc-50 flex items-center justify-between">
                                        <span className="text-heading-sm font-medium text-zinc-900">Total Paid</span>
                                        <span className="text-heading-lg font-medium text-amber">₦{totalPaid.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100 space-y-4">
                                    <div className="text-caption font-medium text-zinc-400 uppercase tracking-widest flex items-center justify-between">
                                        Secure Payment Engine
                                        <ShieldCheck size={14} className="text-emerald-500" />
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Paystack_Logo.png/1200px-Paystack_Logo.png" alt="Paystack" className="h-4 object-contain opacity-50" />
                                        <span className="text-caption font-medium text-zinc-400 uppercase tracking-widest">Verified Reference</span>
                                    </div>
                                    <div className="text-caption font-medium text-zinc-900 truncate">
                                        {booking.preferences?.payment_reference || 'REF-CONFIRMED'}
                                    </div>
                                </div>

                                <div className="space-y-4 no-print">
                                    <button
                                        onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL || 'https://luxel-8o9h.vercel.app/api'}/tours/bookings/${bookingId}/download`, '_blank')}
                                        className="w-full bg-amber hover:bg-amber-dark text-black py-5 rounded-2xl text-body-sm font-medium tracking-widest uppercase flex items-center justify-center gap-3 transition-all shadow-xl shadow-amber/10"
                                    >
                                        <Download size={18} />
                                        Download Experience Pass
                                    </button>
                                </div>
                            </div>

                            <div className="bg-amber/5 rounded-[2.5rem] p-8 border border-amber/10 text-center">
                                <p className="text-body-sm font-medium text-zinc-500 leading-relaxed">
                                    Need help? Contact our 24/7 priority concierge at <span className="text-zinc-900 font-medium">support@luxel.com</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default function TourConfirmationPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-amber border-t-transparent rounded-full animate-spin" />
                <p className="text-caption font-medium text-zinc-400 uppercase tracking-widest">Synchronizing Journey...</p>
            </div>
        }>
            <ConfirmationContent />
        </Suspense>
    );
}
