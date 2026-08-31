/**
 * Valores que deben revisarse cuando cambia la normativa. Mantenerlos aquí
 * permite ver rápidamente su vigencia, procedencia y última revisión.
 */
export const REGULATORY_RULES = {
  iva: {
    rate: 0.19,
    source: "https://www.sii.cl/preguntas_frecuentes/impuestos_mensuales/001_130_0572.htm",
    reviewedAt: "2026-08-31",
  },
  honorarios: {
    withholdingRate: 0.1525,
    validFor: "2026",
    source: "https://www.sii.cl/preguntas_frecuentes/declaracion_renta/001_140_8398.htm",
    reviewedAt: "2026-08-31",
  },
  cotizaciones: {
    afpAndHealthCapUF: 90,
    unemploymentInsuranceCapUF: 135.2,
    validFor: "Remuneraciones desde febrero de 2026",
    source: "https://www.afc.cl/afc-informa/noticias/empleador-conozca-el-nuevo-tope-imponible-para-2026/",
    reviewedAt: "2026-08-31",
  },
  impuestoUnico: {
    source: "https://www.sii.cl/valores_y_fechas/impuesto_2da_categoria/impuesto2026.htm",
    reviewedAt: "2026-08-31",
  },
} as const;
