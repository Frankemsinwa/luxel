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
                
                // On larger screens, auto-select the first room
                if (window.innerWidth > 1024 && roomsRes.data.length > 0) {
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
                    roomsRes.data.forEach((room: any) => {
                        socket.emit('join_room', room.id);
                    });
                });

                socket.on('new_message', (message) => {
                    if (message.room_id === selectedRoomIdRef.current) {
                        setMessages(prev => [...prev, message]);
                    }

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
            <div className="h-[calc(100vh-120px)] lg:h-[calc(100vh-160px)] flex items-center justify-center bg-white rounded-3xl lg:rounded-[3rem] border border-zinc-100">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 size={32} className="text-amber animate-spin" />
                    <p className="text-[10px] lg:text-caption font-medium text-zinc-400 uppercase tracking-widest">Initializing Concierge...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-120px)] lg:h-[calc(100vh-160px)] flex gap-4 lg:gap-6 relative overflow-hidden">
            {/* Chat List Sidebar */}
            <div className={`
                absolute inset-0 z-20 lg:relative lg:z-0 lg:w-80 xl:w-96 bg-white rounded-3xl lg:rounded-[3rem] border border-zinc-100 shadow-sm flex flex-col overflow-hidden transition-transform duration-300
                ${selectedRoomId ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
            `}>
                <div className="p-6 lg:p-8 border-b border-zinc-50">
                    <div className="flex items-center justify-between mb-4 lg:mb-6">
                        <h3 className="text-lg lg:text-heading-sm font-medium text-zinc-900 tracking-tight">Concierge Chat</h3>
                        <span className="bg-zinc-900 text-amber text-[10px] font-medium px-2 py-1 rounded uppercase">{rooms.length} Active</span>
                    </div>
                    <div className="relative group">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-amber transition-colors" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full bg-zinc-50 border-none rounded-xl lg:rounded-2xl py-2.5 lg:py-3 pl-10 pr-4 text-xs lg:text-body-sm font-medium text-zinc-900 focus:ring-2 focus:ring-amber/10 transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {rooms.map((room) => (
                        <button
                            key={room.id}
                            onClick={() => setSelectedRoomId(room.id)}
                            className={`w-full p-4 lg:p-6 flex items-center gap-4 transition-all border-l-4 ${selectedRoomId === room.id
                                    ? 'bg-zinc-50 border-amber'
                                    : 'border-transparent hover:bg-zinc-50/50'
                                }`}
                        >
                            <div className="relative">
                                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400 overflow-hidden">
                                    <User size={20} />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 lg:w-4 lg:h-4 rounded-full border-2 border-white bg-emerald-500" />
                            </div>
                            <div className="flex-1 text-left min-w-0">
                                <div className="flex items-center justify-between mb-0.5 lg:mb-1">
                                    <span className="text-sm lg:text-body font-medium text-zinc-900 truncate pr-2">
                                        {room.customer?.full_name || 'Guest Member'}
                                    </span>
                                    <span className="text-[10px] font-medium text-zinc-400 uppercase flex-shrink-0">
                                        {new Date(room.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className="text-xs lg:text-body-sm text-zinc-400 truncate font-medium italic">
                                    Request #{room.request?.id?.substring(0, 8) || 'GEN'}
                                </p>
                            </div>
                        </button>
                    ))}
                    
                    {rooms.length === 0 && (
                        <div className="p-12 text-center">
                            <p className="text-[10px] lg:text-caption font-medium text-zinc-300 uppercase tracking-widest">No active sessions</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Window */}
            <div className={`
                flex-1 bg-white rounded-3xl lg:rounded-[3rem] border border-zinc-100 shadow-sm flex flex-col overflow-hidden relative transition-transform duration-300
                ${!selectedRoomId ? 'translate-x-full lg:translate-x-0' : 'translate-x-0'}
            `}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.02),transparent)] pointer-events-none" />

                {selectedRoomId ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 lg:p-8 border-b border-zinc-100 flex items-center justify-between relative z-10 bg-white/80 backdrop-blur-md">
                            <div className="flex items-center gap-3 lg:gap-4">
                                <button 
                                    onClick={() => setSelectedRoomId(null)}
                                    className="lg:hidden p-2 -ml-2 text-zinc-400 hover:text-zinc-900 transition-colors"
                                >
                                    <MoreVertical className="rotate-90 md:rotate-0" size={20} />
                                </button>
                                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-400">
                                    <User size={20} />
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h3 className="text-sm lg:text-base font-medium text-zinc-900 leading-none truncate">
                                            {selectedRoom?.customer?.full_name || 'Guest Member'}
                                        </h3>
                                        <span className="text-[10px] font-medium px-1 py-0.5 rounded bg-zinc-900 text-white uppercase tracking-widest">VIP</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-emerald-500 font-medium uppercase tracking-widest">
                                        <div className="w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        Active
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-1 lg:gap-2">
                                <button className="w-9 h-9 lg:w-12 lg:h-12 rounded-xl border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 transition-all">
                                    <Phone size={16} />
                                </button>
                                <button className="hidden sm:flex w-9 h-9 lg:w-12 lg:h-12 rounded-xl border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 transition-all">
                                    <Video size={16} />
                                </button>
                                <button className="w-9 h-9 lg:w-12 lg:h-12 rounded-xl border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 transition-all">
                                    <Info size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 lg:p-10 space-y-6 lg:space-y-8 relative z-10 custom-scrollbar">
                            {isLoadingMessages ? (
                                <div className="flex justify-center py-20">
                                    <Loader2 className="text-amber animate-spin" />
                                </div>
                            ) : (
                                messages.map((msg, i) => {
                                    const isMe = msg.sender_id === currentUser?.id;
                                    return (
                                        <div key={msg.id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[85%] lg:max-w-[70%] space-y-1 lg:space-y-2 ${isMe ? 'items-end flex flex-col' : ''}`}>
                                                <div className={`p-4 lg:p-6 rounded-2xl lg:rounded-[2rem] text-xs lg:text-body font-medium leading-relaxed shadow-sm ${isMe
                                                        ? 'bg-zinc-900 text-white rounded-tr-none'
                                                        : 'bg-white border border-zinc-100 text-zinc-700 rounded-tl-none'
                                                    }`}>
                                                    {msg.content}
                                                </div>
                                                <div className="flex items-center gap-2 px-2">
                                                    <span className="text-[10px] font-medium text-zinc-300 uppercase tracking-widest">
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
                                    <div className="bg-zinc-50 px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg lg:rounded-xl text-[10px] font-medium text-zinc-400 animate-pulse uppercase tracking-widest">
                                        Member is typing...
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 lg:p-8 pt-0 relative z-10 bg-white">
                            <form onSubmit={handleSendMessage} className="bg-zinc-50 border border-zinc-100 rounded-2xl lg:rounded-[2.5rem] p-2 lg:p-4 flex items-center gap-2 lg:gap-4 shadow-inner">
                                <div className="hidden sm:flex items-center gap-1 lg:gap-2 border-r border-zinc-200 pr-2 lg:pr-4">
                                    <button type="button" className="w-8 h-8 lg:w-10 lg:h-10 rounded-full hover:bg-white flex items-center justify-center text-zinc-400 hover:text-amber transition-all">
                                        <AtSign size={16} />
                                    </button>
                                    <button type="button" className="w-8 h-8 lg:w-10 lg:h-10 rounded-full hover:bg-white flex items-center justify-center text-zinc-400 hover:text-amber transition-all">
                                        <Paperclip size={16} />
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={handleInputChange}
                                    placeholder="Message..."
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-xs lg:text-body font-medium text-zinc-900 placeholder:text-zinc-300"
                                />
                                <button type="button" className="w-8 lg:w-10 h-8 lg:h-10 rounded-full hover:bg-white flex items-center justify-center text-zinc-400 hover:text-amber transition-all flex-shrink-0">
                                    <Smile size={16} />
                                </button>
                                <button 
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="w-10 lg:w-14 h-10 lg:h-14 rounded-full bg-zinc-900 text-amber flex items-center justify-center shadow-xl shadow-zinc-200 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex-shrink-0"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center p-8">
                            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-200 mx-auto mb-6">
                                <MessageSquare size={32} />
                            </div>
                            <h3 className="text-base lg:text-heading-sm font-medium text-zinc-900 mb-2">Select a Conversation</h3>
                            <p className="text-xs lg:text-body text-zinc-400 font-medium max-w-xs mx-auto">Connect with an active member to begin elite concierge support</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
