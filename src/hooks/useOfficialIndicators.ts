import { useEffect, useState } from "react";
import { getOfficialIndicators, type OfficialIndicators } from "../lib/indicators";

export function useOfficialIndicators() {
  const [indicators, setIndicators] = useState<OfficialIndicators | null>(null);

  useEffect(() => {
    void getOfficialIndicators().then(setIndicators).catch(() => setIndicators(null));
  }, []);

  return indicators;
}
