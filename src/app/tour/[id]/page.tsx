'use client'

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
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TourDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [guests, setGuests] = useState(2);
    const [selectedDate, setSelectedDate] = useState('September 12, 2024');

    const tourId = params.id as string;

    const getHeroImage = (id: string) => {
        if (id === 'tuscan-silk-road') return '/tour-img/img-1.jpg';
        if (id === 'kyoto-zen-retreat') return '/tour-img/img-2.jpg';
        if (id === 'wilderness-refined') return '/tour-img/img-3.jpg';
        return '/tour/Screen-2.png';
    };

    const getTourTitle = (id: string) => {
        if (id === 'tuscan-silk-road') return 'The Tuscan Silk Road';
        if (id === 'kyoto-zen-retreat') return 'Kyoto Zen Retreat';
        if (id === 'wilderness-refined') return 'Wilderness Refined';
        return 'The Silk Road Reimagined';
    };

    const tour = {
        id: tourId,
        title: getTourTitle(tourId),
        image: getHeroImage(tourId),
        location: "Istanbul, Turkey",
        price: 8500,
        duration: "12 Days",
        rating: 5,
        description: "Traverse the ancient pathways of merchants and monarchs, where every corner turned reveals a secret from a millennium past, reimagined with the pinnacle of modern luxury.",
        tags: ["Limited Edition", "12 Days"],
        itinerary: [
            {
                day: 1,
                title: "Twilight Over the Bosphorus",
                subtitle: "Arrival & Welcome Dinner",
                content: "Step into a world where East meets West. Your private chauffeur awaits to whisk you to your suite overlooking the shimmering Bosphorus. As the sun dips below the horizon, enjoy an exclusive six-course welcome dinner curated by a Michelin-starred chef on a private rooftop terrace.",
                images: ["/tour-img/img-2.jpg", "/tour-img/img-3.jpg"]
            },
            {
                day: 2,
                title: "The Golden Horn & Hidden Vaults",
                subtitle: "Private Museum Access",
                content: "Experience the history of the Ottoman Empire without the crowds. Exclusive early access to the Topkapi Palace and Hagia Sophia.",
            },
            {
                day: 3,
                title: "Anatolian Echoes",
                subtitle: "Luxury Transit to Cappadocia",
                content: "A private jet flight followed by a stay in a luxury cave resort with panoramic views of the valley.",
            }
        ],
        guides: [
            { name: "Elif Demir", role: "Art Historian • 12 Years exp.", image: "/tour-img/img-4.jpg" },
            { name: "Julian Vance", role: "Logistics & Gastronomy", image: "/tour-img/img-5.jpg" }
        ],
        included: [
            { icon: <Hotel size={24} />, label: "5-Star Stays" },
            { icon: <Utensils size={24} />, label: "Michelin Dining" },
            { icon: <Car size={24} />, label: "Private Driver" },
            { icon: <ShieldCheck size={24} />, label: "All Access" }
        ]
    };

    const handleBooking = () => {
        router.push(`/tour/${tour.id}/booking?guests=${guests}&date=${selectedDate}`);
    };

    return (
        <div className="bg-white min-h-screen">
            <Navbar />
            {/* Hero Section */}
            <section className="relative h-[65vh] flex items-end">
                <Image
                    src={tour.image}
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
                        {tour.tags.map(tag => (
                            <span key={tag} className="bg-amber text-black text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                                {tag}
                            </span>
                        ))}
                    </motion.div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-5xl md:text-7xl font-serif text-white max-w-2xl leading-tight"
                        >
                            {tour.title}
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-right"
                        >
                            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Starting From</p>
                            <p className="text-4xl font-black text-amber">₦{tour.price.toLocaleString()} <span className="text-sm text-white/40 font-medium">/ guest</span></p>
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
                            <h2 className="text-3xl font-serif text-zinc-900">A Curated Journey through History</h2>
                            <p className="text-zinc-500 text-lg font-light leading-relaxed">
                                "{tour.description}"
                            </p>
                        </div>

                        {/* Daily Itinerary */}
                        <div className="space-y-10">
                            <div className="flex items-center gap-4 text-amber font-black uppercase tracking-[0.2em] text-sm">
                                <Clock size={20} />
                                Daily Itinerary
                            </div>

                            <div className="space-y-12 relative pl-8">
                                <div className="absolute left-[1.2rem] top-4 bottom-4 w-[2px] bg-zinc-100" />

                                {tour.itinerary.map((item, i) => (
                                    <motion.div
                                        key={item.day}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        className="relative"
                                    >
                                        <div className="absolute -left-11 w-8 h-8 rounded-full bg-white border-2 border-amber flex items-center justify-center text-xs font-black text-amber z-10 shadow-sm">
                                            {item.day}
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-xl font-bold text-zinc-900 leading-tight">{item.title}</h3>
                                                    <p className="text-amber font-bold text-[10px] uppercase tracking-widest mt-1">{item.subtitle}</p>
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
                                                    {item.images.map((img, idx) => (
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
                            <h3 className="text-center text-xl font-serif text-zinc-900 mb-10">What's Included</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {tour.included.map((item, i) => (
                                    <div key={i} className="flex flex-col items-center gap-4 text-center">
                                        <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-amber shadow-sm">
                                            {item.icon}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar (Right) */}
                    <div className="lg:col-span-4 space-y-10">

                        {/* Booking Card */}
                        <div className="bg-white rounded-[3rem] border border-zinc-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-10 sticky top-28">
                            <h3 className="text-2xl font-serif text-zinc-900 mb-8">Reserve Your Spot</h3>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Select Start Date</label>
                                    <div className="w-full bg-zinc-50 border-none rounded-2xl py-4 px-6 flex items-center justify-between text-sm font-bold text-zinc-900 cursor-pointer">
                                        {selectedDate}
                                        <Calendar size={18} className="text-amber" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Number of Guests</label>
                                    <div className="flex items-center justify-between bg-zinc-50 rounded-2xl p-2 border border-zinc-50">
                                        <button
                                            onClick={() => setGuests(Math.max(1, guests - 1))}
                                            className="w-10 h-10 rounded-xl bg-white text-zinc-400 flex items-center justify-center hover:text-zinc-900 transition-all font-bold"
                                        >-</button>
                                        <span className="font-black text-zinc-900">{guests} Guests</span>
                                        <button
                                            onClick={() => setGuests(guests + 1)}
                                            className="w-10 h-10 rounded-xl bg-white text-zinc-400 flex items-center justify-center hover:text-zinc-900 transition-all font-bold"
                                        >+</button>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-zinc-50 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-lg font-black text-zinc-900">Subtotal</p>
                                        <p className="text-xs text-zinc-400 font-medium whitespace-nowrap">Tax & fees included</p>
                                    </div>
                                    <p className="text-2xl font-black text-zinc-900">₦{(tour.price * guests).toLocaleString()}</p>
                                </div>

                                <button
                                    onClick={handleBooking}
                                    className="w-full bg-amber hover:bg-amber-dark text-black py-5 rounded-2xl font-bold shadow-xl shadow-amber/10 transition-all transform active:scale-95"
                                >
                                    Reserve Your Spot
                                </button>
                                <p className="text-[10px] text-center text-zinc-400 font-medium">You won't be charged yet. Our concierge will contact you to finalize details.</p>
                            </div>
                        </div>

                        {/* Guides */}
                        <div className="p-10 bg-white rounded-[3rem] border border-zinc-100 shadow-sm">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-8">Your Expert Guides</h4>
                            <div className="space-y-6">
                                {tour.guides.map((guide, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-zinc-100 border border-zinc-200 overflow-hidden relative">
                                            <Image src={guide.image} alt={guide.name} fill className="object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-zinc-900">{guide.name}</p>
                                            <p className="text-[10px] font-bold text-zinc-400 mt-0.5">{guide.role}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-amber border-t border-zinc-50 hover:bg-zinc-50 transition-all rounded-b-3xl">
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
