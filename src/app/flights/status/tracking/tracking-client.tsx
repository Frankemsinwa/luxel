'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { readTracker, writeTracker, type BookingTrackerRecord } from '@/lib/bookingTracker';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, RefreshCw } from 'lucide-react';

function prettyStatus(s?: string) {
  if (!s) return 'Unknown';
  return s
    .toString()
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

export default function TrackingClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestIdParam = searchParams.get('requestId');

  const [tracker, setTracker] = useState<BookingTrackerRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<any>(null);
  const [requestStatus, setRequestStatus] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = readTracker();
    setTracker(t);
  }, []);

  const headers = useMemo(() => {
    if (!tracker?.guestToken) return undefined;
    return { 'x-guest-token': tracker.guestToken };
  }, [tracker?.guestToken]);

  const refresh = async (opts?: { silent?: boolean }) => {
    if (!tracker) return;
    if (!opts?.silent) setLoading(true);
    setError(null);
    try {
      const reqRes = await api.get(`/bookings/requests/${tracker.requestId}/status`, { headers });
      setRequestStatus(reqRes.data);

      let bookingData = null;
      if (tracker.bookingId) {
        try {
          const bookingRes = await api.get(`/bookings/${tracker.bookingId}/status`, { headers });
          bookingData = bookingRes.data;
          setBookingStatus(bookingData);
        } catch {
          // No booking yet (LUXEL_ASSISTANCE flow) — that's fine
        }
      }

      const next: BookingTrackerRecord = {
        ...tracker,
        lastKnownRequestStatus: reqRes.data?.status ?? tracker.lastKnownRequestStatus,
        lastKnownBookingStatus: bookingData?.status ?? tracker.lastKnownBookingStatus,
        lastSyncedAt: Date.now(),
      };
      setTracker(next);
      writeTracker(next);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Unable to fetch status right now.');
    } finally {
      if (!opts?.silent) setLoading(false);
    }
  };

  useEffect(() => {
    if (!tracker) return;
    refresh({ silent: true });
    const t = window.setInterval(() => refresh({ silent: true }), 15000);
    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracker?.bookingId, tracker?.requestId, tracker?.guestToken]);

  const mismatch = Boolean(requestIdParam && tracker?.requestId && requestIdParam !== tracker.requestId);
  const isAssistance = !tracker?.bookingId;
  const requestStatusStr = (requestStatus?.status ?? tracker?.lastKnownRequestStatus ?? '').toUpperCase();

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      <Navbar />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/5 hover:bg-black/10 text-body-sm font-medium text-black transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="mt-6 rounded-[2.5rem] border border-black/10 bg-white shadow-[0_30px_90px_rgba(0,0,0,0.08)] p-7 md:p-10">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
              <div>
                <div className="text-heading-lg font-medium text-black">{isAssistance ? 'Track your request' : 'Track your booking'}</div>
                <div className="text-body text-black/60 mt-2">
                  We save your progress on this device (if you accepted cookies), so you can come back anytime.
                </div>
              </div>

              <button
                onClick={() => refresh()}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-black text-white hover:bg-black/90 text-body-sm font-medium transition-colors"
                disabled={!tracker || loading}
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>

            {!tracker && (
              <div className="mt-8 rounded-2xl border border-black/10 bg-black/[0.03] p-5">
                <div className="text-body font-medium text-black">No tracking data found on this device</div>
                <div className="text-body-sm text-black/70 mt-1">
                  If you cleared cookies/storage or switched devices, we cannot recover guest tracking automatically.
                  If you logged in, check <span className="font-medium text-black">My Trips</span>.
                </div>
              </div>
            )}

            {tracker && (
              <>
                {mismatch && (
                  <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                    <div className="text-body font-medium text-black">This link does not match your saved booking</div>
                    <div className="text-body-sm text-black/70 mt-1">
                      We’ll show the booking saved on this device: <span className="font-medium text-black">{tracker.bookingRef}</span>.
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5">
                    <div className="text-body font-medium text-black">Status unavailable</div>
                    <div className="text-body-sm text-black/70 mt-1">{error}</div>
                  </div>
                )}

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-black/10 bg-white p-5">
                    <div className="text-caption text-black/50 tracking-widest uppercase">Request</div>
                    <div className="text-heading-sm font-medium text-black mt-2">
                      {prettyStatus(requestStatus?.status ?? tracker.lastKnownRequestStatus)}
                    </div>
                    <div className="text-body-sm text-black/60 mt-2">
                      {isAssistance
                        ? 'This is your flight assistance request with our team.'
                        : 'This is your request in the agent queue (open, in-progress, confirmed, etc).'}
                    </div>
                  </div>

                  {!isAssistance ? (
                    <div className="rounded-2xl border border-black/10 bg-white p-5">
                      <div className="text-caption text-black/50 tracking-widest uppercase">Booking</div>
                      <div className="text-heading-sm font-medium text-black mt-2">
                        {prettyStatus(bookingStatus?.status ?? tracker.lastKnownBookingStatus)}
                      </div>
                      {bookingStatus?.airline_booking_reference && (
                        <div className="text-body-sm text-black/60 mt-2">
                          Airline PNR: <span className="font-medium text-black">{bookingStatus.airline_booking_reference}</span>
                        </div>
                      )}
                      <div className="text-body-sm text-black/60 mt-2">
                        This is the state of your booking record on Luxel.
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-black/10 bg-white p-5">
                      <div className="text-caption text-black/50 tracking-widest uppercase">Payment</div>
                      <div className="text-heading-sm font-medium text-black mt-2">
                        {requestStatusStr === 'RESOLVED' ? 'Payment Received' : 'Awaiting Payment'}
                      </div>
                      <div className="text-body-sm text-black/60 mt-2">
                        {requestStatusStr === 'RESOLVED'
                          ? 'Our team will now proceed to book your flight. You will receive an email with your booking confirmation.'
                          : 'Please complete your bank transfer to proceed with your flight assistance.'}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 rounded-2xl border border-black/10 bg-black/[0.03] p-5">
                  <div className="text-body-sm text-black/70">
                    {isAssistance ? (
                      <>
                        Your reference: <span className="font-medium text-black">{tracker.requestId.substring(0, 8).toUpperCase()}</span>
                      </>
                    ) : (
                      <>
                        Your Luxel reference: <span className="font-medium text-black">{bookingStatus?.airline_booking_reference || tracker.bookingRef}</span>
                      </>
                    )}
                  </div>
                  <div className="text-caption text-black/50 mt-2">
                    Saved: {new Date(tracker.createdAt).toLocaleString()}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

