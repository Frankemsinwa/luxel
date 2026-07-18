# Flight Assistance Request - Implementation Plan

## Overview
Update the `/flights` page to collect detailed customer info when "Request Luxel Assistance" is clicked (no flights found), store the request in the database, email all agents with full details, and display these requests in the Agent Dashboard with a clear "Customer Flight Assistance" classification.

---

## Current State Analysis

### Frontend (`src/app/flights/page.tsx`)
- **Current**: Simple email prompt (line 606-622) → calls `/flights/request-assistance` with `customerEmail` + `searchPayload`
- **Search params available in state**: `from`, `to`, `departure`, `return`, `tripType`, `adults`, `children`, `travelClass`, `passengers`

### Backend (`server/src/routes/flightRoutes.ts` → `requestFlightAssistance`)
- **Current**: Sends email to all agents with search params + customerEmail only
- **Missing**: Does NOT create a database record in `requests` table
- **Missing**: No customer name, phone, special requests collected

### Database (`supabase_schema.sql`)
- **Table**: `requests` (id, user_id, service_type, details JSONB, status, priority, assigned_agent_id)
- **details JSONB** currently stores: `flight_data`, `trip_details`, `passengers`, `contact`, `pricing`, `booking_id`, `itinerary`

### Agent Dashboard
- **List**: `src/app/agent/requests/page.tsx` - shows all requests in table
- **Detail**: `src/app/agent/requests/[id]/page.tsx` - shows full details
- **Current filter**: Only by search query (name, ID, itinerary)
- **Missing**: Filter/classification for "Customer Flight Assistance Requests"

---

## Implementation Plan

### Phase 1: Backend Changes

#### 1.1 Update `requestFlightAssistance` in `flightRoutes.ts`
**File**: `server/src/routes/flightRoutes.ts` (or move to `agentController.ts` as `createFlightAssistanceRequest`)

**Changes**:
1. Accept additional fields: `customerName`, `customerPhone`, `specialRequests`
2. Create record in `requests` table:
   ```javascript
   {
     user_id: user?.id || null,  // if logged in
     service_type: 'FLIGHT',
     request_type: 'LUXEL_ASSISTANCE',  // NEW field to classify
     details: {
       flight_search: { from, to, departure, returnDate, tripType, adults, children, travelClass },
       customer: { email, name, phone, specialRequests },
       status: 'PENDING_AGENT'
     },
     status: 'OPEN',
     priority: 'NORMAL'  // or 'HIGH' if VIP
   }
   ```
3. Send enhanced email to agents with ALL details
4. Return request ID to frontend for confirmation

#### 1.2 Add `request_type` column to `requests` table
**Migration needed**:
```sql
ALTER TABLE requests ADD COLUMN IF NOT EXISTS request_type TEXT DEFAULT 'STANDARD' CHECK (request_type IN ('STANDARD', 'LUXEL_ASSISTANCE', 'VIP_CONCIERGE'));
CREATE INDEX IF NOT EXISTS idx_requests_request_type ON requests(request_type);
```

#### 1.3 Update `getAllRequests` in `agentController.ts`
- Add optional query param `?request_type=LUXEL_ASSISTANCE` for filtering
- Or add `service_type=FLIGHT&request_type=LUXEL_ASSISTANCE`

#### 1.4 Email Template Enhancement
Enhance email to agents with:
- **Customer Info**: Name, Email, Phone, Special Requests
- **Flight Search**: From, To, Departure, Return, Trip Type, Adults, Children, Class
- **Direct link** to agent request detail page: `/agent/requests/{requestId}`

---

### Phase 2: Frontend - Flight Page (`src/app/flights/page.tsx`)

#### 2.1 Replace Email Prompt with Full Modal Form
**New State**:
```typescript
const [showAssistanceModal, setShowAssistanceModal] = useState(false);
const [assistanceForm, setAssistanceForm] = useState({
  email: user?.email || '',
  fullName: user?.user_metadata?.full_name || '',
  phone: user?.phone || '',
  specialRequests: ''
});
```

#### 2.2 Modal Component (inline or separate component)
Fields:
- **Email** (required, pre-filled if logged in)
- **Full Name** (required)
- **Phone Number** (optional but recommended)
- **Special Requests/Notes** (textarea, optional)
  - e.g., "Need wheelchair assistance", "Prefer morning flights", "Flexible dates ±3 days"

#### 2.3 On Submit
- Call `/api/flights/request-assistance` with:
  ```javascript
  {
    customerEmail: form.email,
    customerName: form.fullName,
    customerPhone: form.phone,
    specialRequests: form.specialRequests,
    searchPayload: { from, to, departure, returnDate, tripType, adults, children, travelClass }
  }
  ```
