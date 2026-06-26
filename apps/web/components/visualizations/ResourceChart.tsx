"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { resourcePlan } from "@/lib/mock-data";
import { useMemo } from "react";

export function ResourceChart({ model = "Flood" }: { model?: string }) {
  const dynamicData = useMemo(() => {
    const r = () => Math.random() * 20 - 10;
    return resourcePlan.map((item) => ({
      ...item,
      requested: Math.max(0, (model === "Flood" ? item.requested : model === "Earthquake" ? item.requested * 1.5 : item.requested * 0.8) + r()),
      assigned: Math.max(0, (model === "Flood" ? item.assigned : model === "Earthquake" ? item.assigned * 1.2 : item.assigned * 0.9) + r()),
    }));
  }, [model]);
  return (
    <div className="h-48 md:h-64 w-full">
      <ResponsiveContainer>
        <BarChart data={dynamicData} margin={{ top: 12, right: 12, left: -18, bottom: 0 }}>
          <CartesianGrid stroke="rgba(238,248,247,0.09)" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: "#10181f", border: "1px solid rgba(238,248,247,0.12)", borderRadius: 8 }} />
          <Bar dataKey="requested" fill="rgba(244,184,96,0.45)" radius={[6, 6, 0, 0]} />
          <Bar dataKey="assigned" fill="#50e3d6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
