"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useMemo } from "react";

export function WeatherImpactChart({ model }: { model: string }) {
  const data = useMemo(() => {
    const offset = Math.random() * 20 - 10; // -10 to +10 offset for uniqueness
    return ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"].map((day, i) => ({
      name: day,
      intensity: Math.max(0, (model === "Flood" ? 80 - i * 10 : model === "Earthquake" ? 20 + i * 5 : model === "Wildfire" ? 60 + i * 8 : 90 - i * 15) + offset),
      spread: Math.max(0, (model === "Flood" ? 40 + i * 5 : model === "Earthquake" ? 80 - i * 10 : model === "Wildfire" ? 30 + i * 15 : 70 - i * 10) + offset * 0.5)
    }));
  }, [model]);

  return (
    <div className="glass rounded-lg p-5">
      <h3 className="mb-4 text-sm font-semibold text-cyan">Weather & Environmental Impact ({model})</h3>
      <div className="h-40 md:h-56 w-full">
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="rgba(238,248,247,0.05)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#10181f", border: "1px solid rgba(238,248,247,0.12)", borderRadius: 8 }} />
            <Bar dataKey="intensity" fill="#50e3d6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="spread" fill="#88c060" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
