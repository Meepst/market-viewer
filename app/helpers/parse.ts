import { StockDay, Card } from "../types/stock";

export function parseTimeSeries(raw: Record<string, any>): Card {
  const meta = raw["Meta Data"];
  const series = raw["Time Series (Daily)"];

  const data: StockDay[] = Object.entries(series)
    .map(([date, vals]: [string, any]) => ({
      date,
      open: parseFloat(vals["1. open"]),
      high: parseFloat(vals["2. high"]),
      low: parseFloat(vals["3. low"]),
      close: parseFloat(vals["4. close"]),
      volume: parseInt(vals["5. volume"]),
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return {
    name: meta["2. Symbol"],
    symbol: meta["2. Symbol"],
    data,
  };
}
