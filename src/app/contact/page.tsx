'use client'

import StaticPage from "@/components/StaticPage";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <StaticPage 
      title="Contact Us" 
      subtitle="Our dedicated concierge team is available 24/7 to assist with your premium travel needs."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-12">
          <section>
            <h2 className="text-3xl font-bold text-zinc-900 mb-8">Get in Touch</h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-2xl bg-amber/10 flex items-center justify-center text-amber shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900">Phone</h4>
                  <p className="text-zinc-600">+234 813 156 7255</p>
                </div>
              </div>
              
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-2xl bg-amber/10 flex items-center justify-center text-amber shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900">Email</h4>
                  <p className="text-zinc-600">luxelflight@gmail.com</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-2xl bg-amber/10 flex items-center justify-center text-amber shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900">Office</h4>
                  <p className="text-zinc-600">Suite D35, Iyemi plaza, Gudu, Abuja</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-amber p-8 rounded-[2rem] text-black">
            <h3 className="text-xl font-bold mb-2">Concierge Service</h3>
            <p className="opacity-80">Our elite support agents are ready to help you plan your next billionaire-budget experience.</p>
          </section>
        </div>

        <div className="bg-zinc-50 p-8 lg:p-12 rounded-[3rem] border border-zinc-100 shadow-sm">
          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-900 px-1">FULL NAME</label>
              <input type="text" className="w-full bg-white border border-zinc-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-amber/20 focus:border-amber transition-all outline-none" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-900 px-1">EMAIL ADDRESS</label>
              <input type="email" className="w-full bg-white border border-zinc-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-amber/20 focus:border-amber transition-all outline-none" placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-900 px-1">MESSAGE</label>
              <textarea rows={4} className="w-full bg-white border border-zinc-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-amber/20 focus:border-amber transition-all outline-none resize-none" placeholder="How can we help you?"></textarea>
            </div>
            <button className="w-full bg-black text-white py-5 rounded-2xl font-bold tracking-widest hover:bg-zinc-800 transition-all active:scale-[0.98]">
              SEND MESSAGE
            </button>
          </form>
        </div>
      </div>
    </StaticPage>
  );
}
