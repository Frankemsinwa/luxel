'use client'

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Globe, ArrowRight, ChevronRight, PlaneLanding } from 'lucide-react';

const destinationCards = [
  {
    name: "Abu Dhabi",
    img: "/pic/abu-dhabi-1.jpeg",
    desc: "Abu Dhabi is renowned for its stunning Sheikh Zayed Grand Mosque and luxury attractions like Ferrari World",
    tag: "Trending"
  },
  {
    name: "Lagos",
    img: "/pic/lagos.jpeg",
    desc: "Lagos is Africa's most populous city, famous as Nigeria's financial hub and Nollywood epicenter.",
    tag: "Popular"
  },
  {
    name: "Singapore",
    img: "/pic/singapore.jpeg",
    desc: "Singapore is known worldwide as a global financial powerhouse and spotless 'Garden City.'",
    tag: "Recommended"
  },
  {
    name: "Canada",
    img: "/pic/canada.jpeg",
    desc: "Canada is celebrated for its vast natural beauty, including the Rocky Mountains and northern lights.",
    tag: "Adventure"
  }
];

/* ───── Grid Background Component ───── */
const PremiumGrid = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0" style={{
      backgroundImage: `
        linear-gradient(rgba(241,188,50,0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(241,188,50,0.06) 1px, transparent 1px)
      `,
      backgroundSize: '80px 80px',
    }} />
  </div>
);

const DestinationsSection = () => {
  return (
    <section className="py-32 px-6 bg-zinc-950 relative overflow-hidden">
      <PremiumGrid />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-amber/5 rounded-full blur-[200px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, type: "spring", bounce: 0.3 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber/20 bg-amber/5 text-[11px] font-medium tracking-[0.2em] text-amber/80 uppercase mb-5">
              <Globe size={12} /> Explore
            </span>
            <h2 className="text-display text-white tracking-tighter">
              <span className="font-medium">Destinations</span> <br />
              <span className="text-amber italic font-newton tracking-[-0.05em]">for discovery</span>
            </h2>
            <p className="text-body-lg text-zinc-500 mt-3">Curated recommendations for the global elite.</p>
          </motion.div>

          <Link href="/tour">
            <motion.button
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center gap-3 text-caption tracking-widest uppercase text-zinc-400 hover:text-amber transition-colors bg-zinc-900/50 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm border border-zinc-800 hover:border-amber/30 w-full sm:w-auto mt-6 md:mt-0 justify-center"
            >
              View all places
              <div className="w-10 h-10 rounded-full border border-zinc-700 bg-zinc-900 flex items-center justify-center group-hover:border-amber group-hover:bg-amber/10 transition-colors">
                <ChevronRight size={18} className="text-zinc-400 group-hover:text-amber transition-colors" />
              </div>
            </motion.button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {destinationCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 80, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.12, type: "spring", bounce: 0.4 }}
              className="group cursor-pointer"
            >
              <div className="relative h-80 rounded-[2.5rem] overflow-hidden mb-[-3rem] z-10 shadow-[0_20px_50px_rgba(0,0,0,0.4)] border-[3px] border-zinc-800/50 group-hover:border-amber/30 transition-all duration-700 group-hover:-translate-y-4 group-hover:shadow-[0_30px_60px_rgba(241,188,50,0.15)]">
                <Image
                  src={card.img}
                  alt={card.name}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-125"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Tag badge */}
                <div className="absolute top-4 left-4 bg-amber/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-[10px] font-bold text-black tracking-wider uppercase">{card.tag}</span>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800/50 group-hover:border-amber/20 p-8 pt-16 rounded-[2.5rem] shadow-xl transition-all duration-500 min-h-[240px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-heading-md text-white transition-colors duration-300 group-hover:text-amber">{card.name}</h3>
                    <motion.div
                      className="w-10 h-10 rounded-full bg-amber/10 border border-amber/20 flex items-center justify-center translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500"
                    >
                      <PlaneLanding size={16} className="text-amber" />
                    </motion.div>
                  </div>
                  <p className="text-body-sm leading-relaxed mb-6 line-clamp-3 text-zinc-500 group-hover:text-zinc-400 transition-colors">
                    {card.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DestinationsSection;
