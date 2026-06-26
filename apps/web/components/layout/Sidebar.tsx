"use client";

import { Activity, BarChart3, Bell, FileText, FlaskConical, LayoutDashboard, Map, Shield, Users } from "lucide-react";
import { motion } from "framer-motion";
import type { UserRole } from "@/lib/types";

type Props = {
  activeView: string;
  onViewChange: (view: string) => void;
  role: UserRole;
};

const nav = [
  { id: "dashboard", label: "Research Home", icon: LayoutDashboard },
  { id: "projects", label: "Projects", icon: FlaskConical },
  { id: "analysis", label: "Data Analysis", icon: BarChart3 },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "response", label: "Response Ops", icon: Users },
  { id: "map", label: "Live Map", icon: Map }
];

export function Sidebar({ activeView, onViewChange, role }: Props) {
  return (
    <aside className="glass sticky top-4 hidden h-[calc(100vh-2rem)] w-72 shrink-0 rounded-xl p-4 xl:block shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-cyan/5 to-transparent pointer-events-none" />
      <div className="mb-7 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-lg bg-cyan/15 text-cyan shadow-glow">
          <Activity size={24} />
        </div>
        <div>
          <p className="text-lg font-semibold">DisasterScope</p>
          <p className="text-xs uppercase text-cyan/80">{role.replace("_", " ")}</p>
        </div>
      </div>

      <nav className="space-y-2">
        {nav.map((item) => {
          const Icon = item.icon;
          const selected = activeView === item.id;
          return (
            <button
              key={item.id}
              className={`relative flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition group ${selected ? 'text-cyan font-medium' : 'text-themed hover:text'}`}
              onClick={() => onViewChange(item.id)}
              title={item.label}
            >
              {selected ? (
                <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-lg bg-cyan/15 border border-cyan/30 shadow-[0_0_15px_rgba(80,227,214,0.15)]" />
              ) : (
                <span className="absolute inset-0 rounded-lg bg-transparent group-hover:bg-hover transition" />
              )}
              <Icon className="relative" size={18} />
              <span className="relative">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-8 rounded-lg border border-amber/30 bg-amber/10 p-4 shadow-[0_0_20px_rgba(245,158,11,0.05)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-amber/50" />
        <div className="mb-2 flex items-center gap-2 text-amber font-semibold">
          <Shield size={18} className="animate-pulse" />
          <span className="text-sm">Trust Layer</span>
        </div>
        <p className="text-xs leading-5 text-amber/70">
          JWT, RBAC, encrypted secrets, rate limiting, and immutable audit-ready event trails.
        </p>
      </div>

      <button onClick={() => onViewChange("response")} className="absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-lg border-themed bg-medium p-3 hover:border-cyan/40 transition w-[calc(100%-2rem)] text-left">
        <Bell size={18} className="text-coral" />
        <div>
          <p className="text-sm font-medium">37 alerts active</p>
          <p className="text-xs text-themed-dim">8 require manager review</p>
        </div>
      </button>
    </aside>
  );
}
