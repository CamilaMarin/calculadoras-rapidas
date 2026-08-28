export interface OtherService {
  id: string;
  name: string;
  monthlyCost: number;
}

export interface WebsiteCostState {
  hostingMonthly: number;
  domainYearly: number;
  otherServices: OtherService[];
}

export interface FreelanceRateState {
  desiredMonthlyIncome: number;
  monthlyFixedExpenses: number;
  workableHoursPerMonth: number;
  bufferPercent: number; // colchón para imprevistos/impuestos
}

export type CalculatorMode = "website" | "freelance";

export interface CalculatorsState {
  mode: CalculatorMode;
  website: WebsiteCostState;
  freelance: FreelanceRateState;
}

export const defaultState: CalculatorsState = {
  mode: "website",
  website: {
    hostingMonthly: 0,
    domainYearly: 0,
    otherServices: [],
  },
  freelance: {
    desiredMonthlyIncome: 0,
    monthlyFixedExpenses: 0,
    workableHoursPerMonth: 0,
    bufferPercent: 0,
  },
};
