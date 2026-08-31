import { REGULATORY_RULES } from "./regulatory";

// Vigente desde el 1 de enero de 2026. Revisar el registro centralizado
// antes de usar la calculadora para años posteriores.
export const TASA_RETENCION_2026 = REGULATORY_RULES.honorarios.withholdingRate;

export function brutoALiquido(bruto: number): { retencion: number; liquido: number } {
  const retencion = bruto * TASA_RETENCION_2026;
  return { retencion, liquido: bruto - retencion };
}

export function liquidoABruto(liquido: number): { retencion: number; bruto: number } {
  const bruto = liquido / (1 - TASA_RETENCION_2026);
  return { retencion: bruto - liquido, bruto };
}
