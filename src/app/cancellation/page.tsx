'use client'

import StaticPage from "@/components/StaticPage";

export default function CancellationPage() {
  return (
    <StaticPage 
      title="Cancellation Option" 
      subtitle="Flexible plans for a changing world. Understand your rights and options."
    >
      <div className="space-y-12">
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Flexible Booking</h2>
          <p className="text-lg text-zinc-600">
            At Luxel, we understand that plans can change. That's why we offer tiered cancellation options tailored to your needs.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
              tier: "Standard", 
              price: "Free", 
              desc: "Cancel up to 7 days before departure for a full refund in travel credits." 
            },
            { 
              tier: "Premium", 
              price: "+5% Booking", 
              desc: "Cancel up to 48 hours before departure for a 90% cash refund." 
            },
            { 
              tier: "Elite Flex", 
              price: "+12% Booking", 
              desc: "Cancel anytime up to the moment of departure for a 100% cash refund." 
            }
          ].map((item, i) => (
            <div key={i} className={`p-8 rounded-[2rem] border ${i === 2 ? 'border-amber bg-amber/5' : 'border-zinc-100 bg-white'} space-y-4 shadow-sm`}>
              <h3 className="font-bold text-zinc-900">{item.tier}</h3>
              <p className="text-2xl font-bold text-amber">{item.price}</p>
              <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <section className="bg-zinc-50 p-8 rounded-2xl border border-zinc-100">
          <h3 className="font-bold text-zinc-900 mb-2">How to Cancel</h3>
          <p className="text-zinc-600 text-sm">
            Cancellations can be managed directly through your "My Trips" dashboard. For urgent requests within 24 hours of departure, please contact our concierge team immediately.
          </p>
        </section>
      </div>
    </StaticPage>
  );
}
