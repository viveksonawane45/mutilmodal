"use client";

import { motion } from "framer-motion";
import {
  Activity, AlertTriangle, BarChart3, Bell, FileText, FlaskConical,
  LayoutDashboard, Map, Package, Settings, User, Users
} from "lucide-react";
import type { ViewType } from "@/lib/types";

type Props = {
  activeView: string;
  onViewChange: (view: string) => void;
  role: string;
};

type NavItem = {
  id: ViewType;
  label: string;
  icon: React.ElementType;
  color: string;
  section: "main" | "management" | "account";
};

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, color: "text-cyan", section: "main" },
  { id: "projects", label: "Projects", icon: FlaskConical, color: "text-violet", section: "main" },
  { id: "analysis", label: "Analysis", icon: BarChart3, color: "text-blue", section: "main" },
  { id: "reports", label: "Reports", icon: FileText, color: "text-amber", section: "main" },
  { id: "response", label: "Response", icon: Users, color: "text-coral", section: "main" },
  { id: "map", label: "Live Map", icon: Map, color: "text-moss", section: "main" },
  { id: "incidents", label: "Incidents", icon: AlertTriangle, color: "text-rose", section: "management" },
  { id: "resources", label: "Resources", icon: Package, color: "text-cyan", section: "management" },
  { id: "profile", label: "Profile", icon: User, color: "text-blue", section: "account" },
  { id: "settings", label: "Settings", icon: Settings, color: "text-themed-dim", section: "account" },
];

const sectionLabels: Record<string, string> = {
  main: "Main",
  management: "Operations",
  account: "Account",
};

export function Sidebar({ activeView, onViewChange, role }: Props) {
  return (
    <aside className="glass sticky top-4 hidden h-[calc(100vh-2rem)] w-64 shrink-0 rounded-2xl p-4 xl:flex xl:flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan/[0.04] to-transparent pointer-events-none" />

      <div className="relative mb-6 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan/20 to-violet/20 text-cyan shadow-glow">
          <Activity size={22} />
        </div>
        <div>
          <p className="text-base font-bold tracking-tight">DisasterScope</p>
          <p className="text-[10px] uppercase tracking-wider text-cyan/80 font-medium">{role.replace("_", " ")}</p>
        </div>
      </div>

      {(["main", "management", "account"] as const).map((section) => (
        <div key={section} className="relative mb-3 last:mb-0">
          <p className="mb-1.5 px-3 text-[10px] uppercase tracking-widest text-themed-dim font-semibold">
            {sectionLabels[section]}
          </p>
          <nav className="space-y-0.5">
            {navItems
              .filter((item) => item.section === section)
              .map((item) => {
                const Icon = item.icon;
                const selected = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    className={`relative flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition group ${
                      selected ? "bg-subtle" : "hover:bg-subtle"
                    }`}
                  >
                    {selected && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-cyan shadow-[0_0_8px_rgba(80,227,214,0.5)]"
                      />
                    )}
                    <Icon
                      size={17}
                      className={`shrink-0 transition ${
                        selected ? item.color : "text-themed-dim group-hover:text-themed"
                      }`}
                    />
                    <span
                      className={`transition ${
                        selected ? "font-medium" : "text-themed"
                      }`}
                    >
                      {item.label}
                    </span>
                    {item.id === "incidents" && (
                      <span className="ml-auto rounded-full bg-coral/12 px-2 py-0.5 text-[10px] font-medium text-coral">
                        8
                      </span>
                    )}
                  </button>
                );
              })}
          </nav>
        </div>
      ))}

      <div className="mt-auto relative pt-3 border-t border-themed/50">
        <button
          onClick={() => onViewChange("response")}
          className="flex w-full items-center gap-3 rounded-xl bg-coral/8 p-3 hover:bg-coral/12 transition text-left"
        >
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-coral/12">
            <Bell size={16} className="text-coral animate-pulse" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium">37 alerts</p>
            <p className="text-[11px] text-coral/70">8 need review</p>
          </div>
        </button>
      </div>
    </aside>
  );
}
