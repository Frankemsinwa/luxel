'use client'

import { useState, useRef, useEffect } from 'react';
import CalendarDropdown from './CalendarDropdown';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
    MapPin,
    Users,
    Search,
    ChevronRight,
    PlaneTakeoff,
    PlaneLanding
} from 'lucide-react';

const locations = [
    'Karachi, Pakistan',
    'New York, USA',
    'London, UK',
    'Tokyo, Japan',
    'Dubai, UAE',
];

const passengerOptions = [
    '1 Passenger',
    '2 Passengers',
    '3 Passengers',
    '4+ Passengers',
]

interface DropdownProps {
    options: string[];
    selected: string;
    setSelected: (val: string) => void;
    label: string;
    icon: React.ReactNode;
}

const Dropdown = ({ options, selected, setSelected, label, icon }: DropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.body.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.body.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative flex-1 min-w-[200px]" ref={dropdownRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`group flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 cursor-pointer border border-transparent hover:border-zinc-200 hover:bg-white/80 hover:shadow-sm ${isOpen ? 'bg-white shadow-md border-zinc-200' : ''}`}
            >
                <div className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${isOpen ? 'bg-amber text-white ring-4 ring-amber/10' : 'bg-zinc-50 text-zinc-400 group-hover:bg-amber group-hover:text-white group-hover:scale-110'}`}>
                    {icon}
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-[0.1em] text-zinc-400 font-bold mb-0.5">{label}</span>
                    <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-zinc-900 line-clamp-1">{selected}</span>
                        <ChevronRight
                            size={12}
                            className={`text-amber transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`}
                        />
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                        className="absolute top-full left-0 mt-3 w-full bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/20 z-[100] overflow-hidden"
                    >
                        <div className="p-2">
                            {options.map(option => (
                                <div
                                    key={option}
                                    onClick={() => {
                                        setSelected(option);
                                        setIsOpen(false);
                                    }}
                                    className={`p-3 text-sm font-medium rounded-xl cursor-pointer transition-colors flex items-center justify-between ${selected === option ? 'bg-amber/10 text-amber' : 'text-zinc-600 hover:bg-zinc-50'}`}
                                >
                                    {option}
                                    {selected === option && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default function SearchBar({ className, initialValues }: {
    className?: string;
    initialValues?: {
        from?: string;
        to?: string;
        departure?: string;
        passengers?: string;
    }
}) {
    const router = useRouter();
    const [from, setFrom] = useState(initialValues?.from || locations[0]);
    const [to, setTo] = useState(initialValues?.to || locations[1]);
    const [departureDate, setDepartureDate] = useState<Date | undefined>(
        initialValues?.departure ? new Date(initialValues.departure) : new Date()
    );
    const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
    const [passengers, setPassengers] = useState(initialValues?.passengers || passengerOptions[0]);

    const handleSearch = () => {
        const params = new URLSearchParams({
            from: from || '',
            to: to || '',
            departure: departureDate?.toISOString() || '',
            return: returnDate?.toISOString() || '',
            passengers: passengers || ''
        });
        router.push(`/flights?${params.toString()}`);
    };

    return (
        <section className={className || "relative -mt-24 z-30 px-6 max-w-7xl mx-auto w-full"}>
            <div className="bg-white/70 backdrop-blur-2xl rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-3 border border-white">
                <div className="flex flex-wrap lg:flex-nowrap items-center gap-1">
                    <Dropdown
                        options={locations}
                        selected={from}
                        setSelected={setFrom}
                        label="From"
                        icon={<PlaneTakeoff size={18} strokeWidth={2.5} />}
                    />

                    <div className="hidden lg:flex items-center justify-center -mx-4 z-10">
                        <div className="w-10 h-10 bg-white rounded-full border border-zinc-100 shadow-sm flex items-center justify-center text-zinc-400 hover:text-amber transition-colors cursor-pointer group">
                            <motion.div whileHover={{ rotate: 180 }} transition={{ type: "spring", stiffness: 300 }}>
                                <ChevronRight size={18} />
                            </motion.div>
                        </div>
                    </div>

                    <Dropdown
                        options={locations}
                        selected={to}
                        setSelected={setTo}
                        label="To"
                        icon={<PlaneLanding size={18} strokeWidth={2.5} />}
                    />

                    <div className="w-[1px] h-12 bg-zinc-100 hidden lg:block mx-2" />

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

                    <div className="w-[1px] h-12 bg-zinc-100 hidden lg:block mx-2" />

                    <Dropdown
                        options={passengerOptions}
                        selected={passengers}
                        setSelected={setPassengers}
                        label="Passengers"
                        icon={<Users size={18} strokeWidth={2.5} />}
                    />

                    <button
                        onClick={handleSearch}
                        className="bg-amber text-white h-16 w-full lg:w-16 rounded-[22px] font-bold flex items-center justify-center transition-all shadow-lg shadow-amber/20 ml-2 cursor-pointer hover:bg-amber-dark hover:scale-105 active:scale-95"
                    >
                        <Search size={24} strokeWidth={3} />
                    </button>
                </div>
            </div>
        </section>
    );
}
