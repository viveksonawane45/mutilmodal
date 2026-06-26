"use client";

import { useState } from "react";
import { ArrowLeft, CalendarDays, ChevronRight, Database, RadioTower, Satellite, Siren } from "lucide-react";
import { motion } from "framer-motion";
import { activityFeed, disasterEvents, liveMetrics } from "@/lib/mock-data";
import { MetricCard } from "@/components/dashboard/MetricCard";

type Props = {
  search?: string;
  onOpenView?: (view: string) => void;
  onNotify?: (message: string) => void;
  onSelectProject?: (projectId: string) => void;
};

export function ResearchDashboard({ search = "", onOpenView, onNotify, onSelectProject }: Props) {
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

  const filteredEvents = disasterEvents.filter((event) => `${event.name} ${event.location} ${event.type}`.toLowerCase().includes(search.toLowerCase()));
  const expandedEvent = expandedProjectId ? disasterEvents.find(e => e.id === expandedProjectId) : null;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {liveMetrics.map((metric, index) => (
          <motion.div key={metric.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
            <button 
              className="block w-full text-left transition hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan rounded-lg"
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
              <div className="hover:border-cyan/40 border border-transparent rounded-lg transition">
                <MetricCard metric={metric} />
              </div>
            </button>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="glass rounded-xl p-4 md:p-6 border border-white/10 shadow-xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan/50 to-transparent opacity-50" />
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-cyan/90 font-semibold mb-1">Research portfolio</p>
              <h2 className="text-2xl font-bold text-white/90 drop-shadow-sm">Active disaster studies</h2>
            </div>
            {!expandedEvent && (
              <button onClick={() => onOpenView?.("projects")} className="grid h-10 w-10 place-items-center rounded-lg bg-white/[0.08] hover:bg-white/[0.14] hover:text-cyan transition" title="Open all projects">
                <ChevronRight size={18} />
              </button>
            )}
          </div>
          
          {expandedEvent ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <button onClick={() => setExpandedProjectId(null)} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition">
                <ArrowLeft size={16} /> Back to studies
              </button>
              <div className="rounded-lg border border-white/10 bg-black/20 p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="text-xs uppercase text-cyan">{expandedEvent.type}</p>
                    <h3 className="text-2xl font-bold">{expandedEvent.name}</h3>
                    <p className="text-sm text-slate-400 mt-1">{expandedEvent.location}</p>
                  </div>
                  <span className="rounded-lg bg-coral/15 px-3 py-1.5 text-lg font-bold text-coral shadow-glow">{expandedEvent.riskScore}</span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-slate-300 mb-6">
                  <span className="rounded-lg bg-white/5 border border-white/10 px-3 py-1.5">Radius: {expandedEvent.radiusKm} km</span>
                  <span className="rounded-lg bg-white/5 border border-white/10 px-3 py-1.5">Status: {expandedEvent.status}</span>
                  {expandedEvent.territory && <span className="rounded-lg bg-white/5 border border-white/10 px-3 py-1.5">Territory: {expandedEvent.territory}</span>}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  Detailed disaster overview for {expandedEvent.name}. This event requires immediate multimodal intelligence tracking. Ground units and sensor arrays have been deployed.
                </p>
                <button 
                  onClick={() => {
                    onSelectProject?.(expandedEvent.id);
                    onOpenView?.("analysis");
                    onNotify?.(`Data analysis opened for ${expandedEvent.name}`);
                  }} 
                  className="w-full rounded-lg bg-cyan px-4 py-3 text-sm font-semibold text-ink shadow-glow transition hover:-translate-y-0.5"
                >
                  Show Data Analysis
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="grid gap-3 lg:grid-cols-2 max-h-[280px] md:max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredEvents.map((event, i) => (
                <motion.button 
                  key={event.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setExpandedProjectId(event.id)} 
                  className="group rounded-lg border border-white/10 bg-black/20 p-4 text-left transition hover:border-cyan/40 hover:bg-black/40 hover:shadow-[0_0_20px_rgba(80,227,214,0.1)]"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-cyan/80 mb-1">{event.type}</p>
                      <h3 className="text-lg font-bold text-slate-200 group-hover:text-cyan transition">{event.name}</h3>
                      <p className="text-sm text-slate-400 mt-1">{event.location}</p>
                    </div>
                    <span className="rounded-lg bg-coral/15 px-2 py-1 text-sm font-semibold text-coral ring-1 ring-coral/20">{event.riskScore}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                    <span className="rounded bg-white/5 px-2 py-1">Radius {event.radiusKm} km</span>
                    <span className="rounded bg-white/5 px-2 py-1 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse"/>{event.status}</span>
                    <span className="rounded bg-cyan/10 text-cyan px-2 py-1 font-medium">AI ready</span>
                  </div>
                </motion.button>
              ))}
              {filteredEvents.length === 0 ? <p className="col-span-2 rounded-lg border border-white/10 bg-black/20 p-4 text-sm text-slate-400">No matching studies found.</p> : null}
            </div>
          )}
        </section>

        <section className="glass rounded-xl p-4 md:p-6 border border-white/10 shadow-xl backdrop-blur-md">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded bg-cyan/15">
              <RadioTower className="text-cyan animate-pulse" size={16} />
            </div>
            <h2 className="text-xl font-bold text-white/90">Activity feed</h2>
          </div>
          <div className="space-y-3">
            {activityFeed.map((item) => (
              <div key={item} className="rounded-lg border border-white/5 bg-black/30 p-3 text-sm leading-6 text-slate-300 hover:border-cyan/30 transition">
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
          { icon: CalendarDays, label: "Generate report", detail: "AI summary plus QA checklist", view: "reports" }
        ].map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              onClick={() => {
                onOpenView?.(action.view);
                onNotify?.(`${action.label} workflow opened.`);
              }}
              className="glass rounded-lg p-4 text-left transition hover:-translate-y-1 hover:border-cyan/40"
            >
              <Icon className="mb-3 text-cyan" size={22} />
              <span className="block text-sm font-semibold">{action.label}</span>
              <span className="mt-1 block text-xs text-slate-400">{action.detail}</span>
            </button>
          );
        })}
      </section>
    </div>
  );
}
