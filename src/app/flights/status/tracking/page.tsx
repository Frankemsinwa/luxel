import { Suspense } from 'react';
import TrackingClient from './tracking-client';

export default function BookingTrackingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center">
          <div className="text-body text-black/60">Loading booking status...</div>
        </div>
      }
    >
      <TrackingClient />
    </Suspense>
  );
}

