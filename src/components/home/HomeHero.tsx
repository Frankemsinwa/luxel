'use client'

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Plane, Shield, CheckCircle2, Zap } from 'lucide-react';
import FloatingParticles from './FloatingParticles';

/* ───── Grid Background Component ───── */
const PremiumGrid = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Main grid */}
    <div className="absolute inset-0" style={{
      backgroundImage: `
        linear-gradient(rgba(241,188,50,0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(241,188,50,0.06) 1px, transparent 1px)
      `,
      backgroundSize: '80px 80px',
    }} />
    {/* Finer sub-grid */}
    <div className="absolute inset-0" style={{
      backgroundImage: `
        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
      `,
      backgroundSize: '20px 20px',
    }} />
    {/* Radial fade overlay so grid fades at edges */}
    <div className="absolute inset-0" style={{
      background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.8) 100%)',
    }} />
  </div>
);

const HomeHero = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        type: "spring",
        bounce: 0.4,
      },
    },
  };

  const titleVariants: any = {
    hidden: { opacity: 0, y: 60, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1.2,
        type: "spring",
        bounce: 0.3,
      },
    },
  };

  return (
    <section ref={heroRef} className="relative bg-zinc-950 text-white pt-6 pb-44 overflow-hidden min-h-[100vh]">
      <PremiumGrid />
      <FloatingParticles />

      {/* Ambient glow orbs */}
      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-amber/8 rounded-full blur-[180px] -translate-y-1/2"
      />
      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-amber/5 rounded-full blur-[200px] translate-x-1/3"
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber/3 rounded-full blur-[250px]"
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Golden accent lines */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber/20 to-transparent" />
      <motion.div
        className="absolute top-[40%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber/10 to-transparent"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-6 mt-16 lg:mt-28 flex flex-col lg:flex-row items-center gap-16 relative z-20">
        {/* Left Side */}
        <motion.div
          className="flex-1 text-center lg:text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <motion.div variants={itemVariants} className="mb-6 inline-flex items-center gap-2 px-5 py-2 rounded-full border border-amber/20 bg-amber/5 backdrop-blur-xl shadow-[0_0_30px_rgba(241,188,50,0.08)]">
            <motion.span
              className="w-2 h-2 rounded-full bg-amber"
              animate={{ scale: [1, 1.5, 1], boxShadow: ["0 0 0 0 rgba(241,188,50,0.4)", "0 0 0 8px rgba(241,188,50,0)", "0 0 0 0 rgba(241,188,50,0)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-[11px] font-medium tracking-[0.2em] text-amber/80 uppercase">Premium Travel Experience</span>
          </motion.div>

          <motion.h1
            variants={titleVariants}
            className="text-5xl sm:text-6xl lg:text-[100px] font-normal leading-[0.9] mb-8 tracking-tighter text-white"
          >
            <span className="font-bold">Travel Like</span> <br />
            a <span className="text-amber italic font-newton relative">
              Billionaire
              <motion.span
                className="absolute bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-amber/80 via-amber to-amber/80"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
              />
            </span> <br />
            <span className="font-bold">on Budget.</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-zinc-400 max-w-lg mb-12 leading-relaxed font-light text-base lg:text-lg mx-auto lg:mx-0"
          >
            Experience the pinnacle of luxury travel without the luxury price tag. Discover curated hotels
            and elite flights to <span className="text-white font-medium">5,000+</span> destinations worldwide.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full">
            <Link href="/flights" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="group bg-amber text-black w-full px-10 py-5 rounded-2xl text-[12px] font-semibold tracking-widest shadow-[0_20px_50px_rgba(241,188,50,0.3)] hover:shadow-[0_25px_60px_rgba(241,188,50,0.45)] transition-all cursor-pointer relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  START YOUR SEARCH
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                />
              </motion.button>
            </Link>
            <Link href="/about" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="w-full px-10 py-5 rounded-2xl text-[12px] font-medium tracking-widest border border-zinc-700 hover:border-amber/40 hover:bg-amber/5 transition-all cursor-pointer text-zinc-300 hover:text-white"
              >
                LEARN MORE
              </motion.button>
            </Link>
          </motion.div>

          {/* Trust Badges Row */}
          <motion.div
            variants={itemVariants}
            className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-6 text-zinc-500"
          >
            {[
              { icon: <Shield size={14} />, text: "Secure Booking" },
              { icon: <CheckCircle2 size={14} />, text: "Verified Flights" },
              { icon: <Zap size={14} />, text: "Instant Confirm" },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[11px] tracking-wide">
                <span className="text-amber/60">{badge.icon}</span>
                {badge.text}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Side - Oval Images */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 10, x: 50 }}
          animate={{ opacity: 1, scale: 1, rotate: 0, x: 0 }}
          transition={{ duration: 1.5, type: "spring", bounce: 0.4, delay: 0.5 }}
          style={{ y: heroY, opacity: heroOpacity }}
          className="flex-1 relative flex items-center justify-center lg:justify-end gap-2 sm:gap-6 h-[350px] sm:h-[450px] lg:h-[550px] w-full mt-10 lg:mt-0 scale-75 sm:scale-90 lg:scale-100"
        >
          <div className="relative group">
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-48 h-[360px] lg:w-56 lg:h-[420px] rounded-full border-[3px] border-amber/20 overflow-hidden transform translate-y-8 shadow-[0_30px_80px_rgba(0,0,0,0.6)] transition-all duration-500 group-hover:border-amber/50 group-hover:-translate-y-2 group-hover:shadow-[0_40px_80px_rgba(241,188,50,0.15)]"
            >
              <Image
                src="/hero-left.png"
                alt="Skyline at night"
                fill
                className="object-cover scale-110 group-hover:scale-125 transition-transform duration-700"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xl px-4 py-1.5 rounded-full border border-white/10">
                <span className="text-[10px] text-white/90 tracking-widest font-medium">DUBAI</span>
              </div>
            </motion.div>
            <div className="absolute -inset-2 border border-amber/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          <div className="relative group">
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="relative w-56 h-[440px] lg:w-64 lg:h-[500px] rounded-full border-[3px] border-amber/20 overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.6)] transition-all duration-500 group-hover:border-amber/50 group-hover:-translate-y-2 group-hover:shadow-[0_40px_80px_rgba(241,188,50,0.15)]"
            >
              <Image
                src="/hero-right.png"
                alt="Golden hour skyline"
                fill
                className="object-cover scale-110 group-hover:scale-125 transition-transform duration-700"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xl px-4 py-1.5 rounded-full border border-white/10">
                <span className="text-[10px] text-white/90 tracking-widest font-medium">LONDON</span>
              </div>
            </motion.div>
            <div className="absolute -inset-2 border border-amber/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* Decorative floating badge */}
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-8 right-0 bg-zinc-900/80 backdrop-blur-2xl border border-amber/20 rounded-2xl px-5 py-3 shadow-2xl"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber/20 flex items-center justify-center">
                <Plane size={14} className="text-amber" />
              </div>
              <div>
                <p className="text-[10px] text-zinc-400 tracking-wider">BEST DEAL</p>
                <p className="text-sm font-bold text-white">₦310,000</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Wavy Divider */}
      <div className="absolute bottom-0 left-0 w-full leading-[0] z-10 translate-y-[1px]">
        <svg viewBox="0 0 1440 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 80C240 160 480 180 720 80C960 -20 1200 0 1440 80V160H0V80Z" fill="#F1BC32" />
        </svg>
      </div>
    </section>
  );
};

export default HomeHero;
