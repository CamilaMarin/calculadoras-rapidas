import NumberField from "./NumberField";
import ResultDisplay from "./ResultDisplay";
import { formatMoney, safeNumber } from "../lib/format";
import type { WebsiteCostState } from "../lib/types";

interface Props {
  state: WebsiteCostState;
  onChange: (state: WebsiteCostState) => void;
}

export default function WebsiteCostCalculator({ state, onChange }: Props) {
  function addService() {
    onChange({
      ...state,
      otherServices: [
        ...state.otherServices,
        { id: crypto.randomUUID(), name: "", monthlyCost: 0 },
      ],
    });
  }

  function updateService(id: string, patch: Partial<{ name: string; monthlyCost: number }>) {
    onChange({
      ...state,
      otherServices: state.otherServices.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    });
  }

  function removeService(id: string) {
    onChange({ ...state, otherServices: state.otherServices.filter((s) => s.id !== id) });
  }

  const hosting = safeNumber(state.hostingMonthly);
  const domain = safeNumber(state.domainYearly);
  const othersMonthly = state.otherServices.reduce(
    (sum, s) => sum + safeNumber(s.monthlyCost),
    0,
  );

  const monthlyTotal = hosting + domain / 12 + othersMonthly;
  const yearlyTotal = monthlyTotal * 12;

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <NumberField
          label="Hosting (mensual)"
          value={state.hostingMonthly}
          onChange={(v) => onChange({ ...state, hostingMonthly: v })}
        />
        <NumberField
          label="Dominio (anual)"
          value={state.domainYearly}
          onChange={(v) => onChange({ ...state, domainYearly: v })}
        />
      </div>

      <div className="mt-6">
        <p className="font-mono text-xs uppercase tracking-wide text-ink-soft">
          Otros servicios
        </p>
        <div className="mt-2 space-y-2">
          {state.otherServices.map((service) => (
            <div key={service.id} className="flex items-center gap-2">
              <input
                value={service.name}
                onChange={(e) => updateService(service.id, { name: e.target.value })}
                placeholder="Ej. email, CDN..."
                className="flex-1 border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-line-strong"
              />
              <input
                type="number"
                min={0}
                value={Number.isNaN(service.monthlyCost) ? "" : service.monthlyCost}
                onChange={(e) =>
                  updateService(service.id, { monthlyCost: e.target.valueAsNumber })
                }
                placeholder="Mensual"
                className="w-32 border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-line-strong"
              />
              <button
                onClick={() => removeService(service.id)}
                className="text-ink-muted hover:text-ink"
                aria-label="Quitar servicio"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addService}
          className="mt-3 border border-dashed border-line-strong px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-ink-soft hover:border-ink hover:text-ink"
        >
          + Agregar servicio
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ResultDisplay label="Costo mensual" value={formatMoney(monthlyTotal)} />
        <ResultDisplay label="Costo anual" value={formatMoney(yearlyTotal)} />
      </div>
    </div>
  );
}
