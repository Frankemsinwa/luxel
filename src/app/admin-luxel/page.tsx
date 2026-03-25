'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ShieldCheck, Eye, EyeOff, KeyRound, User, Mail, Lock, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';

type Step = 'register' | 'login' | 'success';

export default function AdminRegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>('register');

    // Register form state
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secret, setSecret] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showSecret, setShowSecret] = useState(false);

    // Login state (used after registration to get a session)
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const API = process.env.NEXT_PUBLIC_API_URL || 'https://luxel-8o9h.vercel.app/api';

    // ── Step 1: Register ──────────────────────────────────────────────────────
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${API}/auth/admin/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, fullName, secret }),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Registration failed');
                return;
            }

            setSuccessMsg('Account created! Now log in to access the admin panel.');
            setLoginEmail(email);
            setLoginPassword(password);
            setStep('login');
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // ── Step 2: Login (establish session) ────────────────────────────────────
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: loginEmail,
                password: loginPassword,
            });

            if (signInError) {
                setError(signInError.message);
                return;
            }

            router.push('/admin/dashboard');
        } catch {
            setError('Failed to log in. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-[120px]" />
                <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-white/5 blur-[80px]" />
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30 mb-4">
                        <ShieldCheck size={28} className="text-black" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Admin Registration</h1>
                    <p className="text-zinc-400 mt-2 text-sm">
                        {step === 'register'
                            ? 'Create your Luxel administrator account'
                            : 'Sign in to access the admin panel'}
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
                    {/* Error */}
                    {error && (
                        <div className="mb-5 flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm">
                            <AlertCircle size={16} className="shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Success */}
                    {successMsg && (
                        <div className="mb-5 flex items-center gap-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl px-4 py-3 text-sm">
                            <CheckCircle2 size={16} className="shrink-0" />
                            {successMsg}
                        </div>
                    )}

                    {/* ── Register Form ── */}
                    {step === 'register' && (
                        <form onSubmit={handleRegister} className="space-y-5">
                            {/* Full Name */}
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Full Name</label>
                                <div className="relative">
                                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                        placeholder="John Doe"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 focus:bg-white/8 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Email Address</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="admin@luxel.com"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 focus:bg-white/8 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Password</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={8}
                                        placeholder="Min. 8 characters"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-11 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Secret */}
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Admin Creation Secret</label>
                                <div className="relative">
                                    <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                                    <input
                                        type={showSecret ? 'text' : 'password'}
                                        value={secret}
                                        onChange={(e) => setSecret(e.target.value)}
                                        required
                                        placeholder="Provided by your system administrator"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-11 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowSecret(!showSecret)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                                    >
                                        {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                <p className="mt-2 text-xs text-zinc-600">This is the <code className="text-amber-500/80">ADMIN_CREATION_SECRET</code> environment variable.</p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-xl py-3 transition-all text-sm mt-2"
                            >
                                {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                                {loading ? 'Creating Account...' : 'Create Admin Account'}
                            </button>
                        </form>
                    )}

                    {/* ── Login Form (shown after registration) ── */}
                    {step === 'login' && (
                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Email Address</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                                    <input
                                        type="email"
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Password</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-11 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-semibold rounded-xl py-3 transition-all text-sm mt-2"
                            >
                                {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                                {loading ? 'Signing In...' : 'Sign In to Admin Panel'}
                            </button>
                        </form>
                    )}
                </div>

                {/* Footer */}
                <p className="text-center text-zinc-600 text-xs mt-6">
                    Already have an admin account?{' '}
                    <Link href="/admin/dashboard" className="text-amber-500 hover:text-amber-400 transition-colors">
                        Go to Dashboard
                    </Link>
                </p>
            </div>
        </div>
    );
}
