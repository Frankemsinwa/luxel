'use client'

import { useSearchParams } from 'next/navigation';
import { PlaneTakeoff, PlaneLanding } from "lucide-react";
import { Suspense } from 'react';

function ReservationSummaryContent() {
    const searchParams = useSearchParams();

    const passengerCountStr = searchParams.get('passengers') || '1 Passenger';
    const passengerCount = parseInt(passengerCountStr.split(' ')[0]) || 1;
    const pricePerPerson = Number(searchParams.get('price')) || 540;
    const totalPrice = pricePerPerson * passengerCount;
    const cabinClass = searchParams.get('class') || 'First Class';

    const route = {
        from: searchParams.get('depCity') || "London",
        fromCode: searchParams.get('depCode') || "LHR",
        to: searchParams.get('arrCity') || "New York",
        toCode: searchParams.get('arrCode') || "JFK",
        depTime: searchParams.get('depTime') || "10:30 AM",
        arrTime: searchParams.get('arrTime') || "06:45 PM",
        departureDate: searchParams.get('departure') ? new Date(searchParams.get('departure')!).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Oct 24, 2024',
        returnDate: searchParams.get('return') ? new Date(searchParams.get('return')!).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Oct 31, 2024',
    };

    return (
        <div className="bg-amber rounded-[3rem] shadow-xl shadow-amber/20 border border-amber/20 overflow-hidden">
            <div className="p-8 border-b border-black/10 flex items-center justify-between">
                <div>
                    <span className="text-[10px] font-bold text-black/50 uppercase tracking-widest block mb-1">Reference</span>
                    <span className="text-xl font-bold text-black">LX-492781</span>
                </div>
                <div className="text-right">
                    <span className="text-[10px] font-bold text-black/50 uppercase tracking-widest block mb-1">{passengerCount} {passengerCount > 1 ? 'Passengers' : 'Passenger'}</span>
                    <span className="px-4 py-1.5 rounded-full bg-black/10 text-black text-[10px] font-bold uppercase tracking-widest">{cabinClass}</span>
                </div>
            </div>

            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="flex items-center gap-12">
                    <div className="flex-1">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-black/50 uppercase tracking-widest flex items-center gap-2 mb-4">
                                <PlaneTakeoff size={14} className="text-black" /> Outbound
                            </span>
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-2xl font-black text-black">{route.fromCode}</span>
                                <div className="flex-1 h-px bg-black/10 mx-4" />
                                <span className="text-2xl font-black text-black">{route.toCode}</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-bold text-black/50 uppercase tracking-widest mb-6">
                                <span>{route.from}</span>
                                <span>{route.to}</span>
                            </div>
                            <div className="text-[10px] font-bold text-black bg-black/5 py-2 px-4 rounded-full w-fit">
                                {route.departureDate} • {route.depTime}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-12 border-l border-black/10 pl-12 opacity-40">
                    <div className="flex-1">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-black/50 uppercase tracking-widest flex items-center gap-2 mb-4">
                                <PlaneLanding size={14} className="text-black" /> Return
                            </span>
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-2xl font-black text-black">{route.toCode}</span>
                                <div className="flex-1 h-px bg-black/10 mx-4" />
                                <span className="text-2xl font-black text-black">{route.fromCode}</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-bold text-black/50 uppercase tracking-widest mb-6">
                                <span>{route.to}</span>
                                <span>{route.from}</span>
                            </div>
                            <div className="text-[10px] font-bold text-black bg-black/5 py-2 px-4 rounded-full w-fit">
                                {route.returnDate} • {route.arrTime}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-black/5 p-8 flex items-center justify-between">
                <span className="text-sm font-medium text-black/60">Estimated Total</span>
                <div className="text-right">
                    <div className="text-2xl font-bold text-black">₦{totalPrice.toFixed(2)}</div>
                    <div className="text-[8px] font-black text-black/50 uppercase tracking-[0.2em] mt-1">Confirmed Rate</div>
                </div>
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
