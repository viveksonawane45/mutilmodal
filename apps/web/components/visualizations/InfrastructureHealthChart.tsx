"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useMemo } from "react";

export function InfrastructureHealthChart({ model }: { model: string }) {
  const data = useMemo(() => {
    const r = () => Math.floor(Math.random() * 20 - 10);
    return [
      { name: "Power Grid", health: Math.min(100, Math.max(0, (model === "Earthquake" ? 40 : model === "Hurricane" ? 55 : 85) + r())) },
      { name: "Water Supply", health: Math.min(100, Math.max(0, (model === "Flood" ? 30 : 80) + r())) },
      { name: "Telecom", health: Math.min(100, Math.max(0, (model === "Wildfire" ? 60 : 90) + r())) },
      { name: "Hospitals", health: Math.min(100, Math.max(0, (model === "Earthquake" ? 50 : 95) + r())) },
      { name: "Roadways", health: Math.min(100, Math.max(0, (model === "Flood" ? 20 : model === "Earthquake" ? 45 : 85) + r())) }
    ];
  }, [model]);

  return (
    <div className="glass rounded-lg p-5">
      <h3 className="mb-4 text-sm font-semibold text-cyan">Critical Infrastructure Health (%)</h3>
      <div className="h-56 w-full">
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid stroke="rgba(238,248,247,0.05)" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis dataKey="name" type="category" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
            <Tooltip contentStyle={{ background: "#10181f", border: "1px solid rgba(238,248,247,0.12)", borderRadius: 8 }} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
            <Bar dataKey="health" fill="#50e3d6" radius={[0, 4, 4, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
