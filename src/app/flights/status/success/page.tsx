'use client'

import api from '@/lib/api';
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Ticket, ArrowRight, Home } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isVerifying, setIsVerifying] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);
    const bookingRef = searchParams.get('ref');
    const trxRef = searchParams.get('reference') || searchParams.get('trxref');

    useEffect(() => {
        const verify = async () => {
            if (!trxRef) {
                setIsVerifying(false);
                return;
            }

            try {
                const response = await api.get(`/bookings/verify-payment/${trxRef}`);

                if (response.status === 200) {
                    setIsSuccess(true);
                }
            } catch (error: any) {
                console.error('Verification failed:', error);
                if (error.response?.status === 401) {
                    // Token might be missing or expired
                }
            } finally {
                setIsVerifying(false);
            }
        };

        verify();
    }, [trxRef]);

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 bg-[url('https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=2070')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 bg-white/5 backdrop-blur-2xl border border-white/10 p-6 md:p-12 rounded-[2rem] md:rounded-[4rem] max-w-xl w-full text-center shadow-2xl"
            >
                {isVerifying ? (
                    <div className="space-y-6 py-6 md:py-12">
                        <div className="w-20 h-20 border-4 border-amber border-t-transparent rounded-full animate-spin mx-auto" />
                        <h2 className="text-heading-lg text-white tracking-tight">Authenticating Transaction...</h2>
                        <p className="text-body text-white/50">Securing your luxury itinerary with the global clearing house.</p>
                    </div>
                ) : isSuccess ? (
                    <>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", damping: 12 }}
                            className="w-20 h-20 md:w-24 md:h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-10 shadow-lg shadow-emerald-500/20"
                        >
                            <CheckCircle2 size={48} className="text-white" />
                        </motion.div>

                        <h1 className="text-heading-xl text-white tracking-tight mb-4">Itinerary Secured</h1>
                        <p className="text-body-lg text-white/60 mb-8 md:mb-12">Your reservation {bookingRef} has been verified. Welcome to the Luxel elite.</p>

                        <div className="grid grid-cols-1 gap-4">
                            <button
                                onClick={() => router.push('/agent/dashboard')} // Agent for now, or profile
                                className="w-full bg-white text-black py-6 rounded-3xl text-body-sm font-medium flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
                            >
                                <Ticket size={18} />
                                VIEW E-TICKETS
                                <ArrowRight size={18} />
                            </button>
                            <button
                                onClick={() => router.push('/')}
                                className="w-full bg-white/10 text-white py-6 rounded-3xl text-body-sm font-medium flex items-center justify-center gap-3 hover:bg-white/20 transition-all border border-white/10"
                            >
                                <Home size={18} />
                                RETURN HOME
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="py-6 md:py-12">
                        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                            <span className="text-heading-xl text-red-500">!</span>
                        </div>
                        <h2 className="text-heading-lg text-white mb-4 tracking-tight">Handshake Interrupted</h2>
                        <p className="text-body text-white/50 mb-10">We couldn't verify your payment instantly. Please check your dashboard or contact concierge.</p>
                        <button
                            onClick={() => router.push('/')}
                            className="bg-white text-black px-10 py-5 rounded-2xl text-body-sm font-medium"
                        >
                            RETURN TO LUXEL
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={<div className="bg-black min-h-screen" />}>
            <SuccessContent />
        </Suspense>
    );
}
