'use client'

import { motion, AnimatePresence } from "framer-motion";
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
    Clock,
    Loader2,
    CheckCheck as CheckCircle2,
    User,
    MessageSquare
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { supabase } from "@/lib/supabase";
import api from "@/lib/api";

export default function AgentChatPage() {
    const [rooms, setRooms] = useState<any[]>([]);
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    const selectedRoomIdRef = useRef<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoadingRooms, setIsLoadingRooms] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isTyping, setIsTyping] = useState(false);
    
    const socketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Sync ref with state to avoid stale closures
    useEffect(() => {
        selectedRoomIdRef.current = selectedRoomId;
    }, [selectedRoomId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initialize: Fetch rooms and setup socket
    useEffect(() => {
        const initAgentChat = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) return;
                setCurrentUser(session.user);

                // Fetch initial rooms
                const roomsRes = await api.get('/chat/rooms');
                setRooms(roomsRes.data);
                
                if (roomsRes.data.length > 0) {
                    const firstRoomId = roomsRes.data[0].id;
                    setSelectedRoomId(firstRoomId);
                    selectedRoomIdRef.current = firstRoomId;
                }

                // Socket setup
                const socketUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'https://luxel-8o9h.vercel.app';
                console.log('Agent connecting to socket at:', socketUrl);

                const socket = io(socketUrl, {
                    auth: { token: session.access_token },
                    transports: ['websocket', 'polling']
                });

                socket.on('connect', () => {
                    console.log('✅ Agent connected to chat server');
                    // Join existing rooms to receive updates/notifications
                    roomsRes.data.forEach((room: any) => {
                        socket.emit('join_room', room.id);
                    });
                });

                socket.on('connect_error', (err) => {
                    console.error('❌ Agent socket connection error:', err.message);
                });

                socket.on('new_message', (message) => {
                    // 1. Add to messages if it's for the selected room (check against Ref)
                    if (message.room_id === selectedRoomIdRef.current) {
                        setMessages(prev => [...prev, message]);
                    }

                    // 2. Update rooms list to show last message/update order
                    setRooms(prev => {
                        const updated = prev.map(r => {
                            if (r.id === message.room_id) {
                                return { ...r, last_message_at: message.created_at };
                            }
                            return r;
                        });
                        return [...updated].sort((a, b) => 
                            new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
                        );
                    });
                });

                socket.on('user_typing', ({ userId, typing, roomId }) => {
                    if (roomId === selectedRoomIdRef.current && userId !== session.user.id) {
                        setIsTyping(typing);
                    }
                });

                socketRef.current = socket;
            } catch (error) {
                console.error('Agent chat init error:', error);
            } finally {
                setIsLoadingRooms(false);
            }
        };

        initAgentChat();

        return () => {
            socketRef.current?.disconnect();
        };
    }, []);

    // Effect for room switching: Join new room and fetch history
    useEffect(() => {
        if (!selectedRoomId || !socketRef.current) return;

        const fetchHistory = async () => {
            setIsLoadingMessages(true);
            try {
                socketRef.current?.emit('join_room', selectedRoomId);
                const res = await api.get(`/chat/rooms/${selectedRoomId}/messages`);
                setMessages(res.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            } finally {
                setIsLoadingMessages(false);
            }
        };

        fetchHistory();
    }, [selectedRoomId]);

    const handleSendMessage = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!newMessage.trim() || !selectedRoomId || !socketRef.current) return;

        socketRef.current.emit('send_message', {
            roomId: selectedRoomId,
            content: newMessage,
            type: 'TEXT'
        });

        setNewMessage("");
        socketRef.current.emit('typing_stop', selectedRoomId);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value);
        if (socketRef.current && selectedRoomId) {
            if (e.target.value.length > 0) {
                socketRef.current.emit('typing_start', selectedRoomId);
            } else {
                socketRef.current.emit('typing_stop', selectedRoomId);
            }
        }
    };

    const selectedRoom = rooms.find(r => r.id === selectedRoomId);

    if (isLoadingRooms) {
        return (
            <div className="h-[calc(100vh-160px)] flex items-center justify-center bg-white rounded-[3rem] border border-zinc-100">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 size={32} className="text-amber animate-spin" />
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Initializing Concierge Console...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-160px)] flex gap-6">
            {/* Chat List Sidebar */}
            <div className="w-96 bg-white rounded-[3rem] border border-zinc-100 shadow-sm flex flex-col overflow-hidden">
                <div className="p-8 border-b border-zinc-50">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-black text-zinc-900 tracking-tight">Concierge Chat</h3>
                        <span className="bg-zinc-900 text-amber text-[8px] font-black px-2 py-1 rounded uppercase">{rooms.length} Active</span>
                    </div>
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
                    {rooms.map((room) => (
                        <button
                            key={room.id}
                            onClick={() => setSelectedRoomId(room.id)}
                            className={`w-full p-6 flex items-center gap-4 transition-all border-l-4 ${selectedRoomId === room.id
                                    ? 'bg-zinc-50 border-amber'
                                    : 'border-transparent hover:bg-zinc-50/50'
                                }`}
                        >
                            <div className="relative">
                                <div className="w-12 h-12 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400 overflow-hidden relative">
                                    <User size={20} />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white bg-emerald-500" />
                            </div>
                            <div className="flex-1 text-left">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-black text-zinc-900 truncate w-32">
                                        {room.customer?.full_name || 'Guest Member'}
                                    </span>
                                    <span className="text-[9px] font-bold text-zinc-400 uppercase">
                                        {new Date(room.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-zinc-400 truncate w-40 font-medium italic">
                                        Request #{room.request?.id?.substring(0, 8) || 'GEN'}
                                    </p>
                                </div>
                            </div>
                        </button>
                    ))}
                    
                    {rooms.length === 0 && (
                        <div className="p-12 text-center">
                            <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">No active sessions</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 bg-white rounded-[3rem] border border-zinc-100 shadow-sm flex flex-col overflow-hidden relative">
                {/* Wallpaper abstraction */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.02),transparent)] pointer-events-none" />

                {selectedRoomId ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-8 border-b border-zinc-100 flex items-center justify-between relative z-10 bg-white/80 backdrop-blur-md">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-400">
                                    <User size={20} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h3 className="text-base font-black text-zinc-900 leading-none">
                                            {selectedRoom?.customer?.full_name || 'Guest Member'}
                                        </h3>
                                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-zinc-900 text-white uppercase tracking-widest">VIP</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-emerald-500 font-bold uppercase tracking-widest">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        In active session
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
                            {isLoadingMessages ? (
                                <div className="flex justify-center py-20">
                                    <Loader2 className="text-amber animate-spin" />
                                </div>
                            ) : (
                                messages.map((msg, i) => {
                                    const isMe = msg.sender_id === currentUser?.id;
                                    return (
                                        <div key={msg.id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] space-y-2 ${isMe ? 'items-end flex flex-col' : ''}`}>
                                                <div className={`p-6 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm ${isMe
                                                        ? 'bg-zinc-900 text-white rounded-tr-none'
                                                        : 'bg-white border border-zinc-100 text-zinc-700 rounded-tl-none'
                                                    }`}>
                                                    {msg.content}
                                                </div>
                                                <div className="flex items-center gap-2 px-2">
                                                    <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">
                                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    {isMe && <CheckCheck size={12} className="text-amber" />}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-zinc-50 px-4 py-2 rounded-xl text-[10px] font-bold text-zinc-400 animate-pulse uppercase tracking-widest">
                                        Client is typing...
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-8 pt-0 relative z-10 bg-white">
                            <form onSubmit={handleSendMessage} className="bg-zinc-50 border border-zinc-100 rounded-[2.5rem] p-4 flex items-center gap-4 shadow-inner">
                                <div className="flex items-center gap-2 border-r border-zinc-200 pr-4">
                                    <button type="button" className="w-10 h-10 rounded-full hover:bg-white flex items-center justify-center text-zinc-400 hover:text-amber transition-all">
                                        <AtSign size={18} />
                                    </button>
                                    <button type="button" className="w-10 h-10 rounded-full hover:bg-white flex items-center justify-center text-zinc-400 hover:text-amber transition-all">
                                        <Paperclip size={18} />
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={handleInputChange}
                                    placeholder="Type a response to the member..."
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-zinc-900 placeholder:text-zinc-300"
                                />
                                <button type="button" className="w-10 h-10 rounded-full hover:bg-white flex items-center justify-center text-zinc-400 hover:text-amber transition-all">
                                    <Smile size={18} />
                                </button>
                                <button 
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="w-14 h-14 rounded-full bg-zinc-900 text-amber flex items-center justify-center shadow-xl shadow-zinc-200 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    <Send size={20} />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-20 h-20 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-200 mx-auto mb-6">
                                <MessageSquare size={40} />
                            </div>
                            <h3 className="text-xl font-black text-zinc-900 mb-2">Select a Conversation</h3>
                            <p className="text-sm text-zinc-400 font-medium">Connect with an active member to begin support</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
