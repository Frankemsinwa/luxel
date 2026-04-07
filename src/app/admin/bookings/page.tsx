'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Loader2, Plane, User, Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';

interface Booking {
    id: string;
    booking_reference: string;
    airline_booking_reference: string;
    status: string;
    total_price: number;
    created_at: string;
    user: { full_name: string };
    flight_data: any;
}

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await api.get('/admin/bookings');
                setBookings(data);
            } catch (error) {
                console.error('Failed to fetch bookings:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'CONFIRMED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'PENDING': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'CANCELLED': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-zinc-50 text-zinc-600 border-zinc-100';
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin text-black" size={32} />
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Flight Booking Oversight</h1>
                <p className="text-zinc-500 text-lg font-medium">Monitor all flight reservations and statuses.</p>
            </div>

            <div className="grid gap-6">
                {bookings.map((booking) => (
                    <div key={booking.id} className="bg-white border border-zinc-100 p-8 rounded-[2rem] hover:shadow-2xl hover:shadow-black/5 transition-all group">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-900 border border-zinc-100 group-hover:bg-black group-hover:text-white transition-colors">
                                    <Plane size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold tracking-tight">{booking.booking_reference}</h3>
                                    <p className="text-sm font-medium text-zinc-400">
                                        {booking.airline_booking_reference ? `Airline Ref: ${booking.airline_booking_reference}` : 'Awaiting Airline Confirmation'}
                                    </p>
                                </div>
                            </div>
                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold border uppercase tracking-widest ${getStatusColor(booking.status)}`}>
                                {booking.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-6 border-y border-zinc-50">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <User size={10} /> Traveler
                                </p>
                                <p className="text-sm font-bold text-zinc-900">{booking.user?.full_name || 'Guest Traveler'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <Calendar size={10} /> Booked On
                                </p>
                                <p className="text-sm font-bold text-zinc-900">{format(new Date(booking.created_at), 'MMM dd, yyyy')}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <Tag size={10} /> Total Paid
                                </p>
                                <p className="text-sm font-bold text-zinc-900">₦{booking.total_price.toLocaleString()}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Route</p>
                                <p className="text-sm font-bold text-zinc-900 italic">
                                    {booking.flight_data?.itinerary || 'International Route'}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button className="text-xs font-bold text-zinc-400 hover:text-black transition-colors underline decoration-zinc-200 underline-offset-4">
                                View Full Itinerary Details
                            </button>
                        </div>
                    </div>
                ))}

                {bookings.length === 0 && (
                    <div className="text-center py-20 bg-zinc-50 rounded-[2.5rem] border-2 border-dashed border-zinc-200">
                        <Plane className="mx-auto text-zinc-200 mb-4 animate-pulse" size={48} />
                        <p className="text-zinc-400 font-medium italic">No flight bookings found in the system.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
