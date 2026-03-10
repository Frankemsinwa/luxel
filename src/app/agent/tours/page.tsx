'use client'

import api from '@/lib/api';
import { motion } from "framer-motion";
import {
    Plus,
    Search,
    MapPin,
    Calendar,
    Users,
    MoreVertical,
    Eye,
    Edit,
    Trash2,
    Palmtree
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

export default function ToursManagementPage() {
    const router = useRouter();
    const [tours, setTours] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const response = await api.get('/tours/my/listings');
                setTours(response.data);
            } catch (error) {
                console.error('Error fetching tours:', error);
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    router.push('/');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchTours();
    }, [router]);

    const handleArchive = async (id: string) => {
        if (!confirm('Are you sure you want to archive this tour? It will be removed from public listings.')) return;

        try {
            const response = await api.patch(`/tours/${id}`, { status: 'ARCHIVED' });

            if (response.status === 200) {
                setTours(tours.map(t => t.id === id ? { ...t, status: 'ARCHIVED' } : t));
            } else {
                alert('Failed to archive experience.');
            }
        } catch (error) {
            console.error('Archive error:', error);
            alert('An error occurred while archiving.');
        }
    };

    const filteredTours = tours.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-10">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-zinc-900 tracking-tight mb-2">Tour Experiences</h1>
                    <p className="text-zinc-500 font-medium">Manage and curate your elite travel portfolio.</p>
                </div>
                <button
                    onClick={() => router.push('/agent/tours/create')}
                    className="bg-zinc-900 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-zinc-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
                >
                    <Plus size={20} />
                    Create New Tour
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm transition-all hover:shadow-md">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Total Tours</p>
                    <h3 className="text-3xl font-black text-zinc-900 tracking-tight">{tours.length}</h3>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm transition-all hover:shadow-md">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Active Listings</p>
                    <h3 className="text-3xl font-black text-emerald-500 tracking-tight">{tours.filter(t => t.status === 'PUBLISHED').length}</h3>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm transition-all hover:shadow-md">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Drafts / Archived</p>
                    <h3 className="text-3xl font-black text-amber tracking-tight">{tours.filter(t => t.status !== 'PUBLISHED').length}</h3>
                </div>
            </div>

            {/* Main Area */}
            <div className="bg-white rounded-[3rem] border border-zinc-100 shadow-sm overflow-hidden min-h-[400px]">
                <div className="p-10 border-b border-zinc-50 bg-white/50 backdrop-blur-sm">
                    <div className="relative w-96">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" />
                        <input
                            type="text"
                            placeholder="Filter by title or location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-zinc-50 border-none rounded-xl py-3 pl-12 pr-4 text-xs font-bold text-zinc-900 focus:ring-2 focus:ring-amber/10 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50/50">
                                <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest w-[400px]">Experience Details</th>
                                <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Base Price</th>
                                <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Status</th>
                                <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-20 text-zinc-300 font-bold uppercase tracking-widest text-xs">Accessing your luxury portfolio...</td>
                                </tr>
                            ) : filteredTours.length > 0 ? filteredTours.map((tour) => (
                                <tr key={tour.id} className="hover:bg-zinc-50/50 transition-colors group">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-2xl bg-zinc-100 relative overflow-hidden flex-shrink-0 shadow-sm">
                                                {tour.hero_image ? (
                                                    <Image src={tour.hero_image} alt={tour.title} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-zinc-300 bg-zinc-50">
                                                        <Palmtree size={24} />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-zinc-900 mb-1">{tour.title}</h4>
                                                <div className="flex items-center gap-3 text-xs text-zinc-400 font-medium whitespace-nowrap">
                                                    <div className="flex items-center gap-1"><MapPin size={12} className="text-amber" /> {tour.location}</div>
                                                    <div className="flex items-center gap-1"><Calendar size={12} className="text-amber" /> {tour.duration}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className="text-sm font-bold text-zinc-900 tracking-tight">₦{Number(tour.price).toLocaleString()}</span>
                                        <p className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase">Per Guest</p>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${tour.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-600' :
                                            tour.status === 'ARCHIVED' ? 'bg-zinc-100 text-zinc-400' : 'bg-amber/5 text-amber'
                                            }`}>
                                            {tour.status}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <button
                                                onClick={() => window.open(`/tour/${tour.slug}`, '_blank')}
                                                className="p-2 rounded-lg bg-white border border-zinc-100 text-zinc-400 hover:text-blue-500 shadow-sm hover:shadow-md active:scale-95 transition-all"
                                                title="Preview Experience"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => router.push(`/agent/tours/edit/${tour.id}`)}
                                                className="p-2 rounded-lg bg-white border border-zinc-100 text-zinc-400 hover:text-amber shadow-sm hover:shadow-md active:scale-95 transition-all"
                                                title="Edit Metadata"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            {tour.status !== 'ARCHIVED' && (
                                                <button
                                                    onClick={() => handleArchive(tour.id)}
                                                    className="p-2 rounded-lg bg-white border border-zinc-100 text-zinc-400 hover:text-red-500 shadow-sm hover:shadow-md active:scale-95 transition-all"
                                                    title="Archive Tour"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="text-center py-24">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 rounded-3xl bg-zinc-50 flex items-center justify-center text-zinc-200">
                                                <Palmtree size={32} />
                                            </div>
                                            <p className="text-zinc-400 font-bold">No exclusive experiences found.</p>
                                            <button
                                                onClick={() => router.push('/agent/tours/create')}
                                                className="text-amber font-bold text-xs uppercase tracking-widest hover:underline"
                                            >
                                                Start Curating Your First Tour
                                            </button>
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
