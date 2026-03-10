# Luxel Real-Time Chat Implementation Plan

This document outlines the end-to-end implementation of the real-time chat system for Luxel, connecting customers (travelers) with concierge agents.

## Phase 1: Database Schema (Supabase)

We need to store chat sessions (conversations) and the messages themselves.

### New Tables

```sql
-- 1. Create CHAT_ROOMS table
CREATE TABLE chat_rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES public.profiles(id),
  request_id UUID REFERENCES public.requests(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'CLOSED')),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create CHAT_MESSAGES table
CREATE TABLE chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id),
  content TEXT NOT NULL,
  type TEXT DEFAULT 'TEXT' CHECK (type IN ('TEXT', 'IMAGE', 'SYSTEM')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable Realtime
ALTER TABLE chat_rooms REPLICA IDENTITY FULL;
ALTER TABLE chat_messages REPLICA IDENTITY FULL;

-- 4. RLS Policies
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Rooms: Customers see their own, Agents see all
CREATE POLICY "Users view own rooms" ON chat_rooms FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Agents view all rooms" ON chat_rooms FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('AGENT', 'ADMIN'))
);

-- Messages: Users see messages in their rooms
CREATE POLICY "Users view room messages" ON chat_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM chat_rooms WHERE id = room_id AND (customer_id = auth.uid() OR agent_id = auth.uid()))
);
CREATE POLICY "Users send messages" ON chat_messages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM chat_rooms WHERE id = room_id AND (customer_id = auth.uid() OR agent_id = auth.uid()))
);
```

---

## Phase 2: Backend Real-Time Infrastructure (Socket.io)

### 2.1 Setup Socket.io
- Install `socket.io`.
- Refactor `server/src/app.ts` to use `http.createServer(app)`.
- Implement a `socketManager` to handle connections and authentication (via Supabase JWT).

### 2.2 Chat Events
- `join_room`: Joins a specific chat room.
- `send_message`: Persists message to DB and broadcasts to the room.
- `typing_start`/`typing_stop`: Real-time status indicators.
- `message_read`: Updates `is_read` status.

### 2.3 REST API Endpoints
- `GET /api/chat/rooms`: List rooms (Agent views all, User views their active).
- `GET /api/chat/rooms/:id/messages`: Fetch message history.
- `POST /api/chat/rooms`: Create or fetch existing room for a request/customer.

---

## Phase 3: Frontend - Customer Experience

### 3.1 Entry Point
- In `/flights/status/agent-confirming`, update the "Chat with Concierge" button to:
  1. Call backend to ensure a `chat_room` exists.
  2. Open `/chat?room={roomId}` in a new tab.

### 3.2 Chat Page (`/src/app/chat/page.tsx`)
- Implement a clean, luxury-themed chat UI.
- Use `socket.io-client` for real-time updates.
- Load message history on mount.

---

## Phase 4: Frontend - Agent Experience (`/agent/chat`)

### 4.1 Agent Chat Dashboard
- Refactor the existing mock UI in `src/app/agent/chat/page.tsx`.
- Connect to Socket.io.
- Implement room switching (sidebar list).
- Show request context (flight details, customer tier).

---

## Phase 5: Implementation Workflow

1.  **SQL Execution**: Apply the new tables and policies in Supabase.
2.  **Backend Socket Integration**: Setup Socket.io server and auth middleware.
3.  **Chat Services**: Create `chatService.ts` for DB operations.
4.  **Backend Routes**: Implement REST endpoints for history and room management.
5.  **Customer Chat UI**: Create the standalone chat page for travelers.
6.  **Agent Chat Integration**: Connect the agent dashboard to real data.
7.  **Final Hookup**: Link the "Chat with Concierge" button to the flow.

---

## Technical Considerations
- **Authentication**: Use the Supabase session token in the Socket.io handshake.
- **Persistence**: Every message MUST be saved to the database before broadcasting to ensure no loss of history.
- **Scalability**: For now, single-instance Socket.io is fine. If scaling, use Redis adapter.
- **File Uploads**: (Future Phase) Integrate with existing Cloudinary logic for sending screenshots.
