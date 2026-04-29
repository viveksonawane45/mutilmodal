"use client";

import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useMemo } from "react";

export function ResponseTimeChart({ model }: { model: string }) {
  const data = useMemo(() => {
    const r = () => Math.random() * 6 - 3;
    return ["10am", "12pm", "2pm", "4pm", "6pm", "8pm"].map((time, i) => ({
      time,
      medical: Math.max(0, (model === "Earthquake" ? 45 + i * 2 : 15 + i * 1.5) + r()),
      fire: Math.max(0, (model === "Wildfire" ? 10 + i * 3 : 20 + i * 1) + r()),
      police: Math.max(0, (model === "Flood" ? 25 + i * 4 : 12 + i * 0.5) + r())
    }));
  }, [model]);

  return (
    <div className="glass rounded-lg p-5">
      <h3 className="mb-4 text-sm font-semibold text-white">Average Response Time (mins)</h3>
      <div className="h-56 w-full">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="rgba(238,248,247,0.05)" vertical={false} />
            <XAxis dataKey="time" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#10181f", border: "1px solid rgba(238,248,247,0.12)", borderRadius: 8 }} />
            <Line type="monotone" dataKey="medical" name="Medical" stroke="#ff6f61" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="fire" name="Fire/Rescue" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="police" name="Police" stroke="#50e3d6" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
