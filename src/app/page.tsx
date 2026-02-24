'use client'

import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import { motion } from "framer-motion";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.21, 1, 0.36, 1],
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.21, 1, 0.36, 1],
      },
    },
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-black text-white pt-6 pb-44 overflow-hidden">
          {/* Subtle Ambient Light */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber/10 rounded-full blur-[120px] -translate-y-1/2" />
          <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-amber/5 rounded-full blur-[150px] translate-x-1/2" />

          {/* Hero Content */}
          <div className="max-w-7xl mx-auto px-6 mt-16 lg:mt-32 flex flex-col lg:flex-row items-center gap-16 relative z-20">
            {/* Left Side */}
            <motion.div
              className="flex-1 text-center lg:text-left"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-800 bg-white/5 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
                <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase">Premium Travel Experience</span>
              </motion.div>

              <motion.h1
                variants={titleVariants}
                className="text-6xl lg:text-[100px] font-bold leading-[0.9] mb-8 tracking-tighter text-white"
              >
                Travel Like <br />
                a <span className="text-amber italic">Billionaire</span> <br />
                on Budget.
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-zinc-400 max-w-md mb-12 leading-relaxed font-light text-base lg:text-lg"
              >
                Experience the pinnacle of luxury travel without the luxury price tag. Discover curated hotels and elite flights worldwide.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button className="bg-amber text-black px-10 py-5 rounded-2xl text-[12px] font-bold tracking-widest shadow-[0_20px_40px_rgba(241,188,50,0.25)] hover:bg-amber-light transition-all transform hover:-translate-y-1 active:scale-95 cursor-pointer">
                  START YOUR SEARCH
                </button>
                <button className="px-10 py-5 rounded-2xl text-[12px] font-bold tracking-widest border border-zinc-800 hover:bg-white/5 transition-all cursor-pointer">
                  LEARN MORE
                </button>
              </motion.div>
            </motion.div>

            {/* Right Side - Oval Images */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.5, ease: [0.21, 1, 0.36, 1], delay: 0.5 }}
              className="flex-1 relative flex items-center justify-center lg:justify-end gap-6 h-[550px] w-full"
            >
              <div className="relative group">
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="relative w-48 h-[360px] lg:w-56 lg:h-[420px] rounded-full border-[6px] border-amber/20 overflow-hidden transform translate-y-8 shadow-2xl transition-all duration-500 group-hover:border-amber/40"
                >
                  <Image
                    src="/image (1).png"
                    alt="Skyline at night"
                    fill
                    className="object-cover scale-110 group-hover:scale-125 transition-transform duration-700"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </motion.div>
                <div className="absolute -inset-1 border-2 border-amber/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <div className="relative group">
                <motion.div
                  animate={{ y: [0, 15, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  className="relative w-56 h-[440px] lg:w-64 lg:h-[500px] rounded-full border-[6px] border-amber/20 overflow-hidden shadow-2xl transition-all duration-500 group-hover:border-amber/40"
                >
                  <Image
                    src="/image.png"
                    alt="Golden hour skyline"
                    fill
                    className="object-cover scale-110 group-hover:scale-125 transition-transform duration-700"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </motion.div>
                <div className="absolute -inset-1 border-2 border-amber/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </motion.div>
          </div>

          {/* Wavy Divider */}
          <div className="absolute bottom-0 left-0 w-full leading-[0] z-10 translate-y-[1px]">
            <svg viewBox="0 0 1440 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-[0_-5px_15px_rgba(241,188,50,0.1)]">
              <path d="M0 80C240 160 480 180 720 80C960 -20 1200 0 1440 80V160H0V80Z" fill="#F1BC32" />
            </svg>
          </div>
        </section>

        <SearchBar />

        {/* The rest of the sections */}
        <section className="bg-amber pt-32 pb-24 px-6 -mt-10">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-white text-3xl md:text-5xl font-bold mb-16 italic font-serif leading-tight">
              Everything You Need for a Perfect Trip
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Service Cards */}
            </div>
          </div>
        </section>

        <section className="py-24 px-6 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
            {/* Suitcase Illustration Area */}
            <div className="flex-1 relative">
              <div className="relative w-full max-w-md aspect-square">
                <div className="absolute inset-0 bg-amber/5 rounded-full blur-3xl" />
                <svg viewBox="0 0 500 500" className="relative z-10 w-full h-full drop-shadow-xl">
                  <path d="M120 180 Q120 150 150 150 L350 150 Q380 150 380 180 L380 400 Q380 430 350 430 L150 430 Q120 430 120 400 Z" fill="#F1BC32" fillOpacity="0.1" stroke="#F1BC32" strokeWidth="2" strokeDasharray="8 8" />
                  <path d="M140 200 Q140 180 160 180 L340 180 Q360 180 360 200 L360 380 Q360 400 340 400 L160 400 Q140 400 140 380 Z" fill="#F1BC32" fillOpacity="0.2" />
                  <path d="M220 180 L220 140 Q220 120 250 120 Q280 120 280 140 L280 180" stroke="#F1BC32" strokeWidth="4" fill="none" strokeLinecap="round" />
                  <circle cx="250" cy="290" r="70" stroke="#F1BC32" strokeWidth="1" strokeDasharray="4 4" />
                </svg>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <p className="text-amber font-bold tracking-[0.2em] text-[10px] mb-4 uppercase">Benefits</p>
              <h2 className="text-4xl md:text-6xl font-bold mb-8 text-zinc-900 leading-tight">
                Why <span className="italic font-serif">Luxel?</span>
              </h2>

              <p className="text-zinc-500 mb-12 leading-relaxed max-w-md font-light text-sm">
                We don't just book tickets; we curate experiences. From the moment you search to the moment you return, Luxel provides a seamless, premium journey.
              </p>

              <div className="space-y-10">
                <div className="flex flex-col gap-4">
                  <span className="inline-flex items-center px-5 py-2 rounded-full bg-amber/10 text-amber text-[10px] font-bold tracking-widest w-fit border border-amber/20">
                    Transparent Pricing
                  </span>
                  <p className="text-zinc-500 text-sm font-light max-w-sm leading-relaxed">
                    No hidden fees. What you see is what you pay. Guaranteed.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <span className="inline-flex items-center px-5 py-2 rounded-full bg-amber/10 text-amber text-[10px] font-bold tracking-widest w-fit border border-amber/20">
                    Unified Booking
                  </span>
                  <p className="text-zinc-500 text-sm font-light max-w-sm leading-relaxed">
                    Manage flights, hotels, and tours all in one elegant dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-6 bg-[#FDFDFD]">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4">
                Destination <span className="text-amber italic">for discovery</span>
              </h2>
              <p className="text-zinc-500 font-light text-sm">Popular Places to recommend for you</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Destination Cards */}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
