'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Github, Chrome, ShieldCheck, Gem, Globe } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function AuthContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialMode = (searchParams.get('mode') as 'login' | 'signup') || 'login';
    
    const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [fullName, setFullName] = useState("");
    const [error, setError] = useState<string | null>(null);

    // Sync mode with URL if it changes
    useEffect(() => {
        const urlMode = searchParams.get('mode') as 'login' | 'signup';
        if (urlMode && (urlMode === 'login' || urlMode === 'signup')) {
            setMode(urlMode);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (mode === 'signup') {
                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        }
                    }
                });
                if (signUpError) throw signUpError;
                setMode('login');
                setError("Account created! Please check your email or log in.");
            } else {
                const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (signInError) throw signInError;

                const role = session?.user?.user_metadata?.role;
                if (role === "AGENT") {
                    router.push("/agent/dashboard");
                } else {
                    router.push("/");
                }
            }
        } catch (err: any) {
            setError(err.message || "An authentication error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />
            
            <main className="flex-1 flex flex-col lg:flex-row pt-20">
                {/* Left Side - Image & Branding */}
                <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-900 items-center justify-center overflow-hidden">
                    {/* Abstract background elements */}
                    <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-amber/10 blur-[120px]" />
                    <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] rounded-full bg-white/5 blur-[100px]" />
                    
                    <div className="relative z-10 w-full h-full flex flex-col p-20 justify-between">
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
                            >
                                <Gem size={14} className="text-amber" />
                                <span className="text-[10px] font-bold text-amber uppercase tracking-[0.2em]">The Luxel Standard</span>
                            </motion.div>
                            
                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-6xl font-medium text-white leading-[1.1] tracking-tight max-w-md"
                            >
                                Elevate Your <br />
                                <span className="italic font-light text-amber">Journey</span> to New Heights.
                            </motion.h1>
                            
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-white/50 text-lg font-normal max-w-sm leading-relaxed"
                            >
                                Join our elite community and access a world of bespoke travel experiences curated for the discerning traveler.
                            </motion.p>
                        </div>

                        {/* Character Image */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="absolute bottom-0 right-0 w-[80%] h-[60%] pointer-events-none"
                        >
                            <Image 
                                src="/login-img.png" 
                                alt="Luxel Journey" 
                                fill 
                                className="object-contain object-right-bottom opacity-80"
                                priority
                            />
                        </motion.div>

                        <div className="relative z-10 grid grid-cols-2 gap-10 mt-auto">
                            <div className="space-y-2">
                                <h4 className="text-white font-medium">Global Access</h4>
                                <p className="text-white/40 text-xs leading-relaxed font-normal">Private terminals and exclusive lounges worldwide.</p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-white font-medium">24/7 Concierge</h4>
                                <p className="text-white/40 text-xs leading-relaxed font-normal">Dedicated VIP desk for all your travel requirements.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Auth Form */}
                <div className="flex-1 flex items-center justify-center p-8 md:p-20 bg-white">
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-full max-w-[480px] space-y-10"
                    >
                        <div className="space-y-4">
                            <div className="inline-block px-4 py-1.5 rounded-full bg-amber/10 text-amber text-[10px] font-bold uppercase tracking-[0.2em]">
                                {mode === 'login' ? 'Private Portal' : 'Join the Elite'}
                            </div>
                            <h2 className="text-4xl font-medium text-zinc-900 tracking-tight">
                                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                            </h2>
                            <p className="text-zinc-500 font-normal text-base">
                                {mode === 'login' 
                                    ? 'Enter your credentials to access your luxury concierge.' 
                                    : 'Unlock exclusive rates, priority handling, and global access.'}
                            </p>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`p-5 rounded-2xl text-xs font-semibold ${error.includes('Account created') ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-500 border border-red-100'}`}
                            >
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <AnimatePresence mode="wait">
                                {mode === 'signup' && (
                                    <motion.div 
                                        key="signup-field"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-2 overflow-hidden"
                                    >
                                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">Full Name</label>
                                        <div className="relative group">
                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-amber transition-colors">
                                                <User size={18} strokeWidth={1.5} />
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                placeholder="Enter your name"
                                                className="w-full bg-zinc-50 border border-transparent rounded-2xl py-4 pl-12 pr-6 text-sm font-medium text-zinc-900 focus:ring-2 focus:ring-amber/20 focus:bg-white focus:border-amber/10 transition-all outline-none"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-amber transition-colors">
                                        <Mail size={18} strokeWidth={1.5} />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@luxury.com"
                                        className="w-full bg-zinc-50 border border-transparent rounded-2xl py-4 pl-12 pr-6 text-sm font-medium text-zinc-900 focus:ring-2 focus:ring-amber/20 focus:bg-white focus:border-amber/10 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Password</label>
                                    {mode === 'login' && (
                                        <button type="button" className="text-[10px] font-bold text-amber hover:underline uppercase tracking-widest">Forgot Password?</button>
                                    )}
                                </div>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-amber transition-colors">
                                        <Lock size={18} strokeWidth={1.5} />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-zinc-50 border border-transparent rounded-2xl py-4 pl-12 pr-6 text-sm font-medium text-zinc-900 focus:ring-2 focus:ring-amber/20 focus:bg-white focus:border-amber/10 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-zinc-900 text-white py-5 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 group relative overflow-hidden transition-all hover:scale-[1.01] active:scale-95 shadow-xl shadow-black/5 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="absolute inset-0 bg-amber -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                                <span className="relative z-10 group-hover:text-black transition-colors">
                                    {isLoading ? 'Processing Access...' : mode === 'login' ? 'Sign In to Portal' : 'Create Elite Account'}
                                </span>
                                {!isLoading && <ArrowRight size={18} className="relative z-10 group-hover:text-black transition-colors" />}
                            </button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-100" /></div>
                            <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-white px-4 text-zinc-400 font-bold">Premium SSO</span></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-3 py-4 rounded-2xl border border-zinc-100 hover:bg-zinc-50 transition-all group font-semibold text-xs text-zinc-600">
                                <Chrome size={18} className="text-zinc-400 group-hover:text-amber transition-colors" />
                                Google
                            </button>
                            <button className="flex items-center justify-center gap-3 py-4 rounded-2xl border border-zinc-100 hover:bg-zinc-50 transition-all group font-semibold text-xs text-zinc-600">
                                <Github size={18} className="text-zinc-400 group-hover:text-amber transition-colors" />
                                Apple
                            </button>
                        </div>

                        <div className="text-center pt-4">
                            <p className="text-sm font-medium text-zinc-500">
                                {mode === 'login' ? "Not yet a member? " : "Already an elite member? "}
                                <button
                                    onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                                    className="text-amber font-black hover:underline ml-1"
                                >
                                    {mode === 'login' ? 'Request Membership' : 'Sign In'}
                                </button>
                            </p>
                        </div>

                        <div className="pt-10 flex items-center justify-center gap-8 border-t border-zinc-50">
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={14} className="text-emerald-500" />
                                <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">TLS 1.3 Secure</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Globe size={14} className="text-blue-500" />
                                <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Global Support</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default function AuthPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><div className="w-10 h-10 border-4 border-amber border-t-transparent rounded-full animate-spin" /></div>}>
            <AuthContent />
        </Suspense>
    );
}
