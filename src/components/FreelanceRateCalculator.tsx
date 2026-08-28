import NumberField from "./NumberField";
import ResultDisplay from "./ResultDisplay";
import { formatMoney, safeNumber } from "../lib/format";
import type { FreelanceRateState } from "../lib/types";

interface Props {
  state: FreelanceRateState;
  onChange: (state: FreelanceRateState) => void;
}

export default function FreelanceRateCalculator({ state, onChange }: Props) {
  const income = safeNumber(state.desiredMonthlyIncome);
  const expenses = safeNumber(state.monthlyFixedExpenses);
  const hours = safeNumber(state.workableHoursPerMonth);
  const buffer = safeNumber(state.bufferPercent);

  const base = income + expenses;
  const withBuffer = base * (1 + buffer / 100);
  const hourlyRate = hours > 0 ? withBuffer / hours : NaN;

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <NumberField
          label="Ingreso mensual deseado"
          value={state.desiredMonthlyIncome}
          onChange={(v) => onChange({ ...state, desiredMonthlyIncome: v })}
        />
        <NumberField
          label="Gastos fijos del mes"
          value={state.monthlyFixedExpenses}
          onChange={(v) => onChange({ ...state, monthlyFixedExpenses: v })}
        />
        <NumberField
          label="Horas trabajables al mes"
          value={state.workableHoursPerMonth}
          onChange={(v) => onChange({ ...state, workableHoursPerMonth: v })}
          suffix="hrs"
        />
        <NumberField
          label="Colchón (imprevistos/impuestos)"
          value={state.bufferPercent}
          onChange={(v) => onChange({ ...state, bufferPercent: v })}
          suffix="%"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ResultDisplay
          label="Tarifa por hora"
          value={formatMoney(hourlyRate)}
          sublabel={
            hours === 0 ? "Ingresa las horas trabajables al mes" : undefined
          }
        />
        <ResultDisplay label="Total mensual con colchón" value={formatMoney(withBuffer)} />
      </div>
    </div>
  );
}
