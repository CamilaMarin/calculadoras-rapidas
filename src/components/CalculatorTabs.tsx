import type { CalculatorMode } from "../lib/types";

interface Props {
  mode: CalculatorMode;
  onChange: (mode: CalculatorMode) => void;
}

const GROUPS: { label: string; tabs: { id: CalculatorMode; label: string }[] }[] = [
  {
    label: "Freelance",
    tabs: [
      { id: "freelance", label: "Cuánto cobrar" },
      { id: "project", label: "Presupuesto web" },
      { id: "boleta", label: "Boleta honorarios" },
      { id: "iva", label: "IVA" },
    ],
  },
  {
    label: "Costos",
    tabs: [{ id: "website", label: "Mantener un sitio web" }],
  },
  {
    label: "Personal",
    tabs: [
      { id: "sueldo", label: "Sueldo líquido" },
      { id: "uf", label: "UF ↔ Pesos" },
    ],
  },
];

export default function CalculatorTabs({ mode, onChange }: Props) {
  return (
    <div className="space-y-3 border-b border-line pb-3 font-mono text-sm uppercase tracking-wide">
      {GROUPS.map((group) => (
        <div key={group.label}>
          <p className="mb-1 text-[0.65rem] tracking-[0.2em] text-ink-muted">{group.label}</p>
          <div className="flex flex-wrap gap-1" role="tablist" aria-label={group.label}>
            {group.tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={mode === tab.id}
                aria-controls={`panel-${tab.id}`}
                onClick={() => onChange(tab.id)}
                className={`border-b-2 px-3 py-2 ${
                  mode === tab.id
                    ? "border-moss text-ink"
                    : "border-transparent text-ink-muted hover:text-ink"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
