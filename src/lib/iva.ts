export const TASA_IVA = 0.19;

export function agregarIVA(neto: number): { iva: number; total: number } {
  const iva = neto * TASA_IVA;
  return { iva, total: neto + iva };
}

export function quitarIVA(total: number): { neto: number; iva: number } {
  const neto = total / (1 + TASA_IVA);
  return { neto, iva: total - neto };
}
