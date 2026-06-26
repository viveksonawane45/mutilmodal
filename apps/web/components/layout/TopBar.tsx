"use client";

import {
  ArrowLeft, Download, Filter, Moon, Radio, Search, Settings, SlidersHorizontal, Sun, User
} from "lucide-react";
import { useTheme } from "@/lib/theme-provider";

type Props = {
  role: string;
  connected: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  onOpenFilters: () => void;
  onOpenControls: () => void;
  onExport: () => void;
  onNavigate: (view: string) => void;
  activeView: string;
};

const viewTitles: Record<string, string> = {
  dashboard: "Dashboard",
  projects: "Projects",
  analysis: "Data Analysis",
  reports: "Reports",
  response: "Response Operations",
  map: "Live Map",
  profile: "Profile",
  settings: "Settings",
  incidents: "Incident Center",
  resources: "Resource Center",
};

export function TopBar({ role, connected, search, onSearchChange, onOpenFilters, onOpenControls, onExport, onNavigate, activeView }: Props) {
  const { theme, toggle } = useTheme();
  const isMainView = ["dashboard", "projects", "analysis", "reports", "response", "map"].includes(activeView);
  const isNested = !isMainView;

  return (
    <header className="glass relative md:sticky md:top-4 z-30 rounded-2xl px-4 py-3 md:px-5 md:py-3.5 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan/[0.03] via-transparent to-transparent pointer-events-none" />

      <div className="relative flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {isNested && (
            <button onClick={() => onNavigate("dashboard")} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-subtle hover:bg-hover transition">
              <ArrowLeft size={15} className="text-themed" />
            </button>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[10px] md:text-xs uppercase tracking-wider text-cyan/80">
              <Radio size={connected ? 12 : 14} className={connected ? "animate-pulse" : ""} />
              {connected ? "Live operations" : "Demo mode"}
            </div>
            <h1 className="text-base md:text-xl font-bold tracking-tight truncate">
              {viewTitles[activeView] || "Dashboard"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1.5 md:gap-2">
          <div className="hidden md:flex h-9 items-center gap-2 rounded-xl border-themed bg-input px-3 min-w-[200px] focus-within:border-cyan/50 transition">
            <Search size={14} className="text-themed-dim shrink-0" />
            <input
              value={search}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (isNested) onNavigate("dashboard");
              }}
              className="w-full bg-transparent text-sm outline-none placeholder:text-themed-dim"
              placeholder="Search..."
            />
          </div>

          <button onClick={onOpenFilters} className="grid h-9 w-9 place-items-center rounded-xl border-themed bg-subtle text-themed-dim hover:text-themed hover:bg-hover transition shrink-0" title="Filters">
            <Filter size={15} />
          </button>
          <button onClick={onOpenControls} className="grid h-9 w-9 place-items-center rounded-xl border-themed bg-subtle text-themed-dim hover:text-themed hover:bg-hover transition shrink-0" title="Controls">
            <SlidersHorizontal size={15} />
          </button>
          <button onClick={toggle} className="grid h-9 w-9 place-items-center rounded-xl border-themed bg-subtle text-themed-dim hover:text-themed hover:bg-hover transition shrink-0" title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button onClick={onExport} className="flex h-9 items-center justify-center gap-1.5 rounded-xl bg-cyan px-3.5 text-sm font-semibold text-ink shadow-glow hover:bg-cyan/90 transition shrink-0" title="Export Report">
            <Download size={14} />
            <span className="hidden sm:inline text-xs">Export</span>
          </button>
          <button onClick={() => onNavigate("profile")} className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan/15 to-violet/15 text-cyan font-semibold text-xs shrink-0" title="Profile">
            <User size={15} />
          </button>
        </div>
      </div>

      <div className="md:hidden relative mt-2">
        <div className="flex h-9 items-center gap-2 rounded-xl border-themed bg-input px-3 focus-within:border-cyan/50 transition">
          <Search size={14} className="text-themed-dim shrink-0" />
          <input
            value={search}
            onChange={(e) => {
              onSearchChange(e.target.value);
              if (isNested) onNavigate("dashboard");
            }}
            className="w-full bg-transparent text-sm outline-none placeholder:text-themed-dim"
            placeholder="Search..."
          />
        </div>
      </div>
    </header>
  );
}
