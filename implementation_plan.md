# Implementation Plan - Named Flight Tax Fee Charges

We need to add structured, named tax fee charges to flight bookings automatically (static values per passenger), displaying them clearly during flight details lookup, booking confirmation, and final bank transfer checkouts. This ensures premium transparency for travelers and aligns with the platform's revenue earning structure.

## User Review Required

> [!IMPORTANT]
> The total automatic taxes per passenger will sum up to **₦45,000** to remain fully backwards compatible with the current hardcoded static fee. The detailed breakdown is proposed as:
> - **VAT (Value Added Tax):** ₦12,500
> - **Passenger Service Charge (PSC):** ₦15,000
> - **Airport Tax & Security Fee:** ₦10,000
> - **Fuel Surcharge:** ₦7,500
> 
> Let us know if you would like to adjust these specific static amounts or their names!

## Proposed Changes

---

### [Frontend - Client App]

We will create a shared configuration of named taxes in `src/lib/constants.ts` (or direct helpers) and update pages to display the itemized breakdown.

#### [NEW] [constants.ts](file:///c:/Users/PC/Desktop/luxel/src/lib/constants.ts)
- Define the static flight tax fees breakdown:
```typescript
export interface TaxFeeItem {
  name: string;
  amount: number;
}

export const FLIGHT_TAXES_BREAKDOWN: TaxFeeItem[] = [
  { name: "VAT (Value Added Tax)", amount: 12500 },
  { name: "Passenger Service Charge (PSC)", amount: 15000 },
  { name: "Airport Tax & Security Fee", amount: 10000 },
  { name: "Fuel Surcharge", amount: 7500 }
];

export const TOTAL_FLIGHT_TAXES = FLIGHT_TAXES_BREAKDOWN.reduce((sum, item) => sum + item.amount, 0);
```

#### [MODIFY] [page.tsx](file:///c:/Users/PC/Desktop/luxel/src/app/flights/details/page.tsx)
- Import `FLIGHT_TAXES_BREAKDOWN` and `TOTAL_FLIGHT_TAXES`.
- Replace the hardcoded `taxes = 45000` with the shared constant.
- Replace the single "Taxes & Fees" line in the pricing card with a dynamic, itemized breakdown of named taxes (scaled by passenger count).

#### [MODIFY] [page.tsx](file:///c:/Users/PC/Desktop/luxel/src/app/flights/booking/page.tsx)
- Replace hardcoded `taxes = 45000` with the constant.
- Update the itemized display in the Price Summary sidebar card to render each named tax item.
- Include the structured breakdown in the `pricing` object sent in the booking request payload so it is saved in the database:
```typescript
pricing: {
    unitPrice: totalPrice,
    taxes: TOTAL_FLIGHT_TAXES,
    baseFare,
    totalPassengers: passengerCount,
    totalPrice: totalPrice * passengerCount,
    taxesBreakdown: FLIGHT_TAXES_BREAKDOWN
}
```

#### [MODIFY] [page.tsx](file:///c:/Users/PC/Desktop/luxel/src/app/flights/status/payment/page.tsx)
- Extract the tax breakdown from the fetched booking details (`booking.flight_data?.pricing?.taxesBreakdown` or reconstruct using `FLIGHT_TAXES_BREAKDOWN` as a fallback).
- In the booking summary card, display the named, itemized breakdown of the taxes alongside the base fare and total confirmed price to pay.

---

### [Backend - Server App]

We will ensure the booking controller preserves and validates the pricing breakdown structure without requiring schema updates, since it uses `JSONB` for flight details.

#### [MODIFY] [bookingController.ts](file:///c:/Users/PC/Desktop/luxel/server/src/controllers/bookingController.ts)
- Ensure the incoming booking request's pricing details structure is recorded and kept in the `bookings` and `requests` records.

---

## Verification Plan

### Automated Tests
- Validate TypeScript compilation of frontend and backend.
- Run `npm run build` locally if needed.

### Manual Verification
1. Navigate to a flight details page, verify the detailed taxes breakdown is shown correctly.
2. Proceed to the booking page, fill in passenger details, verify the named taxes breakdown sums up to the total correctly.
3. Submit a booking request.
4. Navigate to the booking's payment status page, verify the named taxes breakdown matches what was requested.
