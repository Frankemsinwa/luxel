'use client'

import { motion } from "framer-motion";
import {
    Send,
    AtSign,
    Paperclip,
    Smile,
    MoreVertical,
    Search,
    Phone,
    Video,
    Info,
    CheckCheck,
    Clock
} from "lucide-react";
import { useState } from "react";

export default function ChatPage() {
    const [selectedChat, setSelectedChat] = useState("Jonathan Wick");

    const chats = [
        { name: "Jonathan Wick", lastMsg: "Confirming the Gulfstream for Thursday.", time: "10:15 AM", unread: 2, status: "Active", tier: "VIP" },
        { name: "Sofia Al-Aziz", lastMsg: "Need suite options for NRT-DXB.", time: "9:42 AM", unread: 0, status: "Away", tier: "Elite" },
        { name: "Michael Chen", lastMsg: "Thanks for the support!", time: "Yesterday", unread: 0, status: "Offline", tier: "Business" },
        { name: "Elena Rossi", lastMsg: "Is the private terminal confirmed?", time: "Oct 22", unread: 0, status: "Offline", tier: "VIP" },
    ];

    const messages = [
        { sender: "system", content: "Concierge Sarah joined the session.", time: "10:00 AM" },
        { sender: "client", content: "Hi Sarah, can we move the LHR departure to 2 PM instead of 11 AM?", time: "10:05 AM" },
        { sender: "agent", content: "Checking availability for late departure slots. Give me 5 minutes.", time: "10:08 AM" },
        { sender: "agent", content: "Slots are open. I've updated your itinerary. Confirming the Gulfstream for Thursday.", time: "10:12 AM" },
        { sender: "client", content: "Perfect, thank you!", time: "10:15 AM" },
    ];

    return (
        <div className="h-[calc(100vh-160px)] flex gap-6">
            {/* Chat List Sidebar */}
            <div className="w-96 bg-white rounded-[3rem] border border-zinc-100 shadow-sm flex flex-col overflow-hidden">
                <div className="p-8 border-b border-zinc-50">
                    <h3 className="text-xl font-black text-zinc-900 tracking-tight mb-6">Concierge Chat</h3>
                    <div className="relative group">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-amber transition-colors" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            className="w-full bg-zinc-50 border-none rounded-2xl py-3 pl-10 pr-4 text-xs font-bold text-zinc-900 focus:ring-2 focus:ring-amber/10 transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {chats.map((chat) => (
                        <button
                            key={chat.name}
                            onClick={() => setSelectedChat(chat.name)}
                            className={`w-full p-6 flex items-center gap-4 transition-all border-l-4 ${selectedChat === chat.name
                                    ? 'bg-zinc-50 border-amber'
                                    : 'border-transparent hover:bg-zinc-50/50'
                                }`}
                        >
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-zinc-200 border border-zinc-100 overflow-hidden relative" />
                                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${chat.status === 'Active' ? 'bg-emerald-500' :
                                        chat.status === 'Away' ? 'bg-amber' : 'bg-zinc-300'
                                    }`} />
                            </div>
                            <div className="flex-1 text-left">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-black text-zinc-900">{chat.name}</span>
                                    <span className="text-[10px] font-bold text-zinc-400">{chat.time}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-zinc-400 truncate w-40 font-medium">{chat.lastMsg}</p>
                                    {chat.unread > 0 && (
                                        <span className="w-5 h-5 rounded-full bg-amber text-[10px] font-black text-white flex items-center justify-center">
                                            {chat.unread}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 bg-white rounded-[3rem] border border-zinc-100 shadow-sm flex flex-col overflow-hidden relative">
                {/* Wallpaper abstraction */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.02),transparent)] pointer-events-none" />

                {/* Chat Header */}
                <div className="p-8 border-b border-zinc-100 flex items-center justify-between relative z-10 bg-white/80 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-zinc-100 border border-zinc-200" />
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <h3 className="text-base font-black text-zinc-900 leading-none">{selectedChat}</h3>
                                <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-zinc-900 text-white uppercase tracking-widest">VIP</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-emerald-500 font-bold uppercase tracking-widest">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Member is online
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="w-12 h-12 rounded-2xl border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 transition-all">
                            <Phone size={18} />
                        </button>
                        <button className="w-12 h-12 rounded-2xl border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 transition-all">
                            <Video size={18} />
                        </button>
                        <button className="w-12 h-12 rounded-2xl border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 transition-all">
                            <Info size={18} />
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-10 space-y-8 relative z-10">
                    {messages.map((msg, i) => {
                        if (msg.sender === 'system') {
                            return (
                                <div key={i} className="flex justify-center">
                                    <div className="bg-zinc-50 px-4 py-2 rounded-xl border border-zinc-100 text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                        <Clock size={12} />
                                        {msg.content}
                                    </div>
                                </div>
                            );
                        }
                        return (
                            <div key={i} className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] space-y-2 ${msg.sender === 'agent' ? 'items-end flex flex-col' : ''}`}>
                                    <div className={`p-6 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm ${msg.sender === 'agent'
                                            ? 'bg-zinc-900 text-white rounded-tr-none'
                                            : 'bg-white border border-zinc-100 text-zinc-700 rounded-tl-none'
                                        }`}>
                                        {msg.content}
                                    </div>
                                    <div className="flex items-center gap-2 px-2">
                                        <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">{msg.time}</span>
                                        {msg.sender === 'agent' && <CheckCheck size={12} className="text-amber" />}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Input Area */}
                <div className="p-8 pt-0 relative z-10 bg-white">
                    <div className="bg-zinc-50 border border-zinc-100 rounded-[2.5rem] p-4 flex items-center gap-4 shadow-inner">
                        <div className="flex items-center gap-2 border-r border-zinc-200 pr-4">
                            <button className="w-10 h-10 rounded-full hover:bg-white flex items-center justify-center text-zinc-400 hover:text-amber transition-all">
                                <AtSign size={18} />
                            </button>
                            <button className="w-10 h-10 rounded-full hover:bg-white flex items-center justify-center text-zinc-400 hover:text-amber transition-all">
                                <Paperclip size={18} />
                            </button>
                        </div>
                        <input
                            type="text"
                            placeholder="Type a message to the client..."
                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-zinc-900 placeholder:text-zinc-300"
                        />
                        <button className="w-10 h-10 rounded-full hover:bg-white flex items-center justify-center text-zinc-400 hover:text-amber transition-all">
                            <Smile size={18} />
                        </button>
                        <button className="w-14 h-14 rounded-full bg-zinc-900 text-amber flex items-center justify-center shadow-xl shadow-zinc-200 hover:scale-105 active:scale-95 transition-all">
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
