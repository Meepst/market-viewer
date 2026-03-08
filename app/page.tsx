import { Suspense } from "react";
import { Card } from "./types/stock";
import { DashboardSkeleton } from "./components/cardSkeleton";

async function DashboardLoader() {
  const { getCard } = await import("./helpers/data");
  const { DashboardClient } = await import("./dashboard/dashboardClient");

  const symbols = [
    "NFLX",
    "AAPL",
    "MSFT",
    "NVDA",
    "HIMS",
    "AMZN",
    "PG",
    "LLY",
    "JPM",
    "AMD",
    "DIS",
    "SONY",
    "NSRX",
    "GOOGL",
    "MA",
  ];

  // Fetch in batches of 3 to respect AlphaVantage rate limits
  // while still being faster than fully sequential
  const BATCH_SIZE = 3;
  const cards: Card[] = [];

  for (let i = 0; i < symbols.length; i += BATCH_SIZE) {
    const batch = symbols.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(batch.map((s) => getCard(s)));
    for (const card of results) {
      if (card) cards.push(card);
    }
  }

  return <DashboardClient cards={cards} />;
}

export default async function Home() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardLoader />
    </Suspense>
  );
}
