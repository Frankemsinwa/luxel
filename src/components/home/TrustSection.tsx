'use client'

import { motion } from 'framer-motion';
import { Shield, CreditCard, Clock, HeadphonesIcon } from 'lucide-react';
import PremiumGrid from './PremiumGrid';

const trustFeatures = [
  {
    icon: <Shield size={24} className="text-amber" />,
    title: "Bank-Level Security",
    desc: "256-bit SSL encryption protects every transaction. Your data never leaves our secure vault.",
  },
  {
    icon: <CreditCard size={24} className="text-amber" />,
    title: "Price Match Promise",
    desc: "Found it cheaper elsewhere? We'll match it and give you 10% off your next booking.",
  },
  {
    icon: <Clock size={24} className="text-amber" />,
    title: "Free Cancellation",
    desc: "Plans change. Cancel up to 24h before departure with zero fees on eligible flights.",
  },
  {
    icon: <HeadphonesIcon size={24} className="text-amber" />,
    title: "24/7 Elite Support",
    desc: "Real humans, not bots. Our concierge team is available around the clock globally.",
  },
];

const TrustSection = () => {
  return (
    <section className="py-28 px-6 bg-zinc-950 relative overflow-hidden">
      <PremiumGrid />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber/5 rounded-full blur-[200px]" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {trustFeatures.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center lg:text-left"
            >
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 mx-auto lg:mx-0 border border-white/10">
                {feature.icon}
              </div>
              <h3 className="text-heading-sm text-white mb-3">{feature.title}</h3>
              <p className="text-body-sm text-zinc-500 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
