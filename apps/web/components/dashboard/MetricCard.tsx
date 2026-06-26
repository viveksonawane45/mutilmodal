"use client";

import { useRef, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import type { LiveMetric } from "@/lib/types";

export function MetricCard({ metric }: { metric: LiveMetric }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const Icon = metric.trend.startsWith("-") ? ArrowDownRight : metric.trend === "0" ? Minus : ArrowUpRight;
  const tone = metric.severity === "critical"
    ? "text-coral bg-coral/12"
    : metric.severity === "watch"
    ? "text-amber bg-amber/12"
    : "text-moss bg-moss/12";
  const barColor = metric.severity === "critical"
    ? "bg-coral"
    : metric.severity === "watch"
    ? "bg-amber"
    : "bg-moss";

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -8, y: x * 8 });
  }

  function handleLeave() {
    setTilt({ x: 0, y: 0 });
  }

  return (
    <div className="perspective-1000">
      <div
        ref={ref}
        onMouseMove={handleMouse}
        onMouseLeave={handleLeave}
        style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
        className="glass rounded-xl p-4 transition-transform duration-200 ease-out"
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm text-themed">{metric.label}</p>
          <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${tone}`}>
            <Icon size={14} />
            {metric.trend}
          </span>
        </div>
        <p className="text-3xl font-bold">{metric.value}</p>
        <div className="mt-3 h-1.5 rounded-full bg-subtle">
          <div
            className={`h-full rounded-full ${barColor}`}
            style={{ width: metric.severity === "critical" ? "84%" : metric.severity === "watch" ? "61%" : "46%" }}
          />
        </div>
      </div>
    </div>
  );
}
