import CalculatorTabs from "./components/CalculatorTabs";
import WebsiteCostCalculator from "./components/WebsiteCostCalculator";
import FreelanceRateCalculator from "./components/FreelanceRateCalculator";
import SueldoLiquidoCalculator from "./components/SueldoLiquidoCalculator";
import BoletaHonorariosCalculator from "./components/BoletaHonorariosCalculator";
import UFConverterCalculator from "./components/UFConverterCalculator";
import IVACalculator from "./components/IVACalculator";
import ProjectBudgetCalculator from "./components/ProjectBudgetCalculator";
import { encodeProjectBudget } from "./lib/projectSharing";
import { useCalculatorsState } from "./hooks/useCalculatorsState";

export default function App() {
  const { state, setState, resetState, importState } = useCalculatorsState();

  function handleReset() {
    if (window.confirm("¿Restablecer todos los valores guardados en este dispositivo?")) {
      resetState();
    }
  }

  function downloadBackup() {
    const file = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = "calculadoras-rapidas-respaldo.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleImport(file: File | undefined) {
    if (!file) return;

    try {
      const imported = JSON.parse(await file.text());
      if (!importState(imported)) throw new Error("Formato no válido");
    } catch {
      window.alert("No pudimos importar ese archivo. Elige un respaldo generado por esta aplicación.");
    }
  }

  function buildProjectShareLink() {
    const url = new URL(window.location.href);
    url.search = "";
    url.searchParams.set("project", encodeProjectBudget(state.project));
    return url.toString();
  }

  return (
    <div className="min-h-screen bg-paper px-6 py-10 font-body text-ink md:px-12">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
            Herramientas / Trabajo
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold">Calculadoras rápidas</h1>
          <p className="mt-2 max-w-lg text-sm text-ink-soft">
            Herramientas para cotizar, trabajar independiente y ordenar tus finanzas,
            sin backend.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="cursor-pointer border border-line-strong px-3 py-2 font-mono text-xs uppercase tracking-wide text-ink-soft hover:border-ink hover:text-ink">
            Importar respaldo
            <input
              type="file"
              accept="application/json"
              className="sr-only"
              onChange={(event) => void handleImport(event.target.files?.[0])}
            />
          </label>
          <button
            type="button"
            onClick={downloadBackup}
            className="border border-line-strong px-3 py-2 font-mono text-xs uppercase tracking-wide text-ink-soft hover:border-ink hover:text-ink"
          >
            Exportar respaldo
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="border border-line-strong px-3 py-2 font-mono text-xs uppercase tracking-wide text-ink-soft hover:border-ink hover:text-ink"
          >
            Restablecer datos
          </button>
        </div>
      </div>

      <CalculatorTabs mode={state.mode} onChange={(mode) => setState({ ...state, mode })} />

      <div
        className="mt-8 max-w-2xl"
        id={`panel-${state.mode}`}
        role="tabpanel"
        aria-labelledby={`tab-${state.mode}`}
      >
        {state.mode === "website" && (
          <WebsiteCostCalculator
            state={state.website}
            onChange={(website) => setState({ ...state, website })}
          />
        )}
        {state.mode === "freelance" && (
          <FreelanceRateCalculator
            state={state.freelance}
            onChange={(freelance) => setState({ ...state, freelance })}
          />
        )}
        {state.mode === "project" && (
          <ProjectBudgetCalculator
            state={state.project}
            onChange={(project) => setState({ ...state, project })}
            templates={state.projectTemplates}
            onSaveTemplate={(template) =>
              setState({ ...state, projectTemplates: [...state.projectTemplates, template] })
            }
            onLoadTemplate={(project) => setState({ ...state, project })}
            onDeleteTemplate={(id) =>
              setState({
                ...state,
                projectTemplates: state.projectTemplates.filter((template) => template.id !== id),
              })
            }
            shareLink={buildProjectShareLink()}
          />
        )}
        {state.mode === "sueldo" && (
          <SueldoLiquidoCalculator
            state={state.sueldo}
            onChange={(sueldo) => setState({ ...state, sueldo })}
          />
        )}
        {state.mode === "boleta" && (
          <BoletaHonorariosCalculator
            state={state.boleta}
            onChange={(boleta) => setState({ ...state, boleta })}
          />
        )}
        {state.mode === "uf" && (
          <UFConverterCalculator state={state.uf} onChange={(uf) => setState({ ...state, uf })} />
        )}
        {state.mode === "iva" && (
          <IVACalculator state={state.iva} onChange={(iva) => setState({ ...state, iva })} />
        )}
      </div>
    </div>
  );
}
