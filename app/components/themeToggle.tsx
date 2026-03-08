"use client";

import { Theme } from "../dashboard/dashboardClient";

export function ThemeToggle({
  themeKey,
  onChangeAction,
  theme,
  mobile = false,
}: {
  themeKey: string;
  onChangeAction: (key: string) => void;
  theme: Theme;
  mobile?: boolean;
}) {
  const isDark = themeKey === "midnight";
  return (
    <button
      onClick={() => onChangeAction(isDark ? "arctic" : "midnight")}
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
