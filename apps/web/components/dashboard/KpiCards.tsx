"use client";

import { Activity, AlertTriangle, Database, MapPin, Package, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { kpiData } from "@/lib/mock-data";

const iconMap: Record<string, React.ElementType> = {
  activity: Activity,
  database: Database,
  bell: AlertTriangle,
  users: Users,
  package: Package,
  "map-pin": MapPin,
};

const colorMap: Record<string, { bg: string; text: string; bar: string }> = {
  critical: { bg: "bg-coral/12", text: "text-coral", bar: "bg-coral" },
  watch: { bg: "bg-amber/12", text: "text-amber", bar: "bg-amber" },
  stable: { bg: "bg-moss/12", text: "text-moss", bar: "bg-moss" },
};

export function KpiCards() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {kpiData.map((kpi, i) => (
        <KpiCard key={kpi.id} kpi={kpi} index={i} />
      ))}
    </div>
  );
}

function KpiCard({ kpi, index }: { kpi: typeof kpiData[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const Icon = iconMap[kpi.icon] || Activity;
  const colors = colorMap[kpi.severity] || colorMap.stable;

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -12, y: x * 12 });
  }

  function handleLeave() {
    setTilt({ x: 0, y: 0 });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="perspective-1000"
    >
      <div
        ref={ref}
        onMouseMove={handleMouse}
        onMouseLeave={handleLeave}
        style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
        className="glass rounded-xl p-4 transition-transform duration-200 ease-out cursor-default"
      >
        <div className="mb-3 flex items-center justify-between">
          <div className={`grid h-9 w-9 place-items-center rounded-lg ${colors.bg} ${colors.text}`}>
            <Icon size={18} />
          </div>
          <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${colors.bg} ${colors.text}`}>
            {kpi.change}
          </span>
        </div>
        <p className="text-2xl font-bold tracking-tight">{kpi.value}</p>
        <p className="mt-0.5 text-xs text-themed">{kpi.label}</p>
        <div className="mt-3 h-1 rounded-full bg-subtle">
          <div
            className={`h-full rounded-full ${colors.bar} transition-all duration-500`}
            style={{ width: kpi.severity === "critical" ? "82%" : kpi.severity === "watch" ? "55%" : "35%" }}
          />
        </div>
      </div>
    </motion.div>
  );
}
