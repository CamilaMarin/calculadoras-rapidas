# Calculadoras rápidas

Dos calculadoras: cuánto cuesta mantener un sitio web al año, y cuánto
deberías cobrar por hora de trabajo freelance. Cálculo en vivo, sin
botón "calcular".

## Funcionalidad

- **Costo de sitio web**: hosting mensual + dominio anual + lista libre
  de otros servicios (email, CDN, etc.) → total mensual y anual
- **Cuánto cobrar**: ingreso deseado + gastos fijos + horas trabajables +
  colchón de imprevistos/impuestos → tarifa por hora
- Recalcula en vivo con cada cambio
- Los últimos valores ingresados en ambos modos se guardan solos
  (localStorage), y no se pierden al cambiar de tab

## Desarrollo local

```bash
npm install
npm run dev
```

## Deploy a GitHub Pages

1. Settings → Pages → Source: GitHub Actions.
2. Push a `main`.
3. Si el repo no se llama `calculadoras-rapidas`, ajusta `base` en
   `vite.config.ts`.

No necesita ninguna API key ni backend — todo el cálculo es local.

## Notas técnicas

- No asume ninguna moneda específica: los números se muestran con
  separador de miles pero sin símbolo de moneda fijo (el usuario ingresa
  en la moneda que quiera).
- Valores vacíos o negativos se tratan como 0 en los cálculos parciales
  (`safeNumber` en `src/lib/format.ts`), para que el total siga siendo
  útil mientras se completa el formulario, en vez de romperse apenas un
  campo está vacío.
