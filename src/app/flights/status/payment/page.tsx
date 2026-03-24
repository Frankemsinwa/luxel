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
    CheckCircle2,
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userEmail, setUserEmail] = useState<string>('client@luxel.com');
    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const [receiptUrl, setReceiptUrl] = useState<string>('');
    const [uploading, setUploading] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);

    const passengerCountStr = searchParams.get('passengers') || '1 Passenger';
    const passengerCount = parseInt(passengerCountStr.split(' ')[0]) || 1;

    const departureDateStr = searchParams.get('departure');
    const depTimeStr = searchParams.get('depTime') || "Oct 24, 2026";
    let formattedDepTime = depTimeStr;

    if (departureDateStr) {
        try {
            const d = new Date(departureDateStr);
            const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            formattedDepTime = `${dateStr} • ${depTimeStr}`;
        } catch (e) {
            console.error("Invalid departure date:", departureDateStr);
        }
    }

    const route = {
        from: searchParams.get('depCity') || "London",
        fromCode: searchParams.get('depCode') || "LHR",
        to: searchParams.get('arrCity') || "New York",
        toCode: searchParams.get('arrCode') || "JFK",
        depTime: formattedDepTime,
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
    // We have shifted to manual payment for now.
    /*
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://js.paystack.co/v1/inline.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script); // Cleanup
        };
    }, []);
    */

    // Price to pay: Prefer confirmed_price, fallback to total_price, then search Param.
    const priceToPay = booking?.confirmed_price || booking?.total_price || Number(searchParams.get('price')) || 945000;

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            // 1. Get secure signature from Luxel backend
            const sigRes = await api.get('/uploads/signature');
            const { signature, timestamp, cloud_name, api_key, folder } = sigRes.data;

            // 2. Upload file directly to Cloudinary using the signature
            const formData = new FormData();
            formData.append('file', file);
            formData.append('api_key', api_key);
            formData.append('timestamp', timestamp.toString());
            formData.append('signature', signature);
            formData.append('folder', folder);

            const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!uploadRes.ok) throw new Error('Failed to upload receipt');

            const data = await uploadRes.json();

            // 3. Update the UI with the secure Cloudinary URL
            setReceiptUrl(data.secure_url);
            setReceiptFile(file);
        } catch (error: any) {
            console.error('Upload error:', error);
            alert('Failed to upload receipt to Cloudinary.');
        } finally {
            setUploading(false);
        }
    };

    const handleConfirmPayment = async () => {
        if (!receiptUrl) {
            alert('Please upload your payment receipt before confirming.');
            return;
        }

        setIsSubmitting(true);
        try {
            await api.patch(`/bookings/${bookingId}/confirm-payment`, {
                receipt_url: receiptUrl,
                payment_method: 'BANK_TRANSFER'
            });
            setIsConfirmed(true);
            setTimeout(() => {
                router.push(`/flights/status/verifying?${searchParams.toString()}`);
            }, 2000);
        } catch (error: any) {
            console.error('Failed to confirm payment:', error);
            alert('Failed to submit payment proof. Please contact support.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard');
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
                                <p className="text-sm text-zinc-600 leading-relaxed font-medium">
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

                            <div className="p-6 md:p-10 flex flex-col space-y-6">
                                <div className="text-center">
                                    <h3 className="text-heading-lg text-zinc-900 tracking-tight mb-2">Manual Bank Transfer</h3>
                                    <p className="text-body text-zinc-500 max-w-sm mx-auto">
                                        Please complete your payment by transferring the exact amount to the account details below.
                                    </p>
                                </div>

                                <div className="bg-zinc-50 border border-zinc-100 rounded-3xl p-6 space-y-4">
                                    <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                                        <div className="text-left">
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Bank Name</p>
                                            <p className="text-sm font-bold text-zinc-900">Moniepoint MFB</p>
                                        </div>
                                        <Building2 size={16} className="text-zinc-300" />
                                    </div>
                                    <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                                        <div className="text-left">
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Account Number</p>
                                            <p className="text-lg font-black text-black">4000323443</p>
                                        </div>
                                        <button onClick={() => copyToClipboard('4000323443')} className="p-2 hover:bg-zinc-200 rounded-lg transition-colors">
                                            <Copy size={16} className="text-zinc-400" />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="text-left">
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Account Name</p>
                                            <p className="text-sm font-bold text-zinc-900 uppercase">Eljey Enterprise - Eljey Enterprise 2</p>
                                        </div>
                                        <CheckCircle2 size={16} className="text-emerald-500" />
                                    </div>
                                </div>

                                <div className="bg-amber/10 border border-amber/20 rounded-2xl p-4 flex items-start gap-3">
                                    <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                                    <p className="text-xs text-amber-900 leading-relaxed font-medium">
                                        <strong>IMPORTANT:</strong> Ensure you include your Booking Reference <span className="font-bold underline">{booking?.booking_reference || bookingId}</span> in the transfer description/message.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <label className="block">
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 block">Upload Payment Receipt</span>
                                        <div className="relative group cursor-pointer">
                                            <input
                                                type="file"
                                                accept="image/*,.pdf"
                                                onChange={handleFileUpload}
                                                className="hidden"
                                                id="receipt-upload"
                                            />
                                            <label
                                                htmlFor="receipt-upload"
                                                className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 rounded-3xl py-10 px-6 gap-3 group-hover:border-amber transition-colors bg-white cursor-pointer"
                                            >
                                                {uploading ? (
                                                    <div className="w-8 h-8 border-4 border-amber border-t-transparent rounded-full animate-spin" />
                                                ) : receiptFile ? (
                                                    <>
                                                        <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                                                            <Check size={24} />
                                                        </div>
                                                        <p className="text-sm font-bold text-zinc-900">{receiptFile.name}</p>
                                                        <p className="text-[10px] font-medium text-zinc-400">Click to replace receipt</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-300 group-hover:bg-amber/10 group-hover:text-amber">
                                                            <UploadCloud size={24} />
                                                        </div>
                                                        <p className="text-sm font-bold text-zinc-900">Drop receipt or click to upload</p>
                                                        <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">PNG, JPG or PDF up to 5MB</p>
                                                    </>
                                                )}
                                            </label>
                                        </div>
                                    </label>
                                </div>

                                <button
                                    onClick={handleConfirmPayment}
                                    disabled={loading || isSubmitting || !receiptUrl || isConfirmed}
                                    className="w-full bg-black text-white/90 py-6 rounded-3xl text-body-sm font-medium flex items-center justify-center gap-4 shadow-2xl shadow-black/20 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none uppercase tracking-widest"
                                >
                                    {isSubmitting ? (
                                        "PROCESSING..."
                                    ) : isConfirmed ? (
                                        <>
                                            <Check size={20} strokeWidth={3} className="text-emerald-400" />
                                            PAYMENT SUBMITTED SUCCESSFULLY
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheck size={18} className={receiptUrl ? "text-amber" : "text-zinc-500"} />
                                            I HAVE MADE PAYMENT
                                        </>
                                    )}
                                </button>

                                <p className="text-caption font-medium text-zinc-400 tracking-widest flex items-center justify-center gap-2">
                                    <ShieldCheck size={14} /> Highly encrypted & secure transmission
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
