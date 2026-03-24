'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, CheckCircle2, XCircle, ExternalLink, Plane, Compass, Loader2, Search, Filter } from 'lucide-react';
import Image from 'next/image';

export default function AdminPendingPayments() {
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPayment, setSelectedPayment] = useState<any>(null);
    const [verifyingId, setVerifyingId] = useState<string | null>(null);

    const fetchPayments = async () => {
        try {
            const res = await api.get('/admin/payments/pending');
            setPayments(res.data);
        } catch (err) {
            console.error('Failed to fetch pending payments:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const handleVerify = async (payment: any) => {
        setVerifyingId(payment.id);
        try {
            await api.patch('/admin/payments/verify', {
                bookingId: payment.id,
                serviceType: payment.serviceType
            });
            // Success: Remove from list
            setPayments(prev => prev.filter(p => p.id !== payment.id));
            setSelectedPayment(null);
            alert(`Payment for ${payment.booking_reference || payment.id.split('-')[0]} has been verified.`);
        } catch (err: any) {
            console.error('Verification failed:', err);
            alert(err.response?.data?.message || 'Verification failed. Please try again.');
        } finally {
            setVerifyingId(null);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-96 gap-4">
            <Loader2 className="animate-spin text-amber" size={48} />
            <p className="text-caption font-medium text-zinc-400 uppercase tracking-widest leading-relaxed">Retrieving Manual Audit Log...</p>
        </div>
    );

    return (
        <div className="space-y-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest mb-4">
                        <CreditCard size={12} />
                        Manual Audit Required
                    </div>
                    <h1 className="text-heading-xl text-zinc-900 tracking-tight">Manual Verification Queue</h1>
                    <p className="text-body text-zinc-500 mt-2">Audit proof of payments and authorize the release of tickets & vouchers.</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input 
                            type="text" 
                            placeholder="Search Ref or Email..." 
                            className="bg-white border border-zinc-200 rounded-2xl pl-12 pr-6 py-4 text-body-sm focus:ring-2 focus:ring-black focus:outline-none transition-all w-72"
                        />
                    </div>
                    <button className="w-14 h-14 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center text-black hover:bg-zinc-50 transition-all">
                        <Filter size={18} />
                    </button>
                </div>
            </header>

            {payments.length === 0 ? (
                <div className="bg-white rounded-[3rem] p-32 text-center border-2 border-dashed border-zinc-100 flex flex-col items-center gap-8 group">
                    <div className="w-24 h-24 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-200 group-hover:scale-110 transition-transform duration-700">
                        <CheckCircle2 size={48} />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-heading-md text-zinc-900">Queue Cleared</h2>
                        <p className="text-body text-zinc-400 font-medium max-w-xs mx-auto">All manual bank transfers have been successfully verified and dispatched.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* List View */}
                    <div className="lg:col-span-8 space-y-4">
                        {payments.map((p, i) => (
                            <motion.div
                                key={p.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => setSelectedPayment(p)}
                                className={`group p-6 rounded-[2.5rem] border transition-all cursor-pointer flex items-center gap-6 ${
                                    selectedPayment?.id === p.id 
                                        ? 'bg-black border-black text-white shadow-2xl shadow-black/20' 
                                        : 'bg-white border-zinc-100 hover:border-black/10 hover:shadow-xl'
                                }`}
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                                    selectedPayment?.id === p.id ? 'bg-white/10' : 'bg-zinc-50 text-zinc-400'
                                }`}>
                                    {p.serviceType === 'FLIGHT' ? <Plane size={24} /> : <Compass size={24} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className={`text-body-sm font-bold tracking-tighter uppercase ${selectedPayment?.id === p.id ? 'text-white' : 'text-zinc-900'}`}>
                                            {p.booking_reference || p.id.split('-')[0]}
                                        </span>
                                        <span className={`text-caption font-bold px-2 py-0.5 rounded-md ${
                                            selectedPayment?.id === p.id ? 'bg-white/10 text-white' : 'bg-black/5 text-zinc-500'
                                        }`}>
                                            {p.serviceType}
                                        </span>
                                    </div>
                                    <p className={`text-caption-sm truncate ${selectedPayment?.id === p.id ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                        Uploaded {new Date(p.created_at).toLocaleDateString()} at {new Date(p.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className={`text-body-sm font-black mb-1 ${selectedPayment?.id === p.id ? 'text-white' : 'text-zinc-900'}`}>
                                        ₦{(p.total_price || 0).toLocaleString()}
                                    </p>
                                    <div className="flex items-center gap-2 justify-end">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                                        <span className={`text-caption font-medium uppercase tracking-widest scale-90 ${selectedPayment?.id === p.id ? 'text-amber' : 'text-zinc-400'}`}>Pending</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Inspection & Action View */}
                    <div className="lg:col-span-4 sticky top-10 h-fit">
                        <AnimatePresence mode="wait">
                            {selectedPayment ? (
                                <motion.div
                                    key={selectedPayment.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-white rounded-[3rem] border border-zinc-100 shadow-2xl p-10 space-y-10 overflow-hidden relative group"
                                >
                                    <div className="space-y-6">
                                        <header className="space-y-2">
                                            <h3 className="text-heading-sm text-zinc-900">Audit Desk</h3>
                                            <p className="text-caption font-medium text-zinc-400 uppercase tracking-widest leading-relaxed">
                                                Inspecting Proof for {selectedPayment.booking_reference || selectedPayment.id.split('-')[0]}
                                            </p>
                                        </header>

                                        {/* Proof Preview */}
                                        <div className="relative h-[280px] w-full rounded-[2rem] overflow-hidden bg-zinc-50 border border-zinc-100 group/img shadow-inner ring-8 ring-zinc-50/50">
                                            {selectedPayment.receipt_url ? (
                                                <>
                                                    {/* In a real app we would handle PDF vs Image. For now assume image from Cloudinary */}
                                                    <Image 
                                                        src={selectedPayment.receipt_url} 
                                                        alt="Receipt proof" 
                                                        fill 
                                                        className="object-cover transition-transform duration-700 group-hover/img:scale-110" 
                                                    />
                                                    <a 
                                                        href={selectedPayment.receipt_url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-3 text-white"
                                                    >
                                                        <ExternalLink size={20} />
                                                        <span className="text-body-sm font-medium tracking-widest uppercase">Inspect High-Res</span>
                                                    </a>
                                                </>
                                            ) : (
                                                <div className="h-full flex flex-col items-center justify-center gap-4 text-zinc-300">
                                                    <XCircle size={48} />
                                                    <p className="text-caption font-bold uppercase tracking-widest">No Document Found</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                                                <span className="text-caption font-medium text-zinc-400 uppercase tracking-widest">Expected Sum</span>
                                                <span className="text-heading-sm font-black text-black">₦{selectedPayment.total_price.toLocaleString()}</span>
                                            </div>
                                            
                                            <div className="space-y-4">
                                                <button
                                                    onClick={() => handleVerify(selectedPayment)}
                                                    disabled={verifyingId === selectedPayment.id || !selectedPayment.receipt_url}
                                                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-5 rounded-2xl text-body-sm font-medium tracking-widest uppercase shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                                                >
                                                    {verifyingId === selectedPayment.id ? (
                                                        <>
                                                            <Loader2 size={20} className="animate-spin" />
                                                            Processing...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircle2 size={20} />
                                                            Authorize & Verify
                                                        </>
                                                    )}
                                                </button>
                                                <button className="w-full bg-zinc-50 hover:bg-red-50 text-zinc-400 hover:text-red-500 py-5 rounded-2xl text-caption font-medium tracking-widest uppercase transition-all flex items-center justify-center gap-3">
                                                    <XCircle size={18} />
                                                    Flag Investigation
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Security Watermark */}
                                    <div className="absolute -bottom-10 -right-10 text-zinc-50 opacity-10 pointer-events-none transform -rotate-12 translate-y-1/2">
                                        <ExternalLink size={240} />
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="bg-zinc-50/50 rounded-[3rem] border border-dashed border-zinc-200 h-[600px] flex flex-col items-center justify-center p-12 text-center gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-zinc-300 shadow-sm border border-zinc-100">
                                        <Filter size={24} />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-body font-bold text-zinc-400">Select for Audit</h4>
                                        <p className="text-caption font-medium text-zinc-400/60 uppercase tracking-widest leading-relaxed">Choose a pending credit from the queue to start verification process</p>
                                    </div>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    );
}
