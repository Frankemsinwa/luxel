# Tour Backend Implementation Plan

This document outlines the phased orchestration for building a comprehensive Tour management system for Luxel, enabling Agents to curate, list, and manage elite travel experiences.

## 🏛️ Phase 1: Database Architecture (Supabase)
We will leverage Supabase's PostgreSQL capabilities to store rich metadata for tours.

### 1.1 `tours` Table
- `id`: uuid (Primary Key)
- `slug`: text (Unique, for SEO-friendly URLs)
- `title`: text
- `description`: text
- `location`: text (e.g., "Kyoto, Japan")
- `price`: numeric (Base price per guest)
- `duration`: text (e.g., "7 Days")
- `rating`: float (Default 5.0)
- `hero_image`: text (URL to Supabase Storage/CDN)
- `images`: text[] (Gallery of tour images)
- `tags`: text[] (e.g., ["Limited Edition", "Luxury"])
- `themes`: text[] (e.g., ["Culinary", "Wellness", "Cultural"])
- `itinerary`: jsonb (Array of objects: `{ day: number, title: string, subtitle: string, content: string, images: string[] }`)
- `guides`: jsonb (Array of objects: `{ name: string, role: string, image: string }`)
- `included`: jsonb (Array of objects: `{ label: string, icon_name: string }`)
- `excluded`: jsonb (Array of objects: `{ label: string }`)
- `status`: text (enum: 'DRAFT', 'PUBLISHED', 'ARCHIVED')
- `start_date`: timestamp (For date-specific tours)
- `available_slots`: int (Capacity management)
- `agent_id`: uuid (Reference to the creating Agent)
- `created_at`: timestamptz

### 1.2 `tour_bookings` Table
- `id`: uuid
- `tour_id`: uuid (FK)
- `user_id`: uuid (FK)
- `guest_count`: int
- `total_price`: numeric
- `status`: text ('PENDING', 'CONFIRMED', 'CANCELLED')
- `contact_info`: jsonb
- `booking_date`: timestamp

---

## 🚀 Phase 2: API & Controller Layer
Creation of dynamic endpoints for both public discovery and agent-side administration.

### 2.1 Public Discovery Endpoints
- `GET /api/tours`: Fetch all published tours.
  - Query parameters for filtering: `?theme=...`, `?location=...`, `?date=...`
- `GET /api/tours/:slug`: Fetch detailed tour metadata for the experience page.

### 2.2 Agent Administrative Endpoints (Admin/Agent Only)
- `POST /api/tours`: Initialize a new tour record.
- `PATCH /api/tours/:id`: Atomic updates to metadata (prices, itinerary, etc.).
- `DELETE /api/tours/:id`: Archive/Delete a tour.
- `GET /api/agent/tours`: Fetch all tours managed by the authenticated agent.

### 2.3 Booking Logic
- `POST /api/tours/:id/book`: Process a new reservation request.
- `GET /api/tours/bookings/:id`: Fetch status of a tour booking.

---

## 🛠️ Phase 3: Service Layer Implementation
Decoupling logic from controllers into dedicated services.

### 3.1 `tourService.ts`
- Handlers for complex search queries with spatial/text matching.
- Logic for calculating total pricing based on guest counts and dynamic surcharges.
- Integration with Supabase Storage for high-res image uploads.

### 3.2 `bookingService.ts`
- Inventory check (preventing overbooking).
- Automated email/notification dispatch to the assigned agent when a new booking arrives.

---

## 🔒 Phase 4: Security & Validation
Ensuring the platform remains elite and secure.

- **Role-Based Access Control (RBAC)**: Only users with `role: 'AGENT'` or `role: 'ADMIN'` can access mutation endpoints.
- **Request Validation**: Use `Joi` or `Zod` to strictly validate the nested Tour JSON (itinerary blocks, etc.) to prevent database corruption.
- **Rate Limiting**: Prevent scraping of premium tour data.

---

## 🎨 Phase 5: Dashboard Integration (Next.js)
The final bridge between backend and the user interface.

- **Tour Builder Interface**: A multi-step form for Agents to input itinerary days, add guides, and upload images.
- **Real-time Availability**: Dynamically updating the `/tour/[id]` page based on actual backend slots.
- **Mock Data Clean-up**: Strip all hardcoded arrays in `src/app/tour/page.tsx` and integrate live `fetch()` calls.

---

**Next Immediate Steps:**
1. Execute SQL migrations for `tours` and `tour_bookings`.
2. Generate `tourRoutes.ts` and `tourController.ts`.
3. Scaffold the `TourBuilder` component in the agent dashboard.
