import type { CalculatorMode } from "../lib/types";

interface Props {
  mode: CalculatorMode;
  onChange: (mode: CalculatorMode) => void;
}

export default function CalculatorTabs({ mode, onChange }: Props) {
  return (
    <div className="flex gap-1 border-b border-line font-mono text-sm uppercase tracking-wide">
      <button
        onClick={() => onChange("website")}
        className={`border-b-2 px-3 py-2 ${
          mode === "website" ? "border-moss text-ink" : "border-transparent text-ink-muted"
        }`}
      >
        Costo de sitio web
      </button>
      <button
        onClick={() => onChange("freelance")}
        className={`border-b-2 px-3 py-2 ${
          mode === "freelance" ? "border-moss text-ink" : "border-transparent text-ink-muted"
        }`}
      >
        Cuánto cobrar
      </button>
    </div>
  );
}
