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
        <div className="space-y-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-heading-lg font-medium text-zinc-900 tracking-tight mb-2">Tour Bookings</h1>
                    <p className="text-zinc-500 font-medium">Monitor and manage reservations for your curated experiences.</p>
                </div>
                <div className="flex items-center gap-4">
                    {tourIdFilter && (
                        <button
                            onClick={() => router.push('/agent/tours/bookings')}
                            className="bg-zinc-100 text-zinc-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-zinc-200 transition-all flex items-center gap-2"
                        >
                            Clear Filter
                            <XCircle size={14} />
                        </button>
                    )}
                    <div className="relative group w-80">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-amber transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by ID, guest or tour..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border-none rounded-2xl py-4 pl-12 pr-4 text-body-sm font-medium text-zinc-900 shadow-sm focus:ring-2 focus:ring-amber/10 transition-all"
                        />
                    </div>
                    <button
                        onClick={() => fetchBookings(false)}
                        disabled={isRefreshing}
                        className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-zinc-400 hover:text-amber shadow-sm transition-all disabled:opacity-50"
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
            <div className="bg-white rounded-[3rem] border border-zinc-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50/50">
                                <th className="px-10 py-6 text-caption font-medium text-zinc-400 uppercase tracking-widest">Booking ID</th>
                                <th className="px-10 py-6 text-caption font-medium text-zinc-400 uppercase tracking-widest">Guest</th>
                                <th className="px-10 py-6 text-caption font-medium text-zinc-400 uppercase tracking-widest">Experience</th>
                                <th className="px-10 py-6 text-caption font-medium text-zinc-400 uppercase tracking-widest">Guests</th>
                                <th className="px-10 py-6 text-caption font-medium text-zinc-400 uppercase tracking-widest">Total Price</th>
                                <th className="px-10 py-6 text-caption font-medium text-zinc-400 uppercase tracking-widest">Status</th>
                                <th className="px-10 py-6 text-caption font-medium text-zinc-400 uppercase tracking-widest"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-20 text-zinc-300 font-medium uppercase tracking-widest text-body-sm">Accessing booking records...</td>
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
                                        <td className="px-10 py-6 font-medium text-zinc-900 text-body tracking-tighter">{booking.id.substring(0, 8)}...</td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                                                    {booking.contact_info?.fullName?.charAt(0) || "G"}
                                                </div>
                                                <span className="text-body font-medium text-zinc-700">{booking.contact_info?.fullName || "Guest"}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className="text-body font-medium text-zinc-900">{booking.tour?.title}</span>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-2 text-zinc-500">
                                                <Users size={14} />
                                                <span className="font-medium">{booking.guest_count}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className="text-body font-bold text-zinc-900">{formatPrice(booking.total_price)}</span>
                                        </td>
                                        <td className="px-10 py-6 text-body">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-caption font-medium uppercase tracking-widest ${booking.status === 'PENDING' ? 'bg-amber/5 text-amber' :
                                                booking.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${booking.status === 'PENDING' ? 'bg-amber animate-pulse' :
                                                    booking.status === 'CONFIRMED' ? 'bg-emerald-500' : 'bg-red-500'
                                                    }`} />
                                                {booking.status}
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <button className="p-2 rounded-lg hover:bg-zinc-100 transition-colors text-zinc-400 group-hover:text-amber">
                                                <ArrowUpRight size={20} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-10 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-200">
                                                <SearchX size={32} />
                                            </div>
                                            <p className="text-body font-medium text-zinc-400">No tour bookings found.</p>
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
