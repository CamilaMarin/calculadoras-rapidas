import CalculatorTabs from "./components/CalculatorTabs";
import WebsiteCostCalculator from "./components/WebsiteCostCalculator";
import FreelanceRateCalculator from "./components/FreelanceRateCalculator";
import { useCalculatorsState } from "./hooks/useCalculatorsState";

export default function App() {
  const { state, setState } = useCalculatorsState();

  return (
    <div className="min-h-screen bg-paper px-6 py-10 font-body text-ink md:px-12">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
          Herramientas / Trabajo
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold">Calculadoras rápidas</h1>
        <p className="mt-2 max-w-lg text-sm text-ink-soft">
          Dos calculadoras chicas: cuánto cuesta mantener un sitio web al
          año, y cuánto deberías cobrar por hora de trabajo.
        </p>
      </div>

      <CalculatorTabs mode={state.mode} onChange={(mode) => setState({ ...state, mode })} />

      <div className="mt-8 max-w-2xl">
        {state.mode === "website" ? (
          <WebsiteCostCalculator
            state={state.website}
            onChange={(website) => setState({ ...state, website })}
          />
        ) : (
          <FreelanceRateCalculator
            state={state.freelance}
            onChange={(freelance) => setState({ ...state, freelance })}
          />
        )}
      </div>
    </div>
  );
}
