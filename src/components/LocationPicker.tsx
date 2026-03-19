'use client'

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin,
    Search,
    ChevronDown,
    Building2,
    Loader2
} from 'lucide-react';
import api from '@/lib/api';

interface Location {
    name: string;
    iataCode: string;
    city: string;
    country: string;
    type: string;
}

interface LocationPickerProps {
    label: string;
    icon: React.ReactNode;
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    className?: string;
}

export default function LocationPicker({ 
    label, 
    icon, 
    value, 
    onChange,
    placeholder = 'Select City',
    className = ''
}: LocationPickerProps) {
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
        <div className={`relative ${className}`} ref={dropdownRef}>
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
                        <span className="text-body font-medium text-zinc-900 truncate max-w-[160px]">{value || placeholder}</span>
                        <ChevronDown size={12} className={`text-amber transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: 10 }}
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
}
