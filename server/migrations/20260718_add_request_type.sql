-- Add request_type column to requests table for classifying flight assistance requests
ALTER TABLE requests 
ADD COLUMN IF NOT EXISTS request_type TEXT DEFAULT 'STANDARD' 
CHECK (request_type IN ('STANDARD', 'LUXEL_ASSISTANCE', 'VIP_CONCIERGE'));

-- Add index for filtering
CREATE INDEX IF NOT EXISTS idx_requests_request_type ON requests(request_type);

-- Update existing flight requests that were created from flight search with no results
-- (Identify by checking if details contains flight search data without booking_id)
UPDATE requests 
SET request_type = 'LUXEL_ASSISTANCE' 
WHERE request_type = 'STANDARD' 
  AND service_type = 'FLIGHT' 
  AND (details->>'request_source' = 'flight_search_no_results' OR details->>'from' IS NOT NULL);