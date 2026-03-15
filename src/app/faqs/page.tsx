'use client'

import StaticPage from "@/components/StaticPage";

export default function FAQsPage() {
  return (
    <StaticPage 
      title="Frequently Asked Questions" 
      subtitle="Everything you need to know about booking with Luxel."
    >
      <div className="space-y-8">
        {[
          { 
            q: "How do I book a flight on budget?", 
            a: "Our algorithm scans thousands of premium routes to find the best value-for-money elite experiences. Simply use the 'Best Price' filter in your flight search." 
          },
          { 
            q: "What payment methods do you accept?", 
            a: "We accept all major credit cards, bank transfers, and premium digital wallets including Apple Pay and Google Pay." 
          },
          { 
            q: "Can I manage multiple bookings at once?", 
            a: "Yes! Your 'My Trips' dashboard provides a unified view of all your flights, hotels, and tours in one place." 
          },
          { 
            q: "Is my personal data safe with Luxel?", 
            a: "Absolutely. We use enterprise-grade encryption and strictly follow global privacy standards to protect your information." 
          },
          { 
            q: "How do I become a Luxel Agent?", 
            a: "You can apply through our 'Become an Agent' portal. We look for established travel professionals with a proven track record." 
          }
        ].map((faq, i) => (
          <div key={i} className="p-8 rounded-[2rem] border border-zinc-100 bg-white hover:border-amber transition-all group cursor-pointer shadow-sm">
            <h3 className="text-xl font-bold text-zinc-900 mb-4 flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-amber/10 flex items-center justify-center text-amber text-sm shrink-0">Q</span>
              {faq.q}
            </h3>
            <p className="text-zinc-600 pl-12 leading-relaxed">
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </StaticPage>
  );
}
