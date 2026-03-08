import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getCard } from "../../helpers/data";
import { StockDetailClient } from "./stockDetailClient";
import { DetailSkeleton } from "../../components/detailSkeleton";

async function StockLoader({ symbol }: { symbol: string }) {
  const card = await getCard(symbol);
  if (!card) notFound();
  return <StockDetailClient card={card} />;
}

export default async function StockPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;

  return (
    <Suspense fallback={<DetailSkeleton />}>
      <StockLoader symbol={symbol} />
    </Suspense>
  );
}
