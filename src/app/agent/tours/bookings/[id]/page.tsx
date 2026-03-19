'use client'

import api from '@/lib/api';
import { motion } from "framer-motion";
import {
    ChevronLeft,
    Calendar,
    User,
    Clock,
    CheckCircle2,
    XCircle,
    Copy,
    ArrowUpRight,
    Phone,
    Mail,
    Users,
    MapPin,
    CreditCard,
    Briefcase,
    Palmtree,
    Info
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function TourBookingDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const response = await api.get(`/tours/agent/bookings/${id}`);
                setBooking(response.data);
            } catch (error: any) {
                console.error('Error fetching booking details:', error);
                if (error.response?.status === 401) {
                    router.push('/');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [id, router]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            maximumFractionDigits: 0
        }).format(price);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    if (loading) return <div className="p-20 text-center font-black animate-pulse">Analyzing Experience Data...</div>;
    if (!booking) return <div className="p-20 text-center">Booking not found.</div>;

    const contact = booking.contact_info || {};
    const tour = booking.tour || {};
    const preferences = booking.preferences || {};

    return (
        <div className="max-w-6xl mx-auto space-y-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => router.back()}
                        className="w-12 h-12 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-all shadow-sm"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-black text-zinc-900 tracking-tight">{tour.title}</h1>
                            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${booking.status === 'PENDING' ? 'bg-amber/10 text-amber animate-pulse' :
                                booking.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-600' :
                                    booking.status === 'CANCELLED' ? 'bg-red-50 text-red-600' :
                                        'bg-zinc-100 text-zinc-500'
                                }`}>
                                {booking.status}
                            </div>
                        </div>
                        <p className="text-zinc-500 font-medium text-sm">Booking Reference: {booking.id.substring(0, 8).toUpperCase()}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Experience Summary Card */}
                    <div className="bg-white rounded-[3rem] p-10 border border-zinc-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50" />

                        <div className="relative z-10 flex items-center justify-between mb-10 pb-10 border-b border-zinc-50">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-3xl bg-zinc-100 relative overflow-hidden shadow-inner flex-shrink-0">
                                    {tour.hero_image ? (
                                        <Image src={tour.hero_image} alt={tour.title} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-300">
                                            <Palmtree size={32} />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-1">Experience</h3>
                                    <p className="text-2xl font-black text-zinc-900 tracking-tight">{tour.title}</p>
                                    <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold mt-1">
                                        <MapPin size={12} className="text-amber" />
                                        {tour.location}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Revenue Generated</p>
                                <p className="text-2xl font-black text-zinc-900">{formatPrice(booking.total_price)}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-8 relative z-10">
                            <div>
                                <h4 className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-2">Booked On</h4>
                                <div className="flex items-center gap-2 text-zinc-900 font-bold text-sm">
                                    <Calendar size={16} className="text-zinc-400" />
                                    {new Date(booking.created_at).toLocaleDateString()}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-2">Guest Count</h4>
                                <div className="flex items-center gap-2 text-zinc-900 font-bold text-sm">
                                    <Users size={16} className="text-zinc-400" />
                                    {booking.guest_count} Person(s)
                                </div>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-2">Payment Mode</h4>
                                <div className="flex items-center gap-2 text-zinc-900 font-bold text-sm">
                                    <CreditCard size={16} className="text-emerald-500" />
                                    Verified Checkout
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Guest Contact Information */}
                    <div className="bg-white rounded-[3rem] p-10 border border-zinc-100 shadow-sm">
                        <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-8">Primary Guest Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Full Name</p>
                                <p className="text-sm font-bold text-zinc-900">{contact.fullName || '-'}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Email Address</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-bold text-zinc-900">{contact.email || '-'}</p>
                                    <button onClick={() => copyToClipboard(contact.email)} className="text-zinc-300 hover:text-amber transition-colors">
                                        <Copy size={12} />
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Phone Number</p>
                                <p className="text-sm font-bold text-zinc-900">{contact.phone || '-'}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Member Status</p>
                                <p className="text-sm font-bold text-zinc-900">{booking.user ? 'Elite Member' : 'Guest Traveler'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Special Preferences & Payment */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="bg-white rounded-[3rem] p-10 border border-zinc-100 shadow-sm">
                            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                                <Info size={12} />
                                Preferences
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-2">Dietary Requirements</p>
                                    <p className="text-sm font-medium text-zinc-700 bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                                        {preferences.dietary || 'No specific dietary requirements mentioned.'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-2">Special Requests</p>
                                    <p className="text-sm font-medium text-zinc-700 bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                                        {preferences.specialRequests || 'No special requests provided.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-zinc-900 rounded-[3rem] p-10 text-white relative overflow-hidden">
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber/10 rounded-full -mr-16 -mb-16 blur-2xl" />
                            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-8">Payment Info</h3>
                            <div className="space-y-6 relative z-10">
                                <div>
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Transaction Ref</p>
                                    <p className="text-sm font-bold text-amber break-all">{preferences.payment_reference || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Base Amount</p>
                                    <p className="text-xl font-black text-white">{formatPrice(booking.total_price)}</p>
                                </div>
                                <div className="pt-6 border-t border-white/10 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                                        <CheckCircle2 size={20} />
                                    </div>
                                    <p className="text-xs font-bold text-emerald-500">Payment Successfully Verified</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Experience Context */}
                <div className="space-y-10">
                    <div className="bg-white rounded-[3rem] p-10 border border-zinc-100 shadow-sm">
                        <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-8">Tour Overview</h3>
                        <div className="space-y-6">
                            <div className="aspect-video relative rounded-2xl overflow-hidden bg-zinc-100">
                                {tour.hero_image ? (
                                    <Image src={tour.hero_image} alt={tour.title} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-300">
                                        <Palmtree size={48} />
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-1">Duration</p>
                                <p className="text-sm font-bold text-zinc-900">{tour.duration}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-1">Base Rate</p>
                                <p className="text-sm font-bold text-zinc-900">{formatPrice(tour.price)} / guest</p>
                            </div>
                            <div className="pt-6 border-t border-zinc-50">
                                <button
                                    onClick={() => window.open(`/tour/${tour.slug}`, '_blank')}
                                    className="w-full py-4 rounded-2xl bg-zinc-50 text-zinc-900 font-bold text-xs uppercase tracking-widest hover:bg-zinc-100 transition-all flex items-center justify-center gap-2"
                                >
                                    View Experience Page
                                    <ArrowUpRight size={14} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats for Agent */}
                    <div className="bg-amber/5 rounded-[3rem] p-10 border border-amber/10">
                        <h3 className="text-[10px] font-black text-amber uppercase tracking-[0.3em] mb-8">Inventory Update</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-zinc-500">Remaining Slots</span>
                                <span className="text-sm font-black text-zinc-900">{tour.available_slots}</span>
                            </div>
                            <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                                <div
                                    className="bg-amber h-full"
                                    style={{ width: `${Math.min(100, (booking.guest_count / (tour.available_slots + booking.guest_count)) * 100)}%` }}
                                />
                            </div>
                            <p className="text-[10px] text-zinc-400 font-medium">This booking occupied {booking.guest_count} slots of the total capacity.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
