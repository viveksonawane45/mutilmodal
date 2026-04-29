"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useMemo } from "react";

export function SentimentAnalysisChart({ model }: { model: string }) {
  const data = useMemo(() => {
    const r = () => Math.floor(Math.random() * 15 - 5);
    return [
      { name: "Panic/Urgent", value: Math.max(5, (model === "Earthquake" ? 65 : 30) + r()), color: "#ff6f61" },
      { name: "Seeking Info", value: Math.max(5, (model === "Hurricane" ? 50 : 40) + r()), color: "#f59e0b" },
      { name: "Safe/Resolved", value: Math.max(5, (model === "Flood" ? 30 : 20) + r()), color: "#88c060" },
      { name: "General chatter", value: Math.max(5, (model === "Wildfire" ? 15 : 10) + r()), color: "#50e3d6" }
    ];
  }, [model]);

  return (
    <div className="glass rounded-lg p-5">
      <h3 className="mb-4 text-sm font-semibold text-amber">Public Sentiment & Social Signals</h3>
      <div className="h-56 w-full relative">
        <ResponsiveContainer>
          <PieChart>
            <Tooltip contentStyle={{ background: "#10181f", border: "1px solid rgba(238,248,247,0.12)", borderRadius: 8 }} />
            <Pie data={data} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
          <span className="text-2xl font-bold text-white">{data[0].value}%</span>
          <span className="text-xs text-slate-400">Urgency</span>
        </div>
      </div>
    </div>
  );
}
