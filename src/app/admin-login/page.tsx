'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ShieldCheck, Eye, EyeOff, Mail, Lock, AlertCircle, Loader2, KeyRound } from 'lucide-react';
import Link from 'next/link';

type LoginStep = 'credentials' | 'two_fa';

export default function AdminLoginPage() {
    const router = useRouter();
    const [step, setStep] = useState<LoginStep>('credentials');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [totpCode, setTotpCode] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Stored after successful password login, before 2FA
    const [pendingUserId, setPendingUserId] = useState('');

    const API = process.env.NEXT_PUBLIC_API_URL || 'https://luxel-8o9h.vercel.app/api';

    // ── Step 1: Sign in with email/password ──────────────────────────────────
    const handleCredentials = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

            if (signInError || !data.user) {
                setError(signInError?.message || 'Invalid email or password.');
                return;
            }

            const user = data.user;

            // Must be ADMIN
            if (user.user_metadata?.role !== 'ADMIN') {
                await supabase.auth.signOut();
                setError('Access denied. This portal is for administrators only.');
                return;
            }

            // Check if 2FA is enabled
            const statusRes = await fetch(`${API}/auth/2fa/status?userId=${user.id}`);
            const statusData = await statusRes.json();

            if (statusData.two_fa_enabled) {
                // Sign out the session temporarily — we do NOT grant access yet
                // We store the userId and proceed to the 2FA step
                await supabase.auth.signOut();
                setPendingUserId(user.id);
                setStep('two_fa');
            } else {
                // No 2FA — redirect straight to dashboard
                router.push('/admin/dashboard');
            }
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // ── Step 2: Verify TOTP then re-sign-in to create session ────────────────
    const handleTwoFA = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${API}/auth/2fa/validate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: pendingUserId, token: totpCode }),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Invalid 2FA code.');
                return;
            }

            // 2FA passed — re-create session
            const { error: reSignInError } = await supabase.auth.signInWithPassword({ email, password });
            if (reSignInError) {
                setError('2FA passed but session creation failed. Please try again.');
                return;
            }

            router.push('/admin/dashboard');
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-[120px]" />
                <div className="absolute bottom-[-20%] right-1/4 w-[300px] h-[300px] rounded-full bg-white/3 blur-[80px]" />
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30 mb-4">
                        <ShieldCheck size={28} className="text-black" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Admin Portal</h1>
                    <p className="text-zinc-400 mt-2 text-sm">
                        {step === 'credentials' ? 'Sign in to the Luxel admin panel' : 'Enter your authenticator code'}
                    </p>
                </div>

                {/* Step indicator */}
                <div className="flex items-center gap-2 mb-6">
                    <div className={`flex-1 h-1 rounded-full transition-colors ${step === 'credentials' ? 'bg-amber-500' : 'bg-amber-500'}`} />
                    <div className={`flex-1 h-1 rounded-full transition-colors ${step === 'two_fa' ? 'bg-amber-500' : 'bg-white/10'}`} />
                </div>

                {/* Card */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
                    {error && (
                        <div className="mb-5 flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm">
                            <AlertCircle size={16} className="shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* ── Credentials ── */}
                    {step === 'credentials' && (
                        <form onSubmit={handleCredentials} className="space-y-5">
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Email Address</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                                    <input
                                        id="admin-login-email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="admin@luxel.com"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Password</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                                    <input
                                        id="admin-login-password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="Your admin password"
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
                                id="admin-login-submit"
                                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-semibold rounded-xl py-3 transition-all text-sm mt-2"
                            >
                                {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                                {loading ? 'Verifying...' : 'Sign In'}
                            </button>
                        </form>
                    )}

                    {/* ── 2FA ── */}
                    {step === 'two_fa' && (
                        <form onSubmit={handleTwoFA} className="space-y-5">
                            <div className="text-center mb-2">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-3">
                                    <KeyRound size={20} className="text-amber-400" />
                                </div>
                                <p className="text-zinc-400 text-sm">Open your authenticator app and enter the 6-digit code for <span className="text-white">{email}</span></p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Authenticator Code</label>
                                <input
                                    id="admin-2fa-code"
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={6}
                                    value={totpCode}
                                    onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    required
                                    placeholder="000000"
                                    autoFocus
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white text-2xl text-center tracking-[0.5em] placeholder-zinc-700 focus:outline-none focus:border-amber-500/50 transition-all font-mono"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading || totpCode.length < 6}
                                id="admin-2fa-submit"
                                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-semibold rounded-xl py-3 transition-all text-sm"
                            >
                                {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                                {loading ? 'Verifying Code...' : 'Verify & Sign In'}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setStep('credentials'); setError(''); setTotpCode(''); }}
                                className="w-full text-zinc-500 hover:text-zinc-300 text-sm transition-colors py-2"
                            >
                                ← Back to sign in
                            </button>
                        </form>
                    )}
                </div>

                {/* Footer */}
                <p className="text-center text-zinc-600 text-xs mt-6">
                    New admin?{' '}
                    <Link href="/admin-luxel" className="text-amber-500 hover:text-amber-400 transition-colors">
                        Create admin account
                    </Link>
                </p>
            </div>
        </div>
    );
}
