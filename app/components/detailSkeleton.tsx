"use client";

import { useState, useEffect } from "react";
import { themes, Theme } from "../dashboard/dashboardClient";

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

export function DetailSkeleton() {
  const [theme, setTheme] = useState<Theme>(themes.midnight);

  useEffect(() => {
    setTheme(getTheme());
  }, []);

  return (
    <div
      style={{
        background: theme.bg,
        minHeight: "100vh",
        padding: 32,
        fontFamily: theme.fontDisplay,
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

      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <Shimmer width={80} height={36} radius={99} theme={theme} />

        <div style={{ marginTop: 24 }}>
          <Shimmer width={100} height={14} theme={theme} />
          <div style={{ marginTop: 8 }}>
            <Shimmer width={300} height={30} theme={theme} />
          </div>
          <div style={{ marginTop: 10 }}>
            <Shimmer width={200} height={42} theme={theme} />
          </div>
        </div>

        <div
          style={{
            background: theme.bgCard,
            backdropFilter: "blur(16px)",
            borderRadius: 16,
            padding: 24,
            marginTop: 32,
            border: `1px solid ${theme.border}`,
            boxShadow: theme.shadow,
          }}
        >
          <Shimmer width={140} height={12} theme={theme} />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
              marginTop: 16,
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i}>
                <Shimmer width={70} height={10} theme={theme} />
                <div style={{ marginTop: 6 }}>
                  <Shimmer width={110} height={16} theme={theme} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20 }}>
            <Shimmer width="100%" height={60} radius={8} theme={theme} />
          </div>
        </div>

        <div
          style={{
            background: theme.bgCard,
            backdropFilter: "blur(16px)",
            borderRadius: 16,
            padding: 24,
            marginTop: 20,
            border: `1px solid ${theme.border}`,
            boxShadow: theme.shadow,
          }}
        >
          <Shimmer width={100} height={12} theme={theme} />
          <div style={{ marginTop: 16 }}>
            <Shimmer width="100%" height={280} radius={8} theme={theme} />
          </div>
        </div>

        <div
          style={{
            background: theme.bgCard,
            backdropFilter: "blur(16px)",
            borderRadius: 16,
            padding: 24,
            marginTop: 20,
            border: `1px solid ${theme.border}`,
            boxShadow: theme.shadow,
          }}
        >
          <Shimmer width={80} height={12} theme={theme} />
          <div style={{ marginTop: 16 }}>
            <Shimmer width="100%" height={160} radius={8} theme={theme} />
          </div>
        </div>
      </div>
    </div>
  );
}
