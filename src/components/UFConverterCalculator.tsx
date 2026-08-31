import NumberField from "./NumberField";
import ResultDisplay from "./ResultDisplay";
import { formatMoney, safeNumber } from "../lib/format";
import type { UFConverterState } from "../lib/types";

export default function UFConverterCalculator({
  state,
  onChange,
}: {
  state: UFConverterState;
  onChange: (state: UFConverterState) => void;
}) {
  const valorUF = safeNumber(state.valorUF);
  const monto = safeNumber(state.monto);

  const resultado =
    valorUF === 0
      ? null
      : state.direccion === "uf-a-clp"
        ? monto * valorUF
        : monto / valorUF;

  return (
    <div>
      <div className="border border-line-strong bg-paper-dark p-4 font-mono text-xs leading-relaxed text-ink-soft">
        El valor de la UF cambia todos los días. Verifica el del día en{" "}
        <a href="https://www.bcentral.cl" target="_blank" rel="noreferrer" className="underline">
          bcentral.cl
        </a>{" "}
        (no queda fijo en el código a propósito, para no quedar desactualizado).
      </div>

      <div className="mt-4 flex gap-1 font-mono text-xs uppercase tracking-wide">
        <button
          onClick={() => onChange({ ...state, direccion: "clp-a-uf" })}
          className={`border-b-2 px-2 py-1 ${
            state.direccion === "clp-a-uf"
              ? "border-moss text-ink"
              : "border-transparent text-ink-muted"
          }`}
        >
          Pesos → UF
        </button>
        <button
          onClick={() => onChange({ ...state, direccion: "uf-a-clp" })}
          className={`border-b-2 px-2 py-1 ${
            state.direccion === "uf-a-clp"
              ? "border-moss text-ink"
              : "border-transparent text-ink-muted"
          }`}
        >
          UF → Pesos
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <NumberField
          label="Valor de la UF hoy"
          value={state.valorUF}
          onChange={(v) => onChange({ ...state, valorUF: v })}
        />
        <NumberField
          label={state.direccion === "clp-a-uf" ? "Monto en pesos" : "Monto en UF"}
          value={state.monto}
          onChange={(v) => onChange({ ...state, monto: v })}
        />
      </div>

      <div className="mt-8">
        {resultado === null ? (
          <p className="font-mono text-sm text-ink-muted">Ingresa el valor de la UF de hoy.</p>
        ) : (
          <ResultDisplay
            label={state.direccion === "clp-a-uf" ? "Equivalente en UF" : "Equivalente en pesos"}
            value={
              state.direccion === "clp-a-uf"
                ? `${resultado.toLocaleString("es-CL", { maximumFractionDigits: 2 })} UF`
                : formatMoney(resultado)
            }
          />
        )}
      </div>
    </div>
  );
}
