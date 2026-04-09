'use client'

import { motion } from 'framer-motion';
import { ArrowRight, Plane, Sparkles, MapPin, Globe } from 'lucide-react';

const serviceCards = [
  {
    icon: <Plane size={22} />,
    title: "Flights",
    desc: "Best price guarantee on domestic and international flights to over 5,000 destinations.",
    gradient: "from-amber/20 to-orange-500/20",
  },
  {
    icon: <MapPin size={22} />,
    title: "Hotels",
    desc: "Handpicked luxury hotels and cozy apartments sorted by the best reviews.",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: <Globe size={22} />,
    title: "Car Rentals",
    desc: "Explore your destination at your own pace with our premium fleet of vehicles.",
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
  {
    icon: <Sparkles size={22} />,
    title: "Tour",
    desc: "Guided experiences and adventures tailored to create unforgettable memories.",
    gradient: "from-purple-500/20 to-pink-500/20",
  }
];

const HomeServices = () => {
  return (
    <section className="bg-amber pt-32 pb-24 px-6 relative z-0 -mt-12 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-4"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/10 backdrop-blur-sm text-[11px] font-medium tracking-[0.2em] text-black/70 uppercase">
            <Sparkles size={12} /> Our Services
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="text-white text-heading-xl font-medium mb-16 leading-tight tracking-[0.08em]"
        >
          Everything You Need For A Perfect Trip
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 80, rotate: -5 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.12, type: "spring", bounce: 0.4 }}
              whileHover={{ y: -15, scale: 1.03 }}
              className="bg-zinc-950 text-white p-8 rounded-[2rem] text-left transition-all duration-300 group shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative overflow-hidden border border-zinc-800/50 hover:border-amber/20"
            >
              {/* Gradient orb */}
              <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${card.gradient} rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

              <motion.div
                whileHover={{ rotate: 15, scale: 1.15 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-14 h-14 bg-amber rounded-2xl flex items-center justify-center mb-8 relative z-10 shadow-[0_10px_30px_rgba(241,188,50,0.3)] group-hover:shadow-[0_15px_40px_rgba(241,188,50,0.5)]"
              >
                <div className="text-black">{card.icon}</div>
              </motion.div>

              <h3 className="text-xl font-bold mb-3 relative z-10">{card.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed font-light relative z-10 group-hover:text-zinc-300 transition-colors">
                {card.desc}
              </p>

              <motion.div
                className="mt-6 flex items-center gap-2 text-amber text-xs font-medium tracking-wider opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 relative z-10"
              >
                EXPLORE <ArrowRight size={12} />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeServices;
