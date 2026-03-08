// components/CardSkeleton.tsx
"use client";

import { useEffect, useState } from "react";
import { themes, Theme } from "../dashboard/dashboardClient";
import { useLayout } from "../components/useLayout";

function getTheme(): Theme {
  try {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved && themes[saved]) return themes[saved];
    }
  } catch {}
  return themes.midnight;
}

function Shimmer({
  width = "100%",
  height = 16,
  radius = 4,
  theme,
}: {
  width?: string | number;
  height?: number;
  radius?: number;
  theme: Theme;
}) {
  const isDark = theme.bg.startsWith("#0") || theme.bg.startsWith("#1");
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        backgroundImage: isDark
          ? `linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 75%)`
          : `linear-gradient(90deg, rgba(0,0,0,0.04) 25%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.04) 75%)`,
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite",
      }}
    />
  );
}

function CardSkeleton({ theme }: { theme: Theme }) {
  return (
    <div
      style={{
        background: theme.bgCard,
        backdropFilter: "blur(16px)",
        borderRadius: 16,
        padding: 20,
        border: `1px solid ${theme.border}`,
        boxShadow: theme.shadow,
      }}
    >
      <Shimmer width={60} height={14} theme={theme} />
      <div style={{ marginTop: 10 }}>
        <Shimmer width={140} height={28} theme={theme} />
      </div>
      <div style={{ marginTop: 6 }}>
        <Shimmer width={80} height={18} radius={6} theme={theme} />
      </div>
      <div style={{ marginTop: 16 }}>
        <Shimmer width="100%" height={100} radius={8} theme={theme} />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  const layout = useLayout();
  const mobile = layout.sparkline;
  const [theme, setTheme] = useState<Theme>(themes.midnight);

  useEffect(() => {
    setTheme(getTheme());
  }, []);

  return (
    <div
      style={{
        background: theme.bg,
        minHeight: "100vh",
        padding: mobile ? 12 : 32,
        fontFamily: theme.fontDisplay,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transition: "background 0.5s ease",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=DM+Mono:wght@400;500&family=Sora:wght@400;600;700&display=swap"
        rel="stylesheet"
      />
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div style={{ width: "100%", maxWidth: layout.maxWidth }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: mobile ? 16 : 28,
          }}
        >
          <div>
            <Shimmer width={160} height={26} theme={theme} />
            <div style={{ marginTop: 6 }}>
              <Shimmer width={120} height={12} theme={theme} />
            </div>
          </div>
          <Shimmer width={100} height={32} radius={99} theme={theme} />
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: layout.gap,
          }}
        >
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: `calc((100% - ${layout.gap * (layout.cols - 1)}px) / ${layout.cols})`,
                minWidth: 0,
                opacity: 0,
                animation: "cardIn 0.3s ease forwards",
                animationDelay: `${i * 40}ms`,
              }}
            >
              <style>{`
                @keyframes cardIn {
                  from { opacity: 0; transform: translateY(8px); }
                  to { opacity: 1; transform: translateY(0); }
                }
              `}</style>
              <CardSkeleton theme={theme} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
