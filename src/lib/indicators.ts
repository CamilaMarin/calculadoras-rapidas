export interface OfficialIndicators {
  source: string;
  sourceUrl: string;
  updatedAt: string | null;
  uf: number | null;
  utm: number | null;
}

const EMPTY_INDICATORS: OfficialIndicators = {
  source: "Banco Central de Chile",
  sourceUrl: "https://si3.bcentral.cl/estadisticas/Principal1/Web_Services/index_API_sec1_es.htm",
  updatedAt: null,
  uf: null,
  utm: null,
};

export async function getOfficialIndicators(): Promise<OfficialIndicators> {
  const response = await fetch(`${import.meta.env.BASE_URL}indicators.json`);
  if (!response.ok) return EMPTY_INDICATORS;

  const data: unknown = await response.json();
  if (!data || typeof data !== "object" || Array.isArray(data)) return EMPTY_INDICATORS;

  const candidate = data as Partial<OfficialIndicators>;
  return {
    source: typeof candidate.source === "string" ? candidate.source : EMPTY_INDICATORS.source,
    sourceUrl: typeof candidate.sourceUrl === "string" ? candidate.sourceUrl : EMPTY_INDICATORS.sourceUrl,
    updatedAt: typeof candidate.updatedAt === "string" ? candidate.updatedAt : null,
    uf: typeof candidate.uf === "number" ? candidate.uf : null,
    utm: typeof candidate.utm === "number" ? candidate.utm : null,
  };
}
