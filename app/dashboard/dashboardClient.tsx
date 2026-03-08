// app/dashboard/dashboardClient.tsx
"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { Card } from "../types/stock";
import StockCard from "../components/card";
import { useLayout } from "../components/useLayout";

export interface Theme {
  name: string;
  bg: string;
  bgCard: string;
  bgCardHover: string;
  border: string;
  borderHover: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentGlow: string;
  up: string;
  upGlow: string;
  down: string;
  downGlow: string;
  shadow: string;
  shadowHover: string;
  font: string;
  fontDisplay: string;
}

export const themes: Record<string, Theme> = {
  midnight: {
    name: "Midnight",
    bg: "#0a0a12",
    bgCard: "rgba(18, 18, 30, 0.85)",
    bgCardHover: "rgba(24, 24, 42, 0.95)",
    border: "rgba(255,255,255,0.06)",
    borderHover: "rgba(139,92,246,0.25)",
    textPrimary: "#e8e8f0",
    textSecondary: "#6e6e8a",
    textMuted: "#44445a",
    accent: "#3b82f6",
    accentGlow: "#362F4F",
    up: "#34d399",
    upGlow: "rgba(52,211,153,0.1)",
    down: "#f87171",
    downGlow: "rgba(248,113,113,0.1)",
    shadow: "0 4px 24px rgba(0,0,0,0.4)",
    shadowHover:
      "0 8px 40px rgba(139,92,246,0.12), 0 0 0 1px rgba(139,92,246,0.15)",
    font: "'DM Mono', monospace",
    fontDisplay: "'Sora', sans-serif",
  },
  arctic: {
    name: "Arctic",
    bg: "#f0f4f8",
    bgCard: "rgba(255,255,255,0.85)",
    bgCardHover: "rgba(255,255,255,0.98)",
    border: "rgba(0,0,0,0.07)",
    borderHover: "rgba(59,130,246,0.3)",
    textPrimary: "#1a1a2e",
    textSecondary: "#64748b",
    textMuted: "#94a3b8",
    accent: "#3b82f6",
    accentGlow: "rgba(59,130,246,0.08)",
    up: "#059669",
    upGlow: "rgba(5,150,105,0.07)",
    down: "#dc2626",
    downGlow: "rgba(220,38,38,0.07)",
    shadow: "0 2px 16px rgba(0,0,0,0.05)",
    shadowHover:
      "0 8px 32px rgba(59,130,246,0.08), 0 0 0 1px rgba(59,130,246,0.12)",
    font: "'DM Mono', monospace",
    fontDisplay: "'Sora', sans-serif",
  },
};

export const ThemeContext = createContext<{
  theme: Theme;
  themeKey: string;
  setThemeKey: (key: string) => void;
}>({
  theme: themes.midnight,
  themeKey: "midnight",
  setThemeKey: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

function ThemeToggle({
  themeKey,
  onChange,
  theme,
  mobile = false,
}: {
  themeKey: string;
  onChange: (key: string) => void;
  theme: Theme;
  mobile?: boolean;
}) {
  const isDark = themeKey === "midnight";
  return (
    <button
      onClick={() => onChange(isDark ? "arctic" : "midnight")}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: mobile ? 6 : 8,
        padding: mobile ? "4px 10px" : "6px 14px",
        borderRadius: 99,
        border: `1px solid ${theme.border}`,
        background: theme.bgCard,
        color: theme.textSecondary,
        cursor: "pointer",
        fontFamily: theme.font,
        fontSize: mobile ? 10 : 12,
        letterSpacing: "0.04em",
        transition: "all 0.3s ease",
        backdropFilter: "blur(8px)",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: mobile ? 28 : 36,
          height: mobile ? 16 : 20,
          borderRadius: mobile ? 8 : 10,
          background: theme.accent,
          position: "relative",
          transition: "background 0.3s",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: mobile ? 12 : 16,
            height: mobile ? 12 : 16,
            borderRadius: "50%",
            background: "#fff",
            position: "absolute",
            top: 2,
            left: isDark ? 2 : mobile ? 14 : 18,
            transition: "left 0.3s cubic-bezier(0.4,0,0.2,1)",
            boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
          }}
        />
      </div>
      {!mobile && <span>{isDark ? "Dark" : "Light"}</span>}
    </button>
  );
}

function NoiseOverlay() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
        opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "128px 128px",
      }}
    />
  );
}

// ─── DASHBOARD ─────────────────────────────────────────────

export function DashboardClient({ cards }: { cards: Card[] }) {
  const layout = useLayout();
  const mobile = layout.sparkline;
  const [mounted, setMounted] = useState(false);

  const [themeKey, setThemeKey] = useState("arctic");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved && themes[saved]) setThemeKey(saved);
    } catch {}
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem("theme", themeKey);
      } catch {}
    }
  }, [themeKey, mounted]);

  const theme = themes[themeKey];

  if (!mounted) {
    return <div style={{ minHeight: "100vh", background: "#0a0a12" }} />;
  }

  if (!cards || cards.length === 0) {
    return (
      <div
        style={{
          background: theme.bg,
          minHeight: "100vh",
          padding: 32,
          color: theme.textSecondary,
          fontFamily: theme.fontDisplay,
          transition: "all 0.5s ease",
        }}
      >
        No stock data available. Check your API key and rate limits.
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, themeKey, setThemeKey }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=DM+Mono:wght@400;500&family=Sora:wght@400;600;700&display=swap"
        rel="stylesheet"
      />
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 3px; }
        ::selection { background: ${theme.accentGlow}; color: ${theme.textPrimary}; }
        body { margin: 0; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: theme.bg,
          padding: mobile ? 12 : 32,
          fontFamily: theme.fontDisplay,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transition: "background 0.5s ease, color 0.5s ease",
          position: "relative",
        }}
      >
        {themeKey === "midnight" && <NoiseOverlay />}

        <div
          style={{
            width: "100%",
            maxWidth: layout.maxWidth,
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: mobile ? 16 : 28,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <h1
                style={{
                  fontFamily: theme.fontDisplay,
                  fontSize: mobile ? 20 : 26,
                  fontWeight: 800,
                  color: theme.textPrimary,
                  letterSpacing: "-0.02em",
                  margin: 0,
                  lineHeight: 1.2,
                  transition: "color 0.5s ease",
                }}
              >
                Market Viewer
              </h1>
              <div
                style={{
                  fontFamily: theme.font,
                  fontSize: mobile ? 10 : 12,
                  color: theme.textMuted,
                  marginTop: 4,
                  letterSpacing: "0.04em",
                  transition: "color 0.5s ease",
                }}
              >
                {cards.length} instruments tracked
              </div>
            </div>
            <ThemeToggle
              themeKey={themeKey}
              onChange={setThemeKey}
              theme={theme}
              mobile={mobile}
            />
          </div>

          {/* Cards Grid */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: layout.gap,
            }}
          >
            {cards.map((card, i) => (
              <div
                key={card.symbol}
                style={{
                  width: `calc((100% - ${layout.gap * (layout.cols - 1)}px) / ${layout.cols})`,
                  minWidth: 0,
                  display: "flex",
                  opacity: 0,
                  animation: `cardIn 0.4s ease forwards`,
                  animationDelay: `${i * 60}ms`,
                }}
              >
                <style>{`
                  @keyframes cardIn {
                    from { opacity: 0; transform: translateY(12px); }
                    to { opacity: 1; transform: translateY(0); }
                  }
                `}</style>
                <div style={{ width: "100%" }}>
                  <StockCard card={card} layout={layout} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}
