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
