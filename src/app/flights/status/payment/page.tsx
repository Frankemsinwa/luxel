'use client'

import api from '@/lib/api';
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
    TrendingUp,
    ShieldCheck
} from "lucide-react";
import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from "@/lib/supabase";

function PaymentContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const bookingId = searchParams.get('id');

    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isInitializing, setIsInitializing] = useState(false);
    const [userEmail, setUserEmail] = useState<string>('client@luxel.com');

    const passengerCountStr = searchParams.get('passengers') || '1 Passenger';
    const passengerCount = parseInt(passengerCountStr.split(' ')[0]) || 1;

    const route = {
        from: searchParams.get('depCity') || "London",
        fromCode: searchParams.get('depCode') || "LHR",
        to: searchParams.get('arrCity') || "New York",
        toCode: searchParams.get('arrCode') || "JFK",
        depTime: searchParams.get('depTime') || "Oct 24, 2026",
        airline: searchParams.get('airline') || "British Airways"
    };

    // 1. Fetch the REAL confirmed price from the booking
    useEffect(() => {
        const fetchBooking = async () => {
            if (!bookingId) {
                setLoading(false);
                return;
            }

            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user?.email) {
                    setUserEmail(session.user.email);
                }

                const response = await api.get(`/bookings/${bookingId}/status`);
                const data = response.data;
                setBooking(data);

                if (data.email || data.contact_email || data.user?.email) {
                    setUserEmail(data.email || data.contact_email || data.user?.email);
                }
            } catch (err: any) {
                console.error('Error fetching booking details:', err);
                if (err.response?.status === 401) {
                    router.push('/');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [bookingId, router]);

    // 2. Load Paystack Script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://js.paystack.co/v1/inline.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script); // Cleanup
        };
    }, []);

    // Price to pay: Prefer confirmed_price, fallback to total_price, then search Param.
    const priceToPay = booking?.confirmed_price || booking?.total_price || Number(searchParams.get('price')) || 945000;

    const handlePaystackPayment = async () => {
        setIsInitializing(true);
        try {
            // @ts-ignore
            const handler = window.PaystackPop.setup({
                key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '', // Use proper key
                email: userEmail, // Use the dynamically retrieved email
                amount: priceToPay * 100, // Paystack amount is in kobo
                currency: 'NGN',
                ref: `LUX_${Math.floor((Math.random() * 1000000000) + 1)}`, // Generate a reference
                callback: function (response: any) {
                    // On payment success, we redirect to verifying which confirms payment
                    setIsInitializing(false);
                    router.push(`/flights/status/verifying?${searchParams.toString()}&reference=${response.reference}`);
                },
                onClose: function () {
                    setIsInitializing(false);
                    console.log('Payment window closed');
                }
            });
            handler.openIframe();
        } catch (error) {
            console.error('Failed to initialize Paystack:', error);
            setIsInitializing(false);
        }
    };

    return (
        <div className="min-h-screen bg-amber/5 flex flex-col">
            <Navbar />

            <BookingStatusHeader currentStep={4} />

            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-6 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Left Side: Summary & Reward */}
                    <div className="space-y-8">
                        <div className="bg-black rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-sm border border-white/10">
                            <div className="flex items-center gap-3 mb-10">
                                <div className="px-3 py-1 rounded-full bg-flight-card text-black text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-black" />
                                    Availability Confirmed
                                </div>
                                <span className="text-[10px] font-bold text-white/50">Ref: {booking?.airline_booking_reference || booking?.booking_reference || '#LX-PENDING'}</span>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 sm:gap-0 mb-8">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Departure</span>
                                    <span className="text-xl font-bold text-white">{route.from} ({route.fromCode})</span>
                                </div>
                                <div className="flex-1 mx-4 h-px border-t-2 border-dashed border-white/10 hidden sm:block" />
                                <div className="flex flex-col text-left sm:text-right">
                                    <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Arrival</span>
                                    <span className="text-xl font-bold text-white">{route.to} ({route.toCode})</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 md:gap-8 mb-12">
                                <div>
                                    <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest block mb-1">Date</span>
                                    <span className="text-sm font-bold text-white">{route.depTime}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest block mb-1">Cabin Class</span>
                                    <span className="text-sm font-bold text-flight-card">First Class (Suite)</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest block mb-1">Passengers</span>
                                    <span className="text-sm font-bold text-white">{passengerCount} {passengerCount > 1 ? 'Passengers' : 'Passenger'}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest block mb-1">Airline</span>
                                    <span className="text-sm font-bold text-white">{route.airline}</span>
                                </div>
                            </div>

                            <div className="pt-10 border-t border-white/10 flex items-center justify-between">
                                <span className="text-sm font-medium text-white/50">Total Due (Confirmed)</span>
                                <div className="text-right">
                                    {loading ? (
                                        <div className="w-32 h-8 bg-white/10 animate-pulse rounded-lg ml-auto"></div>
                                    ) : (
                                        <span className="text-3xl font-black text-flight-card">₦{priceToPay.toLocaleString()}</span>
                                    )}
                                </div>
                            </div>
                            <p className="text-[9px] text-white/50 font-medium mt-4 flex items-center gap-2">
                                <AlertCircle size={10} className="text-flight-card" />
                                Final price verified by agent. Includes all taxes, lounge access, and premium handling.
                            </p>
                        </div>

                        {/* Reward Card */}
                        <div className="bg-flight-card/5 border border-black/5 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 flex items-start gap-4 md:gap-6 relative overflow-hidden group hover:scale-[1.02] transition-transform">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <TrendingUp size={80} />
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-flight-card shrink-0">
                                <span className="font-black text-xl">L</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-zinc-900 mb-2">Luxel Platinum Reward</h4>
                                <p className="text-xs text-zinc-500 leading-relaxed font-light">
                                    This booking earns you <span className="font-bold text-flight-card">{(priceToPay * 0.05).toLocaleString()} Luxel Points</span> toward your next private charter.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Secure Payment Box */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-xl shadow-black/5 border border-black/5 overflow-hidden">
                            <div className="bg-black/5 px-6 md:px-10 py-4 md:py-6 border-b border-black/10 flex items-center gap-4">
                                <Building2 size={20} className="text-black/60" />
                                <h2 className="text-caption font-medium text-zinc-900 uppercase tracking-widest">Secure Checkout</h2>
                            </div>

                            <div className="p-6 md:p-10 flex flex-col justify-center items-center text-center space-y-6 md:space-y-8 min-h-[300px] md:min-h-[400px]">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Paystack_Logo.png/1200px-Paystack_Logo.png" alt="Paystack" className="h-10 object-contain mx-auto" />

                                <div>
                                    <h3 className="text-heading-lg text-zinc-900 tracking-tight mb-2">Finalize Your Private Charter</h3>
                                    <p className="text-body text-zinc-500 max-w-sm mx-auto">
                                        You will be redirected to Paystack to securely enter your payment details and finalize your booking.
                                    </p>
                                </div>

                                <div className="w-full max-w-md bg-zinc-50 border border-zinc-100 rounded-3xl p-6 mb-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-caption font-medium text-zinc-400 uppercase tracking-widest">Amount Due</span>
                                        <span className="text-lg font-black text-zinc-900">₦{priceToPay.toLocaleString()}</span>
                                    </div>
                                    <div className="w-full h-px bg-zinc-200 mb-4" />
                                    <div className="flex items-center gap-3 text-body-sm font-medium text-emerald-600 justify-center">
                                        <Check size={14} /> Price verified by agent
                                    </div>
                                </div>

                                <button
                                    onClick={handlePaystackPayment}
                                    disabled={loading || isInitializing}
                                    className="w-full max-w-md bg-black text-flight-card py-6 rounded-3xl text-body-sm font-medium flex items-center justify-center gap-4 shadow-2xl shadow-black/20 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                                >
                                    {isInitializing ? (
                                        "INITIALIZING PAYMENT..."
                                    ) : (
                                        <>
                                            <Check size={20} strokeWidth={3} />
                                            PAY SECURELY WITH PAYSTACK
                                        </>
                                    )}
                                </button>

                                <p className="text-caption font-medium text-zinc-400 tracking-widest flex items-center justify-center gap-2">
                                    <ShieldCheck size={14} /> Securely processed via PCI-DSS compliant infrastructure
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

export default function PaymentPage() {
    return (
        <Suspense fallback={<div>Loading Payment Details...</div>}>
            <PaymentContent />
        </Suspense>
    );
}
