'use client'

import StaticPage from "@/components/StaticPage";
import { ShieldCheck, Lock, Eye, AlertCircle } from "lucide-react";

export default function SafetyPage() {
  return (
    <StaticPage 
      title="Safety Information" 
      subtitle="Your safety and security are our top priorities. Here's how we protect you."
    >
      <div className="space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { 
              title: "Secure Payments", 
              desc: "We use industry-standard encryption to ensure your financial data is always protected.",
              icon: <ShieldCheck className="text-amber" size={32} />
            },
            { 
              title: "Verified Hosts", 
              desc: "Every property and service provider on Luxel undergoes a rigorous vetting process.",
              icon: <Lock className="text-amber" size={32} />
            },
            { 
              title: "Travel Insurance", 
              desc: "We partner with leading providers to offer comprehensive travel insurance for every trip.",
              icon: <Eye className="text-amber" size={32} />
            },
            { 
              title: "24/7 Monitoring", 
              desc: "Our automated systems and support team monitor for suspicious activity round the clock.",
              icon: <AlertCircle className="text-amber" size={32} />
            }
          ].map((item, i) => (
            <div key={i} className="p-8 rounded-[2rem] border border-zinc-100 bg-zinc-50 space-y-4">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-zinc-900">{item.title}</h3>
              <p className="text-zinc-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <section className="prose prose-zinc max-w-none">
          <h2 className="text-3xl font-bold text-zinc-900 mb-6">Our Commitment to Quality</h2>
          <p className="text-lg text-zinc-600">
            Luxel is built on trust. We work exclusively with reputable airlines, five-star hotels, and certified tour operators. Our "Quality Shield" program ensures that if anything goes wrong during your trip, we're there to make it right immediately.
          </p>
        </section>
      </div>
    </StaticPage>
  );
}
