'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Loader2, UserX, UserCheck, Search, ShieldAlert } from 'lucide-react';

interface Agent {
    id: string;
    full_name: string;
    email: string;
    is_banned: boolean;
    created_at: string;
}

export default function AgentsPage() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchAgents();
    }, []);

    const fetchAgents = async () => {
        try {
            const { data } = await api.get('/admin/agents');
            setAgents(data);
        } catch (error) {
            console.error('Failed to fetch agents:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleBan = async (id: string, currentStatus: boolean) => {
        if (!confirm(`Are you sure you want to ${currentStatus ? 'unban' : 'ban'} this agent?`)) return;

        setActionLoading(id);
        try {
            await api.patch(`/admin/agents/${id}/ban`, { isBanned: !currentStatus });
            setAgents(prev => prev.map(a => a.id === id ? { ...a, is_banned: !currentStatus } : a));
        } catch (error) {
            alert('Failed to update agent status');
        } finally {
            setActionLoading(null);
        }
    };

    const filteredAgents = agents.filter(a =>
        a.full_name?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin text-black" size={32} />
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Agent Management</h1>
                <p className="text-zinc-500 text-lg font-medium">Control access and monitor all active agents.</p>
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm">
                <Search size={20} className="text-zinc-400" />
                <input
                    type="text"
                    placeholder="Search agents by name..."
                    className="flex-1 bg-transparent border-none outline-none text-body-sm font-medium"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="grid gap-6">
                {filteredAgents.map((agent) => (
                    <div
                        key={agent.id}
                        className={`bg-white border p-6 rounded-3xl flex items-center justify-between transition-all ${
                            agent.is_banned ? 'border-red-100 bg-red-50/10' : 'border-zinc-100 hover:shadow-xl hover:shadow-black/5'
                        }`}
                    >
                        <div className="flex items-center gap-5">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold ${
                                agent.is_banned ? 'bg-red-100 text-red-600' : 'bg-black text-white'
                            }`}>
                                {agent.full_name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    {agent.full_name}
                                    {agent.is_banned && (
                                        <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                            Banned
                                        </span>
                                    )}
                                </h3>
                                <p className="text-zinc-500 text-sm font-medium">Joined {new Date(agent.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <button
                            onClick={() => toggleBan(agent.id, agent.is_banned)}
                            disabled={actionLoading === agent.id}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                                agent.is_banned
                                    ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20'
                                    : 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20'
                            } disabled:opacity-50`}
                        >
                            {actionLoading === agent.id ? (
                                <Loader2 className="animate-spin" size={18} />
                            ) : agent.is_banned ? (
                                <UserCheck size={18} />
                            ) : (
                                <UserX size={18} />
                            )}
                            {agent.is_banned ? 'Unban Agent' : 'Ban Agent'}
                        </button>
                    </div>
                ))}

                {filteredAgents.length === 0 && (
                    <div className="text-center py-20 bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-200">
                        <ShieldAlert className="mx-auto text-zinc-300 mb-4" size={48} />
                        <p className="text-zinc-500 font-medium italic">No agents found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
