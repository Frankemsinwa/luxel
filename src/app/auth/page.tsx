'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Github, Chrome, ShieldCheck, Gem, Globe, Eye, EyeOff } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getSiteUrl } from '@/lib/utils';

function AuthContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialMode = (searchParams.get('mode') as 'login' | 'signup' | 'forgot-password') || 'login';
    
    const [mode, setMode] = useState<'login' | 'signup' | 'forgot-password'>(initialMode);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
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
            if (mode === 'forgot-password') {
                const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${getSiteUrl()}/auth/reset-password`,
                });
                if (resetError) throw resetError;
                setError("Reset link sent! Please check your inbox.");
            } else if (mode === 'signup') {
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
                if (role === "ADMIN") {
                    router.push("/admin/dashboard");
                } else if (role === "AGENT") {
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
                                <span className="text-caption font-medium text-amber uppercase tracking-[0.2em]">The Luxel Standard</span>
                            </motion.div>
                            
                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-display font-medium text-white leading-[1.1] tracking-tight max-w-md"
                            >
                                Elevate Your <br />
                                <span className="italic font-light text-amber">Journey</span> to New Heights.
                            </motion.h1>
                            
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-body-lg font-normal text-white/50 max-w-sm leading-relaxed"
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
                                src="/login-img-1.png" 
                                alt="Luxel Journey" 
                                fill 
                                className="object-contain object-right-bottom opacity-80"
                                priority
                            />
                        </motion.div>

                        <div className="relative z-10 grid grid-cols-2 gap-10 mt-auto">
                            <div className="space-y-2">
                                <h4 className="text-white font-medium">Global Access</h4>
                                <p className="text-body-sm font-normal text-white/40 leading-relaxed">Private terminals and exclusive lounges worldwide.</p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-white font-medium">24/7 Concierge</h4>
                                <p className="text-body-sm font-normal text-white/40 leading-relaxed">Dedicated VIP desk for all your travel requirements.</p>
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
                        <div className="space-y-6">
                            <div className="inline-block px-4 py-1.5 rounded-full bg-zinc-900 text-amber text-caption font-medium uppercase tracking-[0.2em]">
                                {mode === 'login' ? 'Private Portal' : mode === 'signup' ? 'Membership Access' : 'Security Protocol'}
                            </div>
                            <h1 className="text-display font-medium text-zinc-900 leading-[1.1] tracking-tight">
                                {mode === 'login' ? 'Welcome' : mode === 'signup' ? 'Join the' : 'Reset'} <br />
                                <span className="text-amber italic font-newton">{mode === 'login' ? 'Back' : mode === 'signup' ? 'Elite' : 'Access'}</span>.
                            </h1>
                            <p className="text-body-lg font-normal text-zinc-500 leading-relaxed">
                                {mode === 'login' 
                                    ? 'Enter your credentials to access your luxury concierge.' 
                                    : mode === 'signup' ? 'Unlock exclusive rates, priority handling, and global access.'
                                    : 'Enter your email to receive a secure password restoration link.'}
                            </p>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`p-5 rounded-2xl text-body-sm font-medium ${
                                    (error.includes('Account created') || error.includes('Reset link sent'))
                                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                    : 'bg-red-50 text-red-500 border border-red-100'
                                }`}
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
                                        <label className="text-caption font-medium text-zinc-400 uppercase tracking-widest pl-1">Full Name</label>
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
                                                className="w-full bg-zinc-50 border border-transparent rounded-2xl py-4 pl-12 pr-6 text-body font-medium text-zinc-900 focus:ring-2 focus:ring-amber/20 focus:bg-white focus:border-amber/10 transition-all outline-none"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-2">
                                <label className="text-caption font-medium text-zinc-400 uppercase tracking-widest pl-1">Email Address</label>
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
                                        className="w-full bg-zinc-50 border border-transparent rounded-2xl py-4 pl-12 pr-6 text-body font-medium text-zinc-900 focus:ring-2 focus:ring-amber/20 focus:bg-white focus:border-amber/10 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                {mode !== 'forgot-password' && (
                                    <motion.div
                                        key="password-field"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-2 overflow-hidden"
                                    >
                                        <div className="flex justify-between items-center px-1">
                                            <label className="text-caption font-medium text-zinc-400 uppercase tracking-widest">Password</label>
                                            {mode === 'login' && (
                                                <button
                                                    type="button"
                                                    onClick={() => setMode('forgot-password')}
                                                    className="text-caption font-medium text-amber hover:underline uppercase tracking-widest"
                                                >
                                                    Forgot Password?
                                                </button>
                                            )}
                                        </div>
                                        <div className="relative group">
                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-amber transition-colors">
                                                <Lock size={18} strokeWidth={1.5} />
                                            </div>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full bg-zinc-50 border border-transparent rounded-2xl py-4 pl-12 pr-12 text-body font-medium text-zinc-900 focus:ring-2 focus:ring-amber/20 focus:bg-white focus:border-amber/10 transition-all outline-none"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-amber transition-colors"
                                            >
                                                {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-zinc-900 text-white py-5 rounded-2xl text-body-sm font-medium flex items-center justify-center gap-3 group relative overflow-hidden transition-all hover:scale-[1.01] active:scale-95 shadow-xl shadow-black/5 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="absolute inset-0 bg-amber -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                                <span className="relative z-10 group-hover:text-black transition-colors">
                                    {isLoading ? 'Processing...' : mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Sign Up' : 'Send Recovery Link'}
                                </span>
                                {!isLoading && <ArrowRight size={18} className="relative z-10 group-hover:text-black transition-colors" />}
                            </button>
                        </form>

                        <div className="text-center pt-4">
                            <p className="text-body-sm font-medium text-zinc-500">
                                {mode === 'login' ? "Not yet a member? " : mode === 'signup' ? "Already an elite member? " : "Remember your access? "}
                                <button
                                    type="button"
                                    onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                                    className="text-amber font-medium hover:underline ml-1"
                                >
                                    {mode === 'login' ? 'Sign Up' : mode === 'signup' ? 'Sign In' : 'Back to Login'}
                                </button>
                            </p>
                        </div>

                        <div className="pt-10 flex items-center justify-center gap-8 border-t border-zinc-50">
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={14} className="text-emerald-500" />
                                <span className="text-caption font-medium text-zinc-400 uppercase tracking-widest">TLS 1.3 Secure</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Globe size={14} className="text-blue-500" />
                                <span className="text-caption font-medium text-zinc-400 uppercase tracking-widest">Global Support</span>
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
