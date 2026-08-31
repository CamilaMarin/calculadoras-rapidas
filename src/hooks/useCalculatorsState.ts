import { useEffect, useState } from "react";
import { createDefaultState, defaultState, type CalculatorsState } from "../lib/types";

const STORAGE_KEY = "calculadoras-rapidas-estado";

export function useCalculatorsState() {
  const [state, setState] = useState<CalculatorsState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return createDefaultState();
      const parsed = JSON.parse(raw);
      return {
        ...defaultState,
        ...parsed,
        website: { ...defaultState.website, ...parsed.website },
        freelance: { ...defaultState.freelance, ...parsed.freelance },
        sueldo: { ...defaultState.sueldo, ...parsed.sueldo },
        boleta: { ...defaultState.boleta, ...parsed.boleta },
        uf: { ...defaultState.uf, ...parsed.uf },
        iva: { ...defaultState.iva, ...parsed.iva },
        project: { ...defaultState.project, ...parsed.project },
      };
    } catch {
      return createDefaultState();
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  function resetState() {
    localStorage.removeItem(STORAGE_KEY);
    setState(createDefaultState());
  }

  return { state, setState, resetState };
}
