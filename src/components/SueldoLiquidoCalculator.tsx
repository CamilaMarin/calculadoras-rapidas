import { useEffect } from "react";
import NumberField from "./NumberField";
import ResultDisplay from "./ResultDisplay";
import { formatMoney, safeNumber } from "../lib/format";
import { calcularBrutoDesdeLiquido, calcularSueldoDesdeBruto } from "../lib/sueldoLiquido";
import type { SueldoLiquidoState } from "../lib/types";
import type { OfficialIndicators } from "../lib/indicators";

interface Props {
  state: SueldoLiquidoState;
  onChange: (state: SueldoLiquidoState) => void;
  indicators: OfficialIndicators | null;
}

export default function SueldoLiquidoCalculator({ state, onChange, indicators }: Props) {
  useEffect(() => {
    const valorUTM = state.valorUTM || indicators?.utm || 0;
    const valorUF = state.valorUF || indicators?.uf || 0;
    if (valorUTM !== state.valorUTM || valorUF !== state.valorUF) {
      onChange({ ...state, valorUTM, valorUF });
    }
  }, [indicators, onChange, state]);

  const monto = safeNumber(state.montoInput);
  const params = {
    comisionAFP: state.comisionAFP,
    tipoSalud: state.tipoSalud,
    planIsapreValue: state.planIsapreValue,
    tipoContrato: state.tipoContrato,
    valorUTM: state.valorUTM,
    valorUF: state.valorUF,
  };

  const bruto =
    state.direccion === "bruto-a-liquido" ? monto : calcularBrutoDesdeLiquido(monto, params);
  const resultado = calcularSueldoDesdeBruto(bruto, params);

  const valorUTM = safeNumber(state.valorUTM);
  const valorUF = safeNumber(state.valorUF);

  return (
    <div>
      <div className="border border-line-strong bg-paper-dark p-4 font-mono text-xs leading-relaxed text-ink-soft">
        Esto es una estimación educativa, no un consejo tributario. Los valores
        de UF y UTM se cargan desde el Banco Central cuando están disponibles;
        puedes modificarlos para usar otra fecha. Verifica la información en{" "}
        <a href="https://www.sii.cl" target="_blank" rel="noreferrer" className="underline">
          sii.cl
        </a>{" "}
        y el de la UF en{" "}
        <a href="https://www.bcentral.cl" target="_blank" rel="noreferrer" className="underline">
          bcentral.cl
        </a>
        .
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

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <NumberField
          label={state.direccion === "bruto-a-liquido" ? "Sueldo bruto (imponible)" : "Sueldo líquido deseado"}
          value={state.montoInput}
          onChange={(v) => onChange({ ...state, montoInput: v })}
        />
        <NumberField
          label="Comisión AFP"
          value={state.comisionAFP}
          onChange={(v) => onChange({ ...state, comisionAFP: v })}
          suffix="% (+ 10% obligatorio)"
        />
        <NumberField
          label="Valor UTM del mes"
          value={state.valorUTM}
          onChange={(v) => onChange({ ...state, valorUTM: v })}
        />
        <NumberField
          label="Valor UF del día (para tope imponible)"
          value={state.valorUF}
          onChange={(v) => onChange({ ...state, valorUF: v })}
          placeholder="opcional"
        />

        <label className="block">
          <span className="font-mono text-xs uppercase tracking-wide text-ink-soft">
            Tipo de contrato
          </span>
          <select
            value={state.tipoContrato}
            onChange={(e) =>
              onChange({
                ...state,
                tipoContrato: e.target.value as "indefinido" | "plazo-fijo",
              })
            }
            className="mt-1 w-full border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-line-strong"
          >
            <option value="indefinido">Indefinido</option>
            <option value="plazo-fijo">Plazo fijo</option>
          </select>
        </label>
      </div>

      <div className="mt-4">
        <span className="font-mono text-xs uppercase tracking-wide text-ink-soft">
          Sistema de salud
        </span>
        <div className="mt-1 flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              checked={state.tipoSalud === "fonasa"}
              onChange={() => onChange({ ...state, tipoSalud: "fonasa" })}
            />
            Fonasa (7%)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              checked={state.tipoSalud === "isapre"}
              onChange={() => onChange({ ...state, tipoSalud: "isapre" })}
            />
            Isapre
          </label>
          {state.tipoSalud === "isapre" && (
            <div className="w-40">
              <NumberField
                label="Valor plan (CLP)"
                value={state.planIsapreValue}
                onChange={(v) => onChange({ ...state, planIsapreValue: v })}
              />
            </div>
          )}
        </div>
      </div>

      {valorUF === 0 && (
        <p className="mt-3 font-mono text-xs text-ink-muted">
          Sin valor de UF, no se aplica el tope imponible — para sueldos
          altos (sobre ~90 UF) el resultado puede quedar sobrestimado en
          los descuentos.
        </p>
      )}

      <div className="mt-8 space-y-1 border-t border-line pt-4 font-mono text-sm">
        <div className="flex justify-between text-ink-soft">
          <span>Sueldo bruto {state.direccion === "liquido-a-bruto" ? "(calculado)" : ""}</span>
          <span>{formatMoney(bruto)}</span>
        </div>
        <div className="flex justify-between text-ink-soft">
          <span>− AFP ({(10 + safeNumber(state.comisionAFP)).toFixed(2)}%)</span>
          <span>{formatMoney(resultado.descuentoAFP)}</span>
        </div>
        <div className="flex justify-between text-ink-soft">
          <span>− Salud</span>
          <span>{formatMoney(resultado.descuentoSalud)}</span>
        </div>
        <div className="flex justify-between text-ink-soft">
          <span>− Seguro cesantía</span>
          <span>{formatMoney(resultado.descuentoCesantia)}</span>
        </div>
        <div className="flex justify-between text-ink-soft">
          <span>− Impuesto único</span>
          <span>{valorUTM > 0 ? formatMoney(resultado.impuestoUnico) : "— (ingresa la UTM)"}</span>
        </div>
      </div>

      <div className="mt-4">
        <ResultDisplay
          label={
            state.direccion === "bruto-a-liquido"
              ? "Sueldo líquido estimado"
              : "Sueldo bruto necesario"
          }
          value={formatMoney(state.direccion === "bruto-a-liquido" ? resultado.liquido : bruto)}
        />
      </div>
    </div>
  );
}
