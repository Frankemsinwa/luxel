'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Menu, X, LogOut, Briefcase, Settings, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  // Close menu on click outside
  useEffect(() => {
    if (!showUserMenu) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowUserMenu(false);
    router.push('/');
  };

  const links = [
    { name: 'HOME', href: '/' },
    { name: 'FLIGHT', href: '/flights' },
    { name: 'TOUR', href: '/tour' }
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 ${isScrolled ? 'py-4' : 'py-6'}`}>
        <div className={`max-w-7xl mx-auto rounded-[2rem] transition-all duration-500 border border-white/5 relative ${isScrolled ? 'bg-black/60 backdrop-blur-2xl shadow-2xl py-3 px-8 translate-y-2' : 'bg-black py-4 px-6'}`}>

          {/* Animated Background Shimmer for Scrolled State */}
          <div className="absolute inset-0 overflow-hidden rounded-[2rem] pointer-events-none">
            {isScrolled && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -translate-x-full animate-[shimmer_3s_infinite]"
              />
            )}
          </div>

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
                    <span className={`relative z-10 text-caption font-medium tracking-[0.25em] transition-colors duration-300 ${isActive ? 'text-amber' : 'text-white/60 group-hover:text-white'}`}>
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
              {user ? (
                <div className="relative user-menu-container">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowUserMenu(!showUserMenu);
                    }}
                    className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-2xl transition-all border border-white/10 group"
                  >
                    <div className="w-6 h-6 rounded-full bg-amber flex items-center justify-center text-caption font-medium text-black">
                      {user.user_metadata?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-caption font-medium text-white tracking-widest hidden sm:block uppercase">
                      {user.user_metadata?.full_name?.split(' ')[0] || 'Profile'}
                    </span>
                    <ChevronDown size={14} className={`text-white/40 transition-transform ${showUserMenu ? 'rotate-180' : ''} pointer-events-none`} />
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-4 w-64 bg-zinc-900 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl p-2"
                      >
                        <div className="px-6 py-4 border-b border-white/5">
                          <p className="text-caption font-medium text-white/30 tracking-widest uppercase mb-1">Authenticated</p>
                          <p className="text-body text-white truncate">{user.email}</p>
                        </div>
                        <div className="p-2 space-y-1">
                          {user.user_metadata?.role === 'AGENT' && (
                            <Link
                              href="/agent/dashboard"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-amber/10 text-amber hover:text-amber-500 transition-all group"
                            >
                              <Settings size={16} />
                              <span className="text-caption font-medium tracking-widest uppercase">Agent Dashboard</span>
                            </Link>
                          )}
                          <Link
                            href="/trips"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition-all group"
                          >
                            <Briefcase size={16} className="text-amber" />
                            <span className="text-caption font-medium tracking-widest uppercase">My Trips</span>
                          </Link>
                          <Link
                            href="/profile"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition-all group"
                          >
                            <User size={16} className="text-amber" />
                            <span className="text-caption font-medium tracking-widest uppercase">Settings</span>
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-4 w-full px-4 py-3 rounded-xl hover:bg-red-500/10 text-white/70 hover:text-red-400 transition-all group"
                          >
                            <LogOut size={16} />
                            <span className="text-caption font-medium tracking-widest uppercase">Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-6">
                  <Link
                    href="/auth?mode=signup"
                    className="text-caption font-medium tracking-[0.2em] text-white/60 hover:text-white transition-colors uppercase"
                  >
                    Register
                  </Link>
                  <Link
                    href="/auth?mode=login"
                    className="bg-amber hover:bg-white text-white hover:text-black px-8 py-3 rounded-2xl text-caption font-medium tracking-[0.2em] transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-black/20 uppercase flex items-center gap-2"
                  >
                    <User size={14} strokeWidth={3} />
                    Login
                  </Link>
                </div>
              )}

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
                    className="block text-heading-sm text-white/50 hover:text-amber transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}

                {user && (
                  <>
                    <Link
                      key="trips"
                      href="/trips"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-heading-sm text-white/50 hover:text-amber transition-colors"
                    >
                      MY TRIPS
                    </Link>
                    <Link
                      key="profile"
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-heading-sm text-white/50 hover:text-amber transition-colors"
                    >
                      SETTINGS
                    </Link>
                  </>
                )}

                <div className="pt-6 border-t border-white/10 flex flex-col gap-4">
                  {user ? (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full bg-red-500/20 text-red-400 py-4 rounded-2xl text-body-sm font-medium tracking-widest"
                    >
                      LOGOUT
                    </button>
                  ) : (
                    <>
                      <Link
                        href="/auth?mode=login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full bg-white text-black py-4 rounded-2xl text-body-sm font-medium tracking-widest text-center"
                      >
                        LOGIN
                      </Link>
                      <Link
                        href="/auth?mode=signup"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full border border-white/20 text-white py-4 rounded-2xl text-body-sm font-medium tracking-widest text-center"
                      >
                        REGISTER
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
