'use client'

import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Plane,
    Users,
    MessageSquare,
    Settings,
    LogOut,
    Bell,
    Search,
    Palmtree,
    Calendar,
    Coins,
    Menu,
    X
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AgentLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: "Overview", href: "/agent/dashboard" },
        { icon: <Plane size={20} />, label: "Flight Requests", href: "/agent/requests" },
        { icon: <Palmtree size={20} />, label: "Tour Experiences", href: "/agent/tours" },
        { icon: <Calendar size={20} />, label: "Tour Bookings", href: "/agent/tours/bookings" },
        { icon: <Coins size={20} />, label: "Flight Pricing", href: "/agent/flights/pricing" },
        { icon: <Users size={20} />, label: "Elite Members", href: "/agent/members" },
        { icon: <MessageSquare size={20} />, label: "Concierge Chat", href: "/agent/chat" },
        { icon: <Settings size={20} />, label: "Settings", href: "/agent/settings" },
    ];

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut();
            router.push('/auth');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    // Close sidebar when route changes
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    return (
        <div className="flex h-screen bg-[#F8F9FA] overflow-hidden">
            {/* Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 w-72 bg-white border-r border-zinc-100 flex flex-col z-50 transition-transform duration-300 transform
                lg:translate-x-0 lg:static lg:inset-auto
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-8 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-10 pb-10 border-b border-zinc-50">
                        <Image
                            src="/logo.png"
                            alt="Luxel Logo"
                            width={140}
                            height={36}
                            className="object-contain"
                            priority
                        />
                        <button 
                            onClick={() => setIsSidebarOpen(false)}
                            className="lg:hidden p-2 text-zinc-400 hover:text-zinc-900 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <nav className="space-y-1 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group ${isActive
                                        ? 'bg-zinc-900 text-white shadow-xl shadow-zinc-200'
                                        : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
                                        }`}
                                >
                                    <span className={`${isActive ? 'text-amber' : 'group-hover:text-amber'} transition-colors`}>
                                        {item.icon}
                                    </span>
                                    <span className="font-bold text-sm tracking-tight">{item.label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="sidebar-active"
                                            className="ml-auto w-1.5 h-1.5 rounded-full bg-amber shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="pt-8 border-t border-zinc-50">
                        <button 
                            onClick={handleSignOut}
                            className="flex items-center gap-4 px-4 py-3 rounded-2xl w-full text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-all font-bold text-sm text-left"
                        >
                            <LogOut size={20} />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Topbar */}
                <header className="h-20 bg-white border-b border-zinc-100 flex items-center justify-between px-4 lg:px-10 relative z-30">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 -ml-2 text-zinc-600 hover:bg-zinc-50 rounded-xl transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        
                        <div className="relative w-48 md:w-64 lg:w-96 group hidden sm:block">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-amber transition-colors" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full bg-zinc-50 border-none rounded-2xl py-2.5 pl-12 pr-4 text-xs font-bold text-zinc-900 focus:ring-2 focus:ring-amber/10 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-6">
                        <button className="relative w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-all">
                            <Bell size={20} />
                            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber border-2 border-white" />
                        </button>

                        <div className="h-8 w-px bg-zinc-100 mx-1 hidden md:block" />

                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-black text-zinc-900 leading-none mb-1">Agent Sarah</p>
                                <p className="text-[10px] font-bold text-amber uppercase tracking-widest leading-none">Senior Concierge</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-200 to-zinc-100 border border-zinc-200 flex-shrink-0" />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-10">
                    <div className="max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

