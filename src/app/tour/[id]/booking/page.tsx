'use client'

import api from '@/lib/api';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState, useEffect, Suspense } from 'react';
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
    Loader2,
    Building2,
    Copy,
    UploadCloud
} from 'lucide-react';

function TourBookingContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tour, setTour] = useState<any>(null);
    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const [receiptUrl, setReceiptUrl] = useState<string>('');
    const [uploading, setUploading] = useState(false);

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

        // Manual Payment Transition
        /*
        const script = document.createElement('script');
        script.src = 'https://js.paystack.co/v1/inline.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
        */
    }, [params.id]);

    const handleCompleteBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.firstName || !formData.lastName || !formData.email) {
            alert('Please provide your full name and email address.');
            return;
        }

        if (!receiptUrl) {
            alert('Please upload your payment receipt before confirming.');
            return;
        }

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
                    requests: formData.requests,
                    receipt_url: receiptUrl,
                    payment_method: 'BANK_TRANSFER'
                },
                paymentReference: `MANUAL_${Math.floor((Math.random() * 1000000) + 1)}`
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

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard');
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
                    <form onSubmit={handleCompleteBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-12">

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
                                        <h3 className="text-heading-sm font-medium tracking-tight">Manual Bank Transfer</h3>
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        Verified Business Account
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-zinc-50 border border-zinc-100 rounded-3xl p-8 space-y-5">
                                        <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
                                            <div className="text-left">
                                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Bank Name</p>
                                                <p className="text-body font-bold text-zinc-900 leading-none">Moniepoint MFB</p>
                                            </div>
                                            <Building2 size={18} className="text-zinc-300" />
                                        </div>
                                        <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
                                            <div className="text-left">
                                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Account Number</p>
                                                <p className="text-2xl font-black text-black leading-none">4000323443</p>
                                            </div>
                                            <button type="button" onClick={() => copyToClipboard('4000323443')} className="p-3 hover:bg-zinc-200 rounded-xl transition-colors">
                                                <Copy size={20} className="text-zinc-400" />
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="text-left">
                                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Account Name</p>
                                                <p className="text-body font-bold text-zinc-900 uppercase leading-none">Eljey Enterprise - Eljey Enterprise 2</p>
                                            </div>
                                            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                                                <CheckCircle2 size={14} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-amber/5 border border-amber/10 rounded-2xl p-6 flex items-start gap-4">
                                        <Info size={20} className="text-amber shrink-0 mt-0.5" />
                                        <p className="text-body-sm text-zinc-600 leading-relaxed font-medium">
                                            <strong>Important:</strong> Please include your full name in the transfer narration. Your reservation will be confirmed once the receipt is verified by our finance team.
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block">
                                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3 block">Upload Payment Receipt</span>
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
                                                    className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 rounded-3xl py-12 px-6 gap-4 group-hover:border-amber transition-colors bg-zinc-50/50 cursor-pointer"
                                                >
                                                    {uploading ? (
                                                        <div className="w-10 h-10 border-4 border-amber border-t-transparent rounded-full animate-spin" />
                                                    ) : receiptFile ? (
                                                        <>
                                                            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                                                                <CheckCircle2 size={32} />
                                                            </div>
                                                            <p className="text-body font-bold text-zinc-900">{receiptFile.name}</p>
                                                            <p className="text-caption font-medium text-zinc-400 uppercase tracking-widest">Click to change file</p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-zinc-300 shadow-sm group-hover:bg-amber/10 group-hover:text-amber transition-all">
                                                                <UploadCloud size={32} />
                                                            </div>
                                                            <div className="text-center">
                                                                <p className="text-body font-bold text-zinc-900">Upload Transaction Receipt</p>
                                                                <p className="text-caption font-medium text-zinc-400 uppercase tracking-widest mt-1">PNG, JPG or PDF (Max 5MB)</p>
                                                            </div>
                                                        </>
                                                    )}
                                                </label>
                                            </div>
                                        </label>
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
                                        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : (receiptUrl ? <CheckCircle2 size={18} /> : <ShieldCheck size={18} />)}
                                        {isSubmitting ? 'Finalizing Reservation...' : 'Complete Luxury Booking'}
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

export default function TourBookingPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-body font-medium text-zinc-300 uppercase tracking-widest">Opening Secure Desk...</div>}>
            <TourBookingContent />
        </Suspense>
    );
}
