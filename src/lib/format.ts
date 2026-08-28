/** Formatea un número con separador de miles, sin decimales. No asume
 * una moneda específica (el usuario ingresa los números en la moneda que
 * quiera) — solo antepone "$" como símbolo genérico. */
export function formatMoney(value: number): string {
  if (!Number.isFinite(value) || value < 0) return "—";
  return `$${Math.round(value).toLocaleString("es-CL")}`;
}

export function safeNumber(value: number): number {
  return Number.isFinite(value) && value >= 0 ? value : 0;
}
