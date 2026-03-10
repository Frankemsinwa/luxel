'use client'

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Camera,
    ShieldCheck,
    Bell,
    CreditCard,
    Save,
    ChevronRight,
    Award
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [profile, setProfile] = useState({
        full_name: "",
        phone: "",
        role: "USER",
        loyalty_points: 0,
        avatar_url: ""
    });

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setUser(session.user);

                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (data) {
                    setProfile({
                        full_name: data.full_name || "",
                        phone: data.phone || "",
                        role: data.role || "USER",
                        loyalty_points: data.loyalty_points || 0,
                        avatar_url: data.avatar_url || ""
                    });
                }
            }
            setLoading(false);
        };

        fetchProfile();
    }, []);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating(true);
        setMessage(null);

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: profile.full_name,
                    phone: profile.phone,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (error) throw error;
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border-4 border-amber border-t-transparent animate-spin" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-amber/10 flex items-center justify-center text-amber mb-6">
                    <ShieldCheck size={40} />
                </div>
                <h1 className="text-3xl font-black text-zinc-900 mb-4">Portal Locked</h1>
                <p className="text-zinc-500 max-w-sm mb-8">Please authenticate to access your private Luxel profile and settings.</p>
                <button
                    onClick={() => window.location.href = '/'}
                    className="bg-zinc-900 text-white px-10 py-4 rounded-2xl font-bold text-xs tracking-widest uppercase hover:bg-zinc-800 transition-all"
                >
                    Return to Lobby
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Sidebar Area */}
                    <aside className="lg:col-span-4 space-y-8">
                        <div className="bg-white rounded-[3rem] p-10 border border-zinc-100 shadow-sm text-center">
                            <div className="relative inline-block mb-6">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-amber/10 ring-8 ring-zinc-50 relative group">
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Camera className="text-white" size={24} />
                                    </div>
                                    <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-3xl font-black text-zinc-300">
                                        {profile.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-amber flex items-center justify-center text-black border-4 border-white">
                                    <Award size={18} />
                                </div>
                            </div>

                            <h2 className="text-2xl font-black text-zinc-900 tracking-tight">{profile.full_name || 'Luxel Member'}</h2>
                            <p className="text-amber font-black text-[10px] tracking-[0.2em] uppercase mt-1">{profile.role} STATUS</p>

                            <div className="mt-8 pt-8 border-t border-zinc-50 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Tier Points</p>
                                    <p className="text-xl font-black text-zinc-900">{profile.loyalty_points.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Upcoming</p>
                                    <p className="text-xl font-black text-zinc-900">2</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2.5rem] overflow-hidden border border-zinc-100 shadow-sm">
                            <nav className="flex flex-col">
                                {[
                                    { icon: <User size={18} />, label: "Personal Information", active: true },
                                    { icon: <Bell size={18} />, label: "Notifications" },
                                    { icon: <CreditCard size={18} />, label: "Saved Methods" },
                                    { icon: <ShieldCheck size={18} />, label: "Security & Privacy" }
                                ].map((item, i) => (
                                    <button
                                        key={i}
                                        className={`flex items-center justify-between px-8 py-5 transition-all hover:bg-zinc-50 ${item.active ? 'bg-amber/5 text-amber' : 'text-zinc-400 group'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            {item.icon}
                                            <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                                        </div>
                                        <ChevronRight size={14} className={item.active ? 'opacity-100' : 'opacity-0'} />
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <div className="lg:col-span-8 space-y-8">
                        <section className="bg-white rounded-[3rem] p-12 border border-zinc-100 shadow-sm">
                            <div className="flex items-center justify-between mb-12">
                                <div>
                                    <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Personal Information</h1>
                                    <p className="text-zinc-500 font-medium">Manage your elite profile details and contact preferences.</p>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-amber/10 flex items-center justify-center text-amber">
                                    <User size={24} />
                                </div>
                            </div>

                            {message && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`mb-8 p-5 rounded-2xl text-xs font-bold ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-500 border border-red-100'}`}
                                >
                                    {message.text}
                                </motion.div>
                            )}

                            <form onSubmit={handleUpdate} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-4">Full Name</label>
                                        <div className="relative group">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-amber transition-colors">
                                                <User size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                value={profile.full_name}
                                                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                                placeholder="Enter full name"
                                                className="w-full bg-zinc-50 border-none rounded-2xl py-5 pl-14 pr-6 text-sm font-bold text-zinc-900 focus:ring-2 focus:ring-amber/20 transition-all font-satoshi"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-4">Contact Phone</label>
                                        <div className="relative group">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-amber transition-colors">
                                                <Phone size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                value={profile.phone}
                                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                                placeholder="+234 000 0000"
                                                className="w-full bg-zinc-50 border-none rounded-2xl py-5 pl-14 pr-6 text-sm font-bold text-zinc-900 focus:ring-2 focus:ring-amber/20 transition-all font-satoshi"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-4">Registered Email</label>
                                    <div className="relative">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            value={user.email}
                                            disabled
                                            className="w-full bg-zinc-50 border-none rounded-2xl py-5 pl-14 pr-6 text-sm font-bold text-zinc-300 cursor-not-allowed font-satoshi"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-4">Address / Billing Location</label>
                                    <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-amber transition-colors">
                                            <MapPin size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="London, UK"
                                            className="w-full bg-zinc-50 border-none rounded-2xl py-5 pl-14 pr-6 text-sm font-bold text-zinc-900 focus:ring-2 focus:ring-amber/20 transition-all font-satoshi"
                                        />
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-zinc-50">
                                    <button
                                        type="submit"
                                        disabled={updating}
                                        className="bg-amber hover:bg-black text-white hover:text-white px-12 py-5 rounded-[1.5rem] font-black text-xs tracking-widest uppercase transition-all shadow-xl shadow-amber/10 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                                    >
                                        <span className="group-hover:text-amber transition-colors">{updating ? 'SAVING...' : 'SAVE CHANGES'}</span>
                                        <Save size={16} className="group-hover:text-amber transition-colors" />
                                    </button>
                                </div>
                            </form>
                        </section>

                        <section className="bg-zinc-950 rounded-[3rem] p-12 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-amber/10 rounded-full blur-[100px] -mr-32 -mt-32" />
                            <div className="relative z-10">
                                <h3 className="text-2xl font-black mb-2 tracking-tight">Luxel Insider Status</h3>
                                <p className="text-white/40 font-medium mb-10 text-sm">You are currently in the Elite Tier with priority concierge access.</p>

                                <div className="flex flex-wrap gap-4">
                                    <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl">
                                        <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Status</p>
                                        <p className="text-xs font-black text-amber uppercase tracking-widest">ACTIVE</p>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl">
                                        <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">MEMBER SINCE</p>
                                        <p className="text-xs font-black text-white uppercase tracking-widest">2026</p>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl">
                                        <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">GLOBAL RANK</p>
                                        <p className="text-xs font-black text-white uppercase tracking-widest">#1,402</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
