'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Loader2, History, User, Activity } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Log {
    id: string;
    actor_id: string;
    action: string;
    entity_type: string;
    entity_id: string;
    details: any;
    created_at: string;
    actor: {
        full_name: string;
        avatar_url: string;
    };
}

export default function LogsPage() {
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const { data } = await api.get('/admin/logs');
                setLogs(data);
            } catch (error) {
                console.error('Failed to fetch logs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const getActionColor = (action: string) => {
        if (action.includes('BAN')) return 'text-red-600 bg-red-50 border-red-100';
        if (action.includes('PUBLISH')) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
        if (action.includes('APPROVE')) return 'text-blue-600 bg-blue-50 border-blue-100';
        return 'text-zinc-600 bg-zinc-50 border-zinc-100';
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin text-black" size={32} />
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Activity Logs</h1>
                <p className="text-zinc-500 text-lg font-medium">Real-time audit trail of all agent and admin actions.</p>
            </div>

            <div className="bg-white border border-zinc-100 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50/50 border-b border-zinc-100">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Agent</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Action</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Entity</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Details</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-zinc-50/30 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 font-bold text-xs border border-zinc-200">
                                                {log.actor?.full_name?.charAt(0) || <User size={14} />}
                                            </div>
                                            <span className="text-sm font-bold text-zinc-900">{log.actor?.full_name || 'System'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${getActionColor(log.action)}`}>
                                            {log.action.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-medium text-zinc-500">
                                        {log.entity_type || '—'}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap text-sm text-zinc-500 font-medium italic">
                                            {JSON.stringify(log.details)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-medium text-zinc-400">
                                        {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {logs.length === 0 && (
                    <div className="py-20 text-center">
                        <Activity className="mx-auto text-zinc-200 mb-3" size={40} />
                        <p className="text-zinc-400 italic">No activity recorded yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
