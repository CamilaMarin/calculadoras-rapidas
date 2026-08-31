import NumberField from "./NumberField";
import ResultDisplay from "./ResultDisplay";
import { formatMoney } from "../lib/format";
import { TASA_IVA } from "../lib/iva";
import { calculateProjectBudget } from "../lib/projectBudget";
import type { ProjectBudgetState, ProjectBudgetTemplate } from "../lib/types";

interface Props {
  state: ProjectBudgetState;
  onChange: (state: ProjectBudgetState) => void;
  templates: ProjectBudgetTemplate[];
  onSaveTemplate: (template: ProjectBudgetTemplate) => void;
  onLoadTemplate: (state: ProjectBudgetState) => void;
  onDeleteTemplate: (id: string) => void;
  shareLink: string;
}

export default function ProjectBudgetCalculator({
  state,
  onChange,
  templates,
  onSaveTemplate,
  onLoadTemplate,
  onDeleteTemplate,
  shareLink,
}: Props) {
  const [templateName, setTemplateName] = useState("");
  const [shareMessage, setShareMessage] = useState("");
  const result = calculateProjectBudget(state);

  function saveTemplate() {
    const name = templateName.trim();
    if (!name) return;
    onSaveTemplate({ id: crypto.randomUUID(), name, budget: structuredClone(state) });
    setTemplateName("");
  }

  async function copyShareLink() {
    try {
      await navigator.clipboard.writeText(shareLink);
      setShareMessage("Enlace copiado.");
    } catch {
      window.prompt("Copia este enlace", shareLink);
    }
  }

  return (
    <div>
      <p className="max-w-xl text-sm text-ink-soft">
        Convierte tu tarifa en una cotización. Considera el tiempo de trabajo,
        los costos externos y un margen para imprevistos.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <NumberField
          label="Horas de diseño"
          value={state.designHours}
          onChange={(designHours) => onChange({ ...state, designHours })}
          suffix="hrs"
        />
        <NumberField
          label="Horas de desarrollo"
          value={state.developmentHours}
          onChange={(developmentHours) => onChange({ ...state, developmentHours })}
          suffix="hrs"
        />
        <NumberField
          label="Horas de reuniones y gestión"
          value={state.meetingsHours}
          onChange={(meetingsHours) => onChange({ ...state, meetingsHours })}
          suffix="hrs"
        />
        <NumberField
          label="Tarifa por hora"
          value={state.hourlyRate}
          onChange={(hourlyRate) => onChange({ ...state, hourlyRate })}
        />
        <NumberField
          label="Costos externos"
          value={state.externalCosts}
          onChange={(externalCosts) => onChange({ ...state, externalCosts })}
          placeholder="Dominio, licencias, fotos..."
        />
        <NumberField
          label="Margen para imprevistos"
          value={state.bufferPercent}
          onChange={(bufferPercent) => onChange({ ...state, bufferPercent })}
          suffix="%"
        />
      </div>

      <label className="mt-5 flex items-center gap-2 text-sm text-ink-soft">
        <input
          type="checkbox"
          checked={state.includesIVA}
          onChange={(event) => onChange({ ...state, includesIVA: event.target.checked })}
        />
        Incluir IVA ({(TASA_IVA * 100).toFixed(0)}%) en el total
      </label>

      <div className="mt-8 space-y-1 border-t border-line pt-4 font-mono text-sm" aria-live="polite">
        <div className="flex justify-between text-ink-soft">
          <span>Horas estimadas</span>
          <span>{result.totalHours.toLocaleString("es-CL")} hrs</span>
        </div>
        <div className="flex justify-between text-ink-soft">
          <span>Trabajo ({formatMoney(result.hourlyRate)}/hr)</span>
          <span>{formatMoney(result.workCost)}</span>
        </div>
        <div className="flex justify-between text-ink-soft">
          <span>Costos externos</span>
          <span>{formatMoney(result.externalCosts)}</span>
        </div>
        <div className="flex justify-between text-ink-soft">
          <span>+ Imprevistos ({result.bufferPercent.toLocaleString("es-CL")}%)</span>
          <span>{formatMoney(result.buffer)}</span>
        </div>
        <div className="flex justify-between text-ink-soft">
          <span>+ IVA</span>
          <span>{state.includesIVA ? formatMoney(result.iva) : "No incluido"}</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ResultDisplay label="Neto a cotizar" value={formatMoney(result.net)} />
        <ResultDisplay label="Total a cobrar" value={formatMoney(result.total)} />
      </div>

      <div className="mt-8 border-t border-line pt-5">
        <p className="font-mono text-xs uppercase tracking-wide text-ink-soft">Plantillas</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <input
            value={templateName}
            onChange={(event) => setTemplateName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") saveTemplate();
            }}
            placeholder="Ej. Landing page"
            className="min-w-48 flex-1 border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-line-strong"
          />
          <button
            type="button"
            onClick={saveTemplate}
            disabled={!templateName.trim()}
            className="border border-line-strong px-3 py-2 font-mono text-xs uppercase tracking-wide text-ink-soft enabled:hover:border-ink enabled:hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            Guardar plantilla
          </button>
          <button
            type="button"
            onClick={() => void copyShareLink()}
            className="border border-line-strong px-3 py-2 font-mono text-xs uppercase tracking-wide text-ink-soft hover:border-ink hover:text-ink"
          >
            Copiar enlace
          </button>
        </div>
        {shareMessage && <p className="mt-2 text-sm text-ink-soft" role="status">{shareMessage}</p>}
        {templates.length > 0 && (
          <ul className="mt-3 space-y-2">
            {templates.map((template) => (
              <li key={template.id} className="flex items-center justify-between gap-3 border border-line p-3">
                <span className="text-sm">{template.name}</span>
                <span className="flex gap-3 font-mono text-xs uppercase tracking-wide">
                  <button type="button" onClick={() => onLoadTemplate(template.budget)} className="hover:text-ink-soft">
                    Usar
                  </button>
                  <button type="button" onClick={() => onDeleteTemplate(template.id)} className="text-ink-muted hover:text-ink">
                    Quitar
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
import { useState } from "react";
