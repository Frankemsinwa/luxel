'use client'

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Plane } from 'lucide-react';

const HomeCTA = () => {
  return (
    <section className="py-28 px-6 bg-amber relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", bounce: 0.3 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-block mb-6"
          >
            <Plane size={40} className="text-black/80" />
          </motion.div>
          <h2 className="text-4xl lg:text-5xl font-bold text-black tracking-tight mb-6 leading-tight">
            Ready to Fly <span className="italic font-newton">Premium?</span>
          </h2>
          <p className="text-black/60 text-lg max-w-lg mx-auto mb-10 font-light">
            Join over 10,000 elite travelers who trust Luxel for
            their domestic and international flights. Your next adventure starts here.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4 sm:px-0">
            <Link href="/flights" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="group bg-zinc-950 text-white w-full px-10 py-5 rounded-2xl text-[12px] font-semibold tracking-widest shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.4)] transition-all cursor-pointer flex items-center justify-center gap-3"
              >
                SEARCH FLIGHTS NOW
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>

            <Link href="/contact" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="w-full px-10 py-5 rounded-2xl text-[12px] font-medium tracking-widest border-2 border-black/20 hover:border-black/40 transition-all cursor-pointer text-black/80 hover:text-black"
              >
                CONTACT US
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HomeCTA;
