-- Run this in your Supabase SQL Editor to enable Realtime explicitly for the requests table.
-- This ensures the agent-confirming screen automatically advances the second the agent confirms or rejects the request.

ALTER PUBLICATION supabase_realtime ADD TABLE requests;
ALTER TABLE requests REPLICA IDENTITY FULL;
