"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, Droplets, Thermometer, Wind } from "lucide-react";
import type { DisasterEvent } from "@/lib/types";

type TimelineEntry = {
  time: string;
  title: string;
  description: string;
  sensor: string;
  value: string;
  severity: "stable" | "watch" | "critical";
};

function generateTimeline(event: DisasterEvent): TimelineEntry[] {
  const base = [
    { time: "Day 1", title: "Initial Detection", description: `${event.type} activity detected via sensor network in ${event.location}.`, sensor: "Seismic", value: "2.1", severity: "watch" as const },
    { time: "Day 2", title: "Escalation Phase", description: `Risk score rose to ${event.riskScore - 10}. Satellite confirmation requested.`, sensor: "Satellite", value: "78%", severity: "watch" as const },
    { time: "Day 3", title: "Peak Impact", description: `Maximum intensity reported. ${event.radiusKm}km radius affected. Emergency protocols activated.`, sensor: "IoT", value: `${event.riskScore}`, severity: "critical" as const },
    { time: "Day 4", title: "Response Mobilization", description: "Rescue teams deployed. Shelter capacity assessed.", sensor: "Social", value: "High", severity: "watch" as const },
    { time: "Day 5", title: "Stabilization", description: "Situation stabilizing. Damage assessment ongoing.", sensor: "Weather", value: "Moderate", severity: "stable" as const },
  ];
  const r = () => Math.random() * 15 - 7;
  return base.map((entry, i) => ({
    ...entry,
    value: i === 0 ? (2 + r() * 0.5).toFixed(1) : i === 1 ? `${(70 + r()).toFixed(0)}%` : i === 2 ? `${(70 + r()).toFixed(0)}` : entry.value,
  }));
}

export function DisasterTimeline({ event }: { event: DisasterEvent }) {
  const timeline = useMemo(() => generateTimeline(event), [event.id]);

  const icons: Record<string, React.ElementType> = {
    Seismic: Thermometer,
    Satellite: Wind,
    IoT: Droplets,
    Social: Clock,
    Weather: Wind,
  };

  return (
    <div className="glass rounded-xl p-4 md:p-6 border border-white/10 shadow-xl backdrop-blur-md">
      <div className="mb-5 flex items-center gap-3">
        <Clock className="text-cyan" size={20} />
        <h2 className="text-lg font-semibold">Event Timeline — {event.name}</h2>
      </div>
      <div className="relative space-y-0">
        {timeline.map((entry, i) => {
          const Icon = icons[entry.sensor] || Clock;
          const color = entry.severity === "critical" ? "border-coral/30 bg-coral/10" : entry.severity === "watch" ? "border-amber/30 bg-amber/10" : "border-moss/30 bg-moss/10";
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative flex gap-4 pb-6 pl-8 last:pb-0"
            >
              <div className="absolute left-3 top-2 h-full w-px bg-white/10 last:hidden" style={i === timeline.length - 1 ? { display: "none" } : undefined} />
              <div className={`absolute left-0 top-1 grid h-6 w-6 place-items-center rounded-full border ${color}`}>
                <Icon size={12} />
              </div>
              <div className="flex-1 rounded-lg border border-white/10 bg-black/20 p-3">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="text-xs text-cyan/80 font-semibold">{entry.time}</span>
                  <span className={`rounded px-1.5 py-0.5 text-[10px] ${entry.severity === "critical" ? "bg-coral/15 text-coral" : entry.severity === "watch" ? "bg-amber/15 text-amber" : "bg-moss/15 text-moss"}`}>
                    {entry.sensor}: {entry.value}
                  </span>
                </div>
                <h3 className="text-sm font-semibold">{entry.title}</h3>
                <p className="mt-0.5 text-xs text-slate-400 leading-relaxed">{entry.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
