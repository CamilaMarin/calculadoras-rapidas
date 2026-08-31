import NumberField from "./NumberField";
import ResultDisplay from "./ResultDisplay";
import { formatMoney, safeNumber } from "../lib/format";
import { agregarIVA, quitarIVA, TASA_IVA } from "../lib/iva";
import type { IVAState } from "../lib/types";

export default function IVACalculator({
  state,
  onChange,
}: {
  state: IVAState;
  onChange: (state: IVAState) => void;
}) {
  const monto = safeNumber(state.monto);
  const resultado = state.direccion === "agregar" ? agregarIVA(monto) : quitarIVA(monto);

  const neto = state.direccion === "agregar" ? monto : (resultado as { neto: number }).neto;
  const total = state.direccion === "agregar" ? (resultado as { total: number }).total : monto;

  return (
    <div>
      <div className="flex gap-1 font-mono text-xs uppercase tracking-wide">
        <button
          onClick={() => onChange({ ...state, direccion: "agregar" })}
          className={`border-b-2 px-2 py-1 ${
            state.direccion === "agregar"
              ? "border-moss text-ink"
              : "border-transparent text-ink-muted"
          }`}
        >
          Agregar IVA (desde neto)
        </button>
        <button
          onClick={() => onChange({ ...state, direccion: "quitar" })}
          className={`border-b-2 px-2 py-1 ${
            state.direccion === "quitar"
              ? "border-moss text-ink"
              : "border-transparent text-ink-muted"
          }`}
        >
          Quitar IVA (desde total)
        </button>
      </div>

      <div className="mt-4 max-w-xs">
        <NumberField
          label={state.direccion === "agregar" ? "Monto neto" : "Monto total (con IVA)"}
          value={state.monto}
          onChange={(v) => onChange({ ...state, monto: v })}
        />
      </div>

      <div className="mt-8 space-y-1 border-t border-line pt-4 font-mono text-sm">
        <div className="flex justify-between text-ink-soft">
          <span>Neto</span>
          <span>{formatMoney(neto)}</span>
        </div>
        <div className="flex justify-between text-ink-soft">
          <span>+ IVA ({(TASA_IVA * 100).toFixed(0)}%)</span>
          <span>{formatMoney(resultado.iva)}</span>
        </div>
      </div>

      <div className="mt-4">
        <ResultDisplay label="Total" value={formatMoney(total)} />
      </div>
    </div>
  );
}
