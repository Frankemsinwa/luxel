'use client'

import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import { motion } from "framer-motion";
import { ChevronRight, PlaneLanding } from "lucide-react";

export default function Home() {
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.21, 1, 0.36, 1] as any,
      },
    },
  };

  const titleVariants: any = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.21, 1, 0.36, 1] as any,
      },
    },
  };

  const serviceCards = [
    {
      icon: <svg width="24" height="24" fill="black" viewBox="0 0 24 24"><path d="M21 16.5C21 16.88 20.79 17.21 20.47 17.38L12.57 21.82C12.41 21.94 12.21 22 12 22C11.79 22 11.59 21.94 11.43 21.82L3.53 17.38C3.21 17.21 3 16.88 3 16.5V7.5C3 7.12 3.21 6.79 3.53 6.62L11.43 2.18C11.59 2.06 11.79 2 12 2C12.21 2 12.41 2.06 12.57 2.18L20.47 6.62C20.79 6.79 21 7.12 21 7.5V16.5Z" /></svg>,
      title: "Flights",
      desc: "Best price guarantee on domestic and international flights to over 5,000 destinations."
    },
    {
      icon: <svg width="24" height="24" fill="black" viewBox="0 0 24 24"><path d="M7 14c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM19 8h-1V3H6v5H5c-1.1 0-2 .9-2 2v11h18V10c0-1.1-.9-2-2-2zM8 5h8v3H8V5zm11 14H5v-2h14v2zm0-4H5v-5h14v5z" /></svg>,
      title: "Hotels",
      desc: "Handpicked luxury hotels and cozy apartments sorted by the best reviews."
    },
    {
      icon: <svg width="24" height="24" fill="black" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" /></svg>,
      title: "Car Rentals",
      desc: "Explore your destination at your own pace with our premium fleet of vehicles."
    },
    {
      icon: <svg width="24" height="24" fill="black" viewBox="0 0 24 24"><path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" /></svg>,
      title: "Tour",
      desc: "Guided experiences and adventures tailored to create unforgettable memories."
    }
  ];

  const destinationCards = [
    {
      name: "Abu dhabi",
      img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800",
      desc: "Abu Dhabi is renowned for its stunning Sheikh Zayed Grand Mosque and luxury attractions like Ferrari World"
    },
          { 
            name: "Lagos", 
            img: "/lagos.png", // Using local image
            desc: "Lagos is Africa's most populous city, famous as Nigeria's financial hub and Nollywood epicenter."
          },
          { 
            name: "Singapore", 
            img: "/singapore.png", // Using local image
            desc: "Singapore is known worldwide as a global financial powerhouse and spotless 'Garden City.'"
          },    {
      name: "Canada",
      img: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&q=80&w=800",
      desc: "Canada is celebrated for its vast natural beauty, including the Rocky Mountains and northern lights."
    }
  ];

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

        {/* Yellow Services Section */}
        <section className="bg-amber pt-32 pb-24 px-6 relative z-0 -mt-12">
          <div className="max-w-7xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-white text-3xl md:text-5xl font-bold mb-16 italic font-serif leading-tight"
            >
              Everything You Need for a Perfect Trip
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {serviceCards.map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="bg-zinc-950 text-white p-8 rounded-[2rem] text-left transition-all duration-300 group shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-amber/10 transition-colors" />

                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    className="w-14 h-14 bg-amber rounded-2xl flex items-center justify-center mb-8 relative z-10 shadow-[0_10px_30px_rgba(241,188,50,0.3)]"
                  >
                    <div className="text-black transform-none">
                      {card.icon}
                    </div>
                  </motion.div>

                  <h3 className="text-xl font-bold mb-4 relative z-10">{card.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed font-light relative z-10">
                    {card.desc}
                  </p>

                  <div className="mt-8 flex items-center gap-2 text-amber text-[10px] font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    Explore More <ChevronRight size={10} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-32 px-6 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
            {/* Illustration Area */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.21, 1, 0.36, 1] }}
              className="flex-1 relative"
            >
              <div className="relative w-full max-w-lg aspect-square">
                <div className="absolute inset-0 bg-amber/10 rounded-full blur-[80px] animate-pulse" />
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="relative w-full h-full"
                >
                  <Image
                    src="/why.png"
                    alt="Luxel Benefits Illustration"
                    fill
                    className="object-contain relative z-10"
                    priority
                  />
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute top-10 right-10 w-20 h-20 border-2 border-amber/20 rounded-full animate-spin-slow" />
                <div className="absolute bottom-10 left-10 w-12 h-12 bg-amber/20 rounded-3xl rotate-45" />
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.21, 1, 0.36, 1] }}
              className="flex-1"
            >
              <p className="text-amber font-bold tracking-[0.3em] text-[10px] mb-6 uppercase flex items-center gap-3">
                <span className="w-8 h-[1px] bg-amber" />
                Core Values
              </p>
              <h2 className="text-5xl md:text-7xl font-bold mb-8 text-zinc-900 leading-tight tracking-tighter">
                Why <span className="italic font-serif text-amber">Luxel?</span>
              </h2>

              <p className="text-zinc-500 mb-12 leading-relaxed max-w-md font-light text-lg">
                We don't just book tickets; we curate experiences. Luxel provides a seamless, high-touch journey powered by elite technology.
              </p>

              <div className="space-y-12">
                {[
                  {
                    title: "Transparent Pricing",
                    desc: "No hidden fees. What you see is what you pay. Guaranteed at every step."
                  },
                  {
                    title: "Unified Booking",
                    desc: "Manage flights, hotels, and luxury tours all in one world-class dashboard."
                  }
                ].map((benefit, i) => (
                  <motion.div
                    key={i}
                    className="flex flex-col gap-4 group"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-amber" />
                      <h4 className="text-lg font-bold text-zinc-900 group-hover:text-amber transition-colors">{benefit.title}</h4>
                    </div>
                    <p className="text-zinc-500 text-sm font-light max-w-sm leading-relaxed pl-5 border-l-2 border-zinc-100 group-hover:border-amber transition-colors">
                      {benefit.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-32 px-6 bg-[#FDFDFD]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-5xl md:text-7xl font-bold text-zinc-900 mb-6 tracking-tighter">
                  Destinations <br />
                  <span className="text-amber italic font-serif">for discovery</span>
                </h2>
                <p className="text-zinc-500 font-light text-lg">Curated recommendations for the global elite.</p>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-3 text-sm font-bold tracking-widest uppercase hover:text-amber transition-colors"
              >
                View all places
                <div className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center group-hover:border-amber transition-colors">
                  <ChevronRight size={18} />
                </div>
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {destinationCards.map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className="group cursor-pointer"
                >
                  <div className="relative h-80 rounded-[3rem] overflow-hidden mb-[-3rem] z-10 shadow-2xl border-[6px] border-white transition-transform duration-500 group-hover:-translate-y-4">
                    <Image
                      src={card.img}
                      alt={card.name}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  <motion.div
                    whileHover={{ backgroundColor: "#000", color: "#fff" }}
                    className="bg-[#FBC335] p-8 pt-16 rounded-[3rem] shadow-xl transition-all duration-500 min-h-[260px] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold">{card.name}</h3>
                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <PlaneLanding size={14} className="text-white" />
                        </div>
                      </div>
                      <p className="text-[12px] font-light leading-relaxed mb-6 line-clamp-3 opacity-90">
                        {card.desc}
                      </p>
                    </div>
                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                      <p className="font-bold text-[10px] tracking-widest uppercase opacity-80">302 Properties</p>
                      <p className="text-[10px] font-bold">FROM $2,499</p>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
