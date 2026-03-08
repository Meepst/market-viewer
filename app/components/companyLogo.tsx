"use client";

import { useState } from "react";

export function CompanyLogo({
  symbol,
  size = 32,
  borderRadius = 8,
}: {
  symbol: string;
  size?: number;
  borderRadius?: number;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius,
          background: "rgba(128,128,128,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 0.4,
          fontWeight: 700,
          color: "rgba(128,128,128,0.6)",
          flexShrink: 0,
        }}
      >
        {symbol.charAt(0)}
      </div>
    );
  }

  return (
    <img
      src={`/logos/${symbol.toUpperCase()}.svg`}
      alt={`${symbol} logo`}
      width={size}
      height={size}
      onError={() => setFailed(true)}
      style={{
        borderRadius,
        objectFit: "contain",
        flexShrink: 0,
      }}
    />
  );
}
