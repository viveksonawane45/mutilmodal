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
    <header className="glass relative md:sticky md:top-4 z-30 flex flex-col gap-2 md:gap-4 rounded-xl p-2.5 md:p-4 md:flex-row md:items-center md:justify-between border border-white/10 backdrop-blur-xl bg-black/40 shadow-xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan/5 via-transparent to-transparent pointer-events-none" />
      
      {/* Title & Stream Wrapper */}
      <div className="flex items-center justify-between w-full md:w-auto md:block">
        <div className="flex flex-col">
          <div className="flex items-center gap-1 text-[9px] md:text-xs uppercase text-cyan/80 font-semibold tracking-wider">
            <Radio size={12} className={connected ? "animate-pulse" : ""} />
            {connected ? "Live operations stream" : "Demo stream"}
          </div>
          <h1 className="mt-0.5 text-sm md:text-xl lg:text-2xl font-bold tracking-tight text-white">
            Multimodal disaster intelligence
          </h1>
        </div>
        {/* Mobile-only Role Badge */}
        <span className="md:hidden rounded-md border border-white/10 bg-white/[0.08] px-2 py-1 text-[9px] uppercase text-slate-300 font-semibold tracking-wider shrink-0">
          {role.replace("_", " ")}
        </span>
      </div>

      {/* Action Buttons Wrapper */}
      <div className="flex items-center gap-1.5 md:gap-3 relative z-10 w-full md:w-auto">
        <div className="flex h-8 md:h-10 flex-1 md:flex-initial min-w-[120px] md:min-w-64 items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-2 md:px-3 focus-within:border-cyan/50 focus-within:shadow-[0_0_15px_rgba(80,227,214,0.15)] transition">
          <Search size={14} className="text-slate-400 shrink-0" />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="w-full bg-transparent text-xs md:text-sm outline-none placeholder:text-slate-500"
            placeholder="Search projects, zones, reports"
          />
        </div>
        <button onClick={onOpenFilters} className="grid h-8 w-8 md:h-10 md:w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.08] text-slate-200 hover:bg-white/[0.14] transition shrink-0" title="Filters">
          <Filter size={14} />
        </button>
        <button onClick={onOpenControls} className="grid h-8 w-8 md:h-10 md:w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.08] text-slate-200 hover:bg-white/[0.14] transition shrink-0" title="Controls">
          <SlidersHorizontal size={14} />
        </button>
        <button onClick={onExport} className="flex h-8 md:h-10 items-center gap-1 md:gap-2 rounded-lg bg-cyan px-2.5 md:px-4 text-xs md:text-sm font-semibold text-ink shadow-glow hover:bg-cyan/90 transition shrink-0">
          <Download size={14} />
          <span>Export</span>
        </button>
        {/* Desktop-only Role Badge */}
        <span className="hidden md:inline-block rounded-lg border border-white/10 bg-white/[0.08] px-3 py-2 text-xs uppercase text-slate-300 font-medium tracking-wider shrink-0">
          {role.replace("_", " ")}
        </span>
      </div>
    </header>
  );
}
