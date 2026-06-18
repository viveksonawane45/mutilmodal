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
    <header className="glass relative md:sticky md:top-4 z-30 flex flex-col gap-3 rounded-xl p-3 md:p-4 border border-white/10 backdrop-blur-xl bg-black/40 shadow-xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between w-full relative z-10">
        {/* Top row: Title and Badge (on mobile side-by-side, on desktop it flows nicely) */}
        <div className="flex items-start justify-between md:justify-start gap-4 w-full md:w-auto">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] md:text-xs uppercase text-cyan/80">
              <Radio size={connected ? 12 : 14} className={connected ? "animate-pulse" : ""} />
              {connected ? "Live operations stream" : "Demo stream"}
            </div>
            <h1 className="mt-0.5 text-lg font-semibold sm:text-xl md:text-2xl lg:text-3xl tracking-tight">
              Multimodal disaster intelligence
            </h1>
          </div>
          {/* Badge for role on mobile (hidden on md and up) */}
          <span className="md:hidden self-center rounded-lg border border-white/10 bg-white/[0.08] px-2 py-1 text-[10px] uppercase text-slate-300 whitespace-nowrap">
            {role.replace("_", " ")}
          </span>
        </div>

        {/* Actions row: Search & Buttons */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
          <div className="flex h-9 md:h-10 flex-1 md:flex-none min-w-[140px] md:min-w-64 items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-2.5 md:px-3 focus-within:border-cyan/50 focus-within:shadow-[0_0_15px_rgba(80,227,214,0.15)] transition">
            <Search size={14} className="text-slate-400 shrink-0" />
            <input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              className="w-full bg-transparent text-xs md:text-sm outline-none placeholder:text-slate-500"
              placeholder="Search projects..."
            />
          </div>
          
          <button 
            onClick={onOpenFilters} 
            className="grid h-9 w-9 md:h-10 md:w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.08] text-slate-200 hover:bg-white/[0.14] transition shrink-0" 
            title="Filters"
          >
            <Filter size={15} />
          </button>
          
          <button 
            onClick={onOpenControls} 
            className="grid h-9 w-9 md:h-10 md:w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.08] text-slate-200 hover:bg-white/[0.14] transition shrink-0" 
            title="Controls"
          >
            <SlidersHorizontal size={15} />
          </button>
          
          <button 
            onClick={onExport} 
            className="flex h-9 md:h-10 items-center justify-center gap-1.5 md:gap-2 rounded-lg bg-cyan px-3 md:px-4 text-xs md:text-sm font-semibold text-ink shadow-glow hover:bg-cyan/90 transition shrink-0"
            title="Export Operations Report"
          >
            <Download size={15} />
            <span className="hidden sm:inline">Export</span>
          </button>
          
          {/* Badge for role on desktop (hidden on mobile) */}
          <span className="hidden md:inline rounded-lg border border-white/10 bg-white/[0.08] px-3 py-2 text-xs uppercase text-slate-300 whitespace-nowrap">
            {role.replace("_", " ")}
          </span>
        </div>
      </div>
    </header>
  );
}

