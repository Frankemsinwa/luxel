'use client'

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
    Clock
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const initialTourResults = [
    {
        id: 'tuscan-silk-road',
        title: 'The Tuscan Silk Road',
        description: 'Culinary excellence through the rolling hills of Italy focusing on fine wines and truffles.',
        image: '/tour-img/img-1.jpg',
        price: 4200,
        duration: '7 Days',
        rating: 5,
        theme: 'Culinary Expeditions',
        location: 'Tuscany, Italy'
    },
    {
        id: 'kyoto-zen-retreat',
        title: 'Kyoto Zen Retreat',
        description: 'Mindful immersion in the ancient temples of Japan with exclusive tea ceremonies.',
        image: '/tour-img/img-2.jpg',
        price: 3800,
        duration: '5 Days',
        rating: 5,
        theme: 'Wellness Retreats',
        location: 'Kyoto, Japan'
    },
    {
        id: 'wilderness-refined',
        title: 'Wilderness Refined',
        description: 'Ultimate luxury safari experience in the Serengeti with private guides.',
        image: '/tour-img/img-3.jpg',
        price: 9500,
        duration: '10 Days',
        rating: 5,
        theme: 'Active Escapes',
        location: 'Serengeti, Tanzania'
    },
    {
        id: 'moroccan-mosaic',
        title: 'Moroccan Mosaic',
        description: 'Vibrant markets, sweeping deserts, and secluded riad sanctuaries.',
        image: '/tour-img/img-4.jpg',
        price: 3200,
        duration: '6 Days',
        rating: 4,
        theme: 'Cultural Journeys',
        location: 'Marrakech, Morocco'
    },
    {
        id: 'swiss-alpine-grand',
        title: 'Swiss Alpine Grand Retreat',
        description: 'Ski-in, ski-out chalets and thermal spas in the shadow of the Matterhorn.',
        image: '/tour-img/img-5.jpg',
        price: 12400,
        duration: '7 Days',
        rating: 5,
        theme: 'Wellness Retreats',
        location: 'Zermatt, Switzerland'
    },
    {
        id: 'patagonia-extreme',
        title: 'Patagonia Edge of the World',
        description: 'Glacier trekking and luxury lodging at the southern tip of the Americas.',
        image: '/tour-img/img-6.jpg',
        price: 7800,
        duration: '9 Days',
        rating: 5,
        theme: 'Active Escapes',
        location: 'Patagonia, Chile'
    }
];

function TourSearchContent() {
    const searchParams = useSearchParams();

    // Search states
    const [searchData, setSearchData] = useState({
        dest: searchParams.get('dest') || '',
        date: searchParams.get('date') || '',
        travelers: searchParams.get('travelers') || '2 Travelers'
    });

    const [priceRange, setPriceRange] = useState(15000);
    const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
    const [results, setResults] = useState(initialTourResults);

    useEffect(() => {
        let filtered = initialTourResults.filter(tour => tour.price <= priceRange);

        if (selectedThemes.length > 0) {
            filtered = filtered.filter(tour => selectedThemes.includes(tour.theme));
        }

        // Simple search logic for demonstration
        if (searchData.dest) {
            const query = searchData.dest.toLowerCase();
            filtered = filtered.filter(tour =>
                tour.title.toLowerCase().includes(query) ||
                tour.location.toLowerCase().includes(query)
            );
        }

        setResults(filtered);
    }, [priceRange, selectedThemes, searchData]);

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
                            {results.length} exclusive experiences found
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
                                    setPriceRange(15000);
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
                                min="1000"
                                max="15000"
                                step="500"
                                value={priceRange}
                                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-amber mb-4"
                            />
                            <div className="flex justify-between text-xs font-bold text-zinc-400">
                                <span>$1,000</span>
                                <span className="text-amber">${priceRange.toLocaleString()}</span>
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
                            {results.length > 0 ? results.map((tour, index) => (
                                <motion.div
                                    key={tour.id}
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    layout
                                    className="group cursor-pointer bg-white rounded-[2.5rem] border border-zinc-100 overflow-hidden shadow-sm hover:shadow-xl transition-all"
                                >
                                    <Link href={`/tour/${tour.id}`}>
                                        <div className="relative h-64 overflow-hidden">
                                            <Image
                                                src={tour.image}
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
                                                <span className="text-[10px] font-black uppercase tracking-widest text-amber">{tour.theme}</span>
                                                <div className="flex gap-0.5">
                                                    {[...Array(tour.rating)].map((_, idx) => (
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
                                                    <span className="text-xl font-black text-zinc-900">${tour.price.toLocaleString()}</span>
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