- Show success state with request ID
- Close modal after success

---

### Phase 3: Agent Dashboard Updates

#### 3.1 Update Request List Page (`src/app/agent/requests/page.tsx`)
**Option A: Add Filter Tab**
- Add tabs: "All Requests" | "Flight Assistance" | "Other"
- Filter by `request_type === 'LUXEL_ASSISTANCE'` and `service_type === 'FLIGHT'`

**Option B: Add Visual Badge**
- Add badge "🛫 Customer Flight Request" on rows where `request_type === 'LUXEL_ASSISTANCE'`
- Keep single list but visually distinct

**Recommended**: Option A (tabs) for better UX

#### 3.2 Update Request Detail Page (`src/app/agent/requests/[id]/page.tsx`)
- Detect `request_type === 'LUXEL_ASSISTANCE'` and `service_type === 'FLIGHT'`
- Render special section: "Customer Flight Assistance Request"
- Display:
  - **Customer Details**: Name, Email, Phone, Special Requests
  - **Flight Search Parameters**: From, To, Departure, Return, Trip Type, Passengers (Adults/Children), Class
  - **Action Buttons**: "Contact Customer", "Search Flights", "Mark Resolved"

---

### Phase 4: Database Migration

```sql
-- 1. Add request_type column
ALTER TABLE requests 
ADD COLUMN IF NOT EXISTS request_type TEXT DEFAULT 'STANDARD' 
CHECK (request_type IN ('STANDARD', 'LUXEL_ASSISTANCE', 'VIP_CONCIERGE'));

-- 2. Add index for filtering
CREATE INDEX IF NOT EXISTS idx_requests_request_type ON requests(request_type);

-- 3. Update existing flight assistance requests (if any)
UPDATE requests 
SET request_type = 'LUXEL_ASSISTANCE' 
WHERE service_type = 'FLIGHT' 
  AND details->>'request_source' = 'flight_search_no_results';
```

---

### Phase 5: Email Template (Backend)

**File**: `server/src/routes/flightRoutes.ts` → `requestFlightAssistance`

Enhanced HTML email with:
```
Subject: ✈️ Flight Assistance Request: [From] → [To] | [Customer Name]

Sections:
1. Customer Information
   - Name: [fullName]
   - Email: [email]  
   - Phone: [phone]
   - Special Requests: [specialRequests]

2. Flight Search Details
   - Route: [from] → [to]
   - Departure: [departureDate]
   - Return: [returnDate or "One Way"]
   - Trip Type: [ONE_WAY/ROUND_TRIP]
   - Passengers: [adults] Adults, [children] Children
   - Cabin Class: [travelClass]

3. Action Required
   - Link: [Agent Dashboard URL]/agent/requests/[requestId]
   - Reply directly to customer email
```

---

## File Changes Summary

### Backend
| File | Change Type | Description |
|------|-------------|-------------|
| `server/src/routes/flightRoutes.ts` | Modify | Enhance `requestFlightAssistance` to create DB record + enhanced email |
| `server/src/controllers/agentController.ts` | Modify | Add `request_type` filter to `getAllRequests` |
| `supabase/migrations/xxx_add_request_type.sql` | New | Add `request_type` column + index |

### Frontend
| File | Change Type | Description |
|------|-------------|-------------|
| `src/app/flights/page.tsx` | Modify | Replace email prompt with full assistance modal form |
| `src/app/agent/requests/page.tsx` | Modify | Add filter tabs for "Flight Assistance" requests |
| `src/app/agent/requests/[id]/page.tsx` | Modify | Enhanced display for LUXEL_ASSISTANCE requests |

---

## Implementation Order

1. **Database Migration** - Add `request_type` column
2. **Backend API** - Update `requestFlightAssistance` to create request + send enhanced email
3. **Backend API** - Update `getAllRequests` to support filtering by `request_type`
4. **Frontend Flight Page** - Build assistance modal with full form
5. **Frontend Agent Dashboard** - Add filter tabs + enhanced detail view
6. **Testing** - End-to-end flow verification

---

## Questions for Clarification

1. **Customer Phone**: Is phone required or optional? (Currently optional in plan)
2. **Special Requests**: Free text or predefined options (e.g., checkboxes for "Wheelchair", "Flexible dates", "Specific airline")?
3. **Priority**: Should flight assistance requests be `HIGH` priority by default?
4. **Agent Assignment**: Auto-assign to available agent or leave unassigned (current behavior)?
5. **Email Template**: Use existing email service or keep inline nodemailer?
6. **Guest Users**: If user not logged in, create request with `user_id = null`?
7. **Dashboard Location**: New tab in existing `/agent/requests` or new page `/agent/flight-assistance`?

Please confirm the plan and answer questions above before I start implementation.