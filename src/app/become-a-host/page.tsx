'use client'

import StaticPage from "@/components/StaticPage";

export default function BecomeHostPage() {
  return (
    <StaticPage 
      title="Become a Host" 
      subtitle="Join the world's most exclusive network of luxury property owners and service providers."
    >
      <div className="space-y-16">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Why Host with Luxel?</h2>
            <p className="text-lg text-zinc-600 leading-relaxed">
              Luxel isn't just another booking platform. We are a community of premium hosts who value quality over quantity. By hosting with us, you gain access to a global elite clientele who appreciate the finer details.
            </p>
            <ul className="space-y-4">
              {[
                "Global visibility to high-net-worth individuals",
                "Advanced booking management tools",
                "Dedicated host support team",
                "Secure and timely payments"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-zinc-700">
                  <div className="w-5 h-5 rounded-full bg-amber flex items-center justify-center text-black">
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path d="M5 13l4 4L19 7" /></svg>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-zinc-950 p-12 rounded-[3rem] text-white space-y-8 shadow-2xl">
            <h3 className="text-2xl font-bold">Start Hosting Today</h3>
            <p className="text-zinc-400">Tell us about your property or service, and our team will get back to you within 48 hours.</p>
            <button className="w-full bg-amber text-black py-5 rounded-2xl font-bold tracking-widest hover:bg-amber-light transition-all">
              APPLY NOW
            </button>
          </div>
        </section>
      </div>
    </StaticPage>
  );
}
