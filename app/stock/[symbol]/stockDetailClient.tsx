// app/stock/[symbol]/stockDetailClient.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Card, StockDay } from "../../types/stock";
import { themes, Theme } from "../../dashboard/dashboardClient";
import { CompanyLogo } from "../../components/companyLogo";

function fmt(value: string | undefined): string {
  if (!value || value === "None" || value === "-") return "N/A";
  return value;
}

function fmtMarketCap(value: string | undefined): string {
  if (!value || value === "None") return "N/A";
  const num = parseFloat(value);
  if (isNaN(num)) return "N/A";
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toLocaleString()}`;
}

function calcPctChange(current: StockDay, previous: StockDay | null): string {
  if (!previous) return "N/A";
  const change = ((current.close - previous.close) / previous.close) * 100;
  return `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;
}

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isMobile;
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

export function StockDetailClient({ card }: { card: Card }) {
  const [showAllRows, setShowAllRows] = useState(false);
  const [mounted, setMounted] = useState(false);
  const mobile = useIsMobile();
  const ov = card.overview;

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

  const latest = card.data[card.data.length - 1];
  const first = card.data[0];
  const change = latest.close - first.close;
  const changePct = (change / first.close) * 100;
  const isUp = change >= 0;
  const color = isUp ? theme.up : theme.down;
  const glow = isUp ? theme.upGlow : theme.downGlow;

  const reversed = [...card.data].reverse();
  const visibleRows = showAllRows ? reversed : reversed.slice(0, 20);

  const infoFields = [
    { label: "Symbol", value: fmt(ov?.Symbol) },
    { label: "Asset Type", value: fmt(ov?.AssetType) },
    { label: "Name", value: fmt(ov?.Name) },
    { label: "Exchange", value: fmt(ov?.Exchange) },
    { label: "Sector", value: fmt(ov?.Sector) },
    { label: "Industry", value: fmt(ov?.Industry) },
    { label: "Market Cap", value: fmtMarketCap(ov?.MarketCapitalization) },
  ];

  // Section card style
  const sectionStyle = {
    background: theme.bgCard,
    backdropFilter: "blur(16px)" as const,
    borderRadius: 16,
    padding: mobile ? 16 : 24,
    marginBottom: mobile ? 12 : 20,
    border: `1px solid ${theme.border}`,
    boxShadow: theme.shadow,
    transition: "all 0.5s ease",
  };

  const sectionLabel = {
    fontFamily: theme.font,
    color: theme.textSecondary,
    fontSize: 11,
    letterSpacing: "0.1em" as const,
    textTransform: "uppercase" as const,
    marginBottom: 16,
    transition: "color 0.5s ease",
  };

  return (
    <>
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
          padding: mobile ? 16 : 32,
          color: theme.textPrimary,
          fontFamily: theme.fontDisplay,
          transition: "background 0.5s ease, color 0.5s ease",
          position: "relative",
        }}
      >
        {themeKey === "midnight" && <NoiseOverlay />}

        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            position: "relative",
            zIndex: 2,
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(16px)",
            transition: "all 0.5s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          {/* Top bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: mobile ? 16 : 24,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <Link
              href="/"
              style={{
                color: theme.textSecondary,
                border: `1px solid ${theme.border}`,
                borderRadius: 99,
                padding: "8px 18px",
                textDecoration: "none",
                display: "inline-block",
                fontSize: 13,
                fontFamily: theme.font,
                letterSpacing: "0.04em",
                transition: "all 0.3s ease",
                backdropFilter: "blur(8px)",
                background: theme.bgCard,
              }}
            >
              &larr; Back
            </Link>
            <ThemeToggle
              themeKey={themeKey}
              onChange={setThemeKey}
              theme={theme}
              mobile={mobile}
            />
          </div>

          {/* Header */}
          <div style={{ marginBottom: mobile ? 20 : 32 }}>
            <div
              style={{
                fontFamily: theme.font,
                fontSize: 13,
                color: theme.textMuted,
                letterSpacing: "0.08em",
                marginBottom: 8,
                transition: "color 0.5s ease",
              }}
            >
              {ov?.Symbol || card.symbol}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: mobile ? 12 : 16,
              }}
            >
              <CompanyLogo
                symbol={card.symbol}
                size={mobile ? 48 : 64}
                borderRadius={mobile ? 10 : 14}
              />
              <div>
                <h1
                  style={{
                    fontFamily: theme.fontDisplay,
                    fontSize: mobile ? 22 : 30,
                    fontWeight: 800,
                    margin: 0,
                    lineHeight: 1.2,
                    letterSpacing: "-0.02em",
                    color: theme.textPrimary,
                    transition: "color 0.5s ease",
                  }}
                >
                  {ov?.Name || card.symbol}
                </h1>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 12,
                    marginTop: 6,
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontFamily: theme.fontDisplay,
                      fontSize: mobile ? 28 : 38,
                      fontWeight: 800,
                      color: theme.textPrimary,
                      transition: "color 0.5s ease",
                    }}
                  >
                    ${latest.close.toFixed(2)}
                  </span>
                  <span
                    style={{
                      fontFamily: theme.font,
                      fontSize: mobile ? 14 : 16,
                      color,
                      fontWeight: 600,
                      padding: "4px 10px",
                      borderRadius: 8,
                      background: glow,
                      transition: "all 0.5s ease",
                    }}
                  >
                    {isUp ? "+" : ""}
                    {change.toFixed(2)} ({changePct.toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Company Info */}
          <div style={sectionStyle}>
            <div style={sectionLabel}>Company Information</div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: mobile
                  ? "repeat(2, 1fr)"
                  : "repeat(auto-fill, minmax(200px, 1fr))",
                gap: mobile ? 12 : 16,
              }}
            >
              {infoFields.map(({ label, value }) => (
                <div key={label}>
                  <div
                    style={{
                      fontFamily: theme.font,
                      color: theme.textMuted,
                      fontSize: 10,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      fontFamily: theme.fontDisplay,
                      fontSize: mobile ? 13 : 15,
                      fontWeight: 600,
                      marginTop: 3,
                      wordBreak: "break-word",
                      color: theme.textPrimary,
                      transition: "color 0.5s ease",
                    }}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>
            {ov?.Description && (
              <div
                style={{
                  marginTop: 20,
                  color: theme.textSecondary,
                  fontSize: mobile ? 13 : 14,
                  lineHeight: 1.7,
                  fontFamily: theme.fontDisplay,
                  transition: "color 0.5s ease",
                }}
              >
                {ov.Description}
              </div>
            )}
          </div>

          {/* Price Chart */}
          <div style={sectionStyle}>
            <div style={sectionLabel}>Closing Price</div>
            <div
              style={{
                width: "100%",
                height: mobile ? 180 : 280,
                minWidth: 0,
                minHeight: mobile ? 180 : 280,
              }}
            >
              <ResponsiveContainer width="99%" height={mobile ? 180 : 280}>
                <AreaChart
                  data={card.data}
                  margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
                >
                  <defs>
                    <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    tick={{
                      fill: theme.textMuted,
                      fontSize: mobile ? 9 : 10,
                      fontFamily: theme.font,
                    }}
                    tickFormatter={(d) => d.slice(5)}
                    interval={Math.floor(card.data.length / (mobile ? 4 : 6))}
                    axisLine={false}
                    tickLine={false}
                  />
                  {!mobile && (
                    <YAxis
                      tick={{
                        fill: theme.textMuted,
                        fontSize: 10,
                        fontFamily: theme.font,
                      }}
                      axisLine={false}
                      tickLine={false}
                      domain={["dataMin - 10", "dataMax + 10"]}
                      tickFormatter={(v) => `$${v}`}
                    />
                  )}
                  <Tooltip
                    contentStyle={{
                      background: theme.bgCard,
                      border: `1px solid ${theme.border}`,
                      borderRadius: 10,
                      color: theme.textPrimary,
                      fontSize: 12,
                      fontFamily: theme.font,
                      boxShadow: theme.shadow,
                    }}
                    formatter={(
                      val:
                        | number
                        | string
                        | readonly (number | string)[]
                        | undefined,
                    ) => {
                      if (val == null) return ["$0.00", "Close"];

                      const v = Array.isArray(val) ? val[0] : val;
                      const num = typeof v === "number" ? v : Number(v);

                      return [`$${num.toFixed(2)}`, "Close"];
                    }}
                    labelStyle={{ color: theme.textSecondary }}
                  />
                  <Area
                    type="monotone"
                    dataKey="close"
                    stroke={color}
                    strokeWidth={2.5}
                    fill="url(#priceGrad)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Volume Chart */}
          <div style={sectionStyle}>
            <div style={sectionLabel}>Volume</div>
            <div
              style={{
                width: "100%",
                height: mobile ? 120 : 160,
                minWidth: 0,
                minHeight: mobile ? 120 : 160,
              }}
            >
              <ResponsiveContainer width="99%" height={mobile ? 120 : 160}>
                <BarChart data={card.data}>
                  <XAxis
                    dataKey="date"
                    tick={{
                      fill: theme.textMuted,
                      fontSize: mobile ? 9 : 10,
                      fontFamily: theme.font,
                    }}
                    tickFormatter={(d) => d.slice(5)}
                    interval={Math.floor(card.data.length / (mobile ? 4 : 6))}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      background: theme.bgCard,
                      border: `1px solid ${theme.border}`,
                      borderRadius: 10,
                      color: theme.textPrimary,
                      fontSize: 12,
                      fontFamily: theme.font,
                      boxShadow: theme.shadow,
                    }}
                    formatter={(
                      val:
                        | number
                        | string
                        | readonly (number | string)[]
                        | undefined,
                    ) => {
                      if (val == null) return ["$0.00", "Close"];

                      const v = Array.isArray(val) ? val[0] : val;
                      const num = typeof v === "number" ? v : Number(v);

                      return [`$${num.toFixed(2)}`, "Close"];
                    }}
                    labelStyle={{ color: theme.textSecondary }}
                  />
                  <Bar
                    dataKey="volume"
                    fill={theme.accent}
                    opacity={0.5}
                    radius={[3, 3, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Historical Prices Table */}
          <div style={sectionStyle}>
            <div style={sectionLabel}>Historical Prices</div>
            <div
              style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: mobile ? 12 : 14,
                  minWidth: mobile ? 400 : "auto",
                }}
              >
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                    {["Date", "Close", "Volume", "Change"].map((h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: "left",
                          padding: mobile ? "8px 8px" : "10px 12px",
                          fontFamily: theme.font,
                          color: theme.textMuted,
                          fontWeight: 500,
                          fontSize: 10,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((day) => {
                    const chronoIndex = card.data.findIndex(
                      (d) => d.date === day.date,
                    );
                    const prev =
                      chronoIndex > 0 ? card.data[chronoIndex - 1] : null;
                    const pct = calcPctChange(day, prev);
                    const pctNum = prev
                      ? ((day.close - prev.close) / prev.close) * 100
                      : 0;
                    const pctColor = pctNum >= 0 ? theme.up : theme.down;

                    return (
                      <tr
                        key={day.date}
                        style={{
                          borderBottom: `1px solid ${theme.border}`,
                          transition: "background 0.15s",
                        }}
                      >
                        <td
                          style={{
                            padding: mobile ? "8px 8px" : "10px 12px",
                            fontFamily: theme.font,
                            color: theme.textSecondary,
                            fontSize: 13,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {day.date}
                        </td>
                        <td
                          style={{
                            padding: mobile ? "8px 8px" : "10px 12px",
                            fontFamily: theme.fontDisplay,
                            color: theme.textPrimary,
                            fontSize: 14,
                            fontWeight: 600,
                          }}
                        >
                          ${day.close.toFixed(2)}
                        </td>
                        <td
                          style={{
                            padding: mobile ? "8px 8px" : "10px 12px",
                            fontFamily: theme.font,
                            color: theme.textSecondary,
                            fontSize: 13,
                          }}
                        >
                          {mobile
                            ? `${(day.volume / 1e6).toFixed(1)}M`
                            : day.volume.toLocaleString()}
                        </td>
                        <td
                          style={{
                            padding: mobile ? "8px 8px" : "10px 12px",
                            fontFamily: theme.font,
                            color: prev ? pctColor : theme.textMuted,
                            fontSize: 13,
                            fontWeight: 600,
                          }}
                        >
                          {pct}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {!showAllRows && reversed.length > 20 && (
              <button
                onClick={() => setShowAllRows(true)}
                style={{
                  marginTop: 16,
                  background: theme.bgCard,
                  border: `1px solid ${theme.border}`,
                  color: theme.textSecondary,
                  borderRadius: 99,
                  padding: "10px 20px",
                  cursor: "pointer",
                  fontSize: 13,
                  fontFamily: theme.font,
                  letterSpacing: "0.04em",
                  width: "100%",
                  transition: "all 0.3s ease",
                  backdropFilter: "blur(8px)",
                }}
              >
                Show all {reversed.length} entries
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
