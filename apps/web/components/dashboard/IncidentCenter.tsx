"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Clock, Filter, MapPin, Search, X } from "lucide-react";
import { incidents } from "@/lib/mock-data";
import type { IncidentItem } from "@/lib/types";

const severityColors: Record<string, { bg: string; text: string; dot: string }> = {
  critical: { bg: "bg-coral/12", text: "text-coral", dot: "bg-coral" },
  high: { bg: "bg-amber/12", text: "text-amber", dot: "bg-amber" },
  medium: { bg: "bg-blue/12", text: "text-blue", dot: "bg-blue" },
  low: { bg: "bg-moss/12", text: "text-moss", dot: "bg-moss" },
};

const statusColors: Record<string, string> = {
  open: "bg-coral/12 text-coral",
  investigating: "bg-amber/12 text-amber",
  resolved: "bg-moss/12 text-moss",
  closed: "bg-subtle text-themed-dim",
};

export function IncidentCenter() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<IncidentItem | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const filtered = incidents.filter((inc) => {
    const matchSearch = `${inc.title} ${inc.location}`.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || inc.severity === filter;
    return matchSearch && matchFilter;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="glass rounded-xl p-4 md:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold md:text-2xl">Incident Center</h1>
            <p className="text-sm text-themed mt-0.5">{incidents.length} total incidents</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 flex-1 sm:flex-none items-center gap-2 rounded-lg border-themed bg-input px-2.5 min-w-[180px]">
              <Search size={14} className="text-themed-dim shrink-0" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-transparent text-sm outline-none placeholder:text-themed-dim" placeholder="Search incidents..." />
            </div>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="h-9 rounded-lg border-themed bg-input px-2.5 text-sm outline-none">
              <option value="all">All Severity</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_360px]">
        <div className="space-y-2">
          {filtered.map((inc, i) => {
            const sev = severityColors[inc.severity] || severityColors.low;
            return (
              <motion.button
                key={inc.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setSelected(inc)}
                className={`w-full text-left glass rounded-xl p-4 transition hover:-translate-y-0.5 ${selected?.id === inc.id ? "ring-2 ring-cyan/50" : ""}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg ${sev.bg}`}>
                      <AlertTriangle size={16} className={sev.text} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{inc.title}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-themed">
                        <MapPin size={12} /> {inc.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusColors[inc.status]}`}>
                      {inc.status}
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${sev.bg} ${sev.text}`}>
                      {inc.severity}
                    </span>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-themed-dim">
                  <Clock size={12} />
                  {inc.timestamp}
                </div>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="glass rounded-xl p-5 h-fit sticky top-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold">Incident Details</h2>
                <button onClick={() => setSelected(null)} className="grid h-8 w-8 place-items-center rounded-lg bg-subtle hover:bg-hover transition">
                  <X size={16} />
                </button>
              </div>
              {(() => {
                const sev = severityColors[selected.severity];
                return (
                  <div className="space-y-4">
                    <div className={`rounded-lg ${sev.bg} p-3`}>
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${sev.dot} animate-pulse`} />
                        <span className={`text-sm font-semibold ${sev.text}`}>{selected.severity.toUpperCase()}</span>
                        <span className="text-xs text-themed-dim">priority</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-lg font-bold">{selected.title}</p>
                      <p className="flex items-center gap-1 text-sm text-themed mt-1">
                        <MapPin size={14} /> {selected.location}
                      </p>
                    </div>
                    <div className="rounded-lg bg-subtle p-3 text-sm text-themed leading-relaxed">
                      {selected.description}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-themed-dim">
                      <Clock size={12} />
                      Reported: {selected.timestamp}
                    </div>
                    <div className="flex gap-2">
                      <span className="rounded-lg bg-cyan px-3 py-1.5 text-xs font-medium text-ink cursor-pointer hover:bg-cyan/90 transition">
                        Assign Team
                      </span>
                      <span className="rounded-lg border-themed bg-subtle px-3 py-1.5 text-xs text-themed cursor-pointer hover:bg-hover transition">
                        View on Map
                      </span>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-xl p-5 flex items-center justify-center text-center text-themed-dim"
            >
              <div>
                <AlertTriangle size={32} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm">Select an incident to view details</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
