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
    X,
    Calendar,
    Plus,
    Clock,
    Info,
    LayoutGrid,
    PlaneTakeoff,
    PlaneLanding
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import LocationPicker from '@/components/LocationPicker';
import CalendarDropdown from '@/components/CalendarDropdown';
import { format, addDays, isBefore, startOfDay } from 'date-fns';

export default function FlightPricingPage() {
    const [from, setFrom] = useState('Lagos (LOS)');
    const [to, setTo] = useState('Abuja (ABV)');
    const [departureDate, setDepartureDate] = useState<Date | undefined>(new Date());

    const [flights, setFlights] = useState<any[]>([]);
    const [overrides, setOverrides] = useState<any[]>([]);
    const [manualFlights, setManualFlights] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'search' | 'overrides' | 'manual'>('search');
    
    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        refreshData();
    }, []);

    const refreshData = async () => {
        try {
            const [ovResp, manOvResp] = await Promise.all([
                api.get('/agent/flight-overrides'),
                api.get('/agent/manual-flights')
            ]);
            setOverrides(ovResp.data);
            setManualFlights(manOvResp.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const extractIATA = (val: string) => {
        const match = val.match(/\(([A-Z]{3})\)/);
        return match ? match[1] : val.toUpperCase();
    };

    const handleSearch = async () => {
        if (!from || !to || !departureDate) return;
        const originCode = extractIATA(from);
        const destinationCode = extractIATA(to);
        
        setIsLoading(true);
        setFlights([]);
        try {
            const dateStr = format(departureDate, 'yyyy-MM-dd');
            const response = await api.get('/flights/search', {
                params: {
                    from: originCode,
                    to: destinationCode,
                    departureDate: dateStr,
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

    const handleSaveOverride = async (origin: string, destination: string, airlineCode: string, price: number, duration: string) => {
        const key = `${origin}-${destination}-${airlineCode}`;
        setIsSaving(key);
        try {
            let validUntil = null;
            if (duration === 'TODAY') {
                validUntil = addDays(startOfDay(new Date()), 1).toISOString();
            } else if (duration !== 'ALWAYS') {
                validUntil = new Date(duration).toISOString();
            }

            const dateStr = departureDate ? format(departureDate, 'yyyy-MM-dd') : null;

            await api.post('/agent/flight-overrides', {
                origin: origin.toUpperCase(),
                destination: destination.toUpperCase(),
                airline_code: airlineCode.toUpperCase(),
                override_price: price,
                departure_date: dateStr,
                valid_until: validUntil,
                is_active: true
            });
            await refreshData();
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
            await refreshData();
        } catch (error) {
            console.error('Delete override error:', error);
        }
    };

    const handleDeleteManualFlight = async (id: string) => {
        if (!confirm('Delete this manual flight result?')) return;
        try {
            await api.delete(`/agent/manual-flights/${id}`);
            await refreshData();
        } catch (error) {
            console.error('Delete manual flight error:', error);
        }
    };

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-heading-lg font-medium text-zinc-900 tracking-tight mb-2">Elite Flight Controls</h1>
                    <p className="text-zinc-500 font-medium">Full dominion over flight availability and pricing.</p>
                </div>
                <button 
                    onClick={() => setShowCreateModal(true)}
                    className="bg-amber text-black px-6 py-3 rounded-2xl font-bold text-xs tracking-widest uppercase hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-amber/20"
                >
                    <Plus size={18} />
                    Create Manual Flight
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-8 border-b border-zinc-100 pb-px overflow-x-auto no-scrollbar">
                <button
                    onClick={() => setActiveTab('search')}
                    className={`pb-4 px-2 text-sm font-bold tracking-widest uppercase transition-all whitespace-nowrap relative ${activeTab === 'search' ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
                >
                    Live Search & Overwrite
                    {activeTab === 'search' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-amber" />}
                </button>
                <button
                    onClick={() => setActiveTab('overrides')}
                    className={`pb-4 px-2 text-sm font-bold tracking-widest uppercase transition-all whitespace-nowrap relative ${activeTab === 'overrides' ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
                >
                    Active Overrides ({overrides.length})
                    {activeTab === 'overrides' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-amber" />}
                </button>
                <button
                    onClick={() => setActiveTab('manual')}
                    className={`pb-4 px-2 text-sm font-bold tracking-widest uppercase transition-all whitespace-nowrap relative ${activeTab === 'manual' ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
                >
                    Manual Listings ({manualFlights.length})
                    {activeTab === 'manual' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-amber" />}
                </button>
            </div>

            {activeTab === 'search' ? (
                <div className="space-y-8">
                    {/* Search Controls */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-zinc-100 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-end gap-6">
                        <div className="flex-[1.5]">
                            <LocationPicker
                                label="Origin"
                                icon={<PlaneTakeoff size={18} strokeWidth={2.5} />}
                                value={from}
                                onChange={setFrom}
                                className="w-full"
                            />
                        </div>
                        <div className="hidden lg:flex items-center justify-center pb-4 text-zinc-300">
                            <ArrowRight size={20} />
                        </div>
                        <div className="flex-[1.5]">
                            <LocationPicker
                                label="Destination"
                                icon={<PlaneLanding size={18} strokeWidth={2.5} />}
                                value={to}
                                onChange={setTo}
                                className="w-full"
                            />
                        </div>
                        <div className="flex-1">
                            <CalendarDropdown 
                                label="Departure"
                                selectedDate={departureDate}
                                onSelectDate={setDepartureDate}
                            />
                        </div>

                        <button
                            onClick={handleSearch}
                            disabled={isLoading}
                            className="bg-zinc-900 text-white px-10 py-4 rounded-2xl font-bold text-xs tracking-widest uppercase shadow-xl shadow-zinc-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3 h-[64px]"
                        >
                            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                            Search Route
                        </button>
                    </div>

                    {/* Results */}
                    <div className="bg-white rounded-[3rem] border border-zinc-100 shadow-sm overflow-hidden overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                            <thead>
                                <tr className="bg-zinc-50/50">
                                    <th className="px-10 py-6 text-caption font-medium text-zinc-400 uppercase tracking-widest">Airline</th>
                                    <th className="px-10 py-6 text-caption font-medium text-zinc-400 uppercase tracking-widest">Flight Details</th>
                                    <th className="px-10 py-6 text-caption font-medium text-zinc-400 uppercase tracking-widest">Amadeus Price</th>
                                    <th className="px-10 py-6 text-caption font-medium text-zinc-400 uppercase tracking-widest">Override Logic</th>
                                    <th className="px-10 py-6 text-caption font-medium text-zinc-400 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="py-32 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <Loader2 size={40} className="text-amber animate-spin" />
                                                <p className="text-zinc-400 font-medium text-lg">Fetching live market data...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : flights.length > 0 ? (
                                    flights.map((flight) => {
                                        const originCode = extractIATA(from);
                                        const destinationCode = extractIATA(to);
                                        const dateStr = departureDate ? format(departureDate, 'yyyy-MM-dd') : null;
                                        
                                        const existingOverride = overrides.find(o =>
                                            o.origin === originCode &&
                                            o.destination === destinationCode &&
                                            o.airline_code === flight.airlineCode &&
                                            (o.departure_date === dateStr || (!o.departure_date && !dateStr))
                                        );

                                        return (
                                            <FlightRow
                                                key={flight.id}
                                                flight={flight}
                                                existingOverride={existingOverride}
                                                isSaving={isSaving === `${originCode}-${destinationCode}-${flight.airlineCode}`}
                                                onSave={(price, duration) => handleSaveOverride(originCode, destinationCode, flight.airlineCode, price, duration)}
                                            />
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-32 text-center">
                                            <div className="max-w-md mx-auto">
                                                <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-300 mx-auto mb-6">
                                                    <Search size={32} />
                                                </div>
                                                <h3 className="text-zinc-900 font-bold mb-2">No results for this date</h3>
                                                <p className="text-zinc-400 mb-8">Amadeus returned no options. Would you like to create a custom flight listing for this route manually?</p>
                                                <button 
                                                    onClick={() => setShowCreateModal(true)}
                                                    className="bg-zinc-900 text-amber px-8 py-4 rounded-2xl font-bold text-xs tracking-widest uppercase hover:scale-105 active:scale-95 transition-all"
                                                >
                                                    Build Manual Flight Result
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : activeTab === 'overrides' ? (
                /* Active Overrides Tab */
                <div className="bg-white rounded-[3rem] border border-zinc-100 shadow-sm overflow-hidden overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-zinc-50/50">
                                <th className="px-10 py-6 text-caption font-medium text-zinc-400 uppercase tracking-widest">Route & Date</th>
                                <th className="px-10 py-6 text-caption font-medium text-zinc-400 uppercase tracking-widest">Airline</th>
                                <th className="px-10 py-6 text-caption font-medium text-zinc-400 uppercase tracking-widest">Price</th>
                                <th className="px-10 py-6 text-caption font-medium text-zinc-400 uppercase tracking-widest">Status/Expiry</th>
                                <th className="px-10 py-6 text-caption font-medium text-zinc-400 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {overrides.length > 0 ? overrides.map((o) => (
                                <ActiveOverrideRow
                                    key={o.id}
                                    override={o}
                                    isSaving={isSaving === `${o.origin}-${o.destination}-${o.airline_code}`}
                                    onSave={(price, duration) => handleSaveOverride(o.origin, o.destination, o.airline_code, price, duration)}
                                    onDelete={() => handleDeleteOverride(o.id)}
                                />
                            )) : (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center text-zinc-300 font-medium uppercase tracking-widest text-xs italic">No active price overrides.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                /* Manual Listings Tab */
                <div className="bg-white rounded-[3rem] border border-zinc-100 shadow-sm overflow-hidden overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-zinc-50/50">
                                <th className="px-10 py-6 text-caption font-medium text-zinc-400 uppercase tracking-widest">Route & Date</th>
                                <th className="px-10 py-6 text-caption font-medium text-zinc-400 uppercase tracking-widest">Airline</th>
                                <th className="px-10 py-6 text-caption font-medium text-zinc-400 uppercase tracking-widest">Schedule</th>
                                <th className="px-10 py-6 text-caption font-medium text-zinc-400 uppercase tracking-widest">Price</th>
                                <th className="px-10 py-6 text-caption font-medium text-zinc-400 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {manualFlights.length > 0 ? manualFlights.map((f) => (
                                <tr key={f.id} className="hover:bg-zinc-50/50 transition-colors group">
                                    <td className="px-10 py-6">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-3 font-black text-zinc-900 mb-1">
                                                {f.origin} <ArrowRight size={14} className="text-amber" /> {f.destination}
                                            </div>
                                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                                <Calendar size={10} /> {f.departure_date}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-[10px] font-black text-zinc-400 border border-zinc-200">
                                                {f.airline_code}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-zinc-900">{f.airline_name}</span>
                                                <span className="text-[10px] font-bold text-zinc-400 uppercase">{f.airline_code}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-zinc-900">{f.departure_time} - {f.arrival_time}</span>
                                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{f.duration} • {f.stops}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 font-black text-zinc-900">
                                        ₦{Number(f.price).toLocaleString()}
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <button
                                            onClick={() => handleDeleteManualFlight(f.id)}
                                            className="p-2.5 rounded-xl text-zinc-300 hover:text-red-500 hover:bg-red-50 transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center text-zinc-300 font-medium uppercase tracking-widest text-xs italic">No manual flight listings created.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Create Manual Flight Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            onClick={() => setShowCreateModal(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-md" 
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl border border-white/20 overflow-hidden"
                        >
                            <ManualFlightForm 
                                onClose={() => setShowCreateModal(false)} 
                                onCreated={() => {
                                    setShowCreateModal(false);
                                    refreshData();
                                }}
                                defaultData={{
                                    origin: extractIATA(from),
                                    destination: extractIATA(to),
                                    departure_date: departureDate ? format(departureDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
                                }}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function ManualFlightForm({ onClose, onCreated, defaultData }: { onClose: () => void, onCreated: () => void, defaultData: any }) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        origin: defaultData.origin || '',
        destination: defaultData.destination || '',
        departure_date: defaultData.departure_date || '',
        airline_code: '',
        airline_name: '',
        departure_time: '12:00',
        arrival_time: '14:30',
        duration: '2h 30m',
        stops: 'Non-stop',
        price: 0
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Auto-generate a beautiful non-stop itinerary
            const itineraries = [{
                duration: formData.duration,
                segments: [{
                    departure: {
                        iataCode: formData.origin,
                        at: `${formData.departure_date}T${formData.departure_time}:00`
                    },
                    arrival: {
                        iataCode: formData.destination,
                        at: `${formData.departure_date}T${formData.arrival_time}:00`
                    },
                    carrierCode: formData.airline_code,
                    carrierName: formData.airline_name,
                    logo: `https://www.gstatic.com/flights/airline_logos/70px/${formData.airline_code}.png`,
                    duration: formData.duration,
                    number: "LX-" + Math.floor(100 + Math.random() * 900), // Random flight number
                    aircraft: "PRIVATE",
                    id: "1"
                }]
            }];

            await api.post('/agent/manual-flights', {
                ...formData,
                itineraries
            });
            onCreated();
        } catch (error) {
            console.error('Submit error:', error);
            alert('Failed to create flight.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-10 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-zinc-900">Create Manual Result</h2>
                    <p className="text-zinc-500 text-sm font-medium">Inject a custom flight offer into the user search results.</p>
                </div>
                <button type="button" onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full text-zinc-400 transition-colors">
                    <X size={20} />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-2">Origin Code</label>
                    <input 
                        required
                        value={formData.origin}
                        onChange={e => setFormData({...formData, origin: e.target.value.toUpperCase()})}
                        className="w-full bg-zinc-50 border-2 border-transparent focus:border-amber rounded-2xl p-4 text-sm font-black transition-all outline-none" 
                        placeholder="LOS"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-2">Destination Code</label>
                    <input 
                        required
                        value={formData.destination}
                        onChange={e => setFormData({...formData, destination: e.target.value.toUpperCase()})}
                        className="w-full bg-zinc-50 border-2 border-transparent focus:border-amber rounded-2xl p-4 text-sm font-black transition-all outline-none" 
                        placeholder="ABV"
                    />
                </div>
                <div className="space-y-2 col-span-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-2">Departure Date</label>
                    <input 
                        required
                        type="date"
                        value={formData.departure_date}
                        onChange={e => setFormData({...formData, departure_date: e.target.value})}
                        className="w-full bg-zinc-50 border-2 border-transparent focus:border-amber rounded-2xl p-4 text-sm font-black transition-all outline-none" 
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-2">Airline Code</label>
                    <input 
                        required
                        value={formData.airline_code}
                        onChange={e => setFormData({...formData, airline_code: e.target.value.toUpperCase()})}
                        className="w-full bg-zinc-50 border-2 border-transparent focus:border-amber rounded-2xl p-4 text-sm font-black transition-all outline-none" 
                        placeholder="QI"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-2">Airline Name</label>
                    <input 
                        required
                        value={formData.airline_name}
                        onChange={e => setFormData({...formData, airline_name: e.target.value})}
                        className="w-full bg-zinc-50 border-2 border-transparent focus:border-amber rounded-2xl p-4 text-sm font-black transition-all outline-none" 
                        placeholder="Ibom Air"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-2">Dep. Time</label>
                    <input 
                        required
                        value={formData.departure_time}
                        onChange={e => setFormData({...formData, departure_time: e.target.value})}
                        className="w-full bg-zinc-50 border-2 border-transparent focus:border-amber rounded-2xl p-4 text-sm font-black transition-all outline-none" 
                        placeholder="08:00"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-2">Arr. Time</label>
                    <input 
                        required
                        value={formData.arrival_time}
                        onChange={e => setFormData({...formData, arrival_time: e.target.value})}
                        className="w-full bg-zinc-50 border-2 border-transparent focus:border-amber rounded-2xl p-4 text-sm font-black transition-all outline-none" 
                        placeholder="09:15"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-2">Duration</label>
                    <input 
                        required
                        value={formData.duration}
                        onChange={e => setFormData({...formData, duration: e.target.value})}
                        className="w-full bg-zinc-50 border-2 border-transparent focus:border-amber rounded-2xl p-4 text-sm font-black transition-all outline-none" 
                        placeholder="1h 15m"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-2">Stops</label>
                    <select 
                        required
                        value={formData.stops}
                        onChange={e => setFormData({...formData, stops: e.target.value})}
                        className="w-full bg-zinc-50 border-2 border-transparent focus:border-amber rounded-2xl p-4 text-sm font-black transition-all outline-none appearance-none cursor-pointer" 
                    >
                        <option value="Non-stop">Non-stop</option>
                        <option value="1 STOP(S)">1 Stop(s)</option>
                    </select>
                </div>
                <div className="space-y-2 col-span-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-2">Price (NGN)</label>
                    <div className="relative">
                        <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" />
                        <input 
                            required
                            type="number"
                            value={formData.price}
                            onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                            className="w-full bg-zinc-50 border-2 border-transparent focus:border-amber rounded-2xl p-4 pl-10 text-lg font-black transition-all outline-none" 
                        />
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
                <button 
                    type="button" 
                    onClick={onClose}
                    className="flex-1 px-8 py-5 rounded-2xl border border-zinc-100 text-sm font-bold tracking-widest uppercase hover:bg-zinc-50 transition-all"
                >
                    Cancel
                </button>
                <button 
                    disabled={isLoading}
                    className="flex-[2] bg-zinc-900 text-amber px-8 py-5 rounded-2xl text-sm font-bold tracking-widest uppercase hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-zinc-200 flex items-center justify-center gap-3"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    Finalize Listing
                </button>
            </div>
        </form>
    );
}

function FlightRow({ flight, existingOverride, onSave, isSaving }: {
    flight: any,
    existingOverride: any,
    onSave: (price: number, duration: string) => void,
    isSaving: boolean
}) {
    const [price, setPrice] = useState(existingOverride ? existingOverride.override_price : flight.price);
    const [duration, setDuration] = useState('ALWAYS');

    useEffect(() => {
        if (existingOverride) {
            setPrice(existingOverride.override_price);
            if (existingOverride.valid_until) {
                // Simplified for the demo, would normally parse to specific UI state
                setDuration('TODAY');
            }
        }
    }, [existingOverride]);

    const isDifferent = price !== (existingOverride ? Number(existingOverride.override_price) : flight.price);

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
                <div className="flex flex-col">
                    <div className="text-sm font-bold text-zinc-900">
                        {flight.departureTime} <span className="text-zinc-300 mx-1">→</span> {flight.arrivalTime}
                    </div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{flight.duration} • {flight.stops}</span>
                </div>
            </td>
            <td className="px-10 py-6 text-sm font-bold text-zinc-400">
                ₦{flight.price.toLocaleString()}
            </td>
            <td className="px-10 py-6">
                <div className="flex flex-col gap-3">
                    <div className="relative">
                        <DollarSign size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" />
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            className={`w-full bg-zinc-50 border-2 rounded-xl py-2 pl-10 pr-4 text-sm font-black transition-all ${isDifferent ? 'border-amber ring-2 ring-amber/10' : 'border-transparent'}`}
                        />
                    </div>
                    <select 
                        value={duration}
                        onChange={e => setDuration(e.target.value)}
                        className="bg-transparent text-[10px] font-black text-zinc-400 uppercase tracking-widest focus:outline-none cursor-pointer border-none"
                    >
                        <option value="ALWAYS">Always Active</option>
                        <option value="TODAY">Today Only</option>
                    </select>
                </div>
            </td>
            <td className="px-10 py-6 text-right">
                <div className="flex items-center justify-end gap-2">
                    {existingOverride && !isDifferent ? (
                        <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 uppercase tracking-widest mr-2">
                            <CheckCircle2 size={12} /> Active
                        </div>
                    ) : isDifferent ? (
                        <div className="flex items-center gap-1 text-[10px] font-black text-amber uppercase tracking-widest mr-2">
                            <AlertCircle size={12} /> Pending
                        </div>
                    ) : null}

                    <button
                        onClick={() => onSave(price, duration)}
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

function ActiveOverrideRow({ override, onSave, onDelete, isSaving }: {
    override: any,
    onSave: (price: number, duration: string) => void,
    onDelete: () => void,
    isSaving: boolean
}) {
    const [price, setPrice] = useState(Number(override.override_price));
    const [duration, setDuration] = useState(override.valid_until ? 'TODAY' : 'ALWAYS');

    const isDifferent = price !== Number(override.override_price);

    return (
        <tr className="hover:bg-zinc-50/50 transition-colors group">
            <td className="px-10 py-6">
                <div className="flex flex-col">
                    <div className="flex items-center gap-3 font-black text-zinc-900 mb-1">
                        {override.origin} <ArrowRight size={14} className="text-amber" /> {override.destination}
                    </div>
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                        {override.departure_date ? (
                            <><Calendar size={10} /> {override.departure_date}</>
                        ) : (
                            <><LayoutGrid size={10} /> Global Route Override</>
                        )}
                    </span>
                </div>
            </td>
            <td className="px-10 py-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-[10px] font-black text-zinc-400 border border-zinc-200">
                        {override.airline_code}
                    </div>
                    <span className="text-sm font-bold text-zinc-600">{override.airline_code}</span>
                </div>
            </td>
            <td className="px-10 py-6">
                <div className="relative w-40">
                    <DollarSign size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" />
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className={`w-full bg-zinc-50 border-2 rounded-xl py-2 pl-10 pr-4 text-sm font-black transition-all ${isDifferent ? 'border-amber ring-2 ring-amber/10' : 'border-transparent'}`}
                    />
                </div>
            </td>
            <td className="px-10 py-6">
                <div className="flex flex-col">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest w-fit mb-1 ${override.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {override.is_active ? 'Active' : 'Inactive'}
                    </span>
                    {override.valid_until && (
                        <span className="text-[9px] font-bold text-zinc-400 uppercase flex items-center gap-1">
                            <Clock size={8} /> Expires: {format(new Date(override.valid_until), 'MMM dd, HH:mm')}
                        </span>
                    )}
                </div>
            </td>
            <td className="px-10 py-6 text-right">
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => onSave(price, duration)}
                        disabled={isSaving || !isDifferent}
                        className={`p-2.5 rounded-xl transition-all shadow-sm ${isDifferent ? 'bg-zinc-900 text-amber hover:scale-105 active:scale-95' : 'bg-zinc-50 text-zinc-300 grayscale opacity-50'}`}
                    >
                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-2.5 rounded-xl text-zinc-300 hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </td>
        </tr>
    );
}
