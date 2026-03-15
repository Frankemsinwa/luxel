'use client'

import StaticPage from "@/components/StaticPage";

export default function RefundPage() {
  return (
    <StaticPage 
      title="Sales and Refund" 
      subtitle="Clear information on our payment and refund processes."
    >
      <div className="prose prose-zinc max-w-none text-zinc-600 space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-zinc-900">1. Payment Policy</h2>
          <p>All bookings must be paid in full at the time of reservation unless otherwise specified.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-zinc-900">2. Refund Eligibility</h2>
          <p>Refunds are subject to the specific cancellation policy selected during booking. Please refer to our Cancellation Option page for details.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-zinc-900">3. Processing Time</h2>
          <p>Approved refunds are typically processed within 5-10 business days to the original payment method.</p>
        </section>
      </div>
    </StaticPage>
  );
}
