'use client'

import { motion } from "framer-motion";
import {
    User,
    Bell,
    Shield,
    Smartphone,
    Globe,
    Moon,
    LogOut,
    ChevronRight,
    Camera
} from "lucide-react";

export default function SettingsPage() {
    const sections = [
        {
            title: "Account",
            items: [
                { icon: <User size={20} />, label: "Profile Information", sub: "Name, email, and verification status", type: "link" },
                { icon: <Smartphone size={20} />, label: "2FA Authentication", sub: "Currently enabled via SMS", type: "toggle", enabled: true },
                { icon: <Shield size={20} />, label: "Password & Security", sub: "Last changed 3 weeks ago", type: "link" },
            ]
        },
        {
            title: "Workspace",
            items: [
                { icon: <Bell size={20} />, label: "Notification Center", sub: "In-app alerts and desktop push", type: "link" },
                { icon: <Globe size={20} />, label: "Regional Preferences", sub: "UTC +1 (London), Currency: USD", type: "link" },
                { icon: <Moon size={20} />, label: "Interface Theme", sub: "Luxel Dynamic Dark (Adaptive)", type: "link" },
            ]
        }
    ];

    return (
        <div className="max-w-4xl space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-2">Workspace Settings</h1>
                <p className="text-zinc-500 font-medium">Manage your agent profile and global application preferences.</p>
            </div>

            {/* Profile Header */}
            <div className="bg-white rounded-[3rem] p-10 border border-zinc-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-3xl bg-zinc-100 border border-zinc-200 overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 to-zinc-400 opacity-20" />
                        </div>
                        <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-zinc-900 text-amber flex items-center justify-center border-4 border-white shadow-lg opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                            <Camera size={14} />
                        </button>
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Agent Sarah</h2>
                            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber text-white uppercase tracking-widest">Verified</span>
                        </div>
                        <p className="text-zinc-400 text-sm font-bold tracking-tight">Senior Concierge & Flight Coordinator</p>
                        <p className="text-zinc-300 text-xs font-medium mt-1">UUID: srh-9428-luxel-alpha</p>
                    </div>
                </div>
                <button className="px-6 py-3 rounded-2xl bg-zinc-900 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-zinc-200 hover:scale-105 active:scale-95 transition-all">
                    Edit Profile
                </button>
            </div>

            {/* Settings Sections */}
            {sections.map((section, si) => (
                <div key={section.title} className="space-y-6">
                    <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] pl-4">{section.title}</h3>
                    <div className="bg-white rounded-[3rem] border border-zinc-100 shadow-sm overflow-hidden">
                        <div className="divide-y divide-zinc-50">
                            {section.items.map((item, ii) => (
                                <button key={item.label} className="w-full p-8 flex items-center justify-between hover:bg-zinc-50 transition-colors group">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:text-amber transition-colors shadow-sm">
                                            {item.icon}
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-black text-zinc-900 mb-0.5">{item.label}</p>
                                            <p className="text-xs text-zinc-400 font-medium">{item.sub}</p>
                                        </div>
                                    </div>
                                    {item.type === 'link' ? (
                                        <ChevronRight size={18} className="text-zinc-200 group-hover:text-zinc-900 transition-colors" />
                                    ) : (
                                        <div className={`w-12 h-6 rounded-full transition-all relative ${item.enabled ? 'bg-emerald-500' : 'bg-zinc-200'}`}>
                                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${item.enabled ? 'left-7' : 'left-1'}`} />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            ))}

            <div className="pt-10">
                <button className="flex items-center gap-4 px-8 py-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-black text-[10px] uppercase tracking-widest border border-red-100">
                    <LogOut size={16} />
                    Sign Out of Workspace
                </button>
            </div>
        </div>
    );
}
