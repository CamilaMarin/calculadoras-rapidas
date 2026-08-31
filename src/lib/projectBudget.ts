import { safeNumber } from "./format";
import { TASA_IVA } from "./iva";
import type { ProjectBudgetState } from "./types";

export function calculateProjectBudget(state: ProjectBudgetState) {
  const designHours = safeNumber(state.designHours);
  const developmentHours = safeNumber(state.developmentHours);
  const meetingsHours = safeNumber(state.meetingsHours);
  const hourlyRate = safeNumber(state.hourlyRate);
  const externalCosts = safeNumber(state.externalCosts);
  const bufferPercent = safeNumber(state.bufferPercent);

  const totalHours = designHours + developmentHours + meetingsHours;
  const workCost = totalHours * hourlyRate;
  const subtotal = workCost + externalCosts;
  const buffer = subtotal * (bufferPercent / 100);
  const net = subtotal + buffer;
  const iva = state.includesIVA ? net * TASA_IVA : 0;

  return {
    totalHours,
    hourlyRate,
    externalCosts,
    bufferPercent,
    workCost,
    buffer,
    net,
    iva,
    total: net + iva,
  };
}
