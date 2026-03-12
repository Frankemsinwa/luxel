'use client'

import { useState, useRef, useEffect, useCallback } from 'react';
import CalendarDropdown from './CalendarDropdown';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
    MapPin,
    Users,
    Search,
    ChevronRight,
    PlaneTakeoff,
    PlaneLanding,
    ChevronDown,
    Plus,
    Minus,
    Gem,
    Building2,
    Loader2
} from 'lucide-react';
import api from '@/lib/api';

// --- Types ---
interface Location {
    name: string;
    iataCode: string;
    city: string;
    country: string;
    type: string;
}

interface Travelers {
    adults: number;
    children: number;
    cabinClass: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
}

// --- Autocomplete Dropdown ---
const AutocompleteDropdown = ({ 
    label, 
    icon, 
    value, 
    onChange 
}: { 
    label: string; 
    icon: React.ReactNode; 
    value: string; 
    onChange: (val: string) => void;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [suggestions, setSuggestions] = useState<Location[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fetch locations from backend
    const fetchLocations = useCallback(async (query: string) => {
        if (query.length < 2) return;
        setIsLoading(true);
        try {
            const res = await api.get(`/flights/locations?keyword=${query}`);
            setSuggestions(res.data);
        } catch (err) {
            console.error('Location search failed:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (keyword) fetchLocations(keyword);
        }, 300);
        return () => clearTimeout(timer);
    }, [keyword, fetchLocations]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative flex-1 min-w-0 min-w-[220px] lg:min-w-[200px]" ref={dropdownRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`group flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 cursor-pointer border border-transparent hover:border-zinc-200 hover:bg-white/80 ${isOpen ? 'bg-white shadow-md border-zinc-200' : ''}`}
            >
                <div className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${isOpen ? 'bg-amber text-white ring-4 ring-amber/10' : 'bg-zinc-50 text-zinc-400 group-hover:bg-amber group-hover:text-white group-hover:scale-110'}`}>
                    {icon}
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-caption font-medium uppercase tracking-[0.1em] text-zinc-400 mb-0.5">{label}</span>
                    <div className="flex items-center gap-1.5">
                        <span className="text-body font-medium text-zinc-900 truncate max-w-[160px]">{value || 'Select City'}</span>
                        <ChevronDown size={12} className={`text-amber transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 mt-3 w-[320px] bg-white rounded-3xl shadow-2xl border border-zinc-100 z-[100] overflow-hidden p-3"
                    >
                        <div className="relative mb-3">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search city or airport..."
                                className="w-full bg-zinc-50 border-none rounded-2xl py-3 pl-12 pr-4 text-body font-medium focus:ring-2 focus:ring-amber/20 outline-none"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                autoFocus
                            />
                            {isLoading && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-amber" size={16} />}
                        </div>

                        <div className="max-h-[280px] overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                            {suggestions.map((loc) => (
                                <button
                                    key={loc.iataCode}
                                    onClick={() => {
                                        onChange(`${loc.city} (${loc.iataCode})`);
                                        setIsOpen(false);
                                    }}
                                    className="w-full text-left p-3 rounded-xl hover:bg-amber/5 group transition-colors flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-amber group-hover:text-white transition-colors">
                                            <MapPin size={14} />
                                        </div>
                                        <div>
                                            <p className="text-body font-medium text-zinc-900">{loc.city}, {loc.country}</p>
                                            <p className="text-caption text-zinc-400 font-medium">{loc.name}</p>
                                        </div>
                                    </div>
                                    <span className="text-caption font-medium text-amber bg-amber/10 px-2 py-1 rounded-md">{loc.iataCode}</span>
                                </button>
                            ))}
                            {keyword.length >= 2 && suggestions.length === 0 && !isLoading && (
                                <div className="py-10 text-center">
                                    <p className="text-body-sm font-medium text-zinc-400 uppercase tracking-widest">No matching gateways found</p>
                                </div>
                            )}
                            {keyword.length < 2 && (
                                <div className="p-4">
                                    <p className="text-caption font-medium text-zinc-300 uppercase tracking-widest mb-4">Popular Local Hubs</p>
                                    <div className="grid grid-cols-1 gap-2">
                                        {['Lagos (LOS)', 'Abuja (ABV)', 'Port Harcourt (PHC)', 'Kano (KAN)'].map(hub => (
                                            <button key={hub} onClick={() => {onChange(hub); setIsOpen(false);}} className="text-left text-body-sm font-medium text-zinc-600 hover:text-amber py-1 transition-colors flex items-center gap-2">
                                                <Building2 size={12} /> {hub}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- Travelers & Class Dropdown ---
const TravelersDropdown = ({ value, onChange }: { value: Travelers; onChange: (v: Travelers) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const updateCount = (type: 'adults' | 'children', delta: number) => {
        const newVal = Math.max(type === 'adults' ? 1 : 0, value[type] + delta);
        onChange({ ...value, [type]: newVal });
    };

    const classes = [
        { id: 'ECONOMY', label: 'Economy' },
        { id: 'PREMIUM_ECONOMY', label: 'Premium' },
        { id: 'BUSINESS', label: 'Business' },
        { id: 'FIRST', label: 'First Class' },
    ];

    return (
        <div className="relative min-w-0" ref={dropdownRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`group flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 cursor-pointer border border-transparent hover:border-zinc-200 hover:bg-white/80 ${isOpen ? 'bg-white shadow-md border-zinc-200' : ''}`}
            >
                <div className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${isOpen ? 'bg-amber text-white' : 'bg-zinc-50 text-zinc-400 group-hover:bg-amber group-hover:text-white'}`}>
                    <Users size={18} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="text-caption font-medium uppercase tracking-[0.1em] text-zinc-400 mb-0.5">Travelers</span>
                    <div className="flex items-center gap-1.5">
                        <span className="text-body font-medium text-zinc-900 truncate">
                            {value.adults + value.children} Pax, {classes.find(c => c.id === value.cabinClass)?.label}
                        </span>
                        <ChevronDown size={12} className={`text-amber transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full right-0 mt-3 w-[300px] bg-white rounded-3xl shadow-2xl border border-zinc-100 z-[100] p-6 space-y-8"
                    >
                        {/* Counts */}
                        <div className="space-y-6">
                            {[
                                { id: 'adults', label: 'Adults', sub: 'Ages 12+' },
                                { id: 'children', label: 'Children', sub: 'Ages 2-11' }
                            ].map(item => (
                                <div key={item.id} className="flex items-center justify-between">
                                    <div>
                                        <p className="text-body font-medium text-zinc-900">{item.label}</p>
                                        <p className="text-caption text-zinc-400 font-medium uppercase tracking-widest">{item.sub}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => updateCount(item.id as any, -1)} className="w-8 h-8 rounded-full border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-amber hover:border-amber transition-all"><Minus size={14} /></button>
                                        <span className="text-body font-medium text-zinc-900 w-4 text-center">{value[item.id as 'adults' | 'children']}</span>
                                        <button onClick={() => updateCount(item.id as any, 1)} className="w-8 h-8 rounded-full border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-amber hover:border-amber transition-all"><Plus size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Class */}
                        <div className="space-y-4">
                            <p className="text-caption font-medium text-zinc-300 uppercase tracking-[0.2em]">Travel Class</p>
                            <div className="grid grid-cols-2 gap-2">
                                {classes.map(c => (
                                    <button
                                        key={c.id}
                                        onClick={() => onChange({ ...value, cabinClass: c.id as any })}
                                        className={`py-2.5 px-4 rounded-xl text-caption font-medium uppercase tracking-widest transition-all border ${
                                            value.cabinClass === c.id 
                                            ? 'bg-zinc-900 text-amber border-zinc-900 shadow-lg' 
                                            : 'bg-zinc-50 text-zinc-400 border-transparent hover:bg-zinc-100'
                                        }`}
                                    >
                                        {c.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button 
                            onClick={() => setIsOpen(false)}
                            className="w-full bg-amber text-white py-4 rounded-2xl text-body-sm font-medium uppercase tracking-widest shadow-xl shadow-amber/20 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            Confirm Selection
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- Main SearchBar ---
export default function SearchBar({ className, initialValues }: {
    className?: string;
    initialValues?: {
        from?: string;
        to?: string;
        departure?: string;
        return?: string;
        tripType?: 'ONE_WAY' | 'ROUND_TRIP';
        adults?: string;
        children?: string;
        travelClass?: string;
    }
}) {
    const router = useRouter();
    const [from, setFrom] = useState(initialValues?.from || 'Lagos (LOS)');
    const [to, setTo] = useState(initialValues?.to || 'London (LHR)');
    const [tripType, setTripType] = useState<'ONE_WAY' | 'ROUND_TRIP'>(() => {
        if (initialValues?.tripType) return initialValues.tripType;
        if (initialValues?.return) return 'ROUND_TRIP';
        return 'ONE_WAY';
    });
    const [departureDate, setDepartureDate] = useState<Date | undefined>(
        initialValues?.departure ? new Date(initialValues.departure) : new Date()
    );
    const [returnDate, setReturnDate] = useState<Date | undefined>(
        initialValues?.return ? new Date(initialValues.return) : undefined
    );
    const [travelers, setTravelers] = useState<Travelers>({
        adults: parseInt(initialValues?.adults || '1'),
        children: parseInt(initialValues?.children || '0'),
        cabinClass: (initialValues?.travelClass as any) || 'ECONOMY'
    });

    // If the user switches to one-way, clear the return date so we don't send stale params.
    useEffect(() => {
        if (tripType !== 'ROUND_TRIP') setReturnDate(undefined);
    }, [tripType]);

    const handleSearch = () => {
        const params = new URLSearchParams();
        params.set('from', from);
        params.set('to', to);
        params.set('departure', departureDate?.toISOString() || '');
        params.set('tripType', tripType);
        if (tripType === 'ROUND_TRIP' && returnDate) {
            params.set('return', returnDate.toISOString());
        }
        params.set('adults', travelers.adults.toString());
        params.set('children', travelers.children.toString());
        params.set('travelClass', travelers.cabinClass);
        router.push(`/flights?${params.toString()}`);
    };

    return (
        <section className={className || "relative -mt-24 z-30 px-6 max-w-7xl mx-auto w-full"}>
            <div className="bg-white/70 backdrop-blur-3xl rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] p-4 border border-white relative">
                {/* Premium Accent */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-amber rounded-full opacity-50" />

                {/* Mobile Trip Type */}
                <div className="md:hidden mb-2">
                    <div className="bg-white/60 backdrop-blur-xl border border-white rounded-2xl shadow-sm p-1 flex items-center gap-1 w-fit">
                        <button
                            type="button"
                            onClick={() => setTripType('ONE_WAY')}
                            className={`px-3 py-2 rounded-xl text-caption font-medium uppercase tracking-widest transition-colors ${tripType === 'ONE_WAY' ? 'bg-zinc-900 text-amber' : 'text-zinc-500'}`}
                        >
                            One way
                        </button>
                        <button
                            type="button"
                            onClick={() => setTripType('ROUND_TRIP')}
                            className={`px-3 py-2 rounded-xl text-caption font-medium uppercase tracking-widest transition-colors ${tripType === 'ROUND_TRIP' ? 'bg-zinc-900 text-amber' : 'text-zinc-500'}`}
                        >
                            Return
                        </button>
                    </div>
                </div>

                {/* Desktop Trip Type: floats and doesn't consume horizontal space */}
                <div className="absolute -top-4 right-6 z-20 hidden md:flex">
                    <div className="bg-white/80 backdrop-blur-xl border border-white rounded-2xl shadow-lg p-1 flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => setTripType('ONE_WAY')}
                            className={`px-3 py-2 rounded-xl text-caption font-medium uppercase tracking-widest transition-colors ${tripType === 'ONE_WAY' ? 'bg-zinc-900 text-amber' : 'text-zinc-500 hover:text-zinc-900'}`}
                        >
                            One way
                        </button>
                        <button
                            type="button"
                            onClick={() => setTripType('ROUND_TRIP')}
                            className={`px-3 py-2 rounded-xl text-caption font-medium uppercase tracking-widest transition-colors ${tripType === 'ROUND_TRIP' ? 'bg-zinc-900 text-amber' : 'text-zinc-500 hover:text-zinc-900'}`}
                        >
                            Return
                        </button>
                    </div>
                </div>

                {/* Systematic grid: never overflows; wraps at breakpoints */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 items-stretch">
                    <div className="relative min-w-0">
                        <AutocompleteDropdown
                            label="From"
                            icon={<PlaneTakeoff size={18} strokeWidth={2.5} />}
                            value={from}
                            onChange={setFrom}
                        />
                        {/* Swap overlay, does not take layout width */}
                        <div className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20">
                            <button
                                type="button"
                                className="w-10 h-10 bg-white rounded-2xl border border-zinc-100 shadow-xl flex items-center justify-center text-zinc-400 hover:text-amber transition-all hover:scale-110 active:scale-95"
                                onClick={() => { const f = from; setFrom(to); setTo(f); }}
                                aria-label="Swap origin and destination"
                            >
                                <motion.div whileHover={{ rotate: 180 }} transition={{ type: "spring", stiffness: 300 }}>
                                    <ChevronRight size={18} strokeWidth={3} />
                                </motion.div>
                            </button>
                        </div>
                    </div>

                    <AutocompleteDropdown
                        label="To"
                        icon={<PlaneLanding size={18} strokeWidth={2.5} />}
                        value={to}
                        onChange={setTo}
                    />

                    <CalendarDropdown
                        label="Departure"
                        selectedDate={departureDate}
                        onSelectDate={setDepartureDate}
                    />

                    <CalendarDropdown
                        label="Return Date"
                        selectedDate={returnDate}
                        onSelectDate={setReturnDate}
                        disabled={tripType !== 'ROUND_TRIP'}
                        disabledText="Not needed"
                    />

                    <TravelersDropdown 
                        value={travelers}
                        onChange={setTravelers}
                    />

                    <button
                        onClick={handleSearch}
                        className="bg-zinc-900 text-amber h-16 w-full rounded-3xl text-body-sm font-medium flex items-center justify-center transition-all shadow-2xl shadow-black/20 cursor-pointer hover:bg-black hover:scale-105 active:scale-95 group"
                    >
                        <Search size={24} strokeWidth={3} className="group-hover:scale-110 transition-transform" />
                    </button>
                </div>
            </div>
        </section>
    );
}
