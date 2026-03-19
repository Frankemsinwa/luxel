'use client'

import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import { Lock, ArrowRight, ShieldCheck, Gem, Globe, Eye, EyeOff } from "lucide-react";
import { useState, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function ResetPasswordContent() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: password
            });

            if (updateError) throw updateError;

            setSuccess(true);
            setTimeout(() => {
                router.push('/auth?mode=login');
            }, 3000);

        } catch (err: any) {
            setError(err.message || "An error occurred while updating your password.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />

            <main className="flex-1 flex flex-col lg:flex-row pt-20">
                {/* Left Side - Image & Branding (Consistent with Auth Page) */}
                <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-900 items-center justify-center overflow-hidden">
                    <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-amber/10 blur-[120px]" />
                    <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] rounded-full bg-white/5 blur-[100px]" />

                    <div className="relative z-10 w-full h-full flex flex-col p-20 justify-between">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                                <Gem size={14} className="text-amber" />
                                <span className="text-caption font-medium text-amber uppercase tracking-[0.2em]">Security Protocol</span>
                            </div>
                            <h1 className="text-display font-medium text-white leading-[1.1] tracking-tight max-w-md">
                                Secure Your <br />
                                <span className="italic font-light text-amber">Account</span> Credentials.
                            </h1>
                        </div>

                        <div className="absolute bottom-0 right-0 w-[80%] h-[60%] pointer-events-none">
                            <Image
                                src="/login-img-1.png"
                                alt="Luxel Security"
                                fill
                                className="object-contain object-right-bottom opacity-80"
                                priority
                            />
                        </div>
                    </div>
                </div>

                {/* Right Side - Reset Form */}
                <div className="flex-1 flex items-center justify-center p-8 md:p-20 bg-white">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-full max-w-[480px] space-y-10"
                    >
                        <div className="space-y-6">
                            <div className="inline-block px-4 py-1.5 rounded-full bg-zinc-900 text-amber text-caption font-medium uppercase tracking-[0.2em]">
                                Password Restoration
                            </div>
                            <h1 className="text-display font-medium text-zinc-900 leading-[1.1] tracking-tight">
                                Create New <br />
                                <span className="text-amber italic font-newton">Password</span>.
                            </h1>
                            <p className="text-body-lg font-normal text-zinc-500 leading-relaxed">
                                Please enter your new secure credentials to regain access to your private portal.
                            </p>
                        </div>

                        {error && (
                            <div className="p-5 rounded-2xl text-body-sm font-medium bg-red-50 text-red-500 border border-red-100">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="p-5 rounded-2xl text-body-sm font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">
                                Password updated successfully! Redirecting you to login...
                            </div>
                        )}

                        {!success && (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-caption font-medium text-zinc-400 uppercase tracking-widest pl-1">New Password</label>
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
                                </div>

                                <div className="space-y-2">
                                    <label className="text-caption font-medium text-zinc-400 uppercase tracking-widest pl-1">Confirm New Password</label>
                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-amber transition-colors">
                                            <Lock size={18} strokeWidth={1.5} />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full bg-zinc-50 border border-transparent rounded-2xl py-4 pl-12 pr-12 text-body font-medium text-zinc-900 focus:ring-2 focus:ring-amber/20 focus:bg-white focus:border-amber/10 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-zinc-900 text-white py-5 rounded-2xl text-body-sm font-medium flex items-center justify-center gap-3 group relative overflow-hidden transition-all hover:scale-[1.01] active:scale-95 shadow-xl shadow-black/5 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <div className="absolute inset-0 bg-amber -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                                    <span className="relative z-10 group-hover:text-black transition-colors">
                                        {isLoading ? 'Updating Security...' : 'Update Password'}
                                    </span>
                                    {!isLoading && <ArrowRight size={18} className="relative z-10 group-hover:text-black transition-colors" />}
                                </button>
                            </form>
                        )}

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

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><div className="w-10 h-10 border-4 border-amber border-t-transparent rounded-full animate-spin" /></div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
