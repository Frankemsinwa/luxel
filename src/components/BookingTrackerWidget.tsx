'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { clearTracker, readTracker, writeTracker, type BookingTrackerRecord } from '@/lib/bookingTracker';
import { supabase } from '@/lib/supabase';
import { AnimatePresence, motion } from 'framer-motion';
import { Plane, X, ArrowRight, RefreshCw, CheckCircle2, Clock3 } from 'lucide-react';

function prettyStatus(s?: string) {
  if (!s) return 'Unknown';
  return s
    .toString()
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

export default function BookingTrackerWidget() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [tracker, setTracker] = useState<BookingTrackerRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [airlineBookingRef, setAirlineBookingRef] = useState<string | null>(null);

  const trackStatusResumeUrl = (t: BookingTrackerRecord | null) => {
    if (!t) return;
    try {
      const currentPath = window.location.pathname;
      const currentSearch = window.location.search || '';
      if (!currentPath.startsWith('/flights/status/')) return;
      if (currentPath.startsWith('/flights/status/tracking')) return;

      const url = `${currentPath}${currentSearch}`;
      if (t.lastStatusUrl === url) return;
      const next = { ...t, lastStatusUrl: url };
      setTracker(next);
      writeTracker(next);
    } catch {
      // ignore
    }
  };

  const headers = useMemo(() => {
    if (!tracker?.guestToken) return undefined;
    return { 'x-guest-token': tracker.guestToken };
  }, [tracker?.guestToken]);

  const refresh = async (opts?: { silent?: boolean }) => {
    if (!tracker) return;
    if (!opts?.silent) setLoading(true);
    try {
      const [reqRes, bookingRes] = await Promise.all([
        api.get(`/bookings/requests/${tracker.requestId}/status`, { headers }),
        api.get(`/bookings/${tracker.bookingId}/status`, { headers }),
      ]);

      const next: BookingTrackerRecord = {
        ...tracker,
        lastKnownRequestStatus: reqRes.data?.status ?? tracker.lastKnownRequestStatus,
        lastKnownBookingStatus: bookingRes.data?.status ?? tracker.lastKnownBookingStatus,
        lastSyncedAt: Date.now(),
      };
      setAirlineBookingRef(bookingRes.data?.airline_booking_reference ?? null);
      setTracker(next);
      writeTracker(next);
    } catch {
      // Swallow: tracker is best-effort; they might be offline or token missing.
    } finally {
      if (!opts?.silent) setLoading(false);
    }
  };

  useEffect(() => {
    setTracker(readTracker());
  }, []);

  useEffect(() => {
    // Remember the last status page the user visited so "View" resumes exactly where they stopped.
    trackStatusResumeUrl(readTracker());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!tracker) return;
    refresh({ silent: true });
    const t = window.setInterval(() => refresh({ silent: true }), 15000);

    // Supabase Realtime: instant status updates (fires within ~1s)
    const channel = supabase
      .channel(`widget-request-${tracker.requestId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'requests',
          filter: `id=eq.${tracker.requestId}`,
        },
        () => {
          // A change happened — immediately refresh via API to get full data
          refresh({ silent: true });
        }
      )
      .subscribe();

    return () => {
      window.clearInterval(t);
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracker?.bookingId, tracker?.requestId, tracker?.guestToken]);

  if (!tracker) return null;

  const status = tracker.lastKnownRequestStatus || tracker.lastKnownBookingStatus || 'OPEN';
  const isDone = ['COMPLETED', 'FINALIZED', 'SUCCESS', 'CONFIRMED'].includes(String(status).toUpperCase());

  const buildStatusQuery = () => {
    const q = new URLSearchParams(tracker.contextQuery || '');
    q.set('ref', tracker.bookingRef);
    q.set('id', tracker.bookingId);
    q.set('reqId', tracker.requestId);
    return q.toString();
  };

  const getRouteRank = (path: string) => {
    if (path.startsWith('/flights/status/agent-confirming')) return 1;
    if (path.startsWith('/flights/status/agent-confirmed')) return 2;
    if (path.startsWith('/flights/status/payment')) return 3;
    if (path.startsWith('/flights/status/verifying')) return 4;
    if (path.startsWith('/flights/status/finalized')) return 5;
    if (path.startsWith('/flights/status/success')) return 6;
    return 0;
  };

  const routeFromStatus = () => {
    const req = String(tracker.lastKnownRequestStatus || '').toUpperCase();
    const booking = String(tracker.lastKnownBookingStatus || '').toUpperCase();
    const q = buildStatusQuery();

    // Closed/cancelled should land on agent-confirming where the "rejected" UI exists.
    if (req === 'CLOSED' || booking === 'CANCELLED') return `/flights/status/agent-confirming?${q}`;

    // Once RESOLVED, the minimum step is agent-confirmed (price/routing verified).
    if (req === 'RESOLVED') return `/flights/status/agent-confirmed?${q}`;

    // Default: initial confirming state.
    return `/flights/status/agent-confirming?${q}`;
  };

  const resolveViewUrl = () => {
    const target = routeFromStatus();
    if (!tracker.lastStatusUrl) return target;

    // If they already visited a later step, resume there.
    const minRank = getRouteRank(target);
    const lastRank = getRouteRank(tracker.lastStatusUrl);
    if (lastRank >= minRank) return tracker.lastStatusUrl;
    return target;
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[110] rounded-3xl bg-black text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] px-4 py-3 flex items-center gap-3 hover:bg-black/90 transition-colors max-w-[92vw]"
        aria-label="Open booking status"
      >
        <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
          <Plane size={18} />
        </div>
        <div className="text-left min-w-0">
          <div className="text-body-sm font-medium leading-tight truncate">Booking {tracker.bookingRef}</div>
          <div className="text-caption text-white/70 truncate">{prettyStatus(status)}</div>
        </div>
        <div className="ml-1">
          {isDone ? <CheckCircle2 size={18} className="text-emerald-300" /> : <Clock3 size={18} className="text-amber" />}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[115] bg-black/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ x: 420, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 420, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              className="fixed right-4 bottom-4 z-[116] w-[min(420px,calc(100vw-2rem))] rounded-[2rem] bg-white shadow-[0_30px_90px_rgba(0,0,0,0.25)] border border-black/10 overflow-hidden"
              role="dialog"
              aria-label="Booking status panel"
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-heading-sm font-medium text-black">Your booking status</div>
                    <div className="text-body-sm text-black/60 mt-1">
                      Reference: <span className="font-medium text-black">{tracker.bookingRef}</span>
                    </div>
                    {airlineBookingRef && (
                      <div className="text-body-sm text-black/60 mt-1">
                        Airline PNR: <span className="font-medium text-black">{airlineBookingRef}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="w-10 h-10 rounded-2xl bg-black/5 hover:bg-black/10 flex items-center justify-center text-black transition-colors"
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="mt-5 rounded-2xl bg-black/[0.03] border border-black/5 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-body-sm text-black/70">Request</div>
                    <div className="text-body-sm font-medium text-black">{prettyStatus(tracker.lastKnownRequestStatus)}</div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-body-sm text-black/70">Booking</div>
                    <div className="text-body-sm font-medium text-black">{prettyStatus(tracker.lastKnownBookingStatus)}</div>
                  </div>
                  {tracker.lastSyncedAt && (
                    <div className="text-caption text-black/50 mt-3">
                      Last updated: {new Date(tracker.lastSyncedAt).toLocaleString()}
                    </div>
                  )}
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <button
                    onClick={() => refresh()}
                    className="flex-1 px-4 py-3 rounded-2xl border border-black/10 bg-white hover:bg-black/5 text-body-sm font-medium text-black transition-colors flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    Refresh
                  </button>
                  <button
                    onClick={() => {
                      setOpen(false);
                      router.push(resolveViewUrl());
                    }}
                    className="flex-1 px-4 py-3 rounded-2xl bg-black text-white hover:bg-black/90 text-body-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    View
                    <ArrowRight size={16} />
                  </button>
                </div>

                <button
                  onClick={() => {
                    clearTracker();
                    setTracker(null);
                    setOpen(false);
                  }}
                  className="mt-4 w-full px-4 py-3 rounded-2xl bg-red-500/10 hover:bg-red-500/15 text-body-sm font-medium text-red-700 transition-colors"
                >
                  Clear from this device
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
