// Tasa de retención de boleta de honorarios vigente desde el 1 de enero
// de 2026 (sube gradualmente por ley hasta 17% en 2028 — revisar en
// sii.cl si esto se usa más adelante en el tiempo).
export const TASA_RETENCION_2026 = 0.1525;

export function brutoALiquido(bruto: number): { retencion: number; liquido: number } {
  const retencion = bruto * TASA_RETENCION_2026;
  return { retencion, liquido: bruto - retencion };
}

export function liquidoABruto(liquido: number): { retencion: number; bruto: number } {
  const bruto = liquido / (1 - TASA_RETENCION_2026);
  return { retencion: bruto - liquido, bruto };
}
