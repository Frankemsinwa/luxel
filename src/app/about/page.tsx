'use client'

import StaticPage from "@/components/StaticPage";

export default function AboutPage() {
  return (
    <StaticPage 
      title="About Luxel" 
      subtitle="Redefining luxury travel for the modern explorer. Experience the pinnacle of worldwide booking."
    >
      <div className="space-y-12 text-zinc-600">
        <section>
          <h2 className="text-3xl font-bold text-zinc-900 mb-6">Our Vision</h2>
          <p className="text-lg leading-relaxed">
            At Luxel, we believe that premium travel experiences should be accessible, seamless, and deeply personal. Founded with the mission to bridge the gap between high-end luxury and intuitive technology, we've curated a platform that caters to the world's most discerning travelers.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-bold text-zinc-900 mb-4">The Luxel Difference</h3>
            <p>
              Unlike traditional booking platforms, Luxel focuses on the 'High-Touch' experience. Every flight, hotel, and tour in our database is hand-selected to ensure it meets our rigorous standards for quality, service, and value.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-zinc-900 mb-4">Innovation First</h3>
            <p>
              Our platform is powered by elite technology that provides real-time pricing, unified booking dashboards, and a seamless mobile-first experience. We've removed the friction from planning so you can focus on the journey.
            </p>
          </div>
        </section>

        <section className="bg-zinc-50 p-12 rounded-[2rem] border border-zinc-100">
          <h2 className="text-2xl font-bold text-zinc-900 mb-4">Our Commitment</h2>
          <p className="italic text-lg">
            "To provide a seamless end-to-end travel booking experience that establishes Luxel as a premium, trustworthy travel brand worldwide."
          </p>
        </section>
      </div>
    </StaticPage>
  );
}
