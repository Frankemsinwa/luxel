'use client'

import api from '@/lib/api';
import { useSearchParams } from 'next/navigation';
import { PlaneTakeoff, PlaneLanding } from "lucide-react";
import { Suspense, useState, useEffect } from 'react';

function ReservationSummaryContent() {
    const searchParams = useSearchParams();
    const bookingId = searchParams.get('id');

    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooking = async () => {
            if (!bookingId) {
                setLoading(false);
                return;
            }
            try {
                const response = await api.get(`/bookings/${bookingId}/status`);
                setBooking(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [bookingId]);

    const passengerCountStr = searchParams.get('passengers') || '1 Passenger';
    const passengerCount = parseInt(passengerCountStr.split(' ')[0]) || 1;
    const cabinClass = searchParams.get('class') || 'First Class';

    const route = {
        from: searchParams.get('depCity') || "London",
        fromCode: searchParams.get('depCode') || "LHR",
        to: searchParams.get('arrCity') || "New York",
        toCode: searchParams.get('arrCode') || "JFK",
        depTime: searchParams.get('depTime') || "10:30 AM",
        arrTime: searchParams.get('arrTime') || "06:45 PM",
        logo: searchParams.get('logo') || "",
        airline: searchParams.get('airline') || "",
        departureDate: searchParams.get('departure') ? new Date(searchParams.get('departure')!).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Oct 24, 2024',
        returnDate: searchParams.get('return') ? new Date(searchParams.get('return')!).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Oct 31, 2024',
    };

    const displayPrice = booking?.confirmed_price || booking?.total_price || (Number(searchParams.get('price')) * passengerCount) || 945000;
    const isConfirmed = !!booking?.confirmed_price;

    return (
        <div className="bg-flight-card rounded-[3rem] shadow-xl shadow-black/5 border border-black/5 overflow-hidden">
            <div className="p-8 border-b border-black/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {route.airline && (
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1.5 border border-black/5 overflow-hidden">
                            <img 
                                src={`https://cdn.jsdelivr.net/gh/besrourms/airline-logos/logos/${route.airline}.png`} 
                                alt={route.airline} 
                                className="w-full h-full object-contain" 
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                        </div>
                    )}
                    <div>
                        <span className="text-caption font-medium text-black/50 uppercase tracking-widest block mb-1">Reference</span>
                        <span className="text-heading-sm text-black">{booking?.airline_booking_reference || booking?.booking_reference || 'LX-PENDING'}</span>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-caption font-medium text-black/50 uppercase tracking-widest block mb-1">{passengerCount} {passengerCount > 1 ? 'Passengers' : 'Passenger'}</span>
                    <span className="px-4 py-1.5 rounded-full bg-black/10 text-black text-caption font-medium uppercase tracking-widest">{cabinClass}</span>
                </div>
            </div>

            <div className="p-10 grid grid-cols-1 gap-12">
                <div className="flex items-center gap-12">
                    <div className="flex-1">
                        <div className="flex flex-col">
                            <span className="text-caption font-medium text-black/50 uppercase tracking-widest flex items-center gap-2 mb-4">
                                <PlaneTakeoff size={14} className="text-black" /> Outbound
                            </span>
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-heading-lg text-black">{route.fromCode}</span>
                                <div className="flex-1 h-px bg-black/10 mx-4" />
                                <span className="text-heading-lg text-black">{route.toCode}</span>
                            </div>
                            <div className="flex justify-between text-caption font-medium text-black/50 uppercase tracking-widest mb-6">
                                <span>{route.from}</span>
                                <span>{route.to}</span>
                            </div>
                            <div className="text-caption font-medium text-black bg-black/5 py-2 px-4 rounded-full w-fit">
                                {route.departureDate} • {route.depTime}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Note: I removed the static hardcoded 'Return' section entirely unless roundtrip is specified, but to keep it simple we show just Oneway if roundtrip is empty */}
            </div>

            <div className="bg-black p-8 flex items-center justify-between">
                {loading ? (
                    <div className="w-full text-center text-white/50 animate-pulse text-body">Validating Record...</div>
                ) : (
                    <>
                        <span className="text-body text-white/60">Total Due</span>
                        <div className="text-right">
                            <div className="text-heading-lg text-flight-card">₦{displayPrice.toLocaleString()}</div>
                            <div className="text-caption font-medium text-flight-card uppercase tracking-[0.2em] mt-1">
                                {isConfirmed ? 'Confirmed Rate' : 'Estimated Total'}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default function ReservationSummaryCard() {
    return (
        <Suspense fallback={<div>Loading Summary...</div>}>
            <ReservationSummaryContent />
        </Suspense>
    );
}
