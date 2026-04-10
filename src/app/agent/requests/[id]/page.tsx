'use client'

import api from '@/lib/api';
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft,
    Calendar,
    User,
    Plane,
    Clock,
    ShieldCheck,
    CheckCircle2,
    XCircle,
    Copy,
    ArrowUpRight,
    Phone,
    Mail,
    Globe,
    X,
    Search,
    Loader2,
    DollarSign
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function RequestDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [request, setRequest] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isActing, setIsActing] = useState(false);
    const [airlineBookingReference, setAirlineBookingReference] = useState('');

    // Verification Modal State
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [verifiedFlights, setVerifiedFlights] = useState<any[]>([]);
    const [confirmedPrice, setConfirmedPrice] = useState('');
    const [selectedFlight, setSelectedFlight] = useState<any>(null);

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const response = await api.get(`/agent/requests/${id}`);
                setRequest(response.data);
                setAirlineBookingReference(
                    response.data?.booking?.airline_booking_reference ||
                    response.data?.details?.airline_booking_reference ||
                    ''
                );
            } catch (error: any) {
                console.error('Error fetching request details:', error);
                if (error.response?.status === 401) {
                    router.push('/');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchRequest();
    }, [id, router]);

    const handleSaveAirlineReference = async () => {
        if (!airlineBookingReference.trim()) return;
        setIsActing(true);
        try {
            const response = await api.patch(`/agent/requests/${id}`, {
                airlineBookingReference: airlineBookingReference.trim()
            });
            setRequest(response.data);
        } catch (error) {
            console.error('Error saving airline booking reference:', error);
        } finally {
            setIsActing(false);
        }
    };

    // Verify flight price through Amadeus API
    const handleVerifyPrice = async () => {
        setVerifyLoading(true);
        setVerifiedFlights([]);

        try {
            const itinerary = request.details?.itinerary || '';
            const codeMatch = itinerary.match(/([A-Z]{3}).*([A-Z]{3})/);
            const depCode = request.details?.flight_data?.departureCode || codeMatch?.[1] || 'LHR';
            const arrCode = request.details?.flight_data?.arrivalCode || codeMatch?.[2] || 'JFK';

            const response = await api.post('/agent/verify-price', {
                from: depCode,
                to: arrCode,
                departureDate: request.details?.tripDetails?.departure?.split('T')[0] || new Date().toISOString().split('T')[0],
                passengers: String(request.details?.tripDetails?.adults || request.details?.passengers?.length || 1)
            });

            const data = response.data;
            if (data.flights) {
                setVerifiedFlights(data.flights);
                if (data.flights.length > 0) {
                    setSelectedFlight(data.flights[0]);
                    setConfirmedPrice(String(data.flights[0].price));
                }
            }
        } catch (error) {
            console.error('Price verification error:', error);
        } finally {
            setVerifyLoading(false);
        }
    };

    // Open verify modal
    const openVerifyModal = () => {
        setShowVerifyModal(true);
        handleVerifyPrice();
    };

    // Confirm with price
    const handleConfirm = async () => {
        if (!confirmedPrice) return;
        setIsActing(true);

        try {
            const response = await api.patch(`/agent/requests/${id}`, {
                status: 'RESOLVED',
                confirmedPrice: Number(confirmedPrice)
            });

            setRequest(response.data);
            setShowVerifyModal(false);
        } catch (error) {
            console.error('Error confirming request:', error);
        } finally {
            setIsActing(false);
        }
    };

    // Reject request
    const handleReject = async () => {
        setIsActing(true);

        try {
            const response = await api.patch(`/agent/requests/${id}`, { status: 'CLOSED' });
            setRequest(response.data);
        } catch (error) {
            console.error('Error rejecting request:', error);
        } finally {
            setIsActing(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    if (loading) return <div className="p-20 text-center font-black animate-pulse">Analyzing Flight Data...</div>;
    if (!request) return <div className="p-20 text-center">Inquiry not found.</div>;

    const passengers = request.details?.passengers || [];
    const contact = request.details?.contact || {};
    const itinerary = request.details?.itinerary || 'Dynamic Route';
    const bookingPrice = request.booking?.total_price;
    const tripDetails = request.details?.trip_details || request.booking?.flight_data?.trip_details || {};
    const pricing = request.details?.pricing || request.booking?.flight_data?.pricing || {};
    const formatNGN = (value: any) =>
        new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            maximumFractionDigits: 0
        }).format(Number(value || 0));

    return (
        <>
            <div className="max-w-6xl mx-auto space-y-6 lg:space-y-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-6">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-white border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-all shadow-sm"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <div className="flex flex-wrap items-center gap-3 mb-1">
                            <h1 className="text-xl lg:text-3xl font-black text-zinc-900 tracking-tight">{request.details?.itinerary || 'Flight Request'}</h1>
                            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${request.status === 'OPEN' ? 'bg-amber/10 text-amber animate-pulse' :
                                request.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-600' :
                                    request.status === 'CLOSED' ? 'bg-red-50 text-red-600' :
                                        'bg-zinc-100 text-zinc-500'
                                }`}>
                                {request.status}
                            </div>
                        </div>
                        <p className="text-zinc-500 font-medium text-xs lg:text-sm">Request ID: {request.id.substring(0, 10)}...</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">

                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-6 lg:space-y-10">

                        {/* Itinerary Card */}
                        <div className="bg-white rounded-[2rem] lg:rounded-[3rem] p-6 lg:p-10 border border-zinc-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50" />

                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-10 border-b border-zinc-50">
                                <div className="flex items-center gap-4 lg:gap-6">
                                    <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl lg:rounded-3xl bg-zinc-900 flex items-center justify-center text-amber">
                                        <Plane size={24} className="lg:w-8 lg:h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Route Overview</h3>
                                        <p className="text-lg lg:text-2xl font-black text-zinc-900 tracking-tight">{itinerary}</p>
                                    </div>
                                </div>
                                <div className="md:text-right">
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Quoted Price</p>
                                    <p className="text-xl lg:text-2xl font-black text-zinc-900">{formatNGN(bookingPrice || 0)}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 relative z-10">
                                <div>
                                    <h4 className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-2">Created</h4>
                                    <div className="flex items-center gap-2 text-zinc-900 font-bold text-xs lg:text-sm">
                                        <Calendar size={16} className="text-zinc-400" />
                                        {new Date(request.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-2">Travelers</h4>
                                    <div className="flex items-center gap-2 text-zinc-900 font-bold text-xs lg:text-sm">
                                        <User size={16} className="text-zinc-400" />
                                        {passengers.length || 1} Passenger(s)
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-2">Flight ID</h4>
                                    <div className="flex items-center gap-2 text-zinc-900 font-bold text-xs lg:text-sm">
                                        <ShieldCheck size={16} className="text-emerald-500" />
                                        {request.details?.flight_id || "Dynamic"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Trip Details */}
                        <div className="bg-white rounded-[2rem] lg:rounded-[3rem] p-6 lg:p-10 border border-zinc-100 shadow-sm">
                            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-8">Trip Details</h3>
                            <div className="grid grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Departure</p>
                                    <p className="text-xs lg:text-sm font-bold text-zinc-900">
                                        {tripDetails.departure ? new Date(tripDetails.departure).toLocaleDateString() : '-'}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Return</p>
                                    <p className="text-xs lg:text-sm font-bold text-zinc-900">
                                        {tripDetails.return ? new Date(tripDetails.return).toLocaleDateString() : '-'}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Cabin</p>
                                    <p className="text-xs lg:text-sm font-bold text-zinc-900">{tripDetails.travelClass || '-'}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Passengers</p>
                                    <p className="text-xs lg:text-sm font-bold text-zinc-900">
                                        {tripDetails.passengerCount || passengers.length || 1}
                                        {typeof tripDetails.adults !== 'undefined' || typeof tripDetails.children !== 'undefined'
                                            ? ` (A: ${tripDetails.adults || 0}, C: ${tripDetails.children || 0})`
                                            : ''}
                                    </p>
                                </div>
                            </div>
                            {pricing && (pricing.unitPrice || pricing.totalPrice) && (
                                <div className="mt-8 lg:mt-10 pt-6 lg:pt-8 border-t border-zinc-50 grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <div>
                                        <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Unit Price</p>
                                        <p className="text-xs lg:text-sm font-bold text-zinc-900">{formatNGN(pricing.unitPrice || 0)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Taxes</p>
                                        <p className="text-xs lg:text-sm font-bold text-zinc-900">{formatNGN(pricing.taxes || 0)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Total</p>
                                        <p className="text-xs lg:text-sm font-bold text-zinc-900">{formatNGN(pricing.totalPrice || 0)}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Passenger Details */}
                        {passengers.length > 0 && (
                            <div className="bg-white rounded-[2rem] lg:rounded-[3rem] p-6 lg:p-10 border border-zinc-100 shadow-sm">
                                <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-8">Passenger Manifesto</h3>
                                <div className="space-y-4">
                                    {passengers.map((p: any, i: number) => (
                                        <div key={i} className="bg-zinc-50 rounded-xl lg:rounded-2xl p-4 lg:p-6 flex items-center justify-between">
                                            <div className="flex items-center gap-4 lg:gap-5">
                                                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-zinc-900 flex items-center justify-center text-amber font-black text-xs lg:text-sm">
                                                    {i + 1}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-zinc-900 text-xs lg:text-sm truncate">
                                                        {p.title} {p.firstName || '-'} {p.lastName || '-'}
                                                    </p>
                                                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                                                        {p.gender || '-'} - {p.nationality || '-'}
                                                    </p>
                                                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">
                                                        DOB: {p.dobDay || '-'} {p.dobMonth || '-'} {p.dobYear || '-'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Panel - only show if OPEN */}
                        {request.status === 'OPEN' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-8">
                                <button
                                    onClick={openVerifyModal}
                                    className={`bg-emerald-50/50 rounded-[2rem] p-6 lg:p-8 border border-emerald-100 flex flex-col justify-between group hover:bg-emerald-50 transition-all cursor-pointer text-left ${isActing ? 'opacity-50 pointer-events-none' : ''}`}
                                >
                                    <div className="flex items-center justify-between mb-4 lg:mb-6">
                                        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-white border border-emerald-100 flex items-center justify-center text-emerald-500 shadow-sm">
                                            <CheckCircle2 size={24} />
                                        </div>
                                        <ArrowUpRight className="text-emerald-300 group-hover:text-emerald-500 transition-colors" />
                                    </div>
                                    <div>
                                        <h4 className="text-base lg:text-lg font-black text-emerald-900 mb-1">Verify Seat & Rate</h4>
                                        <p className="text-[10px] lg:text-xs text-emerald-700/60 font-medium leading-relaxed">Verify live pricing via Amadeus and confirm the booking rate.</p>
                                    </div>
                                </button>

                                <button
                                    onClick={() => !isActing && handleReject()}
                                    className={`bg-red-50/50 rounded-[2rem] p-6 lg:p-8 border border-red-100 flex flex-col justify-between group hover:bg-red-50 transition-all cursor-pointer text-left ${isActing ? 'opacity-50 pointer-events-none' : ''}`}
                                >
                                    <div className="flex items-center justify-between mb-4 lg:mb-6">
                                        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-white border border-red-100 flex items-center justify-center text-red-500 shadow-sm">
                                            <XCircle size={24} />
                                        </div>
                                        <ArrowUpRight className="text-red-300 group-hover:text-red-500 transition-colors" />
                                    </div>
                                    <div>
                                        <h4 className="text-base lg:text-lg font-black text-red-900 mb-1">Reject Inquiry</h4>
                                        <p className="text-[10px] lg:text-xs text-red-700/60 font-medium leading-relaxed">Reject if no availability or routing issues exist.</p>
                                    </div>
                                </button>
                            </div>
                        )}

                        {/* Status badge for already resolved/closed */}
                        {request.status === 'RESOLVED' && (
                            <div className="bg-emerald-50 border border-emerald-100 rounded-[2rem] lg:rounded-[2.5rem] p-6 lg:p-8 flex items-center gap-4 lg:gap-6">
                                <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200 flex-shrink-0">
                                    <CheckCircle2 size={24} className="lg:w-7 lg:h-7" />
                                </div>
                                <div>
                                    <h4 className="font-black text-emerald-900 text-base lg:text-lg mb-1">Confirmed & Resolved</h4>
                                    <p className="text-[10px] lg:text-xs text-emerald-700/60 font-medium">
                                        Confirmed at {formatNGN(request.booking?.confirmed_price || request.booking?.total_price || 0)}
                                    </p>
                                </div>
                            </div>
                        )}
                        {request.status === 'CLOSED' && (
                            <div className="bg-red-50 border border-red-100 rounded-[2rem] lg:rounded-[2.5rem] p-6 lg:p-8 flex items-center gap-4 lg:gap-6">
                                <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-red-500 flex items-center justify-center text-white shadow-lg shadow-red-200 flex-shrink-0">
                                    <XCircle size={24} className="lg:w-7 lg:h-7" />
                                </div>
                                <div>
                                    <h4 className="font-black text-red-900 text-base lg:text-lg mb-1">Request Rejected</h4>
                                    <p className="text-[10px] lg:text-xs text-red-700/60 font-medium">This inquiry has been closed by the concierge team.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="space-y-6 lg:space-y-10">

                        {/* Client Profile */}
                        <div className="bg-white rounded-[2rem] lg:rounded-[3rem] p-6 lg:p-10 border border-zinc-100 shadow-sm">
                            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-8">Client Profile</h3>
                            <div className="flex items-center gap-4 lg:gap-6 mb-8 group">
                                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center font-black text-lg lg:text-xl text-zinc-300">
                                    {request.profiles?.full_name?.charAt(0) || "U"}
                                </div>
                                <div>
                                    <p className="text-base lg:text-lg font-black text-zinc-900 mb-1">{request.profiles?.full_name || "Luxel Client"}</p>
                                    <span className="text-[10px] font-bold text-amber px-2.5 py-1 rounded-md bg-amber/10 uppercase tracking-widest">{request.profiles?.role || "USER"}</span>
                                </div>
                            </div>
                            <div className="space-y-4 pt-6 lg:pt-8 border-t border-zinc-50">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-2"><Mail size={12} /> Email</span>
                                    <button onClick={() => copyToClipboard(contact.email || '')} className="text-[10px] lg:text-xs font-black text-zinc-900 flex items-center gap-2 hover:text-amber transition-colors truncate max-w-[150px]">
                                        {contact.email || "-"}
                                        <Copy size={12} />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-2"><Phone size={12} /> Phone</span>
                                    <span className="text-[10px] lg:text-xs font-black text-zinc-900">{contact.phone || request.profiles?.phone || "-"}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-2"><Clock size={12} /> Request Time</span>
                                    <span className="text-[10px] lg:text-xs font-black text-zinc-900">{new Date(request.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Booking Info */}
                        {request.booking && (
                            <div className="bg-white rounded-[2rem] lg:rounded-[3rem] p-6 lg:p-10 border border-zinc-100 shadow-sm">
                                <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-8">Booking Details</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-zinc-400">Luxel Reference</span>
                                        <span className="text-[10px] lg:text-xs font-black text-zinc-900">{request.booking.booking_reference}</span>
                                    </div>
                                    <div className="pt-4 mt-2 border-t border-zinc-50 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-zinc-400">PNR Reference</span>
                                            <span className="text-[10px] lg:text-xs font-black text-zinc-900">
                                                {request.booking.airline_booking_reference || request.details?.airline_booking_reference || '-'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                value={airlineBookingReference}
                                                onChange={(e) => setAirlineBookingReference(e.target.value)}
                                                placeholder="Enter PNR"
                                                className="flex-1 bg-zinc-50 border border-zinc-100 rounded-lg px-3 py-2.5 text-xs font-bold text-zinc-900 focus:ring-2 focus:ring-amber/20 outline-none"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleSaveAirlineReference}
                                                disabled={isActing || !airlineBookingReference.trim()}
                                                className="px-4 py-2.5 rounded-lg bg-zinc-900 text-amber text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-zinc-400">Quoted Price</span>
                                        <span className="text-[10px] lg:text-xs font-black text-zinc-900">{formatNGN(request.booking.total_price)}</span>
                                    </div>
                                    {request.booking.confirmed_price && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] lg:text-xs font-bold text-emerald-600">Confirmed Price</span>
                                            <span className="text-[10px] lg:text-xs font-black text-emerald-600">{formatNGN(request.booking.confirmed_price)}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-zinc-400">Status</span>
                                        <span className={`text-[10px] lg:text-xs font-black uppercase tracking-widest ${request.booking.status === 'CONFIRMED' ? 'text-emerald-600' : request.booking.status === 'CANCELLED' ? 'text-red-500' : 'text-amber'}`}>
                                            {request.booking.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Verification Modal */}
            <AnimatePresence>
                {showVerifyModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6"
                        onClick={() => setShowVerifyModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 100 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 100 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-t-[2rem] sm:rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
                        >
                            {/* Modal Header */}
                            <div className="sticky top-0 bg-white rounded-t-[2rem] sm:rounded-t-[2.5rem] px-6 lg:px-10 py-6 lg:py-8 border-b border-zinc-100 flex items-center justify-between z-10">
                                <div>
                                    <h2 className="text-lg lg:text-xl font-black text-zinc-900 tracking-tight">Verify Flight & Price</h2>
                                    <p className="text-[10px] lg:text-xs text-zinc-500 font-medium mt-1">Live data from Amadeus GDS</p>
                                </div>
                                <button
                                    onClick={() => setShowVerifyModal(false)}
                                    className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 lg:p-10 space-y-6 lg:space-y-8">
                                {/* Route Info */}
                                <div className="bg-zinc-50 rounded-xl lg:rounded-2xl p-4 lg:p-6 flex items-center justify-between">
                                    <div className="flex items-center gap-3 lg:gap-4">
                                        <Plane size={20} className="text-amber" />
                                        <span className="font-bold text-zinc-900 text-sm">{itinerary}</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-zinc-400">{passengers.length} PAX</span>
                                </div>

                                {/* Loading State */}
                                {verifyLoading && (
                                    <div className="flex flex-col items-center py-10 lg:py-12 gap-4">
                                        <Loader2 size={32} className="text-amber animate-spin" />
                                        <p className="text-xs lg:text-sm font-bold text-zinc-500">Querying Amadeus GDS...</p>
                                    </div>
                                )}

                                {/* Verified Flights */}
                                {!verifyLoading && verifiedFlights.length > 0 && (
                                    <div className="space-y-3 lg:space-y-4">
                                        <h3 className="text-[10px] lg:text-caption font-black text-zinc-400 uppercase tracking-widest">Available Offers ({verifiedFlights.length})</h3>
                                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                            {verifiedFlights.slice(0, 8).map((flight: any, i: number) => (
                                                <button
                                                    key={i}
                                                    onClick={() => {
                                                        setSelectedFlight(flight);
                                                        setConfirmedPrice(String(flight.price));
                                                    }}
                                                    className={`w-full text-left p-4 lg:p-5 rounded-xl lg:rounded-2xl border transition-all ${selectedFlight?.id === flight.id
                                                        ? 'border-amber bg-amber/5 ring-2 ring-amber/20'
                                                        : 'border-zinc-100 hover:border-zinc-200'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3 lg:gap-4">
                                                            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-zinc-100 flex items-center justify-center text-[10px] font-black text-zinc-500 uppercase">
                                                                {flight.airline?.substring(0, 2) || flight.logo?.substring(0, 2) || 'FL'}
                                                            </div>
                                                            <div>
                                                                <p className="text-xs lg:text-sm font-bold text-zinc-900">
                                                                    {flight.departureTime} {'->'} {flight.arrivalTime}
                                                                </p>
                                                                <p className="text-[10px] text-zinc-400 font-medium">
                                                                    {flight.stops} stop(s) - {flight.duration}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-black text-zinc-900 text-sm lg:text-base">{formatNGN(flight.price)}</p>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {!verifyLoading && verifiedFlights.length === 0 && (
                                    <div className="text-center py-6 text-zinc-400">
                                        <p className="font-bold text-xs">No live data available. Enter a manual price below.</p>
                                    </div>
                                )}

                                {/* Agent Price Input */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Confirmed Price (NGN)</label>
                                    <div className="relative">
                                        <DollarSign size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300" />
                                        <input
                                            type="number"
                                            value={confirmedPrice}
                                            onChange={(e) => setConfirmedPrice(e.target.value)}
                                            placeholder="Enter confirmed price"
                                            className="w-full bg-zinc-50 border-none rounded-xl lg:rounded-2xl py-4 lg:py-5 pl-12 pr-6 text-base lg:text-lg font-black text-zinc-900 focus:ring-4 focus:ring-amber/20 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="sticky bottom-0 bg-white rounded-b-[2rem] sm:rounded-b-[2.5rem] px-6 lg:px-10 py-6 lg:py-8 border-t border-zinc-100 flex items-center justify-between gap-4">
                                <button
                                    onClick={() => setShowVerifyModal(false)}
                                    className="flex-1 sm:flex-none px-6 lg:px-8 py-3.5 lg:py-4 rounded-xl border border-zinc-100 text-zinc-500 font-bold text-[10px] lg:text-xs hover:bg-zinc-50 transition-all uppercase tracking-widest"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    disabled={!confirmedPrice || isActing}
                                    className="flex-1 sm:flex-none px-6 lg:px-10 py-3.5 lg:py-4 rounded-xl bg-zinc-900 text-white font-bold text-[10px] lg:text-xs shadow-xl shadow-zinc-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 uppercase tracking-widest"
                                >
                                    {isActing ? (
                                        <><Loader2 size={16} className="animate-spin" /> ...</>
                                    ) : (
                                        <><CheckCircle2 size={16} /> Confirm</>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
