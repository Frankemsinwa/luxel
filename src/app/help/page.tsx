'use client'

import StaticPage from "@/components/StaticPage";
import { Search } from "lucide-react";

export default function HelpPage() {
  return (
    <StaticPage 
      title="Help Center" 
      subtitle="Find answers to your questions and learn how to get the most out of Luxel."
    >
      <div className="space-y-16">
        <div className="relative -mt-12 mb-12">
          <input 
            type="text" 
            placeholder="Search for help articles..." 
            className="w-full bg-white border border-zinc-200 rounded-[2rem] px-12 py-6 shadow-xl focus:ring-4 focus:ring-amber/10 focus:border-amber outline-none transition-all text-lg"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={24} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: "Booking Flights", icon: "✈️" },
            { title: "Hotel Reservations", icon: "🏨" },
            { title: "Payments & Invoices", icon: "💳" },
            { title: "Account Settings", icon: "👤" },
            { title: "Cancellations", icon: "🔄" },
            { title: "Agent Portal", icon: "🛠️" }
          ].map((cat, i) => (
            <div key={i} className="p-8 rounded-[2rem] border border-zinc-100 bg-white hover:bg-zinc-50 hover:shadow-md transition-all cursor-pointer group">
              <div className="text-4xl mb-4">{cat.icon}</div>
              <h3 className="font-bold text-zinc-900 group-hover:text-amber transition-colors">{cat.title}</h3>
              <p className="text-sm text-zinc-500 mt-2">View all 12 articles</p>
            </div>
          ))}
        </div>

        <section className="bg-black p-12 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-md">
            <h2 className="text-2xl font-bold mb-2">Still need help?</h2>
            <p className="text-zinc-400">Our concierge team is available 24/7 to help you with any issues.</p>
          </div>
          <button className="bg-amber text-black px-10 py-5 rounded-2xl font-bold tracking-widest hover:bg-amber-light transition-all whitespace-nowrap">
            CONTACT SUPPORT
          </button>
        </section>
      </div>
    </StaticPage>
  );
}
