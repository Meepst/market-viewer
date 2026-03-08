import { parseTimeSeries } from "./parse";
import { fetchTimeSeries, fetchOverview } from "./api";
import { getFileCached, setFileCache } from "./cache";
import { Card, CompanyOverview } from "../types/stock";

export async function getCard(symbol: string): Promise<Card | null> {
  const key = `card-${symbol.toUpperCase()}`;
  const cached = getFileCached<Card>(key);
  if (cached) {
    console.log(`Cache hit for ${symbol}, has overview: ${!!cached.overview}`);
    return cached;
  }

  try {
    console.log(`Fetching data for ${symbol}`);

    const [timeSeriesRaw, overviewRaw] = await Promise.all([
      fetchTimeSeries(symbol),
      fetchOverview(symbol),
    ]);

    console.log(`Time series keys for ${symbol}:`, Object.keys(timeSeriesRaw));
    console.log(`Overview keys for ${symbol}:`, Object.keys(overviewRaw));

    if (
      timeSeriesRaw["Error Message"] ||
      !timeSeriesRaw["Time Series (Daily)"]
    ) {
      console.error(`Bad response for ${symbol}:`, timeSeriesRaw);
      return null;
    }

    const card = parseTimeSeries(timeSeriesRaw);

    if (
      overviewRaw &&
      overviewRaw["Symbol"] &&
      !overviewRaw["Information"] &&
      !overviewRaw["Error Message"]
    ) {
      card.overview = overviewRaw as CompanyOverview;
      console.log(`Attached overview for ${symbol}: ${card.overview.Name}`);
    } else {
      console.warn(`No valid overview for ${symbol}`);
    }

    setFileCache(key, card, 900);
    return card;
  } catch (err) {
    console.error(`Failed to fetch ${symbol}:`, err);
    return null;
  }
}
