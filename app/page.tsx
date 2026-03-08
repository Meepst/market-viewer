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
  const cards: Card[] = [];

  for (const symbol of symbols) {
    const card = await getCard(symbol);
    if (card) {
      cards.push(card);
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
