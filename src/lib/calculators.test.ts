import { describe, expect, it } from "vitest";
import { brutoALiquido, liquidoABruto } from "./boletaHonorarios";
import { calcularImpuestoUnico } from "./impuestoUnico";
import { agregarIVA, quitarIVA } from "./iva";
import { calculateProjectBudget } from "./projectBudget";
import { calcularBrutoDesdeLiquido, calcularSueldoDesdeBruto } from "./sueldoLiquido";

describe("IVA", () => {
  it("agrega y quita IVA sin perder el monto neto", () => {
    expect(agregarIVA(100_000)).toEqual({ iva: 19_000, total: 119_000 });
    expect(quitarIVA(119_000).neto).toBeCloseTo(100_000);
  });
});

describe("boleta de honorarios", () => {
  it("aplica la retención de 2026 y permite invertir el cálculo", () => {
    expect(brutoALiquido(100_000)).toEqual({ retencion: 15_250, liquido: 84_750 });
    expect(liquidoABruto(84_750).bruto).toBeCloseTo(100_000);
  });
});

describe("impuesto único", () => {
  it("usa 35% en el tramo entre 120 y 310 UTM", () => {
    // Para una base de 200 UTM: 0,66 + 1,6 + 2,7 + 4,6 + 9,12 + 28 = 46,68 UTM.
    expect(calcularImpuestoUnico(20_000, 100)).toBeCloseTo(4_668);
  });
});

describe("sueldo líquido", () => {
  const params = {
    comisionAFP: 1.16,
    tipoSalud: "fonasa" as const,
    planIsapreValue: 0,
    tipoContrato: "indefinido" as const,
    valorUTM: 70_000,
    valorUF: 40_000,
  };

  it("calcula descuentos y puede recuperar el bruto desde el líquido", () => {
    const resultado = calcularSueldoDesdeBruto(1_000_000, params);

    expect(resultado.descuentoAFP).toBeCloseTo(111_600);
    expect(resultado.descuentoSalud).toBeCloseTo(70_000);
    expect(resultado.descuentoCesantia).toBeCloseTo(6_000);
    expect(calcularBrutoDesdeLiquido(resultado.liquido, params)).toBeCloseTo(1_000_000, 2);
  });
});

describe("presupuesto de proyecto", () => {
  it("suma trabajo, costos, imprevistos e IVA", () => {
    const result = calculateProjectBudget({
      designHours: 4,
      developmentHours: 10,
      meetingsHours: 2,
      hourlyRate: 25_000,
      externalCosts: 50_000,
      bufferPercent: 10,
      includesIVA: true,
    });

    expect(result).toMatchObject({
      totalHours: 16,
      workCost: 400_000,
      buffer: 45_000,
      net: 495_000,
      iva: 94_050,
      total: 589_050,
    });
  });
});
