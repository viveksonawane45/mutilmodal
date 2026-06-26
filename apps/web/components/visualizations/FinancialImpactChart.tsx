"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useMemo } from "react";

export function FinancialImpactChart({ model }: { model: string }) {
  const data = useMemo(() => {
    const r = () => Math.random() * 8 - 4;
    return ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"].map((day, i) => ({
      name: day,
      cost: Math.max(0, (model === "Hurricane" ? 10 + i * 20 : model === "Flood" ? 5 + i * 8 : 2 + i * 4) + r()),
      recovery: Math.max(0, (model === "Hurricane" ? i * 5 : i * 2) + r() * 0.5)
    }));
  }, [model]);

  return (
    <div className="glass rounded-lg p-5">
      <h3 className="mb-4 text-sm font-semibold text-moss">Estimated Financial Impact ($M)</h3>
      <div className="h-40 md:h-56 w-full">
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="costGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#88c060" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#88c060" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(238,248,247,0.05)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#10181f", border: "1px solid rgba(238,248,247,0.12)", borderRadius: 8 }} />
            <Area type="monotone" dataKey="cost" stroke="#88c060" fill="url(#costGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="recovery" stroke="#50e3d6" fill="transparent" strokeWidth={2} strokeDasharray="4 4" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
