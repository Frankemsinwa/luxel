'use client'

import api from '@/lib/api';
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Save,
    Trash2,
    Loader2,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
    DollarSign,
    Calculator
} from "lucide-react";
import { useState, useEffect } from "react";

export default function FlightTaxManagementPage() {
    const [taxes, setTaxes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [newTax, setNewTax] = useState({ name: '', amount: 0 });

    useEffect(() => {
        fetchTaxes();
    }, []);

    const fetchTaxes = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/admin/flight-taxes');
            setTaxes(response.data);
        } catch (error) {
            console.error('Error fetching taxes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveTax = async (id: string, name: string, amount: number) => {
        setIsSaving(id);
        try {
            await api.patch(`/admin/flight-taxes/${id}`, { name, amount });
            await fetchTaxes();
        } catch (error) {
            console.error('Error saving tax:', error);
            alert('Failed to save tax.');
        } finally {
            setIsSaving(null);
        }
    };

    const handleCreateTax = async () => {
        if (!newTax.name || newTax.amount < 0) return;
        setIsAdding(true);
        try {
            await api.post('/admin/flight-taxes', newTax);
            setNewTax({ name: '', amount: 0 });
            await fetchTaxes();
        } catch (error) {
            console.error('Error creating tax:', error);
            alert('Failed to create tax.');
        } finally {
            setIsAdding(false);
        }
    };

    const handleDeleteTax = async (id: string) => {
        if (!confirm('Are you sure you want to remove this tax? This will affect new bookings immediately.')) return;
        try {
            await api.delete(`/admin/flight-taxes/${id}`);
            await fetchTaxes();
        } catch (error) {
            console.error('Error deleting tax:', error);
        }
    };

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-heading-lg font-medium text-zinc-900 tracking-tight mb-2">Flight Tax Breakdown</h1>
                    <p className="text-zinc-500 font-medium">Manage the taxes and fees applied to every flight booking.</p>
                </div>
                <button
                    onClick={fetchTaxes}
                    className="p-3 rounded-xl bg-zinc-50 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all"
                >
                    <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Tax List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[3rem] border border-zinc-100 shadow-sm overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-50/50">
                                    <th className="px-10 py-6 text-caption font-medium text-zinc-400 uppercase tracking-widest">Tax Name</th>
                                    <th className="px-10 py-6 text-caption font-medium text-zinc-400 uppercase tracking-widest">Amount (NGN)</th>
                                    <th className="px-10 py-6 text-caption font-medium text-zinc-400 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={3} className="py-20 text-center">
                                            <Loader2 size={32} className="text-amber animate-spin mx-auto mb-4" />
                                            <p className="text-zinc-400 font-medium">Loading tax data...</p>
                                        </td>
                                    </tr>
                                ) : taxes.length > 0 ? (
                                    taxes.map((tax) => (
                                        <TaxRow
                                            key={tax.id}
                                            tax={tax}
                                            isSaving={isSaving === tax.id}
                                            onSave={(name, amount) => handleSaveTax(tax.id, name, amount)}
                                            onDelete={() => handleDeleteTax(tax.id)}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="py-20 text-center text-zinc-300 font-medium italic">
                                            No taxes defined. Add one using the form on the right.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            {taxes.length > 0 && !isLoading && (
                                <tfoot>
                                    <tr className="bg-amber/5">
                                        <td className="px-10 py-6 font-black text-zinc-900 uppercase tracking-widest text-xs">Total Taxes</td>
                                        <td className="px-10 py-6 font-black text-zinc-900">
                                            ₦{taxes.reduce((sum, t) => sum + Number(t.amount), 0).toLocaleString()}
                                        </td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                </div>

                {/* Add New Tax Form */}
                <div className="space-y-6">
                    <div className="bg-zinc-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-zinc-200">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-amber/10 flex items-center justify-center text-amber">
                                <Plus size={24} />
                            </div>
                            <h2 className="text-heading-sm font-medium tracking-tight">Add New Tax</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">Tax Description</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Security Fee"
                                    value={newTax.name}
                                    onChange={(e) => setNewTax({ ...newTax, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-amber/20 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">Amount (NGN)</label>
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">₦</span>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={newTax.amount || ''}
                                        onChange={(e) => setNewTax({ ...newTax, amount: Number(e.target.value) })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:ring-2 focus:ring-amber/20 transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleCreateTax}
                                disabled={isAdding || !newTax.name}
                                className="w-full bg-amber text-black py-5 rounded-2xl font-black text-xs tracking-widest uppercase shadow-xl shadow-amber/10 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3"
                            >
                                {isAdding ? <Loader2 size={18} className="animate-spin" /> : <Calculator size={18} />}
                                Add Tax to System
                            </button>
                        </div>
                    </div>

                    <div className="bg-amber/5 border border-amber/10 rounded-[2.5rem] p-8">
                        <div className="flex items-start gap-4">
                            <AlertCircle className="text-amber shrink-0" size={20} />
                            <div>
                                <h4 className="text-sm font-black text-zinc-900 uppercase tracking-tight mb-2">Important Note</h4>
                                <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                                    Changes made here will reflect immediately on the Flight Details and Booking pages for all customers. Past bookings will retain their original tax breakdown.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TaxRow({ tax, onSave, onDelete, isSaving }: {
    tax: any,
    onSave: (name: string, amount: number) => void,
    onDelete: () => void,
    isSaving: boolean
}) {
    const [name, setName] = useState(tax.name);
    const [amount, setAmount] = useState(tax.amount);

    useEffect(() => {
        setName(tax.name);
        setAmount(tax.amount);
    }, [tax]);

    const isDifferent = name !== tax.name || Number(amount) !== Number(tax.amount);

    return (
        <tr className="hover:bg-zinc-50/50 transition-colors group">
            <td className="px-10 py-6">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full bg-transparent border-b-2 py-1 text-sm font-bold transition-all focus:outline-none ${isDifferent ? 'border-amber text-zinc-900' : 'border-transparent text-zinc-600'}`}
                />
            </td>
            <td className="px-10 py-6">
                <div className="relative w-40">
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-300 font-bold">₦</span>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className={`w-full bg-transparent border-b-2 py-1 pl-6 text-sm font-black transition-all focus:outline-none ${isDifferent ? 'border-amber text-zinc-900' : 'border-transparent text-zinc-600'}`}
                    />
                </div>
            </td>
            <td className="px-10 py-6 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onSave(name, amount)}
                        disabled={isSaving || !isDifferent}
                        className={`p-2.5 rounded-xl transition-all ${isDifferent ? 'bg-zinc-900 text-amber hover:scale-105 active:scale-95 shadow-lg' : 'text-zinc-300 cursor-default'}`}
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
                {isDifferent && !isSaving && (
                    <div className="flex items-center justify-end gap-1 text-[8px] font-black text-amber uppercase tracking-widest mt-1">
                        <AlertCircle size={10} /> Unsaved
                    </div>
                )}
                {!isDifferent && (
                    <div className="flex items-center justify-end gap-1 text-[8px] font-black text-emerald-500 uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <CheckCircle2 size={10} /> Live
                    </div>
                )}
            </td>
        </tr>
    );
}
