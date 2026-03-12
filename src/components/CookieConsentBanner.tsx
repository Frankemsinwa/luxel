'use client';

import { useEffect, useState } from 'react';
import { getCookieConsent, setCookieConsent } from '@/lib/bookingTracker';

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = getCookieConsent();
    setVisible(consent === null);
  }, []);

  const accept = () => {
    setCookieConsent('accepted');

    // Migrate tracker from sessionStorage to localStorage (best effort).
    try {
      const key = 'luxel_booking_tracker_v1';
      const sessionValue = window.sessionStorage.getItem(key);
      if (sessionValue && !window.localStorage.getItem(key)) {
        window.localStorage.setItem(key, sessionValue);
      }
    } catch {}

    setVisible(false);
  };

  const reject = () => {
    setCookieConsent('rejected');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[120]">
      <div className="mx-auto max-w-4xl rounded-3xl border border-black/10 bg-white/90 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <div className="text-body font-medium text-black">Cookies and booking progress</div>
            <div className="text-body-sm text-black/70 mt-1">
              If you accept, we can store your flight booking request status on this device so you can resume if you refresh, close the tab, or come back later.
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={reject}
              className="px-5 py-3 rounded-2xl border border-black/10 bg-white hover:bg-black/5 text-body-sm font-medium text-black transition-colors"
            >
              No thanks
            </button>
            <button
              onClick={accept}
              className="px-5 py-3 rounded-2xl bg-black text-white hover:bg-black/90 text-body-sm font-medium transition-colors"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

