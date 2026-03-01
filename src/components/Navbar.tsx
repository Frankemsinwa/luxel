'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Menu, X } from 'lucide-react';
import AuthModal from './AuthModal';

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'signup' }>({
    isOpen: false,
    mode: 'login'
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'HOME', href: '/' },
    { name: 'FLIGHT', href: '/flights' },
    { name: 'TOUR', href: '/tour' }
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 ${isScrolled ? 'py-4' : 'py-6'}`}>
        <div className={`max-w-7xl mx-auto rounded-[2rem] transition-all duration-500 border border-white/5 relative overflow-hidden ${isScrolled ? 'bg-black/60 backdrop-blur-2xl shadow-2xl py-3 px-8 translate-y-2' : 'bg-black py-4 px-6'}`}>

          {/* Animated Background Shimmer for Scrolled State */}
          {isScrolled && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none"
            />
          )}

          <div className="flex items-center justify-between relative z-10">
            <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-105 active:scale-95">
              <Image
                src="/logo.png"
                alt="Luxel Logo"
                width={110}
                height={28}
                className="brightness-0 invert group-hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] transition-all"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="relative px-6 py-2 group"
                  >
                    <span className={`relative z-10 text-[11px] font-black tracking-[0.25em] transition-colors duration-300 ${isActive ? 'text-amber' : 'text-white/60 group-hover:text-white'}`}>
                      {link.name}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-white/5 rounded-full border border-white/10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-amber transition-all duration-300 group-hover:w-1/2 opacity-0 group-hover:opacity-100" />
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden sm:flex items-center gap-6">
                <button
                  onClick={() => setAuthModal({ isOpen: true, mode: 'signup' })}
                  className="text-[10px] font-black tracking-[0.2em] text-white/60 hover:text-white transition-colors uppercase"
                >
                  Register
                </button>
                <button
                  onClick={() => setAuthModal({ isOpen: true, mode: 'login' })}
                  className="bg-white hover:bg-amber text-black hover:text-white px-8 py-3 rounded-2xl text-[10px] font-black tracking-[0.2em] transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-black/20 uppercase flex items-center gap-2"
                >
                  <User size={14} strokeWidth={3} />
                  Login
                </button>
              </div>

              {/* Mobile Toggle */}
              <button
                className="md:hidden w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 bg-black/90 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl"
            >
              <div className="p-8 space-y-6">
                {links.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-lg font-bold text-white/50 hover:text-amber transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-6 border-t border-white/10 flex flex-col gap-4">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setAuthModal({ isOpen: true, mode: 'login' });
                    }}
                    className="w-full bg-white text-black py-4 rounded-2xl font-black text-xs tracking-widest"
                  >
                    LOGIN
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setAuthModal({ isOpen: true, mode: 'signup' });
                    }}
                    className="w-full border border-white/20 text-white py-4 rounded-2xl font-black text-xs tracking-widest"
                  >
                    REGISTER
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal(prev => ({ ...prev, isOpen: false }))}
        initialMode={authModal.mode}
      />
    </>
  );
}
