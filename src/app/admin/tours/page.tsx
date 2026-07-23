'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Loader2, Palmtree, MapPin, Archive, Send, ExternalLink, Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Tour {
    id: string;
    title: string;
    location: string;
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    agent: { full_name: string };
    price: number;
    slug: string;
}

export default function AdminToursPage() {
    const router = useRouter();
    const [tours, setTours] = useState<Tour[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        fetchTours();
    }, []);

    const fetchTours = async () => {
        try {
            const { data } = await api.get('/admin/tours');
            setTours(data);
        } catch (error) {
            console.error('Failed to fetch tours:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: string) => {
        setUpdatingId(id);
        try {
            await api.patch(`/tours/${id}`, { status: newStatus });
            setTours(prev => prev.map(t => t.id === id ? { ...t, status: newStatus as any } : t));
            // Re-fetch to be safe and get updated logs/state if needed
            await fetchTours();
        } catch (error) {
            alert('Failed to update tour status');
        } finally {
            setUpdatingId(null);
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
                <h1 className="text-3xl font-bold tracking-tight">Experience Oversight</h1>
                <p className="text-zinc-500 text-lg font-medium">Manage all tours across the platform.</p>
            </div>

            <div className="grid gap-6">
                {tours.map((tour) => (
                    <div key={tour.id} className="bg-white border border-zinc-100 p-6 rounded-3xl flex items-center justify-between hover:shadow-xl hover:shadow-black/5 transition-all">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 border border-zinc-100">
                                <Palmtree size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">{tour.title}</h3>
                                <div className="flex items-center gap-4 mt-1 text-sm font-medium text-zinc-500">
                                    <span className="flex items-center gap-1.5"><MapPin size={14} /> {tour.location}</span>
                                    <span>•</span>
                                    <span>By {tour.agent?.full_name || 'System'}</span>
                                    <span>•</span>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                        tour.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-600' :
                                        tour.status === 'ARCHIVED' ? 'bg-red-50 text-red-600' : 'bg-zinc-100 text-zinc-600'
                                    }`}>
                                        {tour.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <a
                                href={`/tours/${tour.slug}`}
                                target="_blank"
                                className="p-3 rounded-xl bg-zinc-50 text-zinc-600 hover:bg-black hover:text-white transition-all"
                                title="Preview Experience"
                            >
                                <ExternalLink size={18} />
                            </a>

                            <button
                                onClick={() => router.push(`/admin/tours/edit/${tour.id}`)}
                                className="p-3 rounded-xl bg-zinc-50 text-zinc-600 hover:bg-amber hover:text-black transition-all"
                                title="Edit Metadata"
                            >
                                <Edit size={18} />
                            </button>

                            {tour.status !== 'PUBLISHED' && (
                                <button
                                    onClick={() => updateStatus(tour.id, 'PUBLISHED')}
                                    disabled={!!updatingId}
                                    className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-all disabled:opacity-50"
                                >
                                    {updatingId === tour.id ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                                    Publish
                                </button>
                            )}

                            {tour.status !== 'ARCHIVED' && (
                                <button
                                    onClick={() => updateStatus(tour.id, 'ARCHIVED')}
                                    disabled={!!updatingId}
                                    className="flex items-center gap-2 px-6 py-3 bg-zinc-100 text-zinc-900 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                                >
                                    {updatingId === tour.id ? <Loader2 className="animate-spin" size={18} /> : <Archive size={18} />}
                                    Archive
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
