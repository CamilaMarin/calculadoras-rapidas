import NumberField from "./NumberField";
import ResultDisplay from "./ResultDisplay";
import { formatMoney, safeNumber } from "../lib/format";
import { brutoALiquido, liquidoABruto, TASA_RETENCION_2026 } from "../lib/boletaHonorarios";
import type { BoletaHonorariosState } from "../lib/types";

interface Props {
  state: BoletaHonorariosState;
  onChange: (state: BoletaHonorariosState) => void;
}

export default function BoletaHonorariosCalculator({ state, onChange }: Props) {
  const monto = safeNumber(state.monto);
  const resultado =
    state.direccion === "bruto-a-liquido" ? brutoALiquido(monto) : liquidoABruto(monto);

  const bruto = state.direccion === "bruto-a-liquido" ? monto : (resultado as { bruto: number }).bruto;
  const liquido =
    state.direccion === "bruto-a-liquido" ? (resultado as { liquido: number }).liquido : monto;

  return (
    <div>
      <div className="border border-line-strong bg-paper-dark p-4 font-mono text-xs leading-relaxed text-ink-soft">
        Tasa de retención vigente 2026: {(TASA_RETENCION_2026 * 100).toFixed(2)}% (sube
        gradualmente por ley hasta 17% en 2028 — verifica en sii.cl si usas
        esto más adelante).
      </div>

      <div className="mt-4 flex gap-1 font-mono text-xs uppercase tracking-wide">
        <button
          onClick={() => onChange({ ...state, direccion: "bruto-a-liquido" })}
          className={`border-b-2 px-2 py-1 ${
            state.direccion === "bruto-a-liquido"
              ? "border-moss text-ink"
              : "border-transparent text-ink-muted"
          }`}
        >
          Desde bruto
        </button>
        <button
          onClick={() => onChange({ ...state, direccion: "liquido-a-bruto" })}
          className={`border-b-2 px-2 py-1 ${
            state.direccion === "liquido-a-bruto"
              ? "border-moss text-ink"
              : "border-transparent text-ink-muted"
          }`}
        >
          Desde líquido
        </button>
      </div>

      <div className="mt-4 max-w-xs">
        <NumberField
          label={state.direccion === "bruto-a-liquido" ? "Monto bruto de la boleta" : "Monto líquido que quieres recibir"}
          value={state.monto}
          onChange={(v) => onChange({ ...state, monto: v })}
        />
      </div>

      <div className="mt-8 space-y-1 border-t border-line pt-4 font-mono text-sm">
        <div className="flex justify-between text-ink-soft">
          <span>Bruto</span>
          <span>{formatMoney(bruto)}</span>
        </div>
        <div className="flex justify-between text-ink-soft">
          <span>− Retención ({(TASA_RETENCION_2026 * 100).toFixed(2)}%)</span>
          <span>{formatMoney(resultado.retencion)}</span>
        </div>
      </div>

      <div className="mt-4">
        <ResultDisplay
          label={state.direccion === "bruto-a-liquido" ? "Líquido a recibir" : "Bruto a emitir en la boleta"}
          value={formatMoney(state.direccion === "bruto-a-liquido" ? liquido : bruto)}
        />
      </div>
    </div>
  );
}
