'use client'

import { motion, AnimatePresence } from "framer-motion";
import {
    Send,
    AtSign,
    Paperclip,
    Smile,
    ChevronLeft,
    ShieldCheck,
    Clock,
    Loader2,
    CheckCheck,
    Headset
} from "lucide-react";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { supabase } from "@/lib/supabase";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function ChatContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const roomId = searchParams.get('room');
    
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [roomInfo, setRoomInfo] = useState<any>(null);
    const [isTyping, setIsTyping] = useState(false);
    
    const socketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom helper
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const initializeChat = async () => {
            if (!roomId) {
                router.push('/');
                return;
            }

            try {
                // 1. Get current user
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    router.push('/');
                    return;
                }
                setUser(session.user);

                // 2. Fetch message history & room info
                const [historyRes, roomsRes] = await Promise.all([
                    api.get(`/chat/rooms/${roomId}/messages`),
                    api.get(`/chat/rooms`) // We'll find our room in this list for info
                ]);

                setMessages(historyRes.data);
                const currentRoom = roomsRes.data.find((r: any) => r.id === roomId);
                setRoomInfo(currentRoom);

                // 3. Setup Socket connection
                const socketUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'https://luxel-8o9h.vercel.app';
                console.log('Connecting to socket at:', socketUrl);
                
                const socket = io(socketUrl, {
                    auth: { token: session.access_token },
                    transports: ['websocket', 'polling']
                });

                socket.on('connect', () => {
                    console.log('✅ Connected to chat server');
                    socket.emit('join_room', roomId);
                });

                socket.on('connect_error', (err) => {
                    console.error('❌ Socket connection error:', err.message);
                });

                socket.on('new_message', (message) => {
                    setMessages(prev => [...prev, message]);
                });

                socket.on('user_typing', ({ userId, typing }) => {
                    if (userId !== session.user.id) {
                        setIsTyping(typing);
                    }
                });

                socketRef.current = socket;
            } catch (error) {
                console.error('Chat init error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeChat();

        return () => {
            socketRef.current?.disconnect();
        };
    }, [roomId, router]);

    const handleSendMessage = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!newMessage.trim() || !socketRef.current) return;

        socketRef.current.emit('send_message', {
            roomId,
            content: newMessage,
            type: 'TEXT'
        });

        setNewMessage("");
        socketRef.current.emit('typing_stop', roomId);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value);
        if (socketRef.current) {
            if (e.target.value.length > 0) {
                socketRef.current.emit('typing_start', roomId);
            } else {
                socketRef.current.emit('typing_stop', roomId);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-amber border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em]">Establishing Secure Connection...</p>
            </div>
        );
    }

    return (
        <div className="bg-[#F8F9FA] min-h-screen flex flex-col">
            <Navbar />
            
            <main className="flex-1 pt-32 pb-10 px-6 max-w-5xl mx-auto w-full flex flex-col h-[calc(100vh-40px)]">
                {/* Chat Header */}
                <header className="bg-white rounded-t-[2.5rem] border-x border-t border-zinc-100 p-8 flex items-center justify-between shadow-sm relative z-10">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center text-amber shadow-xl shadow-zinc-200">
                            <Headset size={28} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-lg font-black text-zinc-900 tracking-tight">Luxel Priority Concierge</h1>
                                <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-amber text-black uppercase tracking-widest">Active</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-emerald-500 font-bold uppercase tracking-widest">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Secured Session
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-4 bg-zinc-50 px-6 py-3 rounded-2xl border border-zinc-100">
                        <ShieldCheck size={16} className="text-amber" />
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">TLS 1.3 Encryption Active</span>
                    </div>
                </header>

                {/* Messages Window */}
                <div className="flex-1 bg-white border-x border-zinc-100 overflow-y-auto p-8 space-y-8 relative">
                    {/* Wallpaper abstraction */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.03),transparent)] pointer-events-none" />
                    
                    <div className="flex justify-center relative z-10">
                        <div className="bg-zinc-50 px-4 py-2 rounded-xl border border-zinc-100 text-[9px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                            <Clock size={12} />
                            Session started: {new Date(roomInfo?.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>

                    {messages.map((msg, i) => {
                        const isMe = msg.sender_id === user?.id;
                        return (
                            <div key={msg.id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} relative z-10`}>
                                <div className={`max-w-[80%] space-y-2 ${isMe ? 'items-end flex flex-col' : ''}`}>
                                    <div className={`p-5 rounded-[1.8rem] text-sm font-medium leading-relaxed shadow-sm ${isMe
                                            ? 'bg-zinc-900 text-white rounded-tr-none'
                                            : 'bg-zinc-50 border border-zinc-100 text-zinc-700 rounded-tl-none'
                                        }`}>
                                        {msg.content}
                                    </div>
                                    <div className="flex items-center gap-2 px-2">
                                        <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {isMe && <CheckCheck size={12} className="text-amber" />}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {isTyping && (
                        <div className="flex justify-start relative z-10">
                            <div className="bg-zinc-50 px-4 py-3 rounded-2xl border border-zinc-100 flex items-center gap-2">
                                <div className="flex gap-1">
                                    <span className="w-1 h-1 bg-zinc-300 rounded-full animate-bounce" />
                                    <span className="w-1 h-1 bg-zinc-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                                    <span className="w-1 h-1 bg-zinc-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                                </div>
                                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Concierge is typing</span>
                            </div>
                        </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <footer className="bg-white rounded-b-[2.5rem] border-x border-b border-zinc-100 p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)]">
                    <form onSubmit={handleSendMessage} className="bg-zinc-50 border border-zinc-100 rounded-3xl p-3 flex items-center gap-4 shadow-inner">
                        <div className="flex items-center gap-1 border-r border-zinc-200 pr-3">
                            <button type="button" className="w-10 h-10 rounded-full hover:bg-white flex items-center justify-center text-zinc-400 hover:text-amber transition-all">
                                <Paperclip size={18} />
                            </button>
                            <button type="button" className="w-10 h-10 rounded-full hover:bg-white flex items-center justify-center text-zinc-400 hover:text-amber transition-all">
                                <Smile size={18} />
                            </button>
                        </div>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={handleInputChange}
                            placeholder="Message your concierge..."
                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-zinc-900 placeholder:text-zinc-300 py-3"
                        />
                        <button 
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="w-12 h-12 rounded-2xl bg-zinc-900 text-amber flex items-center justify-center shadow-xl shadow-zinc-200 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </footer >
            </main>
            
            <Footer />
        </div>
    );
}

export default function ChatPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Chat...</div>}>
            <ChatContent />
        </Suspense>
    );
}
