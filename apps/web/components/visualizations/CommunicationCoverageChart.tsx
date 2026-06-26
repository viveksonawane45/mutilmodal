"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useMemo } from "react";

export function CommunicationCoverageChart({ model }: { model: string }) {
  const data = useMemo(() => {
    const r = () => Math.random() * 10 - 5;
    const cellular = Math.min(100, Math.max(10, (model === "Earthquake" ? 40 : 80) + r()));
    const radio = Math.min(100, Math.max(10, 65 + r()));
    const satellite = Math.min(100, Math.max(10, 45 + r()));
    const mesh = Math.min(100, Math.max(10, (model === "Flood" ? 25 : 50) + r()));
    return [
      { name: "Cellular", value: cellular, color: "#50e3d6" },
      { name: "Radio", value: radio, color: "#88c060" },
      { name: "Satellite", value: satellite, color: "#f59e0b" },
      { name: "Mesh Network", value: mesh, color: "#ff6f61" },
    ];
  }, [model]);

  return (
    <div className="glass rounded-lg p-5">
      <h3 className="mb-4 text-sm font-semibold text-cyan">Communication Coverage (%)</h3>
      <div className="h-40 md:h-56 w-full relative">
        <ResponsiveContainer>
          <PieChart>
            <Tooltip contentStyle={{ background: "#10181f", border: "1px solid rgba(238,248,247,0.12)", borderRadius: 8 }} />
            <Pie data={data} innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value" stroke="none">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
          <span className="text-lg font-bold text-white">{data.reduce((a, b) => a + b.value, 0) / data.length | 0}%</span>
          <span className="text-[10px] text-slate-400">Avg</span>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-slate-400 justify-center">
        {data.map((d) => (
          <span key={d.name} className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: d.color }} />{d.name}</span>
        ))}
      </div>
    </div>
  );
}
