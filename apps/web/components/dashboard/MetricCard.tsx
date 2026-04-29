import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import type { LiveMetric } from "@/lib/types";

export function MetricCard({ metric }: { metric: LiveMetric }) {
  const Icon = metric.trend.startsWith("-") ? ArrowDownRight : metric.trend === "0" ? Minus : ArrowUpRight;
  const tone = metric.severity === "critical" ? "text-coral bg-coral/12" : metric.severity === "watch" ? "text-amber bg-amber/12" : "text-moss bg-moss/12";

  return (
    <div className="glass rounded-lg p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-slate-300">{metric.label}</p>
        <span className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs ${tone}`}>
          <Icon size={14} />
          {metric.trend}
        </span>
      </div>
      <p className="text-3xl font-semibold">{metric.value}</p>
      <div className="mt-4 h-1.5 rounded-full bg-white/[0.08]">
        <div className={`h-full rounded-full ${metric.severity === "critical" ? "bg-coral" : metric.severity === "watch" ? "bg-amber" : "bg-moss"}`} style={{ width: metric.severity === "critical" ? "84%" : metric.severity === "watch" ? "61%" : "46%" }} />
      </div>
    </div>
  );
}
