import { calcularImpuestoUnico } from "./impuestoUnico";
import { safeNumber } from "./format";
import { REGULATORY_RULES } from "./regulatory";

// Topes imponibles vigentes (en UF) para AFP/salud y para seguro de
// cesantía — sobre estos montos, el descuento se calcula solo hasta el
// tope, no sobre el sueldo completo. Afecta principalmente a sueldos
// altos.
const TOPE_AFP_SALUD_UF = REGULATORY_RULES.cotizaciones.afpAndHealthCapUF;
const TOPE_CESANTIA_UF = REGULATORY_RULES.cotizaciones.unemploymentInsuranceCapUF;

export interface SueldoParams {
  comisionAFP: number; // %, además del 10% obligatorio
  tipoSalud: "fonasa" | "isapre";
  planIsapreValue: number; // CLP, solo si tipoSalud === "isapre"
  tipoContrato: "indefinido" | "plazo-fijo";
  valorUTM: number;
  valorUF: number; // 0 = no se aplica tope (no se ingresó)
}

export interface SueldoResultado {
  descuentoAFP: number;
  descuentoSalud: number;
  descuentoCesantia: number;
  baseTributable: number;
  impuestoUnico: number;
  liquido: number;
}

export function calcularSueldoDesdeBruto(
  bruto: number,
  params: SueldoParams,
): SueldoResultado {
  const brutoSafe = safeNumber(bruto);
  const comisionAFP = safeNumber(params.comisionAFP);
  const valorUF = safeNumber(params.valorUF);

  const topeAFPSaludCLP = valorUF > 0 ? TOPE_AFP_SALUD_UF * valorUF : Infinity;
  const topeCesantiaCLP = valorUF > 0 ? TOPE_CESANTIA_UF * valorUF : Infinity;

  const baseAFPSalud = Math.min(brutoSafe, topeAFPSaludCLP);
  const baseCesantia = Math.min(brutoSafe, topeCesantiaCLP);

  const descuentoAFP = baseAFPSalud * (0.1 + comisionAFP / 100);
  const descuentoSalud =
    params.tipoSalud === "fonasa" ? baseAFPSalud * 0.07 : safeNumber(params.planIsapreValue);
  const descuentoCesantia =
    params.tipoContrato === "indefinido" ? baseCesantia * 0.006 : 0;

  const baseTributable = Math.max(
    0,
    brutoSafe - descuentoAFP - descuentoSalud - descuentoCesantia,
  );
  const impuestoUnico =
    safeNumber(params.valorUTM) > 0
      ? calcularImpuestoUnico(baseTributable, params.valorUTM)
      : 0;

  const liquido = brutoSafe - descuentoAFP - descuentoSalud - descuentoCesantia - impuestoUnico;

  return { descuentoAFP, descuentoSalud, descuentoCesantia, baseTributable, impuestoUnico, liquido };
}

/**
 * Cálculo inverso: dado el líquido que quieres recibir, encuentra el
 * bruto necesario. El impuesto único es progresivo por tramos (no
 * lineal), así que no hay una fórmula algebraica directa — se resuelve
 * por búsqueda binaria sobre la misma función de cálculo directo, para
 * garantizar que ambos sentidos usen exactamente las mismas reglas.
 */
export function calcularBrutoDesdeLiquido(
  liquidoDeseado: number,
  params: SueldoParams,
): number {
  const target = safeNumber(liquidoDeseado);
  if (target === 0) return 0;

  let lo = 0;
  let hi = target * 3; // cota superior holgada; el líquido nunca supera al bruto

  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    const resultado = calcularSueldoDesdeBruto(mid, params);
    if (resultado.liquido < target) {
      lo = mid;
    } else {
      hi = mid;
    }
  }

  return (lo + hi) / 2;
}
