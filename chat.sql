 -- Allow customers to create their own chat rooms
CREATE POLICY "Users can create own rooms" ON chat_rooms
FOR INSERT WITH CHECK (auth.uid() = customer_id);
-- Ensure customers can also update their own rooms (e.g., for last_message_at)
CREATE POLICY "Users can update own rooms" ON chat_rooms
FOR UPDATE USING (auth.uid() = customer_id);