'use client'

import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';
import PremiumGrid from './PremiumGrid';

const stats = [
  { value: 5000, suffix: "+", label: "Destinations" },
  { value: 200, suffix: "+", label: "Airlines" },
  { value: 98, suffix: "%", label: "Satisfaction" },
  { value: 24, suffix: "/7", label: "Support" },
];

const HomeStats = () => {
  return (
    <section className="relative bg-zinc-950 py-20 px-6 border-y border-zinc-800/50 overflow-hidden">
      <PremiumGrid />
      <div className="absolute inset-0 bg-gradient-to-r from-amber/5 via-transparent to-amber/5" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x divide-zinc-800/50">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, type: "spring" }}
              className="text-center px-8"
            >
              <div className="text-4xl lg:text-5xl font-bold text-white mb-2 tracking-tight">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-zinc-500 text-sm tracking-widest uppercase font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeStats;
