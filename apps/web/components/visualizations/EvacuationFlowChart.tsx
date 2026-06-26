"use client";

import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useMemo } from "react";

export function EvacuationFlowChart({ model }: { model: string }) {
  const data = useMemo(() => {
    const r = () => Math.random() * 500 - 250;
    return ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"].map((time, i) => ({
      time,
      evacuated: Math.max(0, (model === "Flood" ? i * 1200 : model === "Earthquake" ? i * 500 : i * 2000) + (i > 0 ? r() : 0)),
      capacity: 10000 + Math.floor(r() / 2)
    }));
  }, [model]);

  return (
    <div className="glass rounded-lg p-5">
      <h3 className="mb-4 text-sm font-semibold text-coral">Evacuation Flow vs Capacity</h3>
      <div className="h-40 md:h-56 w-full">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid stroke="rgba(238,248,247,0.05)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="time" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#10181f", border: "1px solid rgba(238,248,247,0.12)", borderRadius: 8 }} />
            <Line type="monotone" dataKey="evacuated" stroke="#ff6f61" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="capacity" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
