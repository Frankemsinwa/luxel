'use client'

import StaticPage from "@/components/StaticPage";

export default function PrivacyPage() {
  return (
    <StaticPage 
      title="Privacy Policy" 
      subtitle="How we collect, use, and protect your personal data."
    >
      <div className="prose prose-zinc max-w-none text-zinc-600 space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-zinc-900">1. Data Collection</h2>
          <p>We collect information you provide directly to us when you book a flight, hotel, or tour, including your name, email, payment details, and travel preferences.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-zinc-900">2. Use of Information</h2>
          <p>We use your information to process bookings, provide customer support, and send you relevant updates about your travel plans.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-zinc-900">3. Data Security</h2>
          <p>Luxel employs enterprise-grade encryption and security protocols to ensure your data remains confidential and protected from unauthorized access.</p>
        </section>
      </div>
    </StaticPage>
  );
}
