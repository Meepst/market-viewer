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
} from "recharts";
import { LayoutConfig, Card } from "../types/stock";
import { useTheme } from "../dashboard/dashboardClient";
import { CompanyLogo } from "./companyLogo";

export default function StockCard({
  card,
  layout,
}: {
  card: Card;
  layout: LayoutConfig;
}) {
  const { theme } = useTheme();
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [winWidth, setWinWidth] = useState(1200);

  useEffect(() => {
    setWinWidth(window.innerWidth);
    setMounted(true);

    const onResize = () => setWinWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const latest = card.data[card.data.length - 1];
  const first = card.data[0];
  const change = latest.close - first.close;
  const changePct = (change / first.close) * 100;
  const isUp = change >= 0;
  const color = isUp ? theme.up : theme.down;
  const glow = isUp ? theme.upGlow : theme.downGlow;
  const compact = layout.sparkline;

  // estimate card width from window width and columns
  const estimatedCardWidth =
    (winWidth - layout.gap * (layout.cols + 1)) / layout.cols;
  const showAxis = estimatedCardWidth > 200 && !compact;

  return (
    <Link href={`/stock/${card.symbol}`} style={{ textDecoration: "none" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? theme.bgCardHover : theme.bgCard,
          backdropFilter: "blur(16px)",
          borderRadius: compact ? 10 : 16,
          padding: layout.cardPadding,
          border: `1px solid ${hovered ? theme.borderHover : theme.border}`,
          cursor: "pointer",
          overflow: "hidden",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          boxShadow: hovered ? theme.shadowHover : theme.shadow,
          transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
          transform: hovered ? "translateY(-2px)" : "translateY(0)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: glow,
            filter: "blur(35px)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.4s",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: compact ? 6 : 10,
            flexShrink: 0,
          }}
        >
          <CompanyLogo
            symbol={card.symbol}
            size={compact ? 20 : 32}
            borderRadius={compact ? 4 : 8}
          />
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontFamily: theme.font,
                color: theme.textSecondary,
                fontSize: layout.fontSize.symbol,
                letterSpacing: "0.06em",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                transition: "color 0.4s",
              }}
            >
              {card.symbol}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: compact ? 4 : 8,
            marginTop: compact ? 2 : 6,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontFamily: theme.fontDisplay,
              fontSize: layout.fontSize.price,
              fontWeight: 700,
              color: theme.textPrimary,
              whiteSpace: "nowrap",
              flexShrink: 0,
              transition: "color 0.4s",
            }}
          >
            ${latest.close.toFixed(compact ? 0 : 2)}
          </span>
          <span
            style={{
              fontFamily: theme.font,
              fontSize: layout.fontSize.change,
              color,
              fontWeight: 600,
              flexShrink: 0,
              padding: "1px 6px",
              borderRadius: 6,
              background: glow,
              transition: "all 0.4s",
            }}
          >
            {isUp ? "+" : ""}
            {compact ? "" : `${change.toFixed(2)} `}({changePct.toFixed(1)}%)
          </span>
        </div>

        {mounted && (
          <div
            style={{
              width: "100%",
              height: layout.chartHeight,
              minHeight: layout.chartHeight,
              minWidth: 0,
              marginTop: "auto",
              paddingTop: compact ? 4 : 12,
              flexShrink: 0,
            }}
          >
            <ResponsiveContainer width="99%" height={layout.chartHeight}>
              <AreaChart
                data={card.data}
                margin={{ top: 2, right: 0, bottom: 0, left: 0 }}
              >
                <defs>
                  <linearGradient
                    id={`grad-${card.symbol}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={color}
                      stopOpacity={compact ? 0.15 : 0.3}
                    />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                {showAxis ? (
                  <XAxis
                    dataKey="date"
                    tick={{
                      fill: theme.textMuted,
                      fontSize: 9,
                      fontFamily: theme.font,
                    }}
                    tickFormatter={(d) => d.slice(5)}
                    interval={Math.floor(card.data.length / 4)}
                    axisLine={false}
                    tickLine={false}
                  />
                ) : (
                  <XAxis hide />
                )}
                <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
                {showAxis && (
                  <Tooltip
                    contentStyle={{
                      background: theme.bgCard,
                      border: `1px solid ${theme.border}`,
                      borderRadius: 10,
                      color: theme.textPrimary,
                      fontSize: 12,
                      fontFamily: theme.font,
                      backdropFilter: "blur(12px)",
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
                    labelFormatter={(label) => label}
                  />
                )}
                <Area
                  type="monotone"
                  dataKey="close"
                  stroke={color}
                  strokeWidth={compact ? 1.5 : 2}
                  fill={`url(#grad-${card.symbol})`}
                  dot={false}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </Link>
  );
}
