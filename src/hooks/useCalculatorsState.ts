import { useEffect, useState } from "react";
import { defaultState, type CalculatorsState } from "../lib/types";

const STORAGE_KEY = "calculadoras-rapidas-estado";

export function useCalculatorsState() {
  const [state, setState] = useState<CalculatorsState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState;
      const parsed = JSON.parse(raw);
      // merge superficial por si en el futuro se agregan campos nuevos
      return {
        ...defaultState,
        ...parsed,
        website: { ...defaultState.website, ...parsed.website },
        freelance: { ...defaultState.freelance, ...parsed.freelance },
      };
    } catch {
      return defaultState;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return { state, setState };
}
