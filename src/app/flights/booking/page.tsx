'use client'

import api from '@/lib/api';
import { FLIGHT_TAXES_BREAKDOWN, TOTAL_FLIGHT_TAXES } from '@/lib/constants';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect, useRef } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from '@/lib/supabase';
import { COUNTRIES } from '@/lib/countries';
import { writeTracker } from '@/lib/bookingTracker';
import {
    Loader2 as LucideLoader,
    User,
    Check,
    ChevronDown,
    Contact,
    Globe,
    Sparkles,
    Shield,
    ArrowRight,
    Search,
    X,
    Clock
} from "lucide-react";

const SearchableDropdown = ({ 
    options, 
    value, 
    onChange, 
    placeholder = "Search...", 
    displayValue, 
    className = "",
    icon: Icon,
    error = false
}: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = options.filter((opt: any) => 
        (opt.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (opt.dial || '').includes(searchTerm) ||
        (opt.code || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={`relative w-full ${className}`} ref={dropdownRef}>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full bg-black/5 border-none rounded-2xl p-4 text-sm font-semibold text-black flex items-center justify-between cursor-pointer transition-all ${isOpen ? 'ring-2 ring-black/10' : ''} ${error ? 'ring-2 ring-red-500/50 bg-red-50' : ''}`}
            >
                <span className="truncate">{displayValue || value}</span>
                {Icon ? <Icon size={16} className="text-black/50" /> : <ChevronDown size={16} className="text-black/50 transition-transform duration-300" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />}
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute z-[100] mt-2 w-full bg-white rounded-2xl shadow-2xl border border-black/5 overflow-hidden"
                    >
                        <div className="p-2 border-b border-black/5">
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30" />
                                <input 
                                    autoFocus
                                    type="text"
                                    placeholder={placeholder}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-black/5 border-none rounded-xl py-2 pl-9 pr-4 text-xs font-semibold focus:ring-1 focus:ring-black/10 text-black"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </div>
                        <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((opt: any, i: number) => (
                                    <div 
                                        key={opt.code || i}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onChange(opt);
                                            setIsOpen(false);
                                            setSearchTerm('');
                                        }}
                                        className="px-4 py-3 text-sm font-medium hover:bg-amber/10 cursor-pointer flex items-center justify-between group transition-colors"
                                    >
                                        <div className="flex flex-col">
                                            <span className={`truncate group-hover:text-black transition-colors ${value === (opt.dial || opt.name) ? 'text-amber' : 'text-black'}`}>
                                                {opt.name}
                                            </span>
                                            {opt.dial && opt.dial !== opt.name && <span className="text-[10px] text-black/30 font-bold uppercase">{opt.code}</span>}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {opt.dial && <span className="text-[10px] text-black/40 font-bold group-hover:text-black/60 transition-colors">{opt.dial}</span>}
                                            {value === (opt.dial || opt.name) && <Check size={14} className="text-amber" />}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="px-4 py-8 text-center text-xs text-black/30 font-bold uppercase tracking-widest">
                                    No matches
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function PassengerDetailsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const flightId = searchParams.get('id');

    const [flightDetails, setFlightDetails] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authChoice, setAuthChoice] = useState<'undecided' | 'guest' | 'login'>('undecided');
    const [showAuthPrompt, setShowAuthPrompt] = useState(false);

    const adults = Number(searchParams.get('adults') || 1);
    const children = Number(searchParams.get('children') || 0);
    const passengerCountFromSplit = parseInt((searchParams.get('passengers') || '').split(' ')[0]) || 0;
    const passengerCount = (adults + children) || passengerCountFromSplit || 1;
    const taxes = TOTAL_FLIGHT_TAXES;

    const [passengerData, setPassengerData] = useState<any[]>([]);
    const [contactEmail, setContactEmail] = useState('');
    const [contactDialCode, setContactDialCode] = useState('+44');
    const [contactPhone, setContactPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStep, setSubmitStep] = useState(0); // 0: Idle, 1: Verifying, 2: Creating, 3: Finalizing
    const [showErrors, setShowErrors] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsLoggedIn(Boolean(session?.user));
            if (session?.user?.email) {
                setContactEmail(session.user.email);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!flightId) {
                setIsLoading(false);
                return;
            }
            try {
                const response = await api.get(`/flights/${flightId}`);
                setFlightDetails(response.data);
            } catch (error) {
                console.error("Error fetching flight details for booking:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetails();
    }, [flightId]);

    useEffect(() => {
        setPassengerData(
            Array.from({ length: passengerCount }, (_, i) => ({
                id: i + 1,
                title: 'Mr.',
                firstName: '',
                lastName: '',
                gender: 'Male',
                nationality: 'United Kingdom',
                dobDay: '',
                dobMonth: '',
                dobYear: '',
            }))
        );
    }, [passengerCount]);

    const totalPrice = flightDetails?.price || Number(searchParams.get('price')) || 0;
    const baseFare = totalPrice - taxes;

    const isFormValid = () => {
        const passengersValid = passengerData.every(p =>
            p.firstName.trim() !== '' &&
            p.lastName.trim() !== '' &&
            p.dobDay !== '' &&
            p.dobMonth !== '' &&
            p.dobYear !== ''
        );
        const contactValid = contactEmail.trim() !== '' && contactPhone.trim() !== '';
        return passengersValid && contactValid;
    };

    const handleRequestReservation = async () => {
        if (!isFormValid()) {
            setShowErrors(true);
            const firstError = document.querySelector('.border-red-500');
            if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        setIsSubmitting(true);
        setSubmitStep(1);

        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session && authChoice !== 'guest') {
                setShowAuthPrompt(true);
                setIsSubmitting(false);
                setSubmitStep(0);
                return;
            }

            // Artificial delay for premium feel
            await new Promise(r => setTimeout(r, 1500));
            setSubmitStep(2);

            const bookingPayload = {
                flightData: {
                    id: flightId,
                    departureCode: flightDetails?.departureCode || searchParams.get('depCode'),
                    arrivalCode: flightDetails?.arrivalCode || searchParams.get('arrCode'),
                    airline: flightDetails?.airline || searchParams.get('airline'),
                    price: totalPrice,
                    departureTime: flightDetails?.departureTime || searchParams.get('depTime'),
                    arrivalTime: flightDetails?.arrivalTime || searchParams.get('arrTime'),
                    duration: flightDetails?.duration || searchParams.get('duration'),
                    stops: flightDetails?.stops || searchParams.get('stops'),
                    // Store the raw flight offer when available (helps agents re-book accurately).
                    raw: flightDetails?.raw
                },
                totalPrice: totalPrice * passengerCount,
                passengers: passengerData,
                contactInfo: {
                    email: contactEmail,
                    phone: `${contactDialCode} ${contactPhone}`.trim(),
                    dialCode: contactDialCode
                },
                tripDetails: {
                    from: searchParams.get('from') || '',
                    to: searchParams.get('to') || '',
                    departure: searchParams.get('departure') || '',
                    return: searchParams.get('return') || '',
                    tripType: searchParams.get('tripType') || '',
                    travelClass: searchParams.get('travelClass') || '',
                    adults,
                    children,
                    passengerCount
                },
                pricing: {
                    unitPrice: totalPrice,
                    taxes,
                    baseFare,
                    totalPassengers: passengerCount,
                    totalPrice: totalPrice * passengerCount,
                    taxesBreakdown: FLIGHT_TAXES_BREAKDOWN
                }
            };

            const response = await api.post('/bookings', bookingPayload);

            if (response.status === 200 || response.status === 201) {
                const data = response.data;
                setSubmitStep(3);
                await new Promise(r => setTimeout(r, 800));

                // Store a local tracker so they can resume without losing their booking (guest-safe).
                try {
                    writeTracker({
                        bookingId: data.bookingId,
                        requestId: data.requestId,
                        bookingRef: data.bookingRef,
                        guestToken: data.guestToken ?? null,
                        createdAt: Date.now(),
                        contextQuery: searchParams.toString(),
                        lastKnownRequestStatus: 'OPEN',
                        lastKnownBookingStatus: 'PENDING',
                        lastSyncedAt: Date.now()
                    });
                } catch { }

                router.push(`/flights/confirmation?ref=${data.bookingRef}&id=${data.bookingId}&reqId=${data.requestId}&${searchParams.toString()}`);
            } else {
                alert(`Error: ${response.data.message}`);
                setIsSubmitting(false);
            }
        } catch (error: any) {
            console.error('Reservation error:', error);
            alert(error.response?.data?.message || 'An unexpected error occurred. Please try again.');
            setIsSubmitting(false);
        }
    };

    const updatePassenger = (id: number, field: string, value: string) => {
        setPassengerData(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-amber/5 flex flex-col items-center justify-center">
                <LucideLoader size={40} className="text-amber animate-spin mb-4" />
                <p className="text-body text-zinc-500">Preparing your reservation suite...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-amber/5 flex flex-col">
            <Navbar />

            <AnimatePresence>
                {showAuthPrompt && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 md:p-6"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
                            className="relative w-full max-w-2xl rounded-[3rem] bg-zinc-950/80 backdrop-blur-2xl border border-white/10 shadow-[0_0_80px_rgba(241,188,50,0.15)] overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-96 h-96 bg-amber/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
                            
                            <div className="p-8 md:p-12 relative z-10 text-center">
                                <button 
                                    onClick={() => setShowAuthPrompt(false)}
                                    className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all font-light"
                                >
                                    <X size={18} />
                                </button>
                                
                                <div className="w-16 h-16 bg-gradient-to-br from-amber/20 to-amber/5 rounded-2xl border border-amber/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(241,188,50,0.2)]">
                                    <Sparkles className="text-amber" size={28} />
                                </div>
                                <h2 className="text-3xl md:text-4xl text-white tracking-tighter mb-4">
                                    <span className="font-light">Elevate Your</span> <span className="font-newton italic text-amber">Experience</span>
                                </h2>
                                <p className="text-zinc-400 text-sm md:text-base max-w-md mx-auto mb-10 font-light leading-relaxed">
                                    Unlock the full potential of your journey. Members enjoy seamless syncing across devices, priority assistance, and a curated travel history.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button
                                        onClick={() => {
                                            setAuthChoice('login');
                                            setShowAuthPrompt(false);
                                            const redirect = encodeURIComponent(`/flights/booking?${searchParams.toString()}`);
                                            router.push(`/auth?mode=login&redirect=${redirect}`);
                                        }}
                                        className="group relative px-6 py-5 rounded-3xl bg-amber text-black hover:bg-amber-light transition-all duration-300 shadow-[0_20px_40px_rgba(241,188,50,0.25)] hover:shadow-[0_25px_50px_rgba(241,188,50,0.35)] flex flex-col items-center justify-center gap-1 overflow-hidden transform hover:-translate-y-1"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <span className="text-sm font-bold tracking-widest uppercase relative z-10 flex items-center gap-2">
                                            Log In / Sign Up <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </span>
                                        <span className="text-[10px] text-black/60 font-medium relative z-10 uppercase tracking-widest">Access VIP Benefits</span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setAuthChoice('guest');
                                            setShowAuthPrompt(false);
                                            setTimeout(() => handleRequestReservation(), 0);
                                        }}
                                        className="group px-6 py-5 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 flex flex-col items-center justify-center gap-1 text-white hover:border-white/20 transform hover:-translate-y-1"
                                    >
                                        <span className="text-sm font-bold tracking-widest uppercase flex items-center gap-2">
                                            Continue as Guest <ArrowRight size={16} className="text-white/30 group-hover:translate-x-1 group-hover:text-amber transition-all" />
                                        </span>
                                        <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest group-hover:text-zinc-400 transition-colors">Standard Booking</span>
                                    </button>
                                </div>
                                
                                <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6">
                                    <div className="flex items-center gap-2 text-zinc-500 text-xs tracking-widest uppercase">
                                        <Shield size={14} className="text-amber/50" />
                                        <span>Secure 256-bit Encryption</span>
                                    </div>
                                    <div className="hidden sm:block w-1 h-1 bg-white/10 rounded-full" />
                                    <div className="flex items-center gap-2 text-zinc-500 text-xs tracking-widest uppercase">
                                        <Clock size={14} className="text-amber/50" />
                                        <span>Instant Confirmation</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 pt-28">
                <div className="flex flex-col lg:flex-row gap-10">

                    {/* Left Column - Forms */}
                    <div className="flex-1 space-y-12">
                        {!isLoggedIn && authChoice === 'guest' && (
                            <div className="rounded-[2rem] border border-black/10 bg-white/70 backdrop-blur p-5">
                                <div className="text-body font-medium text-black">Booking as guest</div>
                                <div className="text-body-sm text-black/60 mt-1">
                                    We’ll keep your booking status on this device (if you accepted cookies). You can also login anytime to sync across devices.
                                </div>
                            </div>
                        )}
                        {passengerData.map((p, index) => (
                            <motion.div
                                key={p.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-flight-card rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-sm border border-black/5"
                            >
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center text-black">
                                        <User size={24} />
                                    </div>
                                    <h2 className="text-heading-md text-black">Passenger {p.id}</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-semibold text-black/50 uppercase tracking-widest pl-1">Title</label>
                                        <div className="relative">
                                            <select
                                                value={p.title}
                                                onChange={(e) => updatePassenger(p.id, 'title', e.target.value)}
                                                className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm font-semibold text-black focus:ring-2 focus:ring-black/20 appearance-none cursor-pointer"
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
                                        <label className="text-xs font-semibold text-black/50 uppercase tracking-widest pl-1">First name</label>
                                        <input
                                            type="text"
                                            value={p.firstName}
                                            onChange={(e) => updatePassenger(p.id, 'firstName', e.target.value)}
                                            placeholder="As shown on passport"
                                            className={`bg-black/5 border-none rounded-2xl p-4 text-sm font-semibold text-black placeholder:text-black/30 focus:ring-2 focus:ring-black/20 ${showErrors && !p.firstName ? 'ring-2 ring-red-500/50 bg-red-50' : ''}`}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-semibold text-black/50 uppercase tracking-widest pl-1">Last name</label>
                                        <input
                                            type="text"
                                            value={p.lastName}
                                            onChange={(e) => updatePassenger(p.id, 'lastName', e.target.value)}
                                            placeholder="As shown on passport"
                                            className={`bg-black/5 border-none rounded-2xl p-4 text-sm font-semibold text-black placeholder:text-black/30 focus:ring-2 focus:ring-black/20 ${showErrors && !p.lastName ? 'ring-2 ring-red-500/50 bg-red-50' : ''}`}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2 lg:col-span-2">
                                        <label className="text-xs font-semibold text-black/50 uppercase tracking-widest pl-1">Date of birth</label>
                                        <div className="grid grid-cols-3 gap-4">
                                            <input
                                                type="number"
                                                placeholder="DD"
                                                value={p.dobDay}
                                                onChange={(e) => updatePassenger(p.id, 'dobDay', e.target.value)}
                                                className={`bg-black/5 border-none rounded-2xl p-4 text-sm font-semibold text-black text-center focus:ring-2 focus:ring-black/20 ${showErrors && !p.dobDay ? 'ring-2 ring-red-500/50 bg-red-50' : ''}`}
                                            />
                                            <div className="relative">
                                                <select
                                                    value={p.dobMonth}
                                                    onChange={(e) => updatePassenger(p.id, 'dobMonth', e.target.value)}
                                                    className={`w-full bg-black/5 border-none rounded-2xl p-4 text-sm font-semibold text-black appearance-none cursor-pointer focus:ring-2 focus:ring-black/20 ${showErrors && !p.dobMonth ? 'ring-2 ring-red-500/50 bg-red-50' : ''}`}
                                                >
                                                    <option value="">Month</option>
                                                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                                                </select>
                                                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/50" />
                                            </div>
                                            <input
                                                type="number"
                                                placeholder="YYYY"
                                                value={p.dobYear}
                                                onChange={(e) => updatePassenger(p.id, 'dobYear', e.target.value)}
                                                className={`bg-black/5 border-none rounded-2xl p-4 text-sm font-semibold text-black text-center focus:ring-2 focus:ring-black/20 ${showErrors && !p.dobYear ? 'ring-2 ring-red-500/50 bg-red-50' : ''}`}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-semibold text-black/50 uppercase tracking-widest pl-1">Gender</label>
                                        <div className="flex items-center gap-8 h-full">
                                            {['Male', 'Female'].map(g => (
                                                <label key={g} className="flex items-center gap-3 cursor-pointer group" onClick={() => updatePassenger(p.id, 'gender', g)}>
                                                    <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center p-1 ${p.gender === g ? 'border-black bg-black' : 'border-black/30'}`}>
                                                        {p.gender === g && <div className="w-full h-full bg-amber rounded-full" />}
                                                    </div>
                                                    <span className={`text-sm font-semibold transition-colors ${p.gender === g ? 'text-black' : 'text-black/50'}`}>{g}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-semibold text-black/50 uppercase tracking-widest pl-1">Nationality</label>
                                        <SearchableDropdown 
                                            options={COUNTRIES}
                                            value={p.nationality}
                                            onChange={(val: any) => updatePassenger(p.id, 'nationality', val.name)}
                                            icon={Globe}
                                            placeholder="Search nationality..."
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {/* Contact Information Card */}
                        <div className="bg-flight-card rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-sm border border-black/5">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center text-black">
                                    <Contact size={24} />
                                </div>
                                <div>
                                    <h2 className="text-heading-md text-black">Contact Information</h2>
                                    <p className="text-body-sm text-black/50 tracking-tight">Booking confirmation will be sent here</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-black/50 uppercase tracking-widest pl-1">Email address</label>
                                    <input
                                        type="email"
                                        value={contactEmail}
                                        onChange={(e) => setContactEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        className={`bg-black/5 border-none rounded-2xl p-4 text-sm font-bold text-black focus:ring-2 focus:ring-black/20 ${showErrors && !contactEmail ? 'ring-2 ring-red-500/50 bg-red-50' : ''}`}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-black/50 uppercase tracking-widest pl-1">Phone number</label>
                                    <div className="flex gap-2">
                                        <div className="w-24 sm:w-32 shrink-0">
                                            <SearchableDropdown 
                                                options={COUNTRIES}
                                                value={contactDialCode}
                                                onChange={(val: any) => setContactDialCode(val.dial)}
                                                displayValue={contactDialCode}
                                                placeholder="Code..."
                                                error={showErrors && !contactDialCode}
                                            />
                                        </div>
                                        <input
                                            type="tel"
                                            value={contactPhone}
                                            onChange={(e) => setContactPhone(e.target.value)}
                                            placeholder="Mobile number"
                                            className={`flex-1 bg-black/5 border-none rounded-2xl p-4 text-sm font-bold text-black focus:ring-2 focus:ring-black/20 ${showErrors && !contactPhone ? 'ring-2 ring-red-500/50 bg-red-50' : ''}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Summary */}
                    <div className="w-full lg:w-96 flex flex-col gap-6 md:gap-8">
                        <div className="bg-flight-card p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-xl shadow-black/5 border border-black/5">
                            <h3 className="text-caption font-medium text-black/50 uppercase tracking-widest mb-8">Price Summary</h3>
                            <div className="space-y-5 mb-8 pb-8 border-b border-black/10">
                                <div className="flex justify-between">
                                    <span className="text-black/60 font-medium">Base Fare ({passengerCount} Passengers)</span>
                                    <span className="font-bold text-black">₦{(baseFare * passengerCount).toLocaleString()}</span>
                                </div>
                                 {FLIGHT_TAXES_BREAKDOWN.map((taxItem, index) => (
                                     <div key={index} className="flex justify-between text-xs pl-2">
                                         <span className="text-black/50 font-medium">{taxItem.name}</span>
                                         <span className="font-medium text-black/80">₦{(taxItem.amount * passengerCount).toLocaleString()}</span>
                                     </div>
                                 ))}
                                 <div className="flex justify-between pt-2 border-t border-dashed border-black/10">
                                     <span className="text-black/60 font-medium">Total Taxes & Fees</span>
                                     <span className="font-bold text-black">₦{(taxes * passengerCount).toLocaleString()}</span>
                                 </div>
                            </div>
                            <div className="flex flex-col items-center gap-2 mb-8">
                                <span className="text-[10px] font-bold text-black/50 uppercase tracking-widest">Total Amount</span>
                                <span className="text-5xl font-bold text-black">₦{(totalPrice * passengerCount).toLocaleString()}</span>
                            </div>
                            <button
                                onClick={handleRequestReservation}
                                disabled={isSubmitting}
                                className={`w-full bg-black text-white py-6 rounded-2xl font-bold text-sm shadow-lg shadow-black/20 hover:bg-black/80 transition-all active:scale-95 mb-4 font-outfit ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? 'Processing...' : 'Request Reservation'}
                            </button>
                            <p className="text-[10px] text-black/50 font-bold text-center uppercase tracking-tighter">Instant confirmation upon approval</p>
                        </div>
                    </div>
                </div>
            </main>

            {isSubmitting && (
                <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-[3rem] p-12 max-w-md w-full text-center shadow-2xl"
                    >
                        <div className="relative w-20 h-20 mx-auto mb-8">
                            <div className="absolute inset-0 rounded-full border-4 border-black/5" />
                            <motion.div
                                className="absolute inset-0 rounded-full border-4 border-t-black"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Check className={`text-black transition-all duration-500 ${submitStep === 3 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} size={32} />
                            </div>
                        </div>

                        <h3 className="text-heading-md text-zinc-900 mb-2">
                            {submitStep === 1 && "Verifying Routing"}
                            {submitStep === 2 && "Securing Private Rate"}
                            {submitStep === 3 && "Request Dispatched"}
                        </h3>
                        <p className="text-body text-zinc-500 leading-relaxed">
                            {submitStep === 1 && "Confirming real-time availability with our Global GDS network..."}
                            {submitStep === 2 && "Locking in your exclusive elite fare for the next 2 hours..."}
                            {submitStep === 3 && "Your VIP concierge desk has received the request successfully."}
                        </p>
                    </motion.div>
                </div>
            )}

            <Footer />
        </div>
    );
}

export default function PassengerDetailsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Booking...</div>}>
            <PassengerDetailsContent />
        </Suspense>
    );
}
