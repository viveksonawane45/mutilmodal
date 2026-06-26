"use client";

import { useState } from "react";
import { ArrowLeft, CalendarDays, ChevronRight, Database, RadioTower, Satellite, Siren } from "lucide-react";
import { motion } from "framer-motion";
import { activityFeed, disasterEvents, liveMetrics } from "@/lib/mock-data";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { KpiCards } from "@/components/dashboard/KpiCards";

type Props = {
  search?: string;
  onOpenView?: (view: string) => void;
  onNotify?: (message: string) => void;
  onSelectProject?: (projectId: string) => void;
};

export function ResearchDashboard({ search = "", onOpenView, onNotify, onSelectProject }: Props) {
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

  const filteredEvents = disasterEvents.filter((event) =>
    `${event.name} ${event.location} ${event.type}`.toLowerCase().includes(search.toLowerCase())
  );
  const expandedEvent = expandedProjectId ? disasterEvents.find((e) => e.id === expandedProjectId) : null;

  return (
    <div className="space-y-5">
      <KpiCards />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {liveMetrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
          >
            <button
              className="block w-full text-left transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan rounded-xl"
              onClick={() => {
                let target = "analysis";
                if (metric.label.toLowerCase().includes("alerts") || metric.label.toLowerCase().includes("response")) {
                  target = "response";
                } else if (metric.label.toLowerCase().includes("data sources")) {
                  target = "projects";
                }
                onOpenView?.(target);
                onNotify?.(`${metric.label} overview opened.`);
              }}
            >
              <MetricCard metric={metric} />
            </button>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="glass rounded-xl p-4 md:p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan/40 to-transparent opacity-50" />
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-cyan/90 font-semibold mb-1">Research portfolio</p>
              <h2 className="text-xl md:text-2xl font-bold">Active disaster studies</h2>
            </div>
            {!expandedEvent && (
              <button
                onClick={() => onOpenView?.("projects")}
                className="grid h-10 w-10 place-items-center rounded-lg bg-subtle hover:bg-hover hover:text-cyan transition"
                title="Open all projects"
              >
                <ChevronRight size={18} />
              </button>
            )}
          </div>

          {expandedEvent ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <button
                onClick={() => setExpandedProjectId(null)}
                className="flex items-center gap-2 text-sm text-themed hover:text-base transition"
              >
                <ArrowLeft size={16} /> Back to studies
              </button>
              <div className="rounded-xl bg-item p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="text-xs uppercase font-semibold text-cyan">{expandedEvent.type}</p>
                    <h3 className="text-xl md:text-2xl font-bold">{expandedEvent.name}</h3>
                    <p className="text-sm text-themed mt-1">{expandedEvent.location}</p>
                  </div>
                  <span className="rounded-lg bg-coral/15 px-3 py-1.5 text-lg font-bold text-coral">
                    {expandedEvent.riskScore}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-themed mb-6">
                  <span className="rounded-lg bg-subtle border-themed px-3 py-1.5">Radius: {expandedEvent.radiusKm} km</span>
                  <span className="rounded-lg bg-subtle border-themed px-3 py-1.5">Status: {expandedEvent.status}</span>
                  {expandedEvent.territory && (
                    <span className="rounded-lg bg-subtle border-themed px-3 py-1.5">Territory: {expandedEvent.territory}</span>
                  )}
                </div>
                <p className="text-sm text-themed leading-relaxed mb-6">
                  Detailed disaster overview for {expandedEvent.name}. This event requires immediate multimodal
                  intelligence tracking. Ground units and sensor arrays have been deployed.
                </p>
                <button
                  onClick={() => {
                    onSelectProject?.(expandedEvent.id);
                    onOpenView?.("analysis");
                    onNotify?.(`Data analysis opened for ${expandedEvent.name}`);
                  }}
                  className="w-full rounded-xl bg-cyan px-4 py-3 text-sm font-semibold text-ink shadow-glow transition hover:-translate-y-0.5"
                >
                  Show Data Analysis
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="grid gap-3 lg:grid-cols-2 max-h-[280px] md:max-h-[400px] overflow-y-auto pr-2 thin-scrollbar">
              {filteredEvents.map((event, i) => (
                <motion.button
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setExpandedProjectId(event.id)}
                  className="group rounded-xl bg-item p-4 text-left transition hover:border-cyan/40 hover:shadow-[0_0_20px_rgba(80,227,214,0.08)] perspective-1000"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-cyan/80 mb-1">{event.type}</p>
                      <h3 className="text-base md:text-lg font-bold group-hover:text-cyan transition">{event.name}</h3>
                      <p className="text-sm text-themed mt-0.5">{event.location}</p>
                    </div>
                    <span className="rounded-lg bg-coral/15 px-2 py-1 text-sm font-semibold text-coral">
                      {event.riskScore}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-themed dim">
                    <span className="rounded bg-subtle px-2 py-1">Radius {event.radiusKm} km</span>
                    <span className="rounded bg-subtle px-2 py-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
                      {event.status}
                    </span>
                    <span className="rounded bg-cyan/10 text-cyan px-2 py-1 font-medium">AI ready</span>
                  </div>
                </motion.button>
              ))}
              {filteredEvents.length === 0 ? (
                <p className="col-span-2 rounded-xl bg-item p-4 text-sm text-themed-dim">
                  No matching studies found.
                </p>
              ) : null}
            </div>
          )}
        </section>

        <section className="glass rounded-xl p-4 md:p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-cyan/12">
              <RadioTower className="text-cyan" size={16} />
            </div>
            <h2 className="text-lg md:text-xl font-bold">Activity feed</h2>
          </div>
          <div className="space-y-3">
            {activityFeed.map((item) => (
              <div
                key={item}
                className="rounded-xl bg-item p-3 text-sm leading-6 text-themed hover:border-cyan/30 transition border border-transparent"
              >
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        {[
          { icon: Database, label: "Ingest IoT feed", detail: "MQTT, sensor CSV, edge gateway", view: "analysis" },
          { icon: Satellite, label: "Attach satellite layer", detail: "GeoTIFF, hotspot raster, NDWI", view: "map" },
          { icon: Siren, label: "Issue alert", detail: "Role-aware notification workflow", view: "response" },
          { icon: CalendarDays, label: "Generate report", detail: "AI summary plus QA checklist", view: "reports" },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              onClick={() => {
                onOpenView?.(action.view);
                onNotify?.(`${action.label} workflow opened.`);
              }}
              className="glass rounded-xl p-4 text-left transition hover:-translate-y-1 hover:shadow-glow perspective-1000"
            >
              <Icon className="mb-3 text-cyan" size={22} />
              <span className="block text-sm font-semibold">{action.label}</span>
              <span className="mt-1 block text-xs text-themed-dim">{action.detail}</span>
            </button>
          );
        })}
      </section>
    </div>
  );
}
