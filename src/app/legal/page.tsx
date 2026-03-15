'use client'

import StaticPage from "@/components/StaticPage";

export default function LegalPage() {
  return (
    <StaticPage 
      title="Legal Information" 
      subtitle="Corporate information and legal compliance details."
    >
      <div className="prose prose-zinc max-w-none text-zinc-600 space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-zinc-900">Corporate Identity</h2>
          <p>Luxel Travel Group is a registered entity operating under global travel regulations. Our headquarters are located in Abuja, Nigeria.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-zinc-900">Compliance</h2>
          <p>We comply with international aviation standards, hospitality regulations, and data protection laws (including GDPR and local mandates).</p>
        </section>
      </div>
    </StaticPage>
  );
}
