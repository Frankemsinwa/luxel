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
        <div className="relative flex-1 min-w-[240px]" ref={dropdownRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`group flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 cursor-pointer border border-transparent hover:border-zinc-200 hover:bg-white/80 ${isOpen ? 'bg-white shadow-md border-zinc-200' : ''}`}
            >
                <div className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${isOpen ? 'bg-amber text-white ring-4 ring-amber/10' : 'bg-zinc-50 text-zinc-400 group-hover:bg-amber group-hover:text-white group-hover:scale-110'}`}>
                    {icon}
                </div>
                <div className="flex flex-col flex-1">
                    <span className="text-[10px] uppercase tracking-[0.1em] text-zinc-400 font-bold mb-0.5">{label}</span>
                    <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-zinc-900 truncate max-w-[160px]">{value || 'Select City'}</span>
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
                                className="w-full bg-zinc-50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-amber/20 outline-none"
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
                                            <p className="text-sm font-bold text-zinc-900">{loc.city}, {loc.country}</p>
                                            <p className="text-[10px] text-zinc-400 font-medium">{loc.name}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-black text-amber bg-amber/10 px-2 py-1 rounded-md">{loc.iataCode}</span>
                                </button>
                            ))}
                            {keyword.length >= 2 && suggestions.length === 0 && !isLoading && (
                                <div className="py-10 text-center">
                                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">No matching gateways found</p>
                                </div>
                            )}
                            {keyword.length < 2 && (
                                <div className="p-4">
                                    <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-4">Popular Local Hubs</p>
                                    <div className="grid grid-cols-1 gap-2">
                                        {['Lagos (LOS)', 'Abuja (ABV)', 'Port Harcourt (PHC)', 'Kano (KAN)'].map(hub => (
                                            <button key={hub} onClick={() => {onChange(hub); setIsOpen(false);}} className="text-left text-xs font-bold text-zinc-600 hover:text-amber py-1 transition-colors flex items-center gap-2">
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
        <div className="relative" ref={dropdownRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`group flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 cursor-pointer border border-transparent hover:border-zinc-200 hover:bg-white/80 ${isOpen ? 'bg-white shadow-md border-zinc-200' : ''}`}
            >
                <div className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${isOpen ? 'bg-amber text-white' : 'bg-zinc-50 text-zinc-400 group-hover:bg-amber group-hover:text-white'}`}>
                    <Users size={18} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-[0.1em] text-zinc-400 font-bold mb-0.5">Travelers</span>
                    <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-zinc-900 whitespace-nowrap">
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
                                        <p className="text-sm font-bold text-zinc-900">{item.label}</p>
                                        <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest">{item.sub}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => updateCount(item.id as any, -1)} className="w-8 h-8 rounded-full border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-amber hover:border-amber transition-all"><Minus size={14} /></button>
                                        <span className="text-sm font-black text-zinc-900 w-4 text-center">{value[item.id as 'adults' | 'children']}</span>
                                        <button onClick={() => updateCount(item.id as any, 1)} className="w-8 h-8 rounded-full border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-amber hover:border-amber transition-all"><Plus size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Class */}
                        <div className="space-y-4">
                            <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em]">Travel Class</p>
                            <div className="grid grid-cols-2 gap-2">
                                {classes.map(c => (
                                    <button
                                        key={c.id}
                                        onClick={() => onChange({ ...value, cabinClass: c.id as any })}
                                        className={`py-2.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
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
                            className="w-full bg-amber text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-amber/20 hover:scale-[1.02] active:scale-95 transition-all"
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
        adults?: string;
        children?: string;
        travelClass?: string;
    }
}) {
    const router = useRouter();
    const [from, setFrom] = useState(initialValues?.from || 'Lagos (LOS)');
    const [to, setTo] = useState(initialValues?.to || 'London (LHR)');
    const [departureDate, setDepartureDate] = useState<Date | undefined>(
        initialValues?.departure ? new Date(initialValues.departure) : new Date()
    );
    const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
    const [travelers, setTravelers] = useState<Travelers>({
        adults: parseInt(initialValues?.adults || '1'),
        children: parseInt(initialValues?.children || '0'),
        cabinClass: (initialValues?.travelClass as any) || 'ECONOMY'
    });

    const handleSearch = () => {
        const params = new URLSearchParams({
            from,
            to,
            departure: departureDate?.toISOString() || '',
            return: returnDate?.toISOString() || '',
            adults: travelers.adults.toString(),
            children: travelers.children.toString(),
            travelClass: travelers.cabinClass
        });
        router.push(`/flights?${params.toString()}`);
    };

    return (
        <section className={className || "relative -mt-24 z-30 px-6 max-w-7xl mx-auto w-full"}>
            <div className="bg-white/70 backdrop-blur-3xl rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] p-4 border border-white relative">
                {/* Premium Accent */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-amber rounded-full opacity-50" />
                
                <div className="flex flex-wrap lg:flex-nowrap items-center gap-2">
                    <AutocompleteDropdown
                        label="From"
                        icon={<PlaneTakeoff size={18} strokeWidth={2.5} />}
                        value={from}
                        onChange={setFrom}
                    />

                    <div className="hidden lg:flex items-center justify-center -mx-4 z-10">
                        <div className="w-12 h-12 bg-white rounded-2xl border border-zinc-100 shadow-xl flex items-center justify-center text-zinc-400 hover:text-amber transition-all cursor-pointer group hover:scale-110 active:scale-95" onClick={() => {const f = from; setFrom(to); setTo(f);}}>
                            <motion.div whileHover={{ rotate: 180 }} transition={{ type: "spring", stiffness: 300 }}>
                                <ChevronRight size={20} strokeWidth={3} />
                            </motion.div>
                        </div>
                    </div>

                    <AutocompleteDropdown
                        label="To"
                        icon={<PlaneLanding size={18} strokeWidth={2.5} />}
                        value={to}
                        onChange={setTo}
                    />

                    <div className="w-[1px] h-12 bg-zinc-100 hidden lg:block mx-3" />

                    <CalendarDropdown
                        label="Departure"
                        selectedDate={departureDate}
                        onSelectDate={setDepartureDate}
                    />

                    <CalendarDropdown
                        label="Return Date"
                        selectedDate={returnDate}
                        onSelectDate={setReturnDate}
                    />

                    <div className="w-[1px] h-12 bg-zinc-100 hidden lg:block mx-3" />

                    <div className="flex-1 lg:flex-none">
                        <TravelersDropdown 
                            value={travelers}
                            onChange={setTravelers}
                        />
                    </div>

                    <div className="pl-4 lg:pl-6 ml-auto lg:ml-0 w-full lg:w-auto mt-4 lg:mt-0">
                        <button
                            onClick={handleSearch}
                            className="bg-zinc-900 text-amber h-16 w-full lg:w-24 rounded-3xl font-bold flex items-center justify-center transition-all shadow-2xl shadow-black/20 cursor-pointer hover:bg-black hover:scale-105 active:scale-95 group"
                        >
                            <Search size={24} strokeWidth={3} className="group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
