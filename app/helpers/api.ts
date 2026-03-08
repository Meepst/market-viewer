const API_KEY = process.env.ALPHA_VANTAGE_KEY!;
const BASE_URL = "https://www.alphavantage.co/query";

if (!API_KEY) {
  console.warn("ALPHA_VANTAGE_KEY is not set in environment variables");
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function fetchTimeSeries(symbol: string) {
  await delay(1500); // advantage's 1 second req delay

  const res = await fetch(
    `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${API_KEY}`,
    {
      next: {
        revalidate: 86400,
        tags: [`timeseries-${symbol}`],
      },
    }, // cache for day
  );

  if (!res.ok) throw new Error(`Failed to fetch time series for ${symbol}`);
  return res.json();
}

export async function fetchOverview(symbol: string) {
  const res = await fetch(
    `${BASE_URL}?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`,
    {
      next: {
        revalidate: 86400,
        tags: [`overview-${symbol}`],
      },
    }, // cache for day
  );

  if (!res.ok) throw new Error(`Failed to fetch overview for ${symbol}`);
  return res.json();
}
