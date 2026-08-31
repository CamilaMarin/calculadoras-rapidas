// Tabla de tramos del Impuesto Único de Segunda Categoría (D.L. 824,
// art. 43), expresada en múltiplos de UTM — esta estructura de tramos es
// estable en el tiempo; lo que cambia mes a mes es el valor de la UTM en
// pesos, que se ingresa manualmente en la calculadora.
//
// El cálculo es 100% marginal (tramo por tramo), así no se depende de
// las constantes de "rebaja" que se ven en otras calculadoras — el
// resultado es equivalente, pero con menos riesgo de arrastrar un
// número mal transcrito.
const TRAMOS = [
  { limiteUTM: 13.5, tasa: 0 },
  { limiteUTM: 30, tasa: 0.04 },
  { limiteUTM: 50, tasa: 0.08 },
  { limiteUTM: 70, tasa: 0.135 },
  { limiteUTM: 90, tasa: 0.23 },
  { limiteUTM: 120, tasa: 0.304 },
  { limiteUTM: 310, tasa: 0.35 },
  { limiteUTM: Infinity, tasa: 0.4 },
];

export function calcularImpuestoUnico(baseImponibleCLP: number, valorUTM: number): number {
  if (baseImponibleCLP <= 0 || valorUTM <= 0) return 0;

  const baseEnUTM = baseImponibleCLP / valorUTM;
  let impuesto = 0;
  let limiteAnterior = 0;

  for (const tramo of TRAMOS) {
    if (baseEnUTM <= limiteAnterior) break;
    const tramoSuperior = Math.min(baseEnUTM, tramo.limiteUTM);
    const montoEnTramoUTM = tramoSuperior - limiteAnterior;
    impuesto += montoEnTramoUTM * tramo.tasa * valorUTM;
    limiteAnterior = tramo.limiteUTM;
  }

  return impuesto;
}
