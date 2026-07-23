'use client'

import { motion } from 'framer-motion';
import Image from 'next/image';

const HomeWhyLuxel = () => {
  return (
    <section className="py-32 px-6 bg-white overflow-hidden relative">
      {/* Light grid on white */}
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
        {/* Illustration Area */}
        <motion.div
          initial={{ opacity: 0, x: -100, rotate: -5 }}
          whileInView={{ opacity: 1, x: 0, rotate: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, type: "spring", bounce: 0.3 }}
          className="flex-1 relative"
        >
          <div className="relative w-full max-w-lg aspect-square">
            <div className="absolute inset-0 bg-amber/10 rounded-full blur-[100px] animate-pulse" />
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full h-full pb-10"
            >
              <Image
                src="/why.png"
                alt="Luxel Benefits Illustration"
                fill
                className="object-contain relative z-10 drop-shadow-[0_30px_40px_rgba(0,0,0,0.1)]"
                priority
              />
            </motion.div>

            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute top-10 right-10 w-24 h-24 border-2 border-amber/30 border-dashed rounded-full"
            />
            <motion.div
              animate={{ y: [0, 10, 0], rotate: [45, 90, 45] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-10 left-10 w-12 h-12 bg-gradient-to-br from-amber/40 to-amber/10 backdrop-blur-sm rounded-3xl"
            />
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, type: "spring", bounce: 0.3 }}
          className="flex-1"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-caption text-amber tracking-[0.3em] mb-6 uppercase flex items-center gap-3"
          >
            <span className="w-8 h-[1px] bg-amber" />
            Core Values
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-display mb-8 text-zinc-900 tracking-tighter"
          >
            <span className="font-medium">Why</span> <span className="italic font-newton text-amber">Luxel?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-body-lg text-zinc-500 mb-12 max-w-md"
          >
            We don&apos;t just book tickets; we curate experiences. Luxel provides a seamless, high-touch journey powered by elite technology.
          </motion.p>

          <div className="space-y-10">
            {[
              {
                title: "Transparent Pricing",
                desc: "No hidden fees. What you see is what you pay. Guaranteed at every step."
              },
              {
                title: "Unified Booking",
                desc: "Manage flights, hotels, and luxury tours all in one world-class dashboard."
              },
              {
                title: "Agent Concierge",
                desc: "Dedicated travel agents personally verify availability and secure the best deals for you."
              }
            ].map((benefit, i) => (
              <motion.div
                key={i}
                className="flex flex-col gap-3 group"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.3 + (i * 0.15), type: "spring", bounce: 0.4 }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    whileInView={{ scale: [0, 1.5, 1] }}
                    transition={{ delay: 0.4 + (i * 0.15), duration: 0.5 }}
                    className="w-3 h-3 rounded-full bg-amber shadow-[0_0_15px_rgba(241,188,50,0.6)]"
                  />
                  <h4 className="text-heading-sm text-zinc-900 group-hover:text-amber transition-colors font-semibold">{benefit.title}</h4>
                </div>
                <p className="text-body-sm text-zinc-500 max-w-sm pl-6 border-l-2 border-zinc-100 group-hover:border-amber transition-all duration-300">
                  {benefit.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HomeWhyLuxel;
