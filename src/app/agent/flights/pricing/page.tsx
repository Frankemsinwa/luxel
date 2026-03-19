'use client'

import api from '@/lib/api';
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Plane,
    ArrowRight,
    Loader2,
    DollarSign,
    Save,
    Trash2,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
    X
} from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function FlightPricingPage() {
    const [from, setFrom] = useState('LOS');
    const [to, setTo] = useState('ABV');
    const [flights, setFlights] = useState<any[]>([]);
    const [overrides, setOverrides] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'search' | 'overrides'>('search');

    useEffect(() => {
        fetchOverrides();
    }, []);

    const fetchOverrides = async () => {
        try {
            const response = await api.get('/agent/flight-overrides');
            setOverrides(response.data);
        } catch (error) {
            console.error('Error fetching overrides:', error);
        }
    };

    const handleSearch = async () => {
        if (!from || !to) return;
        setIsLoading(true);
        setFlights([]);
        try {
            // Use today's date for searching available flights
            const today = new Date().toISOString().split('T')[0];
            const response = await api.get('/flights/search', {
                params: {
                    from,
                    to,
                    departureDate: today,
                    adults: '1',
                    travelClass: 'ECONOMY'
                }
            });
            setFlights(response.data.flights || []);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveOverride = async (airlineCode: string, price: number) => {
        setIsSaving(airlineCode);
        try {
            await api.post('/agent/flight-overrides', {
                origin: from.toUpperCase(),
                destination: to.toUpperCase(),
                airline_code: airlineCode.toUpperCase(),
                override_price: price,
                is_active: true
            });
            await fetchOverrides();
            alert('Price override saved successfully!');
        } catch (error) {
            console.error('Save override error:', error);
            alert('Failed to save override.');
        } finally {
            setIsSaving(null);
        }
    };

    const handleDeleteOverride = async (id: string) => {
        if (!confirm('Are you sure you want to remove this override?')) return;
        try {
            await api.delete(`/agent/flight-overrides/${id}`);
            await fetchOverrides();
        } catch (error) {
            console.error('Delete override error:', error);
        }
    };

    const formatNGN = (value: number) =>
        new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            maximumFractionDigits: 0
        }).format(value);

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-heading-lg font-medium text-zinc-900 tracking-tight mb-2">Flight Pricing Control</h1>
                    <p className="text-zinc-500 font-medium">Manipulate the prices customers see for specific routes and airlines.</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-zinc-100 pb-px">
                <button
                    onClick={() => setActiveTab('search')}
                    className={`pb-4 px-2 text-sm font-bold tracking-widest uppercase transition-all relative ${activeTab === 'search' ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
                >
                    Live Search & Overwrite
                    {activeTab === 'search' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-amber" />}
                </button>
                <button
                    onClick={() => setActiveTab('overrides')}
                    className={`pb-4 px-2 text-sm font-bold tracking-widest uppercase transition-all relative ${activeTab === 'overrides' ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
                >
                    Active Overrides ({overrides.length})
                    {activeTab === 'overrides' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-amber" />}
                </button>
            </div>

            {activeTab === 'search' ? (
                <div className="space-y-8">
                    {/* Search Controls */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-zinc-100 shadow-sm flex flex-col md:flex-row items-end gap-6">
                        <div className="flex-1 space-y-3">
                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-2">Origin IATA</label>
                            <div className="relative">
                                <Plane size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300" />
                                <input
                                    value={from}
                                    onChange={(e) => setFrom(e.target.value.toUpperCase())}
                                    placeholder="e.g. LOS"
                                    className="w-full bg-zinc-50 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-zinc-900 focus:ring-2 focus:ring-amber/20 outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-center pb-4 text-zinc-300">
                            <ArrowRight size={20} />
                        </div>
                        <div className="flex-1 space-y-3">
                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-2">Destination IATA</label>
                            <div className="relative">
                                <Plane size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300 -rotate-90" />
                                <input
                                    value={to}
                                    onChange={(e) => setTo(e.target.value.toUpperCase())}
                                    placeholder="e.g. ABV"
                                    className="w-full bg-zinc-50 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-zinc-900 focus:ring-2 focus:ring-amber/20 outline-none"
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleSearch}
                            disabled={isLoading}
                            className="bg-zinc-900 text-white px-10 py-4 rounded-2xl font-bold text-xs tracking-widest uppercase shadow-xl shadow-zinc-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center gap-3"
                        >
                            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                            Search Route
                        </button>
                    </div>

                    {/* Results */}
                    <div className="bg-white rounded-[3rem] border border-zinc-100 shadow-sm overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-50/50">
                                    <th className="px-10 py-6 text-caption font-medium text-zinc-400 uppercase tracking-widest">Airline</th>
                                    <th className="px-10 py-6 text-caption font-medium text-zinc-400 uppercase tracking-widest">Time</th>
                                    <th className="px-10 py-6 text-caption font-medium text-zinc-400 uppercase tracking-widest">Amadeus Price</th>
                                    <th className="px-10 py-6 text-caption font-medium text-zinc-400 uppercase tracking-widest">Control Price (Override)</th>
                                    <th className="px-10 py-6 text-caption font-medium text-zinc-400 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <Loader2 size={32} className="text-amber animate-spin" />
                                                <p className="text-zinc-400 font-medium">Fetching live route data...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : flights.length > 0 ? (
                                    flights.map((flight) => {
                                        const existingOverride = overrides.find(o =>
                                            o.origin === from.toUpperCase() &&
                                            o.destination === to.toUpperCase() &&
                                            o.airline_code === flight.airlineCode
                                        );

                                        return (
                                            <FlightRow
                                                key={flight.id}
                                                flight={flight}
                                                existingOverride={existingOverride}
                                                isSaving={isSaving === flight.airlineCode}
                                                onSave={(price) => handleSaveOverride(flight.airlineCode, price)}
                                            />
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-20 text-center text-zinc-300 font-medium uppercase tracking-widest text-xs italic">
                                            No search results. Perform a route search to begin pricing control.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* Active Overrides Tab */
                <div className="bg-white rounded-[3rem] border border-zinc-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50/50">
                                <th className="px-10 py-6 text-caption font-medium text-zinc-400 uppercase tracking-widest">Route</th>
                                <th className="px-10 py-6 text-caption font-medium text-zinc-400 uppercase tracking-widest">Airline</th>
                                <th className="px-10 py-6 text-caption font-medium text-zinc-400 uppercase tracking-widest">Override Price</th>
                                <th className="px-10 py-6 text-caption font-medium text-zinc-400 uppercase tracking-widest">Status</th>
                                <th className="px-10 py-6 text-caption font-medium text-zinc-400 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {overrides.length > 0 ? overrides.map((o) => (
                                <tr key={o.id} className="hover:bg-zinc-50/50 transition-colors group">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-3 font-black text-zinc-900">
                                            {o.origin} <ArrowRight size={14} className="text-amber" /> {o.destination}
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-[10px] font-black text-zinc-400 border border-zinc-200">
                                                {o.airline_code}
                                            </div>
                                            <span className="text-sm font-bold text-zinc-600">{o.airline_code}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 font-black text-emerald-600">{formatNGN(o.override_price)}</td>
                                    <td className="px-10 py-6">
                                        <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest">Active</span>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <button
                                            onClick={() => handleDeleteOverride(o.id)}
                                            className="p-2 rounded-lg text-zinc-300 hover:text-red-500 hover:bg-red-50 transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center text-zinc-300 font-medium uppercase tracking-widest text-xs">No active price overrides.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function FlightRow({ flight, existingOverride, onSave, isSaving }: {
    flight: any,
    existingOverride: any,
    onSave: (price: number) => void,
    isSaving: boolean
}) {
    const [price, setPrice] = useState(existingOverride ? existingOverride.override_price : flight.price);

    useEffect(() => {
        if (existingOverride) setPrice(existingOverride.override_price);
    }, [existingOverride]);

    const formatNGN = (value: number) =>
        new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            maximumFractionDigits: 0
        }).format(value);

    const isDifferent = price !== (existingOverride ? existingOverride.override_price : flight.price);

    return (
        <tr className="hover:bg-zinc-50/50 transition-colors group">
            <td className="px-10 py-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white border border-zinc-100 flex items-center justify-center p-2 shadow-sm overflow-hidden">
                        <img
                            src={`https://www.gstatic.com/flights/airline_logos/70px/${flight.airlineCode}.png`}
                            alt={flight.airline}
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div>
                        <p className="text-sm font-black text-zinc-900">{flight.airline}</p>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{flight.airlineCode}</p>
                    </div>
                </div>
            </td>
            <td className="px-10 py-6">
                <div className="text-sm font-bold text-zinc-600">
                    {flight.departureTime} <span className="text-zinc-300 mx-1">→</span> {flight.arrivalTime}
                </div>
            </td>
            <td className="px-10 py-6 text-sm font-bold text-zinc-400">
                {formatNGN(flight.price)}
            </td>
            <td className="px-10 py-6">
                <div className="relative w-48">
                    <DollarSign size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" />
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className={`w-full bg-zinc-50 border-2 rounded-xl py-2 pl-10 pr-4 text-sm font-black transition-all ${isDifferent ? 'border-amber ring-2 ring-amber/10' : 'border-transparent'}`}
                    />
                </div>
            </td>
            <td className="px-10 py-6 text-right">
                <div className="flex items-center justify-end gap-2">
                    {existingOverride && !isDifferent ? (
                        <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 uppercase tracking-widest mr-2">
                            <CheckCircle2 size={12} /> Live Override
                        </div>
                    ) : isDifferent ? (
                        <div className="flex items-center gap-1 text-[10px] font-black text-amber uppercase tracking-widest mr-2">
                            <AlertCircle size={12} /> Unsaved Changes
                        </div>
                    ) : null}

                    <button
                        onClick={() => onSave(price)}
                        disabled={isSaving || !isDifferent}
                        className={`p-2.5 rounded-xl transition-all shadow-sm ${isDifferent ? 'bg-zinc-900 text-amber hover:scale-105 active:scale-95' : 'bg-zinc-50 text-zinc-300 grayscale'}`}
                    >
                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    </button>
                </div>
            </td>
        </tr>
    );
}
