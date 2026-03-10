'use client'

import api from '@/lib/api';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
    Search,
    MapPin,
    Calendar,
    Users,
    Star,
    Filter,
    ChevronDown,
    Clock,
    Loader2
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function TourSearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Search states
    const [searchData, setSearchData] = useState({
        dest: searchParams.get('dest') || '',
        date: searchParams.get('date') || '',
        travelers: searchParams.get('travelers') || '2 Travelers'
    });

    const [priceRange, setPriceRange] = useState(10000000);
    const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTours = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/tours', {
                params: {
                    location: searchData.dest || undefined,
                    theme: selectedThemes.length > 0 ? selectedThemes[0] : undefined,
                    maxPrice: priceRange.toString()
                }
            });
            setResults(response.data);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTours();
    }, [priceRange, selectedThemes, searchData.dest]);

    const handleThemeToggle = (theme: string) => {
        setSelectedThemes(prev =>
            prev.includes(theme)
                ? prev.filter(t => t !== theme)
                : [...prev, theme]
        );
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'Flexible Dates';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } catch (e) {
            return 'Flexible Dates';
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
            <Navbar />

            {/* Search Summary Header */}
            <div className="bg-white border-b border-zinc-100 py-6 px-6 pt-24 relative z-10">
                <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-6">
                    <div>
                        <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Search Results</h1>
                        <p className="text-zinc-500 font-medium mt-1">
                            {isLoading ? 'Searching...' : `${results.length} exclusive experiences found`}
                        </p>
                    </div>

                    <div className="flex bg-zinc-50 rounded-2xl p-2 border border-zinc-100 gap-4 md:gap-8 px-6 py-3">
                        <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-amber" />
                            <span className="text-sm font-bold text-zinc-900">{searchData.dest || 'Any Destination'}</span>
                        </div>
                        <div className="w-px h-5 bg-zinc-200" />
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-amber" />
                            <span className="text-sm font-bold text-zinc-900">{formatDate(searchData.date)}</span>
                        </div>
                        <div className="w-px h-5 bg-zinc-200 hidden md:block" />
                        <div className="hidden md:flex items-center gap-2">
                            <Users size={16} className="text-amber" />
                            <span className="text-sm font-bold text-zinc-900">{searchData.travelers}</span>
                        </div>
                    </div>
                </div>
            </div>

            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 flex flex-col lg:flex-row gap-10">
                {/* Filters Sidebar */}
                <aside className="w-full lg:w-80 flex flex-col gap-8">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-zinc-100 sticky top-28">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-zinc-900">Filters</h2>
                            <button
                                onClick={() => {
                                    setPriceRange(10000000);
                                    setSelectedThemes([]);
                                }}
                                className="text-[10px] font-black text-amber uppercase tracking-widest hover:opacity-80 transition-opacity"
                            >
                                Reset All
                            </button>
                        </div>

                        {/* Price Range */}
                        <div className="mb-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center text-amber">
                                    <Filter size={18} />
                                </div>
                                <h3 className="font-bold text-zinc-900 tracking-tight">Price Range</h3>
                            </div>
                            <input
                                type="range"
                                min="1000000"
                                max="10000000"
                                step="100000"
                                value={priceRange}
                                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-amber mb-4"
                            />
                            <div className="flex justify-between text-xs font-bold text-zinc-400">
                                <span>₦1,000,000</span>
                                <span className="text-amber">₦{priceRange.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Themes */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400">
                                    <MapPin size={18} />
                                </div>
                                <h3 className="font-bold text-zinc-900 tracking-tight">Travel Styles</h3>
                            </div>
                            <div className="space-y-4">
                                {[
                                    "Culinary Expeditions",
                                    "Wellness Retreats",
                                    "Active Escapes",
                                    "Cultural Journeys"
                                ].map((theme, i) => (
                                    <label key={i} className="flex items-center justify-between group cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div
                                                onClick={() => handleThemeToggle(theme)}
                                                className={`w-5 h-5 rounded border transition-colors flex items-center justify-center ${selectedThemes.includes(theme) ? 'bg-amber border-amber' : 'border-zinc-200 group-hover:border-amber'}`}
                                            >
                                                {selectedThemes.includes(theme) && <div className="w-2 h-2 rounded-full bg-white" />}
                                            </div>
                                            <span className="text-sm font-bold text-zinc-600 group-hover:text-zinc-900">{theme}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Results Area */}
                <div className="flex-1">
                    <div className="flex items-center justify-end mb-8">
                        <select className="bg-transparent text-sm font-black text-zinc-400 uppercase tracking-widest focus:outline-none cursor-pointer">
                            <option>Recommended</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                            <option>Duration</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <AnimatePresence mode="popLayout">
                            {isLoading ? (
                                <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4">
                                    <Loader2 className="w-10 h-10 text-amber animate-spin" />
                                    <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Curating Experiences...</p>
                                </div>
                            ) : results.length > 0 ? results.map((tour, index) => (
                                <motion.div
                                    key={tour.id}
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    layout
                                    className="group cursor-pointer bg-white rounded-[2.5rem] border border-zinc-100 overflow-hidden shadow-sm hover:shadow-xl transition-all"
                                >
                                    <Link href={`/tour/${tour.slug}`}>
                                        <div className="relative h-64 overflow-hidden">
                                            <Image
                                                src={tour.hero_image || '/tour-img/fallback.jpg'}
                                                alt={tour.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-900 flex items-center gap-1.5">
                                                <Clock size={12} className="text-amber" /> {tour.duration}
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div className="p-8">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-amber">
                                                    {(tour.themes && tour.themes[0]) || 'Curated Tour'}
                                                </span>
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, idx) => (
                                                        <Star key={idx} size={12} className="fill-amber text-amber" />
                                                    ))}
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-black text-zinc-900 mb-2 truncate">{tour.title}</h3>
                                            <div className="flex items-center gap-2 text-zinc-400 mb-4">
                                                <MapPin size={14} />
                                                <span className="text-xs font-bold">{tour.location}</span>
                                            </div>

                                            <p className="text-zinc-500 font-medium text-sm line-clamp-2 leading-relaxed mb-6">
                                                {tour.description}
                                            </p>

                                            <div className="flex items-center justify-between pt-6 border-t border-zinc-50">
                                                <div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-1">Price From</span>
                                                    <span className="text-xl font-black text-zinc-900">₦{Number(tour.price).toLocaleString()}</span>
                                                </div>
                                                <div className="w-10 h-10 rounded-full bg-amber/10 flex items-center justify-center group-hover:bg-amber transition-colors">
                                                    <ChevronDown size={16} className="text-amber group-hover:text-black -rotate-90 transition-colors" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            )) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="col-span-full bg-white rounded-[2.5rem] p-20 text-center border-2 border-dashed border-zinc-100"
                                >
                                    <div className="w-20 h-20 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-300 mx-auto mb-6">
                                        <Search size={32} />
                                    </div>
                                    <h3 className="text-xl font-black text-zinc-900 mb-2">No tailored tours found</h3>
                                    <p className="text-zinc-400 font-medium">Adjust your filters or destination to discover more experiences.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function TourSearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-amber border-t-transparent animate-spin" /></div>}>
            <TourSearchContent />
        </Suspense>
    );
}
