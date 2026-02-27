'use client'

import { motion } from "framer-motion";
import {
    Search,
    Filter,
    MoreHorizontal,
    User,
    TrendingUp,
    CreditCard,
    Shield,
    Mail,
    Phone
} from "lucide-react";
import { useState } from "react";

export default function MembersPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const members = [
        { id: "M-1029", name: "Jonathan Wick", tier: "VIP", since: "2023", spent: "$492,000", lastFlight: "Oct 20, 2026", status: "Active" },
        { id: "M-1035", name: "Sofia Al-Aziz", tier: "Elite", since: "2024", spent: "$128,500", lastFlight: "Oct 22, 2026", status: "Active" },
        { id: "M-1082", name: "Michael Chen", tier: "Business", since: "2022", spent: "$89,200", lastFlight: "Oct 15, 2026", status: "Active" },
        { id: "M-1102", name: "Elena Rossi", tier: "VIP", since: "2021", spent: "$612,400", lastFlight: "Oct 10, 2026", status: "Away" },
        { id: "M-1145", name: "David Beckham", tier: "VIP", since: "2020", spent: "$890,200", lastFlight: "Now", status: "Active" },
        { id: "M-1156", name: "Amara Okoro", tier: "Elite", since: "2024", spent: "$45,000", lastFlight: "Yesterday", status: "Active" },
    ];

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-2">Elite Members</h1>
                    <p className="text-zinc-500 font-medium">Directory of Luxel's most valued clients and their preferences.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group w-80">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-amber transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by name, ID or tier..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border-none rounded-2xl py-4 pl-12 pr-4 text-xs font-bold text-zinc-900 shadow-sm focus:ring-2 focus:ring-amber/10 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6">
                <div className="bg-zinc-900 rounded-[2rem] p-8 text-white flex items-center justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Total Member Equity</p>
                        <h3 className="text-2xl font-black">$12,482,000</h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-amber relative z-10">
                        <TrendingUp size={24} />
                    </div>
                    {/* Abstract background pattern */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                </div>
                <div className="bg-white rounded-[2rem] p-8 border border-zinc-100 flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">New Members (Month)</p>
                        <h3 className="text-2xl font-black text-zinc-900">142</h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400">
                        <User size={24} />
                    </div>
                </div>
                <div className="bg-white rounded-[2rem] p-8 border border-zinc-100 flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Elite Tier Retention</p>
                        <h3 className="text-2xl font-black text-zinc-900">98.4%</h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400">
                        <Shield size={24} />
                    </div>
                </div>
            </div>

            {/* Members Table */}
            <div className="bg-white rounded-[3rem] border border-zinc-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50/50">
                                <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Member ID</th>
                                <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Name</th>
                                <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Tier</th>
                                <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Spent</th>
                                <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Last Flight</th>
                                <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Status</th>
                                <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {members.map((member, i) => (
                                <tr key={member.id} className="hover:bg-zinc-50/50 transition-colors group">
                                    <td className="px-10 py-6 font-bold text-zinc-400 text-xs tracking-tighter">{member.id}</td>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-zinc-100 overflow-hidden relative border border-zinc-200">
                                                <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 to-zinc-300 opacity-30" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-zinc-900 leading-none mb-1">{member.name}</p>
                                                <p className="text-[10px] font-medium text-zinc-400 italic">Member since {member.since}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className={`text-[10px] font-black px-3 py-1 rounded-lg border ${member.tier === 'VIP' ? 'bg-zinc-900 text-white border-zinc-900' :
                                                member.tier === 'Elite' ? 'bg-amber/10 text-amber border-amber/20' :
                                                    'bg-zinc-100 text-zinc-500 border-zinc-200'
                                            }`}>
                                            {member.tier}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6 text-sm font-black text-zinc-900">{member.spent}</td>
                                    <td className="px-10 py-6 text-xs font-bold text-zinc-400">{member.lastFlight}</td>
                                    <td className="px-10 py-6 text-sm">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${member.status === 'Active' ? 'bg-emerald-50 text-emerald-500' : 'bg-zinc-100 text-zinc-400'
                                            }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${member.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-zinc-300'
                                                }`} />
                                            {member.status}
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 rounded-lg hover:bg-zinc-100 transition-colors text-zinc-400 hover:text-zinc-900">
                                                <Mail size={16} />
                                            </button>
                                            <button className="p-2 rounded-lg hover:bg-zinc-100 transition-colors text-zinc-400 hover:text-amber">
                                                <MoreHorizontal size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
