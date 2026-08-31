import { useEffect, useState } from "react";
import { decodeProjectBudget } from "../lib/projectSharing";
import { createDefaultState, defaultState, type CalculatorsState } from "../lib/types";

const STORAGE_KEY = "calculadoras-rapidas-estado";

export function useCalculatorsState() {
  const [state, setState] = useState<CalculatorsState>(() => {
    let parsed: Partial<CalculatorsState> = {};
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) parsed = JSON.parse(raw) as Partial<CalculatorsState>;
    } catch {
      parsed = {};
    }

    const hydrated = hydrateState(parsed);
    const sharedProject = decodeProjectBudget(new URLSearchParams(window.location.search).get("project") ?? "");
    return sharedProject
      ? { ...hydrated, mode: "project", project: { ...defaultState.project, ...sharedProject } }
      : hydrated;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  function resetState() {
    localStorage.removeItem(STORAGE_KEY);
    setState(createDefaultState());
  }

  function importState(raw: unknown) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return false;
    setState(hydrateState(raw as Partial<CalculatorsState>));
    return true;
  }

  return { state, setState, resetState, importState };
}

function hydrateState(parsed: Partial<CalculatorsState>): CalculatorsState {
  return {
    ...createDefaultState(),
    ...parsed,
    website: { ...defaultState.website, ...parsed.website },
    freelance: { ...defaultState.freelance, ...parsed.freelance },
    sueldo: { ...defaultState.sueldo, ...parsed.sueldo },
    boleta: { ...defaultState.boleta, ...parsed.boleta },
    uf: { ...defaultState.uf, ...parsed.uf },
    iva: { ...defaultState.iva, ...parsed.iva },
    project: { ...defaultState.project, ...parsed.project },
    projectTemplates: Array.isArray(parsed.projectTemplates) ? parsed.projectTemplates : [],
  };
}
