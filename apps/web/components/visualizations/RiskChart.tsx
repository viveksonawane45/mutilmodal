"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { riskSeries } from "@/lib/mock-data";
import { useMemo } from "react";

export function RiskChart({ model = "Flood" }: { model?: string }) {
  const data = useMemo(() => {
    const r = () => Math.random() * 10 - 5;
    return riskSeries.map(item => ({
      ...item,
      flood: Math.max(0, item.flood + r()),
      wildfire: Math.max(0, item.wildfire + r()),
      hurricane: Math.max(0, item.hurricane + r()),
      earthquake: Math.max(0, item.earthquake + r())
    }));
  }, []);

  return (
    <div className="h-52 md:h-72 w-full">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 12, right: 12, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="flood" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#50e3d6" stopOpacity={0.42} />
              <stop offset="95%" stopColor="#50e3d6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="wildfire" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#ff6f61" stopOpacity={0.36} />
              <stop offset="95%" stopColor="#ff6f61" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="hurricane" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#f4b860" stopOpacity={0.36} />
              <stop offset="95%" stopColor="#f4b860" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="earthquake" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#88c060" stopOpacity={0.36} />
              <stop offset="95%" stopColor="#88c060" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(238,248,247,0.09)" vertical={false} />
          <XAxis dataKey="time" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: "#10181f", border: "1px solid rgba(238,248,247,0.12)", borderRadius: 8 }} />
          <Area type="monotone" dataKey="flood" stroke="#50e3d6" fill={model === "Flood" ? "url(#flood)" : "transparent"} strokeWidth={model === "Flood" ? 3 : 1} strokeOpacity={model === "Flood" ? 1 : 0.3} />
          <Area type="monotone" dataKey="wildfire" stroke="#ff6f61" fill={model === "Wildfire" ? "url(#wildfire)" : "transparent"} strokeWidth={model === "Wildfire" ? 3 : 1} strokeOpacity={model === "Wildfire" ? 1 : 0.3} />
          <Area type="monotone" dataKey="hurricane" stroke="#f4b860" fill={model === "Hurricane" ? "url(#hurricane)" : "transparent"} strokeWidth={model === "Hurricane" ? 3 : 1} strokeOpacity={model === "Hurricane" ? 1 : 0.3} />
          <Area type="monotone" dataKey="earthquake" stroke="#88c060" fill={model === "Earthquake" ? "url(#earthquake)" : "transparent"} strokeWidth={model === "Earthquake" ? 3 : 1} strokeOpacity={model === "Earthquake" ? 1 : 0.3} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
