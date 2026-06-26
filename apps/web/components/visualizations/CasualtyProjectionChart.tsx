"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useMemo } from "react";

export function CasualtyProjectionChart({ model }: { model: string }) {
  const data = useMemo(() => {
    const r = () => Math.random() * 30 - 15;
    return [
      { name: "Direct", estimated: Math.max(5, (model === "Earthquake" ? 200 : model === "Flood" ? 80 : 120) + r()), projected: Math.max(5, (model === "Earthquake" ? 280 : model === "Flood" ? 120 : 180) + r()) },
      { name: "Indirect", estimated: Math.max(5, (model === "Wildfire" ? 60 : 40) + r()), projected: Math.max(5, (model === "Wildfire" ? 100 : 60) + r()) },
      { name: "Displaced", estimated: Math.max(5, (model === "Flood" ? 1500 : 500) + r() * 5), projected: Math.max(5, (model === "Flood" ? 2500 : 800) + r() * 5) },
    ];
  }, [model]);

  return (
    <div className="glass rounded-lg p-5">
      <h3 className="mb-4 text-sm font-semibold text-coral">Casualty & Displacement Projection</h3>
      <div className="h-40 md:h-56 w-full">
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid stroke="rgba(238,248,247,0.05)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#10181f", border: "1px solid rgba(238,248,247,0.12)", borderRadius: 8 }} />
            <Bar dataKey="estimated" fill="#ff6f61" radius={[4, 4, 0, 0]} />
            <Bar dataKey="projected" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
