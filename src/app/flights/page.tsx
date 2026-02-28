'use client'

import { useState, useEffect, Suspense } from 'react';
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

const initialFlightResults = [
    {
        id: 1,
        airline: "British Airways",
        logo: "BA",
        departureTime: "10:30",
        departureCode: "LHR",
        departureCity: "London",
        arrivalTime: "18:45",
        arrivalCode: "JFK",
        arrivalCity: "New York",
        duration: "8h 15m",
        stops: "NON-STOP",
        price: 540
    },
    {
        id: 2,
        airline: "British Airways",
        logo: "BA",
        departureTime: "12:15",
        departureCode: "LHR",
        departureCity: "London",
        arrivalTime: "20:30",
        arrivalCode: "JFK",
        arrivalCity: "New York",
        duration: "8h 15m",
        stops: "NON-STOP",
        price: 620
    },
    {
        id: 3,
        airline: "Virgin Atlantic",
        logo: "VA",
        departureTime: "14:00",
        departureCode: "LHR",
        departureCity: "London",
        arrivalTime: "22:15",
        arrivalCode: "JFK",
        arrivalCity: "New York",
        duration: "8h 15m",
        stops: "NON-STOP",
        price: 580
    },
    {
        id: 4,
        airline: "American Airlines",
        logo: "AA",
        departureTime: "16:45",
        departureCode: "LHR",
        departureCity: "London",
        arrivalTime: "01:00",
        arrivalCode: "JFK",
        arrivalCity: "New York",
        duration: "8h 15m",
        stops: "NON-STOP",
        price: 510
    }
];

function FlightsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Search states
    const [searchData, setSearchData] = useState({
        from: searchParams.get('from') || 'London (LHR)',
        to: searchParams.get('to') || 'New York (JFK)',
        departure: searchParams.get('departure') || '',
        passengers: searchParams.get('passengers') || '1 Passenger'
    });

    // Update searchData when URL params change
    useEffect(() => {
        setSearchData({
            from: searchParams.get('from') || 'London (LHR)',
            to: searchParams.get('to') || 'New York (JFK)',
            departure: searchParams.get('departure') || '',
            passengers: searchParams.get('passengers') || '1 Passenger'
        });
        // Collapse search bar after updating
        setIsModifyingSearch(false);
    }, [searchParams]);

    // Filter states
    const [isModifyingSearch, setIsModifyingSearch] = useState(false);
    const [priceRange, setPriceRange] = useState(1500);
    const [selectedAirlines, setSelectedAirlines] = useState<string[]>(["British Airways", "Virgin Atlantic", "American Airlines"]);
    const [results, setResults] = useState(initialFlightResults);

    useEffect(() => {
        const filtered = initialFlightResults.filter(flight => {
            const matchesPrice = flight.price <= priceRange;
            const matchesAirline = selectedAirlines.includes(flight.airline);
            return matchesPrice && matchesAirline;
        });

        // Update airport codes based on search data for realism
        const dynamicResults = filtered.map(flight => ({
            ...flight,
            departureCity: searchData.from.split(',')[0],
            departureCode: searchData.from.includes('(') ? searchData.from.match(/\((.*?)\)/)?.[1] || 'LHR' : 'LHR',
            arrivalCity: searchData.to.split(',')[0],
            arrivalCode: searchData.to.includes('(') ? searchData.to.match(/\((.*?)\)/)?.[1] || 'JFK' : 'JFK',
        }));

        setResults(dynamicResults);
    }, [priceRange, selectedAirlines, searchData]);

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
        <div className="min-h-screen bg-zinc-50 flex flex-col">
            <Navbar />

            {/* Search Summary Bar */}
            <div className="bg-white border-b border-zinc-100 pt-32 pb-6 px-6 relative z-[40]">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-wrap items-center justify-between gap-10">
                        <div className="flex flex-wrap items-center gap-12">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Flight Route</span>
                                <span className="text-sm font-bold text-zinc-900">{searchData.from} to {searchData.to}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Dates</span>
                                <span className="text-sm font-bold text-zinc-900">{formatDate(searchData.departure)}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Travelers</span>
                                <span className="text-sm font-bold text-zinc-900">{searchData.passengers}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsModifyingSearch(!isModifyingSearch)}
                            className="flex items-center gap-2 text-amber font-bold text-sm hover:opacity-80 transition-opacity"
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
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-zinc-100">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-zinc-900">Filters</h2>
                            <button
                                onClick={() => {
                                    setPriceRange(1500);
                                    setSelectedAirlines(["British Airways", "Virgin Atlantic", "American Airlines"]);
                                }}
                                className="text-xs font-bold text-amber hover:underline uppercase tracking-widest"
                            >
                                Reset
                            </button>
                        </div>

                        {/* Price Range */}
                        <div className="mb-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center text-amber">
                                    <Filter size={18} />
                                </div>
                                <h3 className="font-bold text-zinc-900">Price Range</h3>
                            </div>
                            <input
                                type="range"
                                min="200"
                                max="1500"
                                value={priceRange}
                                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-amber mb-4"
                            />
                            <div className="flex justify-between text-xs font-bold text-zinc-400 tracking-tighter">
                                <span>$200</span>
                                <span className="text-amber">${priceRange}</span>
                                <span>$1,500</span>
                            </div>
                        </div>

                        {/* Airlines */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400">
                                    <Plane size={18} />
                                </div>
                                <h3 className="font-bold text-zinc-900">Airlines</h3>
                            </div>
                            <div className="space-y-4">
                                {[
                                    "British Airways",
                                    "Virgin Atlantic",
                                    "American Airlines"
                                ].map((airline, i) => (
                                    <label key={i} className="flex items-center justify-between group cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div
                                                onClick={() => handleAirlineToggle(airline)}
                                                className={`w-5 h-5 rounded border transition-colors flex items-center justify-center ${selectedAirlines.includes(airline) ? 'bg-amber border-amber' : 'border-zinc-200 group-hover:border-amber'}`}
                                            >
                                                {selectedAirlines.includes(airline) && <div className="w-2 h-2 rounded-full bg-white" />}
                                            </div>
                                            <span className="text-sm font-medium text-zinc-600 group-hover:text-zinc-900">{airline}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Results Area */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-lg font-bold text-zinc-900">{results.length} results found for your search</h2>
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Sort by:</span>
                            <select className="bg-transparent text-sm font-bold text-zinc-900 focus:outline-none cursor-pointer">
                                <option>Recommended</option>
                                <option>Cheapest</option>
                                <option>Fastest</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <AnimatePresence mode="popLayout">
                            {results.length > 0 ? results.map((flight) => (
                                <motion.div
                                    key={flight.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    layout
                                    className="bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-sm border border-zinc-100 flex flex-col lg:flex-row items-center gap-10 hover:shadow-xl hover:scale-[1.01] transition-all group"
                                >
                                    {/* Flight Info */}
                                    <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 items-center gap-8 md:gap-4">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 font-black group-hover:bg-amber/10 group-hover:text-amber transition-colors">
                                                <div className="text-xs font-black">{flight.logo}</div>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-zinc-900">{flight.departureTime}</div>
                                                <div className="text-xs font-medium text-zinc-400 tracking-widest">{flight.departureCode} • {flight.departureCity}</div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center justify-center px-4">
                                            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">{flight.duration}</div>
                                            <div className="relative w-full h-[2px] bg-zinc-100 mb-2">
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 border-2 border-amber bg-white rounded-full group-hover:scale-125 transition-transform" />
                                                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1.5 h-1.5 bg-zinc-300 rounded-full" />
                                                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1.5 h-1.5 bg-zinc-300 rounded-full" />
                                            </div>
                                            <div className="text-[10px] font-bold text-amber uppercase tracking-widest">{flight.stops}</div>
                                        </div>

                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-zinc-900">{flight.arrivalTime}</div>
                                            <div className="text-xs font-medium text-zinc-400 tracking-widest">{flight.arrivalCode}-{flight.arrivalCity}</div>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="w-px h-24 bg-zinc-100 hidden lg:block" />

                                    {/* Pricing & Action */}
                                    <div className="w-full lg:w-48 text-center lg:text-right">
                                        <div className="text-4xl font-bold text-zinc-900 mb-1">${flight.price}</div>
                                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-6">Round-trip per person</div>
                                        <button
                                            onClick={() => {
                                                const params = new URLSearchParams({
                                                    ...Object.fromEntries(searchParams.entries()),
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
                                            className="w-full bg-amber text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-amber/20 hover:bg-amber-dark hover:scale-105 active:scale-95 transition-all"
                                        >
                                            Select
                                        </button>
                                    </div>
                                </motion.div>
                            )) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-white rounded-[2.5rem] p-20 text-center border-2 border-dashed border-zinc-100"
                                >
                                    <div className="w-20 h-20 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-300 mx-auto mb-6">
                                        <Search size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-zinc-900 mb-2">No flights found</h3>
                                    <p className="text-zinc-400 font-light">Try adjusting your filters to find more options.</p>
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

export default function FlightsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <FlightsContent />
        </Suspense>
    );
}
