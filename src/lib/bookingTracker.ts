export type CookieConsent = 'accepted' | 'rejected' | null;

export type BookingTrackerRecord = {
  bookingId: string;
  requestId: string;
  bookingRef: string;
  guestToken: string | null;
  createdAt: number; // epoch ms
  contextQuery?: string; // original query params from the booking flow (without ref/id/reqId)
  lastStatusUrl?: string; // last /flights/status/* URL visited on this device
  lastKnownRequestStatus?: string;
  lastKnownBookingStatus?: string;
  lastSyncedAt?: number; // epoch ms
};

const CONSENT_COOKIE = 'luxel_cookie_consent';
const TRACKER_KEY = 'luxel_booking_tracker_v1';

function isBrowser() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

export function getCookieConsent(): CookieConsent {
  if (!isBrowser()) return null;
  const cookie = document.cookie
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${CONSENT_COOKIE}=`));
  if (!cookie) return null;
  const v = decodeURIComponent(cookie.split('=').slice(1).join('='));
  if (v === 'accepted' || v === 'rejected') return v;
  return null;
}

export function setCookieConsent(consent: Exclude<CookieConsent, null>) {
  if (!isBrowser()) return;
  // 180 days
  const maxAge = 60 * 60 * 24 * 180;
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(consent)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

function getPreferredStorage() {
  if (!isBrowser()) return null;
  // If they accepted cookie consent, we persist across sessions; otherwise keep it tab-scoped.
  const consent = getCookieConsent();
  return consent === 'accepted' ? window.localStorage : window.sessionStorage;
}

export function readTracker(): BookingTrackerRecord | null {
  const storage = getPreferredStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(TRACKER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BookingTrackerRecord;
    if (!parsed?.bookingId || !parsed?.requestId || !parsed?.bookingRef) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeTracker(record: BookingTrackerRecord) {
  const storage = getPreferredStorage();
  if (!storage) return;
  storage.setItem(TRACKER_KEY, JSON.stringify(record));
}

export function clearTracker() {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(TRACKER_KEY);
  } catch {}
  try {
    window.sessionStorage.removeItem(TRACKER_KEY);
  } catch {}
}
