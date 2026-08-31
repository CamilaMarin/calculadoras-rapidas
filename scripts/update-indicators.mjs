import { writeFile } from "node:fs/promises";

const token = process.env.BCCH_API_TOKEN;
if (!token) {
  console.log("BCCH_API_TOKEN is not configured; keeping the current indicators file.");
  process.exit(0);
}

const endpoint = "https://si3.bcentral.cl/SieteRestWS/SieteRestWS.ashx";
const today = new Date();

function toDateString(date) {
  return date.toISOString().slice(0, 10);
}

async function getLatestObservation(seriesId, firstDate) {
  const url = new URL(endpoint);
  url.search = new URLSearchParams({
    token,
    function: "GetSeries",
    timeseries: seriesId,
    firstdate: firstDate,
    lastdate: toDateString(today),
  }).toString();

  const response = await fetch(url);
  if (!response.ok) throw new Error(`BCCh returned HTTP ${response.status} for ${seriesId}.`);

  const payload = await response.json();
  const observations = payload?.Series?.Obs;
  if (!Array.isArray(observations)) throw new Error(`No observations returned for ${seriesId}.`);

  const observation = [...observations]
    .reverse()
    .find((item) => item?.statusCode === "OK" && Number.isFinite(Number(item.value)));
  if (!observation) throw new Error(`No valid observation returned for ${seriesId}.`);

  return { value: Number(observation.value), date: observation.indexDateString };
}

const dailyStart = new Date(today);
dailyStart.setDate(today.getDate() - 14);
const monthlyStart = new Date(today);
monthlyStart.setFullYear(today.getFullYear() - 1);

const [uf, utm] = await Promise.all([
  getLatestObservation("F073.UFF.PRE.Z.D", toDateString(dailyStart)),
  getLatestObservation("F073.UTR.PRE.Z.M", toDateString(monthlyStart)),
]);

const output = {
  source: "Banco Central de Chile",
  sourceUrl: "https://si3.bcentral.cl/estadisticas/Principal1/Web_Services/index_API_sec1_es.htm",
  updatedAt: new Date().toISOString(),
  uf: uf.value,
  utm: utm.value,
  observations: { ufDate: uf.date, utmDate: utm.date },
};

await writeFile("public/indicators.json", `${JSON.stringify(output, null, 2)}\n`);
