'use client'

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ChevronRight, PlaneLanding, Star, Shield, Zap, Globe, Users, Plane, ArrowRight, CheckCircle2, Sparkles, MapPin, Clock, CreditCard, HeadphonesIcon } from "lucide-react";

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

/* ───── Floating Particle Effect ───── */
const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 rounded-full bg-amber/30"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -80 - Math.random() * 120, 0],
          x: [0, (Math.random() - 0.5) * 60, 0],
          opacity: [0, 0.8, 0],
          scale: [0, 1 + Math.random(), 0],
        }}
        transition={{
          duration: 4 + Math.random() * 6,
          repeat: Infinity,
          delay: Math.random() * 5,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

/* ───── Animated Counter ───── */
const AnimatedCounter = ({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  return (
    <motion.span
      onViewportEnter={() => {
        if (hasAnimated) return;
        setHasAnimated(true);
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            setCount(target);
            clearInterval(timer);
          } else {
            setCount(Math.floor(current));
          }
        }, duration / steps);
      }}
    >
      {prefix}{count.toLocaleString()}{suffix}
    </motion.span>
  );
};

export default function Home() {
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

  const stats = [
    { value: 5000, suffix: "+", label: "Destinations" },
    { value: 200, suffix: "+", label: "Airlines" },
    { value: 98, suffix: "%", label: "Satisfaction" },
    { value: 24, suffix: "/7", label: "Support" },
  ];

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

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-950">

        {/* ═══════════════════════════════════════════ */}
        {/* HERO SECTION — Ultra-Premium Dark + Grid   */}
        {/* ═══════════════════════════════════════════ */}
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
                    className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-amber/80 via-amber to-amber/80"
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
                  {/* Premium overlay label */}
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

        {/* ═══════════════════════════════════════════════ */}
        {/* SEARCH BAR — Elevated                          */}
        {/* ═══════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="relative z-20"
        >
          <SearchBar />
        </motion.div>

        {/* ═══════════════════════════════════════════════ */}
        {/* SERVICES SECTION — Golden                      */}
        {/* ═══════════════════════════════════════════════ */}
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

        {/* ═══════════════════════════════════════════════ */}
        {/* STATS BAR — Impressive Numbers                 */}
        {/* ═══════════════════════════════════════════════ */}
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

        {/* ═══════════════════════════════════════════════ */}
        {/* WHY LUXEL — Premium Split Section              */}
        {/* ═══════════════════════════════════════════════ */}
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

        {/* ═══════════════════════════════════════════════ */}
        {/* TRUST & GUARANTEE SECTION                      */}
        {/* ═══════════════════════════════════════════════ */}
        <section className="py-28 px-6 bg-zinc-950 relative overflow-hidden">
          <PremiumGrid />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber/5 rounded-full blur-[200px]" />

          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber/20 bg-amber/5 text-[11px] font-medium tracking-[0.2em] text-amber/80 uppercase mb-5">
                <Shield size={12} /> Your Trust, Our Priority
              </span>
              <h2 className="text-display text-white tracking-tighter">
                <span className="font-medium">Book with</span> <span className="italic font-newton text-amber">Confidence</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trustFeatures.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, type: "spring", bounce: 0.3 }}
                  whileHover={{ y: -8 }}
                  className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/80 hover:border-amber/20 rounded-3xl p-8 text-center group transition-all duration-300"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className="w-14 h-14 bg-amber/10 border border-amber/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-amber/20 group-hover:border-amber/40 transition-all duration-300"
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-white font-semibold text-lg mb-3">{feature.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed group-hover:text-zinc-400 transition-colors">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════ */}
        {/* TESTIMONIALS SECTION                           */}
        {/* ═══════════════════════════════════════════════ */}
        <section className="py-28 px-6 bg-white relative overflow-hidden">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.015) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.015) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }} />

          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber/10 text-[11px] font-medium tracking-[0.2em] text-amber uppercase mb-5">
                <Star size={12} /> Traveler Reviews
              </span>
              <h2 className="text-display text-zinc-900 tracking-tighter">
                <span className="font-medium">Loved by</span> <span className="italic font-newton text-amber">Thousands</span>
              </h2>
              <p className="text-body-lg text-zinc-500 mt-3 max-w-md mx-auto">Real stories from real travelers who trusted Luxel for their journeys.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, type: "spring", bounce: 0.3 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-white border border-zinc-100 rounded-3xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(241,188,50,0.1)] transition-all duration-500 group"
                >
                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} size={14} className="fill-amber text-amber" />
                    ))}
                  </div>

                  <p className="text-zinc-600 text-sm leading-relaxed mb-8 italic">&ldquo;{t.text}&rdquo;</p>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white text-xs font-bold tracking-wider">
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

        {/* ═══════════════════════════════════════════════ */}
        {/* DESTINATIONS SECTION                           */}
        {/* ═══════════════════════════════════════════════ */}
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
                  whileInView={{ opacity: 1, x: 0 }}
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

        {/* ═══════════════════════════════════════════════ */}
        {/* CTA BANNER — Premium Newsletter / Action       */}
        {/* ═══════════════════════════════════════════════ */}
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

      </main>
      <Footer />
    </>
  );
}
