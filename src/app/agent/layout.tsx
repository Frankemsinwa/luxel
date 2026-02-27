'use client'

import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Plane,
    Users,
    MessageSquare,
    Settings,
    LogOut,
    Bell,
    Search
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function AgentLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: "Overview", href: "/agent/dashboard" },
        { icon: <Plane size={20} />, label: "Flight Requests", href: "/agent/requests" },
        { icon: <Users size={20} />, label: "Elite Members", href: "/agent/members" },
        { icon: <MessageSquare size={20} />, label: "Concierge Chat", href: "/agent/chat" },
        { icon: <Settings size={20} />, label: "Settings", href: "/agent/settings" },
    ];

    return (
        <div className="flex h-screen bg-[#F8F9FA]">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-zinc-100 flex flex-col relative z-20">
                <div className="p-8">
                    <div className="flex items-center justify-center mb-10 pb-10 border-b border-zinc-50">
                        <Image
                            src="/logo.png"
                            alt="Luxel Logo"
                            width={140}
                            height={36}
                            className="object-contain"
                            priority
                        />
                    </div>

                    <nav className="space-y-2">
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
                </div>

                <div className="mt-auto p-8 border-t border-zinc-50">
                    <button className="flex items-center gap-4 px-4 py-3 rounded-2xl w-full text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-all font-bold text-sm">
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar */}
                <header className="h-20 bg-white border-b border-zinc-100 flex items-center justify-between px-10 relative z-10">
                    <div className="relative w-96 group">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-amber transition-colors" />
                        <input
                            type="text"
                            placeholder="Search requests, members, or routes..."
                            className="w-full bg-zinc-50 border-none rounded-2xl py-3 pl-12 pr-4 text-xs font-bold text-zinc-900 focus:ring-2 focus:ring-amber/10 transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-all">
                            <Bell size={20} />
                            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber border-2 border-white" />
                        </button>

                        <div className="h-8 w-px bg-zinc-100 mx-2" />

                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-xs font-black text-zinc-900 leading-none mb-1">Agent Sarah</p>
                                <p className="text-[10px] font-bold text-amber uppercase tracking-widest leading-none">Senior Concierge</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-200 to-zinc-100 border border-zinc-200" />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
