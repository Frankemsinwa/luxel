'use client'

import api from '@/lib/api';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
    ChevronLeft,
    MapPin,
    Clock,
    Star,
    Users,
    Calendar,
    CheckCircle2,
    ChevronDown,
    Info,
    Hotel,
    Utensils,
    Car,
    ShieldCheck
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TourDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [guests, setGuests] = useState(2);
    const [selectedDate, setSelectedDate] = useState('September 12, 2024');
    const [tour, setTour] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const tourSlug = params.id as string;

    useEffect(() => {
        const fetchTour = async () => {
            try {
                const response = await api.get(`/tours/${tourSlug}`);
                setTour(response.data);
            } catch (err) {
                console.error('Error fetching tour:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTour();
    }, [tourSlug]);

    const handleBooking = () => {
        router.push(`/tour/${tour.slug}/booking?guests=${guests}&date=${selectedDate}`);
    };

    if (isLoading) return <div className="min-h-screen bg-white flex items-center justify-center text-body font-medium text-zinc-300">Synchronizing your elite itinerary...</div>;
    if (!tour) return <div className="min-h-screen bg-white flex items-center justify-center text-body font-medium text-zinc-300">Experience not found.</div>;

    return (
        <div className="bg-white min-h-screen">
            <Navbar />
            {/* Hero Section */}
            <section className="relative h-[65vh] flex items-end">
                <Image
                    src={tour.hero_image || '/tour-img/fallback.jpg'}
                    alt={tour.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-wrap gap-4 mb-6"
                    >
                        {(tour.tags || []).map((tag: any) => (
                            <span key={tag} className="bg-amber text-black text-caption font-medium uppercase tracking-widest px-4 py-1.5 rounded-full">
                                {tag}
                            </span>
                        ))}
                    </motion.div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-display text-white max-w-2xl leading-tight"
                        >
                            {tour.title}
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-right"
                        >
                            <p className="text-white/60 text-caption font-medium uppercase tracking-widest mb-1">Starting From</p>
                            <p className="text-heading-xl font-medium text-amber">₦{Number(tour.price).toLocaleString()} <span className="text-body-sm text-white/40 font-medium">/ guest</span></p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Content Grid */}
            <section className="max-w-7xl mx-auto px-6 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                    {/* Main Content (Left) */}
                    <div className="lg:col-span-8 space-y-16">

                        {/* Description */}
                        <div className="space-y-6">
                            <h2 className="text-heading-xl text-zinc-900">A Curated Journey through History</h2>
                            <p className="text-body-lg text-zinc-500 leading-relaxed">
                                "{tour.description}"
                            </p>
                        </div>

                        {/* Daily Itinerary */}
                        <div className="space-y-10">
                            <div className="flex items-center gap-4 text-amber text-body font-medium uppercase tracking-[0.2em]">
                                <Clock size={20} />
                                Daily Itinerary
                            </div>

                            <div className="space-y-12 relative pl-8">
                                <div className="absolute left-[1.2rem] top-4 bottom-4 w-[2px] bg-zinc-100" />

                                {(tour.itinerary || []).map((item: any, i: any) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        className="relative"
                                    >
                                        <div className="absolute -left-11 w-8 h-8 rounded-full bg-white border-2 border-amber flex items-center justify-center text-caption font-medium text-amber z-10 shadow-sm">
                                            {i + 1 || item.day}
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-heading-sm font-medium text-zinc-900 leading-tight">{item.title}</h3>
                                                    <p className="text-caption font-medium text-amber uppercase tracking-widest mt-1">{item.subtitle}</p>
                                                </div>
                                                <ChevronDown className="text-zinc-300" />
                                            </div>

                                            {item.content && (
                                                <p className="text-zinc-600 font-medium leading-relaxed max-w-2xl">
                                                    {item.content}
                                                </p>
                                            )}

                                            {item.images && (
                                                <div className="grid grid-cols-2 gap-4 pt-4">
                                                    {item.images.map((img: any, idx: any) => (
                                                        <div key={idx} className="relative h-48 rounded-[2rem] overflow-hidden shadow-md">
                                                            <Image src={img} alt="Itinerary point" fill className="object-cover" />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Included */}
                        <div className="bg-zinc-50 rounded-[3rem] p-12 border border-zinc-100">
                            <h3 className="text-center text-heading-md text-zinc-900 mb-10">What's Included</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {(tour.included || []).map((item: any, i: any) => (
                                    <div key={i} className="flex flex-col items-center gap-4 text-center">
                                        <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-amber shadow-sm">
                                            <ShieldCheck size={24} />
                                        </div>
                                        <span className="text-caption font-medium uppercase tracking-widest text-zinc-400">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar (Right) */}
                    <div className="lg:col-span-4 space-y-10">

                        {/* Booking Card */}
                        <div className="bg-white rounded-[3rem] border border-zinc-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-10 sticky top-28">
                            <h3 className="text-heading-lg text-zinc-900 mb-8">Reserve Your Spot</h3>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-caption font-medium text-zinc-400 uppercase tracking-widest">Select Start Date</label>
                                    <div className="w-full bg-zinc-50 border-none rounded-2xl py-4 px-6 flex items-center justify-between text-body font-medium text-zinc-900 cursor-pointer">
                                        {selectedDate}
                                        <Calendar size={18} className="text-amber" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-caption font-medium text-zinc-400 uppercase tracking-widest">Number of Guests</label>
                                    <div className="flex items-center justify-between bg-zinc-50 rounded-2xl p-2 border border-zinc-50">
                                        <button
                                            onClick={() => setGuests(Math.max(1, guests - 1))}
                                            className="w-10 h-10 rounded-xl bg-white text-zinc-400 flex items-center justify-center hover:text-zinc-900 transition-all text-body font-medium"
                                        >-</button>
                                        <span className="text-body font-medium text-zinc-900">{guests} Guests</span>
                                        <button
                                            onClick={() => setGuests(guests + 1)}
                                            className="w-10 h-10 rounded-xl bg-white text-zinc-400 flex items-center justify-center hover:text-zinc-900 transition-all text-body font-medium"
                                        >+</button>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-zinc-50 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-heading-sm text-zinc-900">Subtotal</p>
                                        <p className="text-caption font-medium text-zinc-400 whitespace-nowrap">Tax & fees included</p>
                                    </div>
                                    <p className="text-heading-md font-medium text-zinc-900">₦{(tour.price * guests).toLocaleString()}</p>
                                </div>

                                <button
                                    onClick={handleBooking}
                                    className="w-full bg-amber hover:bg-amber-dark text-black py-5 rounded-2xl text-body-sm font-medium shadow-xl shadow-amber/10 transition-all transform active:scale-95"
                                >
                                    Reserve Your Spot
                                </button>
                                <p className="text-caption text-center text-zinc-400 font-medium">You won't be charged yet. Our concierge will contact you to finalize details.</p>
                            </div>
                        </div>

                        {/* Guides */}
                        <div className="p-10 bg-white rounded-[3rem] border border-zinc-100 shadow-sm">
                            <h4 className="text-caption font-medium uppercase tracking-widest text-zinc-400 mb-8">Your Expert Guides</h4>
                            <div className="space-y-6">
                                {tour.guides.map((guide: any, i: any) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-zinc-100 border border-zinc-200 overflow-hidden relative">
                                            <Image src={guide.image} alt={guide.name} fill className="object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-body font-medium text-zinc-900">{guide.name}</p>
                                            <p className="text-caption font-medium text-zinc-400 mt-0.5">{guide.role}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-8 py-4 text-caption font-medium uppercase tracking-[0.2em] text-amber border-t border-zinc-50 hover:bg-zinc-50 transition-all rounded-b-3xl">
                                Meet The Team
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}
