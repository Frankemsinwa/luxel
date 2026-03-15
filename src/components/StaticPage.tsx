'use client'

import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

interface StaticPageProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  heroImage?: string;
}

export default function StaticPage({ title, subtitle, children, heroImage }: StaticPageProps) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Header Section */}
        <section className="relative bg-black text-white pt-32 pb-24 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber/10 rounded-full blur-[120px] -translate-y-1/2" />
          
          <div className="max-w-7xl mx-auto px-6 relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 tracking-tighter">
                {title}
              </h1>
              {subtitle && (
                <p className="text-zinc-400 text-lg lg:text-xl leading-relaxed font-light">
                  {subtitle}
                </p>
              )}
            </motion.div>
          </div>

          {/* Wavy Divider */}
          <div className="absolute bottom-0 left-0 w-full leading-[0] z-10 translate-y-[1px]">
            <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <path d="M0 50C240 100 480 112.5 720 62.5C960 12.5 1200 25 1440 75V100H0V50Z" fill="#ffffff" />
            </svg>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="prose prose-zinc max-w-none"
            >
              {children}
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
