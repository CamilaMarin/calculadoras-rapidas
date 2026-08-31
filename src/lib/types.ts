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

export type SueldoDireccion = "bruto-a-liquido" | "liquido-a-bruto";

export interface SueldoLiquidoState {
  direccion: SueldoDireccion;
  montoInput: number; // bruto O líquido, según `direccion`
  comisionAFP: number; // %, además del 10% obligatorio
  tipoSalud: "fonasa" | "isapre";
  planIsapreValue: number; // solo si tipoSalud === "isapre", en CLP
  tipoContrato: "indefinido" | "plazo-fijo";
  valorUTM: number;
  valorUF: number; // 0 = no aplica tope imponible
}

export type MontoDireccion = "bruto-a-liquido" | "liquido-a-bruto";

export interface BoletaHonorariosState {
  direccion: MontoDireccion;
  monto: number;
}

export type UFDireccion = "uf-a-clp" | "clp-a-uf";

export interface UFConverterState {
  valorUF: number;
  monto: number;
  direccion: UFDireccion;
}

export type IVADireccion = "agregar" | "quitar";

export interface IVAState {
  monto: number;
  direccion: IVADireccion;
}

export interface ProjectBudgetState {
  designHours: number;
  developmentHours: number;
  meetingsHours: number;
  hourlyRate: number;
  externalCosts: number;
  bufferPercent: number;
  includesIVA: boolean;
}

export interface ProjectBudgetTemplate {
  id: string;
  name: string;
  budget: ProjectBudgetState;
}

export type CalculatorMode =
  | "website"
  | "project"
  | "freelance"
  | "sueldo"
  | "boleta"
  | "uf"
  | "iva";

export interface CalculatorsState {
  mode: CalculatorMode;
  website: WebsiteCostState;
  freelance: FreelanceRateState;
  sueldo: SueldoLiquidoState;
  boleta: BoletaHonorariosState;
  uf: UFConverterState;
  iva: IVAState;
  project: ProjectBudgetState;
  projectTemplates: ProjectBudgetTemplate[];
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
  sueldo: {
    direccion: "bruto-a-liquido",
    montoInput: 0,
    comisionAFP: 1.16,
    tipoSalud: "fonasa",
    planIsapreValue: 0,
    tipoContrato: "indefinido",
    valorUTM: 0,
    valorUF: 0,
  },
  boleta: {
    direccion: "bruto-a-liquido",
    monto: 0,
  },
  uf: {
    valorUF: 0,
    monto: 0,
    direccion: "clp-a-uf",
  },
  iva: {
    monto: 0,
    direccion: "agregar",
  },
  project: {
    designHours: 0,
    developmentHours: 0,
    meetingsHours: 0,
    hourlyRate: 0,
    externalCosts: 0,
    bufferPercent: 10,
    includesIVA: true,
  },
  projectTemplates: [],
};

export function createDefaultState(): CalculatorsState {
  return structuredClone(defaultState);
}
