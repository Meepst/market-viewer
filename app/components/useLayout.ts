import { useState, useEffect } from "react";

export function useLayout() {
  const [layout, setLayout] = useState({
    cols: 1,
    maxWidth: 1400,
    cardPadding: 20,
    gap: 16,
    fontSize: { symbol: 13, price: 28, change: 14 },
    chartHeight: 100,
    sparkline: false,
  });

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;

      if (w < 320) {
        setLayout({
          cols: 2,
          maxWidth: w - 16,
          cardPadding: 6,
          gap: 4,
          fontSize: { symbol: 8, price: 12, change: 8 },
          chartHeight: 20,
          sparkline: true,
        });
      } else if (w < 480) {
        setLayout({
          cols: 3,
          maxWidth: w - 24,
          cardPadding: 8,
          gap: 6,
          fontSize: { symbol: 9, price: 14, change: 9 },
          chartHeight: 25,
          sparkline: true,
        });
      } else if (w < 640) {
        setLayout({
          cols: 3,
          maxWidth: w - 32,
          cardPadding: 10,
          gap: 8,
          fontSize: { symbol: 10, price: 16, change: 10 },
          chartHeight: 30,
          sparkline: true,
        });
      } else if (w < 900) {
        setLayout({
          cols: 3,
          maxWidth: 860,
          cardPadding: 14,
          gap: 12,
          fontSize: { symbol: 11, price: 20, change: 12 },
          chartHeight: 60,
          sparkline: false,
        });
      } else if (w < 1200) {
        setLayout({
          cols: 4,
          maxWidth: 1100,
          cardPadding: 16,
          gap: 14,
          fontSize: { symbol: 12, price: 24, change: 13 },
          chartHeight: 80,
          sparkline: false,
        });
      } else if (w < 1600) {
        setLayout({
          cols: 5,
          maxWidth: 1400,
          cardPadding: 20,
          gap: 16,
          fontSize: { symbol: 13, price: 28, change: 14 },
          chartHeight: 100,
          sparkline: false,
        });
      } else {
        setLayout({
          cols: 5,
          maxWidth: Math.min(w * 0.85, 1800),
          cardPadding: 20,
          gap: 16,
          fontSize: { symbol: 13, price: 28, change: 14 },
          chartHeight: 100,
          sparkline: false,
        });
      }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return layout;
}
