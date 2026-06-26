"use client";

import { motion } from "framer-motion";
import { Activity, Calendar, Clock, FileText, MapPin, Shield, TrendingUp, Users } from "lucide-react";
import { userProfile } from "@/lib/mock-data";

export function ProfilePage() {
  const p = userProfile;
  const stats = [
    { label: "Incidents Managed", value: p.stats.incidentsManaged, icon: Activity, color: "text-coral bg-coral/12" },
    { label: "Reports Generated", value: p.stats.reportsGenerated, icon: FileText, color: "text-cyan bg-cyan/12" },
    { label: "Teams Coordinated", value: p.stats.teamsCoordinated, icon: Users, color: "text-blue bg-blue/12" },
    { label: "Avg Response Time", value: p.stats.responseTime, icon: Clock, color: "text-amber bg-amber/12" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      <div className="glass rounded-xl p-5 md:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-cyan/20 to-violet/20 text-xl font-bold text-cyan shadow-glow">
              {p.avatar}
            </div>
            <div>
              <h1 className="text-xl font-bold md:text-2xl">{p.name}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-themed">
                <span className="flex items-center gap-1">
                  <Shield size={14} className="text-cyan" /> {p.role}
                </span>
                <span className="text-themed-dim">|</span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {p.location}
                </span>
              </div>
              <p className="mt-1 text-xs text-themed-dim">{p.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border-themed bg-subtle px-4 py-2 text-xs text-themed">
            <Calendar size={14} />
            Joined {p.joined}
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass rounded-xl p-4"
            >
              <div className="mb-2 flex items-center gap-2">
                <div className={`grid h-8 w-8 place-items-center rounded-lg ${s.color}`}>
                  <Icon size={16} />
                </div>
              </div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-themed mt-0.5">{s.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="glass rounded-xl p-5">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-cyan" />
            <h2 className="font-semibold">Recent Activity</h2>
          </div>
          <div className="space-y-3">
            {p.recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg bg-subtle p-3 text-sm">
                <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${i < 2 ? "bg-coral animate-pulse" : "bg-cyan"}`} />
                <span className="text-themed leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-xl p-5">
          <div className="mb-4 flex items-center gap-2">
            <Shield size={18} className="text-cyan" />
            <h2 className="font-semibold">Access & Permissions</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: "Full System Access", desc: "All modules and data sources", active: true },
              { label: "Team Management", desc: "Create and assign response teams", active: true },
              { label: "Report Generation", desc: "AI-assisted report creation", active: true },
              { label: "Resource Authorization", desc: "Approve resource deployments", active: true },
              { label: "Data Export", desc: "Export analytics and raw data", active: false },
            ].map((perm) => (
              <div key={perm.label} className="flex items-center justify-between rounded-lg border-themed bg-subtle p-3">
                <div>
                  <p className="text-sm font-medium">{perm.label}</p>
                  <p className="text-xs text-themed-dim">{perm.desc}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${perm.active ? "bg-moss/12 text-moss" : "bg-coral/12 text-coral"}`}>
                  {perm.active ? "Active" : "Disabled"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
