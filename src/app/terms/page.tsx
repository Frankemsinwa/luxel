'use client'

import StaticPage from "@/components/StaticPage";

export default function TermsPage() {
  return (
    <StaticPage 
      title="Terms of Use" 
      subtitle="The rules and guidelines for using the Luxel platform."
    >
      <div className="prose prose-zinc max-w-none text-zinc-600 space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-zinc-900">1. Acceptance of Terms</h2>
          <p>By accessing Luxel, you agree to comply with these terms. If you do not agree, please do not use our services.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-zinc-900">2. Booking Responsibility</h2>
          <p>Users are responsible for providing accurate information during the booking process. Luxel is not liable for errors caused by incorrect user input.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-zinc-900">3. User Conduct</h2>
          <p>You agree to use Luxel only for lawful purposes and in a way that does not infringe the rights of others.</p>
        </section>
      </div>
    </StaticPage>
  );
}
