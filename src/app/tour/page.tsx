'use client'

import api from '@/lib/api';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
    Search,
    MapPin,
    Calendar,
    Users,
    Star,
    ArrowRight,
    ShieldCheck,
    Headset,
    Gem
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TourLandingPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [date, setDate] = useState('');
    const [travelers, setTravelers] = useState('2 Travelers');

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchQuery) params.append('dest', searchQuery);
        if (date) params.append('date', date);
        if (travelers) params.append('travelers', travelers);
        router.push(`/tour/search?${params.toString()}`);
    };

    const [tours, setTours] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const response = await api.get('/tours');
                setTours(response.data);
            } catch (err) {
                console.error('Error fetching tours:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTours();
    }, []);

    const themes = [
        { name: 'Cultural Journeys', image: '/culture.jpeg' },
        { name: 'Wellness Retreats', image: '/wellness.jpeg' },
        { name: 'Active Escapes', image: '/active.jpeg' },
        { name: 'Culinary Expeditions', image: '/culinary.jpeg' }
    ];

    return (
        <div className="bg-white min-h-screen">
            <Navbar />
            {/* Hero Section */}
            <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
                <Image
                    src="/tour-img/city-sunset.jpg"
                    alt="Luxury Landscape"
                    fill
                    className="object-cover brightness-75"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20" />

                <div className="relative z-10 text-center max-w-4xl px-6">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-display text-white mb-6 leading-tight"
                    >
                        Curated journeys.<br />Unforgettable experiences.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-body-lg text-white/90 mb-10"
                    >
                        Immersive, hand-picked adventures tailored for the discerning traveler.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <button
                            onClick={() => router.push('/tour/search')}
                            className="bg-amber hover:bg-amber-dark text-black px-10 py-4 rounded-full text-body-sm font-medium transition-all transform hover:scale-105 active:scale-95 shadow-xl"
                        >
                            Explore Tours
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Search Section */}
            <section className="relative z-20 -mt-12 max-w-5xl mx-auto px-6">
                <div className="bg-white rounded-[2rem] shadow-2xl p-4 flex flex-wrap md:flex-nowrap items-center gap-2 border border-zinc-100">
                    <div className="flex-1 flex items-center gap-4 px-6 py-4 border-r border-zinc-100">
                        <Search className="text-zinc-400" size={20} />
                        <div className="flex flex-col">
                            <span className="text-caption font-medium uppercase tracking-widest text-zinc-400">Destination</span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Where would you like to go?"
                                className="text-body font-medium text-zinc-900 border-none focus:ring-0 p-0 placeholder:text-zinc-300"
                            />
                        </div>
                    </div>

                    <div className="flex-1 flex items-center gap-4 px-6 py-4 border-r border-zinc-100">
                        <Calendar className="text-zinc-400" size={20} />
                        <div className="flex flex-col">
                            <span className="text-caption font-medium uppercase tracking-widest text-zinc-400">When</span>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="text-body font-medium text-zinc-900 border-none focus:ring-0 p-0 placeholder:text-zinc-300 bg-transparent"
                            />
                        </div>
                    </div>

                    <div className="flex-1 flex items-center gap-4 px-6 py-4">
                        <Users className="text-zinc-400" size={20} />
                        <div className="flex flex-col">
                            <span className="text-caption font-medium uppercase tracking-widest text-zinc-400">Travelers</span>
                            <select
                                value={travelers}
                                onChange={(e) => setTravelers(e.target.value)}
                                className="text-body font-medium text-zinc-900 border-none focus:ring-0 p-0 bg-transparent cursor-pointer"
                            >
                                <option>1 Traveler</option>
                                <option>2 Travelers</option>
                                <option>3 Travelers</option>
                                <option>4+ Travelers</option>
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={handleSearch}
                        className="bg-zinc-900 text-white px-10 py-5 rounded-2xl text-body-sm font-medium hover:bg-zinc-800 transition-all ml-2"
                    >
                        Search
                    </button>
                </div>
            </section>

            {/* Featured Tours */}
            <section className="py-24 max-w-7xl mx-auto px-6">
                <div className="flex items-end justify-between mb-16">
                    <div>
                        <span className="text-amber text-body-sm font-medium tracking-widest uppercase">Our Selection</span>
                        <h2 className="text-heading-xl text-zinc-900 mt-2">Featured Tours</h2>
                    </div>
                    <Link href="/tour/search" className="flex items-center gap-2 text-zinc-900 text-body-sm font-medium hover:gap-3 transition-all">
                        View All Experiences <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {isLoading ? (
                        <div className="col-span-3 py-20 text-center text-body font-medium text-zinc-300">Synchronizing with luxury global desk...</div>
                    ) : tours.length > 0 ? tours.map((tour, i) => (
                        <motion.div
                            key={tour.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="group cursor-pointer"
                        >
                            <Link href={`/tour/${tour.slug}`}>
                                <div className="relative h-[400px] rounded-[2.5rem] overflow-hidden mb-6 shadow-lg transform group-hover:scale-[1.02] transition-all">
                                    <Image src={tour.hero_image || '/tour-img/fallback.jpg'} alt={tour.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-caption font-medium uppercase tracking-widest text-zinc-900">
                                        {tour.duration}
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="space-y-2 px-2">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-heading-sm text-zinc-900">{tour.title}</h3>
                                        <div className="flex gap-0.5">
                                            {[...Array(Math.floor(tour.rating || 5))].map((_, i) => (
                                                <Star key={i} size={14} className="fill-amber text-amber" />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-body text-zinc-500 line-clamp-2 leading-relaxed">
                                        {tour.description}
                                    </p>
                                    <div className="pt-2">
                                        <span className="text-caption font-medium uppercase text-zinc-400 tracking-widest">From</span>
                                        <p className="text-2xl font-black text-amber">₦{Number(tour.price).toLocaleString()} <span className="text-xs text-zinc-400 font-medium">PP</span></p>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    )) : (
                        <div className="col-span-3 py-20 text-center text-body font-medium text-zinc-300">No journeys available. Please check back soon.</div>
                    )}
                </div>
            </section>

            {/* Explore by Theme */}
            <section className="py-24 bg-[#111] text-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 text-center mb-16">
                    <h2 className="text-heading-xl mb-4">Explore by Theme</h2>
                    <p className="text-body-lg text-white/40">Tailor your journey to your personal passions and pursuits.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 px-4 gap-4 max-w-[1600px] mx-auto">
                    {themes.map((theme, i) => (
                        <motion.div
                            key={theme.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="relative h-[450px] rounded-[2rem] overflow-hidden group cursor-pointer"
                        >
                            <Image src={theme.image} alt={theme.name} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all" />
                            <div className="absolute inset-0 flex items-center justify-center p-8 text-center bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            </div>
                            <div className="absolute bottom-10 left-0 right-0 text-center">
                                <h4 className="text-heading-xl text-white tracking-wide">{theme.name}</h4>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Benefits */}
            <section className="py-24 border-b border-zinc-100" style={{ backgroundColor: '#FEDB73' }}>
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16">
                    <div className="flex flex-col items-center text-center space-y-6">
                        <div className="w-16 h-16 rounded-3xl bg-amber/10 flex items-center justify-center text-amber">
                            <ShieldCheck size={32} />
                        </div>
                        <div>
                            <h4 className="text-heading-sm text-zinc-900 mb-3">Expert Curation</h4>
                            <p className="text-body text-zinc-500 leading-relaxed">
                                Every destination is personally vetted by our global travel experts.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center text-center space-y-6">
                        <div className="w-16 h-16 rounded-3xl bg-amber/10 flex items-center justify-center text-amber">
                            <Headset size={32} />
                        </div>
                        <div>
                            <h4 className="text-heading-sm text-zinc-900 mb-3">24/7 Global Support</h4>
                            <p className="text-body text-zinc-500 leading-relaxed">
                                Rest easy knowing our concierge team is always a phone call away.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center text-center space-y-6">
                        <div className="w-16 h-16 rounded-3xl bg-amber/10 flex items-center justify-center text-amber">
                            <Gem size={32} />
                        </div>
                        <div>
                            <h4 className="text-heading-sm text-zinc-900 mb-3">Unmatched Luxury</h4>
                            <p className="text-body text-zinc-500 leading-relaxed">
                                Access exclusive properties and experiences unavailable to the general public.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}
