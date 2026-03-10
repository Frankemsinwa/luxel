'use client'

import api from '@/lib/api';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import {
    User,
    Mail,
    Lock,
    ShieldCheck,
    ArrowRight,
    CheckCircle2,
    Briefcase
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AgentSignupPage() {
    const router = useRouter();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.post('/auth/agent/signup', {
                fullName,
                email,
                password
            });

            if (response.status === 201 || response.status === 200) {
                setIsSuccess(true);
                setTimeout(() => {
                    router.push('/');
                }, 3000);
            } else {
                setError(response.data.message || "Failed to create agent account.");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "A connection error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center text-center p-6">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 rounded-full bg-amber flex items-center justify-center text-black mb-10 shadow-2xl shadow-amber/20"
                >
                    <CheckCircle2 size={48} strokeWidth={2.5} />
                </motion.div>
                <h1 className="text-4xl font-black text-white mb-4 italic">Welcome to the Desk, Agent.</h1>
                <p className="text-white/40 font-medium max-w-md mx-auto">
                    Your concierge credentials have been verified. Redirecting you to the portal...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />

            <div className="flex-1 flex overflow-hidden">
                {/* Left Side: Aesthetic Background */}
                <div className="hidden lg:flex lg:w-1/2 bg-zinc-900 relative p-16 flex-col justify-between">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber/5 rounded-full blur-[120px] -mr-96 -mt-96" />
                        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber/5 rounded-full blur-[100px] -ml-48 -mb-48" />
                    </div>

                    <div className="relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-amber flex items-center justify-center text-black mb-12 shadow-xl shadow-amber/20">
                            <ShieldCheck size={32} />
                        </div>
                        <h1 className="text-6xl font-black text-white tracking-tighter leading-tight mb-8">
                            Join the <span className="italic text-amber underline underline-offset-8">Concierge Elite.</span>
                        </h1>
                        <p className="text-white/40 text-xl font-light max-w-xl leading-relaxed">
                            Luxel is expanding its global network. Apply to manage private aviation, luxury villas, and bespoke travel experiences for the world's most discerning travelers.
                        </p>
                    </div>

                    <div className="relative z-10 grid grid-cols-2 gap-12">
                        <div>
                            <p className="text-amber font-black text-3xl mb-2 tracking-tighter">Verified</p>
                            <p className="text-white/30 text-xs font-bold uppercase tracking-widest">Security Clearance Required</p>
                        </div>
                        <div>
                            <p className="text-white font-black text-3xl mb-2 tracking-tighter">Full Access</p>
                            <p className="text-white/30 text-xs font-bold uppercase tracking-widest">Global Logistics Dashboard</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="w-full lg:w-1/2 p-12 lg:p-24 flex flex-col justify-center bg-white relative">
                    <div className="max-w-[480px] mx-auto w-full">
                        <div className="mb-12">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 text-amber text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                                <Briefcase size={12} />
                                Agent Registration
                            </div>
                            <h2 className="text-4xl font-black text-zinc-900 tracking-tight mb-4">Create Agent Portal</h2>
                            <p className="text-zinc-500 font-medium">Please provide your professional credentials for verification.</p>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-6 p-4 rounded-2xl bg-red-50 text-red-500 text-xs font-bold border border-red-100 flex items-center gap-3"
                                >
                                    <ShieldCheck size={16} />
                                    {error}
                                </motion.div>
                            )}
                        </div>

                        <form onSubmit={handleSignup} className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-4">Professional Name</label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-amber transition-colors">
                                        <User size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Enter your full name"
                                        className="w-full bg-zinc-50 border-none rounded-[1.5rem] py-6 pl-14 pr-8 text-sm font-bold text-zinc-900 focus:ring-4 focus:ring-amber/10 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-4">Work Email Address</label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-amber transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="agent@luxel.travel"
                                        className="w-full bg-zinc-50 border-none rounded-[1.5rem] py-6 pl-14 pr-8 text-sm font-bold text-zinc-900 focus:ring-4 focus:ring-amber/10 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-4">Secure Password</label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-amber transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-zinc-50 border-none rounded-[1.5rem] py-6 pl-14 pr-8 text-sm font-bold text-zinc-900 focus:ring-4 focus:ring-amber/10 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-zinc-900 text-white p-6 rounded-[1.5rem] font-black text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-4 group relative overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-zinc-200 disabled:opacity-50"
                            >
                                <div className="absolute inset-0 bg-amber -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                                <span className="relative z-10 group-hover:text-black transition-colors">
                                    {isLoading ? 'Verifying Credentials...' : 'Register as Agent'}
                                </span>
                                {!isLoading && <ArrowRight size={18} className="relative z-10 group-hover:text-black group-hover:translate-x-1 transition-all" />}
                            </button>
                        </form>

                        <p className="mt-12 text-center text-zinc-400 text-xs font-medium">
                            Already have access? <button onClick={() => router.push('/')} className="text-amber font-black uppercase tracking-widest hover:underline ml-2">Login Here</button>
                        </p>
                    </div>

                    {/* Security Badge */}
                    <div className="absolute bottom-12 right-12 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-300">
                            <Lock size={16} />
                        </div>
                        <div className="text-right">
                            <p className="text-[8px] font-black text-zinc-300 uppercase tracking-widest">Military Grade Encryption</p>
                            <p className="text-[8px] font-black text-zinc-300 uppercase tracking-widest">TLS 1.3 Certified</p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
