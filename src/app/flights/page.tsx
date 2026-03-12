'use client'

import api from '@/lib/api';
import { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import { motion, AnimatePresence } from "framer-motion";
// ... icons
import {
    Search,
    ChevronRight,
    Filter,
    Clock,
    Calendar,
    User,
    PenTool,
    ChevronDown,
    Plane
} from "lucide-react";

const initialFlightResults: any[] = [];

function FlightsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);

    // Search states
    const [searchData, setSearchData] = useState({
        from: searchParams.get('from') || 'London (LHR)',
        to: searchParams.get('to') || 'New York (JFK)',
        departure: searchParams.get('departure') || '',
        return: searchParams.get('return') || '',
        tripType: (searchParams.get('tripType') as any) || '',
        adults: searchParams.get('adults') || '1',
        children: searchParams.get('children') || '0',
        travelClass: searchParams.get('travelClass') || 'ECONOMY',
        passengers: `${Number(searchParams.get('adults') || 1) + Number(searchParams.get('children') || 0)} Passenger${(Number(searchParams.get('adults') || 1) + Number(searchParams.get('children') || 0)) > 1 ? 's' : ''}`
    });

    // Update searchData when URL params change
    useEffect(() => {
        setSearchData({
            from: searchParams.get('from') || 'London (LHR)',
            to: searchParams.get('to') || 'New York (JFK)',
            departure: searchParams.get('departure') || '',
            return: searchParams.get('return') || '',
            tripType: (searchParams.get('tripType') as any) || '',
            adults: searchParams.get('adults') || '1',
            children: searchParams.get('children') || '0',
            travelClass: searchParams.get('travelClass') || 'ECONOMY',
            passengers: `${Number(searchParams.get('adults') || 1) + Number(searchParams.get('children') || 0)} Passenger${(Number(searchParams.get('adults') || 1) + Number(searchParams.get('children') || 0)) > 1 ? 's' : ''}`
        });
        // Collapse search bar after updating
        setIsModifyingSearch(false);
    }, [searchParams]);

    // Filter states
    const [isModifyingSearch, setIsModifyingSearch] = useState(false);
    const [priceRange, setPriceRange] = useState(3500000);
    const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
    const [results, setResults] = useState(initialFlightResults);

    const availableAirlines = useMemo(() => {
        const uniques = new Set<string>();
        for (const f of results as any[]) {
            const a = (f?.airline || '').toString().trim();
            if (a) uniques.add(a);
        }
        return Array.from(uniques).sort((a, b) => a.localeCompare(b));
    }, [results]);

    const airlineCounts = useMemo(() => {
        const map = new Map<string, number>();
        for (const f of results as any[]) {
            const a = (f?.airline || '').toString().trim();
            if (!a) continue;
            map.set(a, (map.get(a) || 0) + 1);
        }
        return map;
    }, [results]);

    // On a fresh result set, default to "all airlines selected" so filters match what's on screen.
    useEffect(() => {
        setSelectedAirlines(availableAirlines);
    }, [availableAirlines]);

    const filteredResults = useMemo(() => {
        return (results as any[]).filter((f) => {
            const airline = (f?.airline || '').toString().trim();
            const inAirlines = selectedAirlines.length === 0
                ? availableAirlines.length === 0
                : selectedAirlines.includes(airline);
            const inPrice = typeof f?.price === 'number' ? f.price <= priceRange : true;
            return inAirlines && inPrice;
        });
    }, [results, selectedAirlines, priceRange, availableAirlines.length]);

    // Fetch from Backend Express API
    useEffect(() => {
        const fetchFlights = async () => {
            setIsLoading(true);
            setResults([]); // Clear previous results while loading
            try {
                const response = await api.get('/flights/search', {
                    params: {
                        from: searchData.from,
                        to: searchData.to,
                        departureDate: searchData.departure || new Date().toISOString(),
                        returnDate: searchData.return || undefined,
                        tripType: (searchData.tripType || (searchData.return ? 'ROUND_TRIP' : 'ONE_WAY')),
                        adults: searchData.adults,
                        children: searchData.children,
                        travelClass: searchData.travelClass
                    }
                });

                if (response.data.flights) {
                    setResults(response.data.flights);
                } else {
                    setResults([]);
                }
            } catch (error) {
                console.error('Error fetching flights:', error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFlights();
    }, [searchData]);

    const handleAirlineToggle = (airline: string) => {
        setSelectedAirlines(prev =>
            prev.includes(airline)
                ? prev.filter(a => a !== airline)
                : [...prev, airline]
        );
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'Oct 12, 2026';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } catch (e) {
            return 'Oct 12, 2026';
        }
    };

    return (
        <div className="min-h-screen bg-amber/5 flex flex-col">
            <Navbar />

            {/* Search Summary Bar */}
            <div className="bg-white border-b border-zinc-100 pt-32 pb-6 px-6 relative z-[40]">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-wrap items-center justify-between gap-10">
                        <div className="flex flex-wrap items-center gap-12">
                            <div className="flex flex-col">
                                <span className="text-caption font-medium text-zinc-400 uppercase tracking-widest mb-1">Flight Route</span>
                                <span className="text-body font-medium text-zinc-900">{searchData.from} to {searchData.to}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-caption font-medium text-zinc-400 uppercase tracking-widest mb-1">Dates</span>
                                <span className="text-body font-medium text-zinc-900">{formatDate(searchData.departure)}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-caption font-medium text-zinc-400 uppercase tracking-widest mb-1">Travelers</span>
                                <span className="text-body font-medium text-zinc-900">{searchData.passengers}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsModifyingSearch(!isModifyingSearch)}
                            className="flex items-center gap-2 text-amber text-body-sm font-medium hover:opacity-80 transition-opacity"
                        >
                            <span>{isModifyingSearch ? 'Close' : 'Modify Search'}</span>
                            <div className={`w-8 h-8 rounded-full bg-amber/10 flex items-center justify-center transition-transform ${isModifyingSearch ? 'rotate-180' : ''}`}>
                                <ChevronDown size={14} />
                            </div>
                        </button>
                    </div>

                    <AnimatePresence>
                        {isModifyingSearch && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-visible"
                            >
                                <div className="pt-8 pb-4">
                                    <SearchBar
                                        className="w-full relative !mt-0"
                                        initialValues={searchData}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 flex flex-col lg:flex-row gap-10">

                {/* Filters Sidebar */}
                <aside className="w-full lg:w-80 flex flex-col gap-8">
                    <div className="bg-black p-8 rounded-[2.5rem] shadow-sm border border-white/10">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-heading-sm text-white">Filters</h2>
                            <button
                                 onClick={() => {
                                     setPriceRange(3500000);
                                     setSelectedAirlines(availableAirlines);
                                 }}
                                 className="text-caption font-medium text-white/60 hover:underline uppercase tracking-widest"
                             >
                                 Reset
                            </button>
                        </div>

                        {/* Price Range */}
                        <div className="mb-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                                    <Filter size={18} />
                                </div>
                                <h3 className="text-heading-sm text-white">Price Range</h3>
                            </div>
                            <input
                                type="range"
                                min="100000"
                                max="3500000"
                                step="50000"
                                value={priceRange}
                                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber mb-4"
                            />
                            <div className="flex justify-between text-[10px] font-black text-white/50 tracking-widest uppercase">
                                <span>₦100k</span>
                                <span className="text-white">₦{(priceRange / 1000).toFixed(0)}k</span>
                                <span>₦3.5M</span>
                            </div>
                        </div>

                        {/* Airlines */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                                    <Plane size={18} />
                                </div>
                                <h3 className="text-heading-sm text-white">Airlines</h3>
                            </div>
                             <div className="space-y-4">
                                {availableAirlines.length > 0 ? availableAirlines.map((airline, i) => (
                                    <label key={i} className="flex items-center justify-between group cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div
                                                onClick={() => handleAirlineToggle(airline)}
                                                className={`w-5 h-5 rounded border transition-colors flex items-center justify-center ${selectedAirlines.includes(airline) ? 'bg-amber border-amber' : 'border-white/30 group-hover:border-white'}`}
                                            >
                                                {selectedAirlines.includes(airline) && <div className="w-2 h-2 rounded-full bg-black" />}
                                            </div>
                                            <span className="text-body-sm text-white/70 group-hover:text-white">
                                                {airline}
                                                <span className="text-white/40 ml-2">({airlineCounts.get(airline) || 0})</span>
                                            </span>
                                        </div>
                                    </label>
                                )) : (
                                    <p className="text-body-sm font-medium text-white/50">No airlines yet</p>
                                )}
                             </div>
                         </div>
                     </div>
                 </aside>

                {/* Results Area */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-heading-sm text-black">{filteredResults.length} results found for your search</h2>
                        <div className="flex items-center gap-4">
                            <span className="text-caption font-medium text-black/50 uppercase tracking-widest">Sort by:</span>
                            <select className="bg-transparent text-body-sm font-medium text-black focus:outline-none cursor-pointer">
                                <option>Recommended</option>
                                <option>Cheapest</option>
                                <option>Fastest</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        {isLoading ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-32 bg-white/50 backdrop-blur-sm rounded-[2.5rem] border border-black/5"
                            >
                                <motion.div
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        rotate: [0, 10, -10, 0]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="w-32 h-32 rounded-full bg-amber/10 flex items-center justify-center mb-8 relative"
                                >
                                    <motion.div
                                        animate={{
                                            opacity: [0.5, 1, 0.5],
                                            scale: [0.8, 1.2, 0.8]
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                        className="absolute inset-0 rounded-full bg-amber/20"
                                    />
                                    <Search size={48} className="text-amber relative z-10" />
                                </motion.div>
                                <h3 className="text-2xl font-bold text-black mb-3">Searching for flights...</h3>
                                <p className="text-black/60 font-medium tracking-wide">Scanning airlines for the best options</p>
                            </motion.div>
                        ) : (
                            <AnimatePresence mode="popLayout">
                                {filteredResults.length > 0 ? filteredResults.map((flight) => (
                                    <motion.div
                                        key={flight.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        layout
                                        className="bg-flight-card rounded-[2.5rem] p-8 lg:p-10 shadow-sm border border-black/5 flex flex-col lg:flex-row items-center gap-10 hover:shadow-xl hover:scale-[1.01] transition-all group"
                                    >
                                        {/* Flight Info */}
                                        <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 items-center gap-8 md:gap-4">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center p-3 border border-black/5 group-hover:bg-white transition-colors overflow-hidden relative">
                                                    <img
                                                        src={`/flight-logos/${flight.airline}.png`}
                                                        alt={flight.airline}
                                                        className="w-full h-full object-contain relative z-10"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.style.display = 'none';
                                                            const fallback = target.nextElementSibling as HTMLElement;
                                                            if (fallback) fallback.style.display = 'flex';
                                                        }}
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-50 text-zinc-400">
                                                        <span className="text-[10px] font-black uppercase tracking-tighter">
                                                            {flight.airline || 'Air'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-2xl font-semibold text-black">{flight.departureTime}</div>
                                                    <div className="text-sm font-medium text-black/60 tracking-widest">{flight.departureCode} • {flight.departureCity}</div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-center justify-center px-4">
                                                <div className="text-[10px] font-semibold text-black/50 uppercase tracking-widest mb-3">{flight.duration}</div>
                                                <div className="relative w-full h-[2px] bg-black/10 mb-2">
                                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 border-2 border-black bg-amber rounded-full group-hover:scale-125 transition-transform" />
                                                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1.5 h-1.5 bg-black/30 rounded-full" />
                                                    <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1.5 h-1.5 bg-black/30 rounded-full" />
                                                </div>
                                                <div className="text-[10px] font-semibold text-black uppercase tracking-widest">{flight.stops}</div>
                                            </div>

                                            <div className="text-right">
                                                <div className="text-2xl font-semibold text-black">{flight.arrivalTime}</div>
                                                <div className="text-sm font-medium text-black/60 tracking-widest">{flight.arrivalCode}-{flight.arrivalCity}</div>
                                            </div>
                                        </div>

                                        {/* Divider */}
                                        <div className="w-px h-24 bg-black/10 hidden lg:block" />

                                        {/* Pricing & Action */}
                                        <div className="w-full lg:w-48 text-center lg:text-right">
                                            <div className="text-4xl font-semibold text-black mb-1">₦{flight.price.toLocaleString()}</div>
                                            <div className="text-[10px] font-semibold text-black/50 uppercase tracking-widest mb-6">Round-trip per person</div>
                                            <button
                                                onClick={() => {
                                                    const params = new URLSearchParams({
                                                        ...Object.fromEntries(searchParams.entries()),
                                                        id: flight.id,
                                                        price: flight.price.toString(),
                                                        airline: flight.airline,
                                                        logo: flight.logo,
                                                        depTime: flight.departureTime,
                                                        depCode: flight.departureCode,
                                                        depCity: flight.departureCity,
                                                        arrTime: flight.arrivalTime,
                                                        arrCode: flight.arrivalCode,
                                                        arrCity: flight.arrivalCity,
                                                        duration: flight.duration,
                                                        stops: flight.stops
                                                    });
                                                    router.push(`/flights/details?${params.toString()}`);
                                                }}
                                                className="w-full bg-black text-flight-card py-4 rounded-2xl font-semibold text-sm shadow-lg shadow-black/20 hover:bg-black/80 hover:scale-105 active:scale-95 transition-all"
                                            >
                                                Select
                                            </button>
                                        </div>
                                    </motion.div>
                                )) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="bg-flight-card rounded-[2.5rem] p-20 text-center border-2 border-dashed border-black/20"
                                    >
                                        <div className="w-20 h-20 rounded-full bg-black/10 flex items-center justify-center text-black/30 mx-auto mb-6">
                                            <Search size={32} />
                                        </div>
                                        {results.length === 0 ? (
                                            <>
                                                <h3 className="text-heading-sm text-black mb-2">No flights found</h3>
                                                <p className="text-body-sm font-medium text-black/50">Try adjusting your search to find more options.</p>
                                            </>
                                        ) : (
                                            <>
                                                <h3 className="text-heading-sm text-black mb-2">No flights match your filters</h3>
                                                <p className="text-body-sm font-medium text-black/50 mb-6">Try widening the price range or selecting more airlines.</p>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setPriceRange(3500000);
                                                        setSelectedAirlines(availableAirlines);
                                                    }}
                                                    className="text-caption font-medium text-amber uppercase tracking-widest hover:underline"
                                                >
                                                    Reset filters
                                                </button>
                                            </>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function FlightsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <FlightsContent />
        </Suspense>
    );
}
