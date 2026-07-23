'use client'

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Adaeze O.",
    role: "Frequent Traveler",
    text: "Luxel completely transformed how I book flights. The process is seamless, prices are unbeatable, and their concierge team is world-class.",
    rating: 5,
    avatar: "AO",
  },
  {
    name: "Michael T.",
    role: "Business Executive",
    text: "As someone who flies weekly, Luxel's premium booking experience saves me hours. The real-time pricing and agent support are phenomenal.",
    rating: 5,
    avatar: "MT",
  },
  {
    name: "Fatima A.",
    role: "Travel Blogger",
    text: "I've used every booking platform out there. Luxel stands head and shoulders above the rest. It genuinely feels like a luxury concierge service.",
    rating: 5,
    avatar: "FA",
  },
];

const TestimonialSection = () => {
  return (
    <section className="py-32 px-6 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-display text-zinc-900 tracking-tighter"
          >
            What Our <span className="text-amber italic font-newton">Guests Say</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-zinc-50 p-10 rounded-[2.5rem] border border-zinc-100 hover:border-amber/20 transition-all duration-500 group"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-amber text-amber" />
                ))}
              </div>
              <p className="text-body-lg text-zinc-600 mb-8 italic leading-relaxed">
                &quot;{t.text}&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber/10 border border-amber/20 flex items-center justify-center text-amber font-bold">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-zinc-900 font-semibold text-sm">{t.name}</p>
                  <p className="text-zinc-400 text-xs tracking-wider">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
