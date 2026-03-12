'use client'

import api from '@/lib/api';
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
    Lock,
    Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TourBookingPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tour, setTour] = useState<any>(null);

    const guestsCount = Number(searchParams.get('guests')) || 2;
    const travelDate = searchParams.get('date') || 'Select a date';

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        dietary: '',
        requests: ''
    });

    const [userEmail, setUserEmail] = useState<string>('');

    useEffect(() => {
        const fetchTour = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user?.email) {
                    setUserEmail(session.user.email);
                    // Pre-fill email if possible
                    setFormData(prev => ({ ...prev, email: session.user.email || '' }));
                }

                const response = await api.get(`/tours/${params.id}`);
                setTour(response.data);
            } catch (err) {
                console.error('Error fetching tour:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTour();

        // Load Paystack Script
        const script = document.createElement('script');
        script.src = 'https://js.paystack.co/v1/inline.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, [params.id]);

    const handleCompleteBooking = async (reference: string) => {
        setIsSubmitting(true);
        try {
            const response = await api.post(`/tours/${tour.id}/book`, {
                guestCount: guestsCount,
                contactInfo: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email
                },
                preferences: {
                    dietary: formData.dietary,
                    requests: formData.requests
                },
                paymentReference: reference
            });

            if (response.status === 200 || response.status === 201) {
                const booking = response.data;
                router.push(`/tour/${params.id}/confirmation?bookingId=${booking.id}`);
            } else {
                alert(`Booking confirmation failed: ${response.data.message}`);
            }
        } catch (error: any) {
            console.error('Booking confirmation error:', error);
            alert(error.response?.data?.message || 'An unexpected error occurred during confirmation.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePaystackPayment = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.firstName || !formData.lastName || !formData.email) {
            alert('Please provide your full name and email address.');
            return;
        }

        setIsSubmitting(true);

        try {
            // @ts-ignore
            const handler = window.PaystackPop.setup({
                key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_a65759ce432d67a14f5e0896001221147558666c', // Luxel Test Key
                email: formData.email,
                amount: Math.round(total * 100), // kobo
                currency: 'NGN',
                ref: `TR_${Math.floor((Math.random() * 1000000000) + 1)}`,
                callback: function (response: any) {
                    handleCompleteBooking(response.reference);
                },
                onClose: function () {
                    setIsSubmitting(false);
                }
            });
            handler.openIframe();
        } catch (error) {
            console.error('Paystack initialization error:', error);
            alert('Failed to initialize secure payment engine.');
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="min-h-screen bg-white flex items-center justify-center text-body font-medium text-zinc-300">Preparing your luxury reservation desk...</div>;
    if (!tour) return <div className="min-h-screen bg-white flex items-center justify-center text-body font-medium text-zinc-300">Experience unavailable.</div>;

    const basePrice = tour.price * guestsCount;
    const taxes = basePrice * 0.075; // 7.5% Tax
    const fee = 85000;
    const total = basePrice + taxes + fee;

    return (
        <div className="bg-[#F8F9FA] min-h-screen">
            <Navbar />
            <div className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <form onSubmit={handlePaystackPayment} className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                        {/* Form Side (Left) */}
                        <div className="lg:col-span-8 space-y-8">

                            <header className="flex items-center gap-4 mb-2">
                                <div className="w-10 h-10 rounded-full bg-amber/10 flex items-center justify-center text-amber">
                                    <span className="text-body-sm font-medium">1</span>
                                </div>
                                <h1 className="text-heading-lg font-medium text-zinc-900 tracking-tight">Traveler Details</h1>
                            </header>

                            {/* Primary Traveler */}
                            <div className="bg-white rounded-[2.5rem] p-10 border border-zinc-100 shadow-sm space-y-8">
                                <div className="flex items-center gap-2 text-zinc-900">
                                    <Users size={20} className="text-amber" />
                                    <h3 className="text-heading-sm font-medium tracking-tight">Primary Traveler</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-caption font-medium text-zinc-400 uppercase tracking-widest">First Name as per Passport</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Julian"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            className="w-full bg-zinc-50 border-none rounded-xl py-4 px-6 text-body font-medium text-zinc-900 focus:ring-2 focus:ring-amber/10 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-caption font-medium text-zinc-400 uppercase tracking-widest">Last Name as per Passport</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Thorne"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            className="w-full bg-zinc-50 border-none rounded-xl py-4 px-6 text-body font-medium text-zinc-900 focus:ring-2 focus:ring-amber/10 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-caption font-medium text-zinc-400 uppercase tracking-widest">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="julian.thorne@luxury-travel.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-zinc-50 border-none rounded-xl py-4 px-6 text-body font-medium text-zinc-900 focus:ring-2 focus:ring-amber/10 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Preferences */}
                            <div className="bg-white rounded-[2.5rem] p-10 border border-zinc-100 shadow-sm space-y-8">
                                <div className="flex items-center gap-2 text-zinc-900">
                                    <ShieldCheck size={20} className="text-amber" />
                                    <h3 className="text-heading-sm font-medium tracking-tight">Preferences & Special Requests</h3>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-caption font-medium text-zinc-400 uppercase tracking-widest">Dietary Requirements</label>
                                    <textarea
                                        rows={3}
                                        value={formData.dietary}
                                        onChange={(e) => setFormData({ ...formData, dietary: e.target.value })}
                                        className="w-full bg-zinc-50 border-none rounded-xl py-4 px-6 text-body font-medium text-zinc-900 focus:ring-2 focus:ring-amber/10 transition-all resize-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-caption font-medium text-zinc-400 uppercase tracking-widest">Special Requests / Occasions</label>
                                    <textarea
                                        rows={3}
                                        value={formData.requests}
                                        onChange={(e) => setFormData({ ...formData, requests: e.target.value })}
                                        className="w-full bg-zinc-50 border-none rounded-xl py-4 px-6 text-body font-medium text-zinc-900 focus:ring-2 focus:ring-amber/10 transition-all resize-none"
                                    />
                                </div>
                            </div>

                            {/* Payment Engine Info */}
                            <div className="bg-white rounded-[2.5rem] p-10 border border-zinc-100 shadow-sm space-y-8">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-zinc-900">
                                        <Lock size={20} className="text-amber" />
                                        <h3 className="text-heading-sm font-medium tracking-tight">Verified Payment Engine</h3>
                                    </div>
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Paystack_Logo.png/1200px-Paystack_Logo.png" alt="Paystack" className="h-4 object-contain" />
                                </div>

                                <div className="bg-emerald-50 text-emerald-700 px-6 py-5 rounded-2xl flex items-start gap-4 text-body-sm font-medium border border-emerald-100">
                                    <ShieldCheck size={20} className="shrink-0" />
                                    <p className="leading-relaxed">
                                        You will be securely redirected to the Paystack checkout to finalize your premium reservation. No card details are stored on Luxel servers.
                                    </p>
                                </div>

                                <div className="p-8 border-2 border-dashed border-zinc-100 rounded-3xl flex flex-col items-center justify-center text-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-300">
                                        <CreditCard size={24} />
                                    </div>
                                    <div>
                                        <p className="text-body font-medium text-zinc-900">One-Click Secure Checkout</p>
                                        <p className="text-caption font-medium text-zinc-400 uppercase tracking-widest mt-1">Multi-Bank & International Card Support</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Summary Side (Right) */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-xl overflow-hidden sticky top-28">
                                <div className="relative h-48">
                                    <Image src={tour.hero_image || '/tour-img/fallback.jpg'} alt="Tour Preview" fill className="object-cover" />
                                    <div className="absolute top-4 left-4 bg-amber text-black text-caption font-medium px-3 py-1 rounded flex items-center uppercase tracking-widest">Premium Tour</div>
                                </div>
                                <div className="p-8 space-y-6">
                                    <div>
                                        <h3 className="text-heading-sm font-medium text-zinc-900 leading-tight mb-2">{tour.title}</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-zinc-400">
                                                <Calendar size={14} className="text-amber" />
                                                <span className="text-body-sm font-medium leading-none">{travelDate} ({tour.duration})</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-zinc-400">
                                                <Users size={14} className="text-amber" />
                                                <span className="text-body-sm font-medium leading-none">{guestsCount} Guests</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-zinc-400">
                                                <MapPin size={14} className="text-amber" />
                                                <span className="text-body-sm font-medium leading-none">{tour.location}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-zinc-50 space-y-4">
                                        <div className="flex justify-between text-body-sm font-medium text-zinc-400">
                                            <span>Base Tour Price</span>
                                            <span className="text-zinc-900">₦{basePrice.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-body-sm font-medium text-zinc-400">
                                            <span>Taxes & Local Fees (7.5%)</span>
                                            <span className="text-zinc-900">₦{taxes.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-body-sm font-medium text-zinc-400">
                                            <div className="flex items-center gap-1.5">
                                                Luxel Service Fee <Info size={12} className="text-zinc-300" />
                                            </div>
                                            <span className="text-zinc-900">₦{fee.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-zinc-50 flex items-center justify-between">
                                        <span className="text-heading-sm font-medium text-zinc-900">Total Amount</span>
                                        <span className="text-heading-lg font-medium text-amber">₦{total.toLocaleString()}</span>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-amber hover:bg-amber-dark text-black py-5 rounded-2xl text-body-sm font-medium tracking-widest uppercase flex items-center justify-center gap-3 shadow-xl shadow-amber/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                                        {isSubmitting ? 'Initializing Secure Engine...' : 'Pay Securely with Paystack'}
                                    </button>

                                    <p className="text-caption font-medium text-center text-zinc-400 leading-relaxed">
                                        By clicking 'Complete Booking', you agree to our Terms of Service and Privacy Policy. Your booking will be confirmed immediately.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-amber/5 rounded-[2rem] p-8 border border-amber/10 flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-amber shadow-sm">
                                    <Headset size={28} />
                                </div>
                                <div>
                                    <h4 className="text-body font-medium text-zinc-900 mb-1">Personal Concierge Assigned</h4>
                                    <p className="text-body-sm font-medium text-zinc-500 leading-relaxed">A dedicated travel expert will contact you within 24 hours.</p>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}
