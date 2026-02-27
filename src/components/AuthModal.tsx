'use client'
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, ArrowRight, Github, Chrome } from "lucide-react";
import { useState } from "react";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: 'login' | 'signup';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
    const router = useRouter();
    const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulation delay
        await new Promise(resolve => setTimeout(resolve, 800));

        if (email === "agent@gmail.com" && password === "password") {
            router.push("/agent/dashboard");
            onClose();
        } else {
            // Standard user logic (mocked)
            onClose();
        }
        setIsLoading(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-[500px] bg-white rounded-[3rem] overflow-hidden shadow-2xl"
                    >
                        {/* Shimmer line top */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber/0 via-amber/50 to-amber/0" />

                        <div className="p-12 relative">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-8 right-8 w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-colors"
                            >
                                <X size={20} />
                            </button>

                            {/* Header */}
                            <div className="mb-10 text-center">
                                <motion.div
                                    key={mode}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="inline-block px-4 py-1.5 rounded-full bg-amber/10 text-amber text-[10px] font-black uppercase tracking-[0.2em] mb-4"
                                >
                                    {mode === 'login' ? 'Welcome Back' : 'Join the Elite'}
                                </motion.div>
                                <h2 className="text-4xl font-bold text-zinc-900 mb-2">
                                    {mode === 'login' ? 'Private Portal' : 'Create Account'}
                                </h2>
                                <p className="text-zinc-500 font-light">
                                    {mode === 'login'
                                        ? 'Access your luxury travel concierge.'
                                        : 'Unlock exclusive rates and priority handling.'}
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {mode === 'signup' && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-4">Full Name</label>
                                        <div className="relative group">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-amber transition-colors">
                                                <User size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Enter your name"
                                                className="w-full bg-zinc-50 border-none rounded-[1.5rem] py-5 pl-14 pr-6 text-sm font-bold text-zinc-900 focus:ring-2 focus:ring-amber/20 transition-all"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-4">Email Address</label>
                                    <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-amber transition-colors">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@luxury.com"
                                            className="w-full bg-zinc-50 border-none rounded-[1.5rem] py-5 pl-14 pr-6 text-sm font-bold text-zinc-900 focus:ring-2 focus:ring-amber/20 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between px-4">
                                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Password</label>
                                        {mode === 'login' && (
                                            <button type="button" className="text-[10px] font-bold text-amber hover:underline uppercase tracking-widest">Forgot?</button>
                                        )}
                                    </div>
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
                                            className="w-full bg-zinc-50 border-none rounded-[1.5rem] py-5 pl-14 pr-6 text-sm font-bold text-zinc-900 focus:ring-2 focus:ring-amber/20 transition-all"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-zinc-900 text-white py-5 rounded-[1.5rem] font-bold text-sm flex items-center justify-center gap-3 group relative overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <div className="absolute inset-0 bg-amber -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                                    <span className="relative z-10 group-hover:text-black transition-colors">
                                        {isLoading ? 'Processing...' : mode === 'login' ? 'Enter Portal' : 'Create Account'}
                                    </span>
                                    {!isLoading && <ArrowRight size={18} className="relative z-10 group-hover:text-black transition-colors" />}
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="my-10 flex items-center gap-4">
                                <div className="flex-1 h-px bg-zinc-100" />
                                <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Premium SSO</span>
                                <div className="flex-1 h-px bg-zinc-100" />
                            </div>

                            {/* SSO Buttons */}
                            <div className="grid grid-cols-2 gap-4">
                                <button className="flex items-center justify-center gap-3 py-4 rounded-2xl border border-zinc-100 hover:bg-zinc-50 transition-colors group">
                                    <Chrome size={18} className="text-zinc-400 group-hover:text-amber transition-colors" />
                                    <span className="text-xs font-bold text-zinc-600">Google</span>
                                </button>
                                <button className="flex items-center justify-center gap-3 py-4 rounded-2xl border border-zinc-100 hover:bg-zinc-50 transition-colors group">
                                    <Github size={18} className="text-zinc-400 group-hover:text-amber transition-colors" />
                                    <span className="text-xs font-bold text-zinc-600">Apple</span>
                                </button>
                            </div>

                            <div className="mt-10 text-center">
                                <p className="text-sm font-medium text-zinc-500">
                                    {mode === 'login' ? "Don't have an account? " : "Already a member? "}
                                    <button
                                        onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                                        className="text-amber font-bold hover:underline"
                                    >
                                        {mode === 'login' ? 'Join Luxel' : 'Login'}
                                    </button>
                                </p>
                            </div>
                        </div>

                        {/* Footer Accent */}
                        <div className="bg-zinc-900 p-8 flex items-center justify-center gap-8">
                            <div className="flex flex-col items-center">
                                <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em]">SECURE</span>
                                <div className="w-1 h-1 rounded-full bg-amber mt-1" />
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em]">ENCRYPTED</span>
                                <div className="w-1 h-1 rounded-full bg-amber mt-1" />
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em]">VERIFIED</span>
                                <div className="w-1 h-1 rounded-full bg-amber mt-1" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
