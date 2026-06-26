"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useMemo } from "react";

export function SupplyChainResilienceChart({ model }: { model: string }) {
  const data = useMemo(() => {
    const r = () => Math.random() * 20 - 10;
    return [
      { name: "Food", current: Math.min(100, Math.max(0, (model === "Earthquake" ? 55 : 80) + r())), threshold: 70 },
      { name: "Water", current: Math.min(100, Math.max(0, (model === "Flood" ? 40 : 75) + r())), threshold: 70 },
      { name: "Medicine", current: Math.min(100, Math.max(0, (model === "Wildfire" ? 60 : 85) + r())), threshold: 70 },
      { name: "Fuel", current: Math.min(100, Math.max(0, (model === "Hurricane" ? 35 : 65) + r())), threshold: 70 },
    ];
  }, [model]);

  return (
    <div className="glass rounded-lg p-5">
      <h3 className="mb-4 text-sm font-semibold text-amber">Supply Chain Resilience (%)</h3>
      <div className="h-40 md:h-56 w-full">
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid stroke="rgba(238,248,247,0.05)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#10181f", border: "1px solid rgba(238,248,247,0.12)", borderRadius: 8 }} />
            <Bar dataKey="current" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="threshold" fill="#50e3d6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-xs text-slate-400">Dashed line shows minimum threshold (70%)</p>
    </div>
  );
}
