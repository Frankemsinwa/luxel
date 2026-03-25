'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import api from '@/lib/api';
import {
    ShieldCheck,
    ShieldOff,
    QrCode,
    KeyRound,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Info,
    Copy,
    Check,
} from 'lucide-react';

type Status = 'idle' | 'loading' | 'error' | 'success';

export default function AdminSecurityPage() {
    const [user, setUser] = useState<any>(null);
    const [twoFAEnabled, setTwoFAEnabled] = useState(false);

    // Setup flow state
    const [qrCode, setQrCode] = useState('');
    const [secret, setSecret] = useState('');
    const [setupToken, setSetupToken] = useState('');
    const [disableToken, setDisableToken] = useState('');

    const [setupStatus, setSetupStatus] = useState<Status>('idle');
    const [verifyStatus, setVerifyStatus] = useState<Status>('idle');
    const [disableStatus, setDisableStatus] = useState<Status>('idle');

    const [statusMsg, setStatusMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [copied, setCopied] = useState(false);

    const [mode, setMode] = useState<'overview' | 'setup' | 'disable'>('overview');

    const loadUser = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setUser(user);
            setTwoFAEnabled(user.user_metadata?.two_fa_enabled === true);
        }
    }, []);

    useEffect(() => { loadUser(); }, [loadUser]);

    const clearMessages = () => { setErrorMsg(''); setStatusMsg(''); };

    // ── Initiate setup ────────────────────────────────────────────────────────
    const handleSetup = async () => {
        clearMessages();
        setSetupStatus('loading');
        try {
            const res = await api.post('/auth/2fa/setup');
            setQrCode(res.data.qrCode);
            setSecret(res.data.secret);
            setMode('setup');
            setSetupStatus('idle');
        } catch (err: any) {
            setErrorMsg(err.response?.data?.message || 'Failed to generate 2FA setup.');
            setSetupStatus('error');
        }
    };

    // ── Confirm setup ─────────────────────────────────────────────────────────
    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        clearMessages();
        setVerifyStatus('loading');
        try {
            const res = await api.post('/auth/2fa/verify-setup', { token: setupToken });
            setStatusMsg(res.data.message);
            setTwoFAEnabled(true);
            setVerifyStatus('success');
            setMode('overview');
            setSetupToken('');
            // Refresh user session to get updated metadata
            await supabase.auth.refreshSession();
            await loadUser();
        } catch (err: any) {
            setErrorMsg(err.response?.data?.message || 'Invalid code. Please try again.');
            setVerifyStatus('error');
        }
    };

    // ── Disable 2FA ───────────────────────────────────────────────────────────
    const handleDisable = async (e: React.FormEvent) => {
        e.preventDefault();
        clearMessages();
        setDisableStatus('loading');
        try {
            const res = await api.post('/auth/2fa/disable', { token: disableToken });
            setStatusMsg(res.data.message);
            setTwoFAEnabled(false);
            setDisableStatus('success');
            setMode('overview');
            setDisableToken('');
            await supabase.auth.refreshSession();
            await loadUser();
        } catch (err: any) {
            setErrorMsg(err.response?.data?.message || 'Invalid code. Could not disable 2FA.');
            setDisableStatus('error');
        }
    };

    const copySecret = () => {
        navigator.clipboard.writeText(secret);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-2xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Security Settings</h1>
                <p className="text-zinc-500 mt-1 text-sm">Manage two-factor authentication for your admin account.</p>
            </div>

            {/* Status Messages */}
            {statusMsg && (
                <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
                    <CheckCircle2 size={16} className="shrink-0" />
                    {statusMsg}
                </div>
            )}
            {errorMsg && (
                <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
                    <AlertCircle size={16} className="shrink-0" />
                    {errorMsg}
                </div>
            )}

            {/* ── Overview Card ── */}
            {mode === 'overview' && (
                <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-zinc-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${twoFAEnabled ? 'bg-green-50 text-green-600' : 'bg-zinc-100 text-zinc-400'}`}>
                                    {twoFAEnabled ? <ShieldCheck size={22} /> : <ShieldOff size={22} />}
                                </div>
                                <div>
                                    <h2 className="text-base font-semibold text-zinc-900">Two-Factor Authentication</h2>
                                    <p className="text-sm text-zinc-500 mt-0.5">
                                        {twoFAEnabled
                                            ? 'Your account is protected with 2FA'
                                            : 'Add an extra layer of security'}
                                    </p>
                                </div>
                            </div>
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${twoFAEnabled ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'}`}>
                                {twoFAEnabled ? 'ENABLED' : 'DISABLED'}
                            </span>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="bg-zinc-50 rounded-xl p-4 mb-6 flex gap-3">
                            <Info size={16} className="text-zinc-400 shrink-0 mt-0.5" />
                            <p className="text-sm text-zinc-500">
                                When 2FA is enabled, every admin sign-in will require a 6-digit code from your authenticator app (Google Authenticator, Authy, etc.) after entering your password.
                            </p>
                        </div>

                        {twoFAEnabled ? (
                            <button
                                onClick={() => { setMode('disable'); clearMessages(); }}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium transition-all"
                            >
                                <ShieldOff size={16} />
                                Disable 2FA
                            </button>
                        ) : (
                            <button
                                onClick={handleSetup}
                                disabled={setupStatus === 'loading'}
                                id="enable-2fa-btn"
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black text-white hover:bg-zinc-800 disabled:opacity-60 text-sm font-medium transition-all"
                            >
                                {setupStatus === 'loading' ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <ShieldCheck size={16} />
                                )}
                                Enable 2FA
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* ── Setup Flow ── */}
            {mode === 'setup' && (
                <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-zinc-100">
                        <h2 className="text-base font-semibold text-zinc-900 flex items-center gap-2">
                            <QrCode size={18} />
                            Scan QR Code
                        </h2>
                        <p className="text-sm text-zinc-500 mt-1">Scan this code with your authenticator app, then enter the 6-digit code to confirm.</p>
                    </div>

                    <div className="p-6">
                        {/* QR Code */}
                        {qrCode && (
                            <div className="flex justify-center mb-6">
                                <div className="p-4 bg-white border-2 border-zinc-200 rounded-2xl inline-block shadow-sm">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
                                </div>
                            </div>
                        )}

                        {/* Manual secret */}
                        <div className="mb-6">
                            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Can&apos;t scan? Enter manually:</p>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm font-mono text-zinc-700 break-all">
                                    {secret}
                                </code>
                                <button
                                    onClick={copySecret}
                                    className="p-2.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-500 hover:text-zinc-800 transition-all"
                                >
                                    {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Verify */}
                        <form onSubmit={handleVerify} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">
                                    Verification Code
                                </label>
                                <input
                                    id="2fa-setup-token"
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={6}
                                    value={setupToken}
                                    onChange={(e) => setSetupToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    required
                                    placeholder="000000"
                                    autoFocus
                                    className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-xl text-center tracking-[0.5em] font-mono placeholder-zinc-300 focus:outline-none focus:border-black transition-all"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={verifyStatus === 'loading' || setupToken.length < 6}
                                    id="2fa-setup-confirm"
                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-black text-white rounded-xl hover:bg-zinc-800 disabled:opacity-50 text-sm font-medium transition-all"
                                >
                                    {verifyStatus === 'loading' ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <CheckCircle2 size={16} />
                                    )}
                                    Activate 2FA
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setMode('overview'); clearMessages(); }}
                                    className="px-4 py-3 rounded-xl border border-zinc-200 text-zinc-500 hover:bg-zinc-50 text-sm transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Disable Flow ── */}
            {mode === 'disable' && (
                <div className="bg-white border border-red-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-red-100 bg-red-50">
                        <h2 className="text-base font-semibold text-red-700 flex items-center gap-2">
                            <ShieldOff size={18} />
                            Disable Two-Factor Authentication
                        </h2>
                        <p className="text-sm text-red-500 mt-1">Enter your current authenticator code to confirm and disable 2FA.</p>
                    </div>

                    <div className="p-6">
                        <form onSubmit={handleDisable} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                                    <KeyRound size={14} />
                                    Current Authenticator Code
                                </label>
                                <input
                                    id="2fa-disable-token"
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={6}
                                    value={disableToken}
                                    onChange={(e) => setDisableToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    required
                                    placeholder="000000"
                                    autoFocus
                                    className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-xl text-center tracking-[0.5em] font-mono placeholder-zinc-300 focus:outline-none focus:border-red-400 transition-all"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={disableStatus === 'loading' || disableToken.length < 6}
                                    id="2fa-disable-confirm"
                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 text-sm font-medium transition-all"
                                >
                                    {disableStatus === 'loading' ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <ShieldOff size={16} />
                                    )}
                                    Confirm Disable
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setMode('overview'); clearMessages(); }}
                                    className="px-4 py-3 rounded-xl border border-zinc-200 text-zinc-500 hover:bg-zinc-50 text-sm transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* User info */}
            {user && (
                <div className="mt-6 flex items-center gap-3 text-xs text-zinc-400">
                    <div className="w-6 h-6 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-600 font-medium text-xs">
                        {user.email?.[0]?.toUpperCase()}
                    </div>
                    <span>Signed in as <span className="text-zinc-600 font-medium">{user.email}</span></span>
                </div>
            )}
        </div>
    );
}
