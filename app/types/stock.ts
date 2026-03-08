export interface StockDay {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface CompanyOverview {
  Symbol: string;
  AssetType: string;
  Name: string;
  Description: string;
  Exchange: string;
  Sector: string;
  Industry: string;
  MarketCapitalization: string;
  [key: string]: string;
}

export interface Card {
  name: string;
  symbol: string;
  data: StockDay[];
  overview?: CompanyOverview;
}

export interface LayoutConfig {
  cols: number;
  maxWidth: number;
  cardPadding: number;
  gap: number;
  fontSize: { symbol: number; price: number; change: number };
  chartHeight: number;
  sparkline: boolean;
}
