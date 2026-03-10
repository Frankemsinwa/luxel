import { Server, Socket } from 'socket.io';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export const setupSocket = (server: any) => {
    const io = new Server(server, {
        cors: {
            origin: "*", // Adjust in production
            methods: ["GET", "POST"]
        }
    });

    // Middleware for authentication
    io.use(async (socket: Socket, next) => {
        try {
            const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
            
            if (!token) {
                return next(new Error('Authentication error: No token provided'));
            }

            // Verify the token with Supabase
            const { data: { user }, error } = await supabase.auth.getUser(token);

            if (error || !user) {
                return next(new Error('Authentication error: Invalid token'));
            }

            // Store user info in socket
            socket.data.user = user;
            next();
        } catch (err) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`🔌 User connected: ${socket.data.user.id}`);

        socket.on('join_room', (roomId: string) => {
            socket.join(roomId);
            console.log(`👤 User ${socket.data.user.id} joined room: ${roomId}`);
        });

        socket.on('send_message', async (data: { roomId: string, content: string, type: string }) => {
            const { roomId, content, type } = data;
            const senderId = socket.data.user.id;

            try {
                // 1. Save to Database via Supabase
                const { data: message, error } = await supabase
                    .from('chat_messages')
                    .insert({
                        room_id: roomId,
                        sender_id: senderId,
                        content,
                        type: type || 'TEXT'
                    })
                    .select('*, sender:profiles(*)')
                    .single();

                if (error) throw error;

                // 2. Broadcast to everyone in the room (including sender)
                io.to(roomId).emit('new_message', message);
                
                // 3. Update room's last_message_at
                await supabase
                    .from('chat_rooms')
                    .update({ last_message_at: new Date().toISOString() })
                    .eq('id', roomId);

            } catch (err) {
                console.error('Error sending message:', err);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        socket.on('typing_start', (roomId: string) => {
            socket.to(roomId).emit('user_typing', { userId: socket.data.user.id, typing: true });
        });

        socket.on('typing_stop', (roomId: string) => {
            socket.to(roomId).emit('user_typing', { userId: socket.data.user.id, typing: false });
        });

        socket.on('disconnect', () => {
            console.log(`🔌 User disconnected: ${socket.data.user.id}`);
        });
    });

    return io;
};
