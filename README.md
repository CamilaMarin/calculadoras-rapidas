# Calculadoras rápidas

Herramientas rápidas para cotizar, trabajar independiente y ordenar tus
finanzas. Todos los cálculos se actualizan en vivo, sin botón "calcular".

## Funcionalidad

- **Costo de mantener un sitio web**: hosting mensual + dominio anual + lista libre
  de otros servicios (email, CDN, etc.) → total mensual y anual
- **Cuánto cobrar**: ingreso deseado + gastos fijos + horas trabajables +
  colchón de imprevistos/impuestos → tarifa por hora
- **Presupuesto de proyecto web**: horas de diseño, desarrollo y gestión +
  tarifa + costos externos + imprevistos + IVA → total para cotizar
- **Sueldo líquido**: bidireccional (bruto → líquido, o líquido → bruto
  con búsqueda binaria, ya que el impuesto único no es lineal), con AFP,
  salud (Fonasa/Isapre), seguro de cesantía, impuesto único por tramos, y
  **tope imponible** opcional (90 UF para AFP/salud, 135,2 UF para
  cesantía — se activa solo si ingresas el valor de la UF)
- **Boleta de honorarios**: bidireccional (bruto ↔ líquido), tasa de
  retención 15,25% vigente 2026
- **UF ↔ Pesos**: conversor en ambos sentidos, con el valor de la UF
  ingresado por ti (cambia a diario)
- **IVA**: agregar o quitar 19% desde cualquiera de los dos montos
- Las siete recalculan en vivo, y los últimos valores ingresados en todas
  se guardan solos en el dispositivo (localStorage). Puedes restablecerlos
  desde el encabezado.
- Los presupuestos web se pueden guardar como plantillas y compartir mediante
  un enlace. También puedes exportar o importar un respaldo de todos tus datos.

## Sobre la calculadora de sueldo líquido

**No es asesoría tributaria** — es una estimación educativa.

- El cálculo inverso (líquido → bruto) se resuelve por búsqueda binaria
  sobre la misma función de cálculo directo (`calcularSueldoDesdeBruto`
  en `src/lib/sueldoLiquido.ts`) — así ambos sentidos usan exactamente
  las mismas reglas, sin duplicar lógica.
- El tope imponible (90 UF para AFP/salud, 135,2 UF para cesantía) solo
  se aplica si ingresas el valor de la UF del día — sin eso, sueldos
  altos pueden salir subestimados en el líquido.
- No cubre cotizaciones voluntarias (APV).

El valor de la UTM y de la UF se ingresan manualmente a propósito, en
vez de dejarlos fijos en el código — cambian seguido (UTM cada mes, UF
cada día), y un valor hardcodeado se desactualiza rápido.

## Desarrollo local

```bash
npm install
npm run dev
npm test
```

## Deploy a GitHub Pages

1. Settings → Pages → Source: GitHub Actions.
2. Push a `main`.
3. Si el repo no se llama `calculadoras-rapidas`, ajusta `base` en
   `vite.config.ts`.

No necesita ninguna API key ni backend — todo el cálculo es local.

## Mantención

- Las constantes normativas están reunidas en `src/lib/regulatory.ts`, con
  enlace a la fuente oficial y fecha de revisión.
- El primer día de cada mes, GitHub Actions crea un recordatorio de revisión
  si no existe uno pendiente. Se puede ejecutar manualmente desde Actions.
- GitHub también abre actualizaciones de dependencias con Dependabot.
- UF y UTM se mantienen manuales por ahora. Para automatizarlas sin exponer
  credenciales en el navegador, el siguiente paso es una acción programada
  que consulte la API del Banco Central y publique datos estáticos.

## Notas técnicas

- No asume ninguna moneda específica: los números se muestran con
  separador de miles pero sin símbolo de moneda fijo (el usuario ingresa
  en la moneda que quiera).
- Valores vacíos o negativos se tratan como 0 en los cálculos parciales
  (`safeNumber` en `src/lib/format.ts`), para que el total siga siendo
  útil mientras se completa el formulario, en vez de romperse apenas un
  campo está vacío.
