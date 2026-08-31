import CalculatorTabs from "./components/CalculatorTabs";
import WebsiteCostCalculator from "./components/WebsiteCostCalculator";
import FreelanceRateCalculator from "./components/FreelanceRateCalculator";
import SueldoLiquidoCalculator from "./components/SueldoLiquidoCalculator";
import BoletaHonorariosCalculator from "./components/BoletaHonorariosCalculator";
import UFConverterCalculator from "./components/UFConverterCalculator";
import IVACalculator from "./components/IVACalculator";
import ProjectBudgetCalculator from "./components/ProjectBudgetCalculator";
import { useCalculatorsState } from "./hooks/useCalculatorsState";

export default function App() {
  const { state, setState, resetState } = useCalculatorsState();

  function handleReset() {
    if (window.confirm("¿Restablecer todos los valores guardados en este dispositivo?")) {
      resetState();
    }
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
        <button
          type="button"
          onClick={handleReset}
          className="border border-line-strong px-3 py-2 font-mono text-xs uppercase tracking-wide text-ink-soft hover:border-ink hover:text-ink"
        >
          Restablecer datos
        </button>
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
