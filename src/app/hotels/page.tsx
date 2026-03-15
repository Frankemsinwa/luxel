'use client'

import StaticPage from "@/components/StaticPage";
import SearchBar from "@/components/SearchBar";

export default function HotelsPage() {
  return (
    <StaticPage 
      title="Book Your Stay" 
      subtitle="Handpicked luxury hotels and cozy apartments sorted by the best reviews globally."
    >
      <div className="space-y-16">
        <section className="bg-zinc-950 p-8 rounded-[3rem] -mt-12 mb-12 shadow-2xl">
          <SearchBar />
        </section>

        <section className="text-center space-y-4 py-20">
          <div className="w-20 h-20 bg-amber/10 rounded-full flex items-center justify-center mx-auto text-amber mb-8">
            <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24"><path d="M7 14c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM19 8h-1V3H6v5H5c-1.1 0-2 .9-2 2v11h18V10c0-1.1-.9-2-2-2zM8 5h8v3H8V5zm11 14H5v-2h14v2zm0-4H5v-5h14v5z" /></svg>
          </div>
          <h2 className="text-4xl font-bold text-zinc-900 tracking-tighter">Luxury Awaits</h2>
          <p className="text-zinc-500 max-w-lg mx-auto">
            Our hotel booking system is currently being optimized to provide you with the most exclusive deals. Check back soon for our curated collection.
          </p>
          <div className="pt-8">
            <button className="bg-amber text-black px-10 py-4 rounded-2xl text-[12px] font-bold tracking-widest hover:bg-amber-light transition-all">
              NOTIFY ME
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Boutique Hotels", desc: "Unique character and intimate service." },
            { title: "Elite Resorts", desc: "All-inclusive luxury in world-class locations." },
            { title: "Urban Suites", desc: "Modern comfort in the heart of global cities." }
          ].map((type, i) => (
            <div key={i} className="p-8 rounded-[2rem] border border-zinc-100 bg-zinc-50 hover:bg-white hover:shadow-xl transition-all cursor-default">
              <h3 className="font-bold text-zinc-900 mb-2">{type.title}</h3>
              <p className="text-sm text-zinc-500">{type.desc}</p>
            </div>
          ))}
        </section>
      </div>
    </StaticPage>
  );
}
