'use client'

import api from '@/lib/api';
import { motion } from "framer-motion";
import {
    Search,
    Filter,
    ChevronRight,
    Calendar,
    ArrowUpRight,
    SearchX,
    RefreshCw,
    Users,
    CreditCard,
    CheckCircle2,
    Clock,
    XCircle
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { supabase } from "@/lib/supabase";

function TourBookingsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tourIdFilter = searchParams.get('tourId');
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchBookings = useCallback(async (showFullLoading = true) => {
        if (showFullLoading) setLoading(true);
        else setIsRefreshing(true);

        try {
            const response = await api.get('/tours/agent/bookings');
            setBookings(response.data);
        } catch (error: any) {
            console.error('Error fetching agent tour bookings:', error);
            if (error.response?.status === 401) {
                router.push('/');
            }
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    }, [router]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const filteredBookings = useMemo(() => {
        return bookings.filter(booking => {
            const matchesSearch = (booking.tour?.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                (booking.contact_info?.fullName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                booking.id.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesTour = tourIdFilter ? booking.tour_id === tourIdFilter : true;

            return matchesSearch && matchesTour;
        });
    }, [bookings, searchQuery, tourIdFilter]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            maximumFractionDigits: 0
        }).format(price);
    };

    return (
        <div className="space-y-6 lg:space-y-10">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl lg:text-heading-lg font-medium text-zinc-900 tracking-tight mb-2">Tour Bookings</h1>
                    <p className="text-sm lg:text-body text-zinc-500 font-medium">Monitor and manage reservations for your experiences.</p>
                </div>
                <div className="flex items-center gap-3 md:gap-4">
                    {tourIdFilter && (
                        <button
                            onClick={() => router.push('/agent/tours/bookings')}
                            className="bg-zinc-100 text-zinc-600 px-3 lg:px-4 py-2 lg:py-2.5 rounded-xl text-[10px] lg:text-xs font-bold hover:bg-zinc-200 transition-all flex items-center gap-2 flex-shrink-0"
                        >
                            Clear Filter
                            <XCircle size={14} />
                        </button>
                    )}
                    <div className="relative group flex-1 md:w-80">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-amber transition-colors" />
                        <input
                            type="text"
                            placeholder="Search bookings..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border-none rounded-xl lg:rounded-2xl py-3.5 lg:py-4 pl-12 pr-4 text-xs lg:text-body-sm font-medium text-zinc-900 shadow-sm focus:ring-2 focus:ring-amber/10 transition-all"
                        />
                    </div>
                    <button
                        onClick={() => fetchBookings(false)}
                        disabled={isRefreshing}
                        className="w-12 h-12 lg:w-14 lg:h-14 bg-white rounded-xl lg:rounded-2xl flex items-center justify-center text-zinc-400 hover:text-amber shadow-sm transition-all disabled:opacity-50 flex-shrink-0"
                    >
                        <motion.div
                            animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                            <RefreshCw size={20} />
                        </motion.div>
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-[2rem] lg:rounded-[3rem] border border-zinc-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-zinc-50/50">
                                <th className="px-6 lg:px-10 py-5 lg:py-6 text-[10px] lg:text-caption font-medium text-zinc-400 uppercase tracking-widest">Booking ID</th>
                                <th className="px-6 lg:px-10 py-5 lg:py-6 text-[10px] lg:text-caption font-medium text-zinc-400 uppercase tracking-widest">Guest</th>
                                <th className="px-6 lg:px-10 py-5 lg:py-6 text-[10px] lg:text-caption font-medium text-zinc-400 uppercase tracking-widest">Experience</th>
                                <th className="px-6 lg:px-10 py-5 lg:py-6 text-[10px] lg:text-caption font-medium text-zinc-400 uppercase tracking-widest">Guests</th>
                                <th className="px-6 lg:px-10 py-5 lg:py-6 text-[10px] lg:text-caption font-medium text-zinc-400 uppercase tracking-widest">Total Price</th>
                                <th className="px-6 lg:px-10 py-5 lg:py-6 text-[10px] lg:text-caption font-medium text-zinc-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 lg:px-10 py-5 lg:py-6 text-[10px] lg:text-caption font-medium text-zinc-400 uppercase tracking-widest"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-20 text-zinc-300 font-medium uppercase tracking-widest text-[10px] lg:text-body-sm">Accessing booking records...</td>
                                </tr>
                            ) : filteredBookings.length > 0 ? (
                                filteredBookings.map((booking, i) => (
                                    <motion.tr
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        key={booking.id}
                                        onClick={() => router.push(`/agent/tours/bookings/${booking.id}`)}
                                        className="hover:bg-zinc-50 transition-colors group cursor-pointer"
                                    >
                                        <td className="px-6 lg:px-10 py-5 lg:py-6 font-medium text-zinc-900 text-sm lg:text-body tracking-tighter">{booking.id.substring(0, 8)}...</td>
                                        <td className="px-6 lg:px-10 py-5 lg:py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                                                    {booking.contact_info?.fullName?.charAt(0) || "G"}
                                                </div>
                                                <span className="text-sm lg:text-body font-medium text-zinc-700">{booking.contact_info?.fullName || "Guest"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 lg:px-10 py-5 lg:py-6 text-sm lg:text-body font-medium text-zinc-900">
                                            {booking.tour?.title}
                                        </td>
                                        <td className="px-6 lg:px-10 py-5 lg:py-6">
                                            <div className="flex items-center gap-2 text-zinc-500">
                                                <Users size={14} />
                                                <span className="text-sm lg:text-body font-medium">{booking.guest_count}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 lg:px-10 py-5 lg:py-6">
                                            <span className="text-sm lg:text-body font-bold text-zinc-900 tracking-tight">{formatPrice(booking.total_price)}</span>
                                        </td>
                                        <td className="px-6 lg:px-10 py-5 lg:py-6">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] lg:text-caption font-medium uppercase tracking-widest ${booking.status === 'PENDING' ? 'bg-amber/5 text-amber' :
                                                booking.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${booking.status === 'PENDING' ? 'bg-amber animate-pulse' :
                                                    booking.status === 'CONFIRMED' ? 'bg-emerald-500' : 'bg-red-500'
                                                    }`} />
                                                {booking.status}
                                            </div>
                                        </td>
                                        <td className="px-6 lg:px-10 py-5 lg:py-6 text-right">
                                            <button className="p-2 rounded-lg hover:bg-zinc-100 transition-colors text-zinc-400 group-hover:text-amber">
                                                <ArrowUpRight size={20} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 lg:px-10 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-200">
                                                <SearchX size={32} />
                                            </div>
                                            <p className="text-sm lg:text-body font-medium text-zinc-400">No tour bookings found.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default function TourBookingsPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[400px]">
                <RefreshCw size={32} className="animate-spin text-amber/20" />
            </div>
        }>
            <TourBookingsContent />
        </Suspense>
    );
}
