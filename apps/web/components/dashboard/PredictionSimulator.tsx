"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Gauge, TrendingUp } from "lucide-react";
import type { DisasterEvent } from "@/lib/types";

type Props = {
  event: DisasterEvent;
};

export function PredictionSimulator({ event }: Props) {
  const [waterLevel, setWaterLevel] = useState(1.5);
  const [windSpeed, setWindSpeed] = useState(60);
  const [population, setPopulation] = useState(50);

  const impact = useMemo(() => {
    const base = event.riskScore;
    const waterImpact = (waterLevel - 1.5) * 8;
    const windImpact = (windSpeed - 60) * 0.3;
    const popImpact = (population - 50) * 0.15;
    return Math.min(100, Math.max(0, base + waterImpact + windImpact + popImpact));
  }, [waterLevel, windSpeed, population, event.riskScore]);

  const severityColor = impact > 80 ? "text-coral" : impact > 60 ? "text-amber" : "text-moss";

  return (
    <div className="glass rounded-xl p-4 md:p-6 border border-amber/20 shadow-[0_0_30px_rgba(245,158,11,0.05)] backdrop-blur-md">
      <div className="mb-4 flex items-center gap-3">
        <Gauge className="text-amber" size={20} />
        <h2 className="text-lg font-semibold">What-If Prediction — {event.name}</h2>
      </div>

      <div className="space-y-4">
        <Slider label="Water Level (m)" value={waterLevel} onChange={setWaterLevel} min={0} max={5} step={0.1} unit="m" />
        <Slider label="Wind Speed (km/h)" value={windSpeed} onChange={setWindSpeed} min={0} max={200} step={5} unit="km/h" />
        <Slider label="Population in Zone (%)" value={population} onChange={setPopulation} min={0} max={100} step={5} unit="%" />
      </div>

      <motion.div
        key={Math.round(impact)}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className={`mt-5 rounded-lg border p-4 text-center ${impact > 80 ? "border-coral/30 bg-coral/10" : impact > 60 ? "border-amber/30 bg-amber/10" : "border-moss/30 bg-moss/10"}`}
      >
        <p className="text-xs uppercase tracking-wider opacity-70">Projected Risk Score</p>
        <p className={`mt-1 text-4xl font-bold ${severityColor}`}>{impact.toFixed(0)}</p>
        <p className="mt-1 text-xs opacity-70">
          {impact > 80 ? "Critical — Immediate action required" : impact > 60 ? "Elevated — Prepare response" : "Moderate — Monitor situation"}
        </p>
        <div className="mt-3 flex items-center justify-center gap-2 text-xs opacity-60">
          <TrendingUp size={12} /> Baseline: {event.riskScore}
        </div>
      </motion.div>
    </div>
  );
}

function Slider({ label, value, onChange, min, max, step, unit }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; step: number; unit: string }) {
  return (
    <label className="block">
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="text-cyan font-semibold tabular-nums">{value.toFixed(step < 1 ? 1 : 0)} {unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-cyan h-2 rounded-full appearance-none bg-white/10 cursor-pointer" />
    </label>
  );
}
