"use client";

import { Download, Filter, Radio, Search, SlidersHorizontal } from "lucide-react";
import type { UserRole } from "@/lib/types";

type Props = {
  role: UserRole;
  connected: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  onOpenFilters: () => void;
  onOpenControls: () => void;
  onExport: () => void;
};

export function TopBar({ role, connected, search, onSearchChange, onOpenFilters, onOpenControls, onExport }: Props) {
  return (
    <header className="glass sticky top-4 z-30 flex flex-col gap-4 rounded-xl p-4 md:flex-row md:items-center md:justify-between border border-white/10 backdrop-blur-xl bg-black/40 shadow-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan/5 via-transparent to-transparent pointer-events-none" />
      <div>
        <div className="flex items-center gap-2 text-xs uppercase text-cyan/80">
          <Radio size={14} className={connected ? "animate-pulse" : ""} />
          {connected ? "Live operations stream" : "Demo stream"}
        </div>
        <h1 className="mt-1 text-2xl font-semibold md:text-3xl">Multimodal disaster intelligence</h1>
      </div>
      <div className="flex flex-wrap items-center gap-3 relative z-10">
        <div className="flex h-10 min-w-64 items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-3 focus-within:border-cyan/50 focus-within:shadow-[0_0_15px_rgba(80,227,214,0.15)] transition">
          <Search size={16} className="text-slate-400" />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
            placeholder="Search projects, zones, reports"
          />
        </div>
        <button onClick={onOpenFilters} className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.08] text-slate-200 hover:bg-white/[0.14]" title="Filters">
          <Filter size={18} />
        </button>
        <button onClick={onOpenControls} className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.08] text-slate-200 hover:bg-white/[0.14]" title="Controls">
          <SlidersHorizontal size={18} />
        </button>
        <button onClick={onExport} className="flex h-10 items-center gap-2 rounded-lg bg-cyan px-4 text-sm font-semibold text-ink shadow-glow hover:bg-cyan/90">
          <Download size={17} />
          Export
        </button>
        <span className="rounded-lg border border-white/10 bg-white/[0.08] px-3 py-2 text-xs uppercase text-slate-300">{role.replace("_", " ")}</span>
      </div>
    </header>
  );
}
