"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, BarChart3, FileText, FlaskConical, LayoutDashboard, Map, Shield, Users, X } from "lucide-react";
import { AIAssistant } from "@/components/dashboard/AIAssistant";
import { AnalysisDashboard } from "@/components/dashboard/AnalysisDashboard";
import { AuthPanel } from "@/components/dashboard/AuthPanel";
import { ProjectWorkspace } from "@/components/dashboard/ProjectWorkspace";
import { ReportsWorkspace } from "@/components/dashboard/ReportsWorkspace";
import { ResearchDashboard } from "@/components/dashboard/ResearchDashboard";
import { ResponseWorkspace } from "@/components/dashboard/ResponseWorkspace";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { getDemoToken } from "@/lib/api";
import { useLiveTelemetry } from "@/lib/use-live-telemetry";
import type { UserRole } from "@/lib/types";

const mobileNav = [
  { id: "dashboard", label: "Home", icon: LayoutDashboard },
  { id: "projects", label: "Projects", icon: FlaskConical },
  { id: "analysis", label: "Analysis", icon: BarChart3 },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "response", label: "Response", icon: Users },
  { id: "map", label: "Map", icon: Map }
];

export default function Home() {
  const [role, setRole] = useState<UserRole>("emergency_manager");
  const [token, setToken] = useState<string>();
  const [activeView, setActiveView] = useState("dashboard");
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [panel, setPanel] = useState<"filters" | "controls" | null>(null);
  const [notice, setNotice] = useState("Ready for operations.");
  const { telemetry, connected } = useLiveTelemetry();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }
  }, []);

  const content = useMemo(() => {
    if (activeView === "projects") return <ProjectWorkspace onNotify={setNotice} />;
    if (activeView === "analysis" || activeView === "map") return <AnalysisDashboard activeView={activeView} onNotify={setNotice} activeProjectId={activeProjectId} setActiveProjectId={setActiveProjectId} />;
    if (activeView === "reports") return <ReportsWorkspace onNotify={setNotice} />;
    if (activeView === "response") return <ResponseWorkspace onNotify={setNotice} />;
    return <ResearchDashboard search={search} onOpenView={setActiveView} onNotify={setNotice} onSelectProject={setActiveProjectId} />;
  }, [activeView, search]);

  async function login() {
    try {
      const result = await getDemoToken(role);
      setToken(result.access_token);
      setNotice(`${role.replace("_", " ")} session started with backend token.`);
    } catch {
      setToken("offline-demo-token");
      setNotice(`${role.replace("_", " ")} demo session started in offline mode.`);
    }
  }

  function exportReport() {
    const report = [
      "DisasterScope Operations Export",
      `Role: ${role.replace("_", " ")}`,
      `Active view: ${activeView}`,
      `Risk index: ${telemetry.riskIndex.toFixed(1)}`,
      `Water level: ${telemetry.waterLevel.toFixed(1)} m`,
      `Generated: ${new Date().toLocaleString()}`
    ].join("\n");
    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "disasterscope-operations-export.txt";
    link.click();
    URL.revokeObjectURL(url);
    setNotice("Operations export generated.");
  }

  return (
    <main className="min-h-screen p-4">
      <div className="mx-auto flex max-w-[1900px] gap-4">
        <Sidebar activeView={activeView} onViewChange={setActiveView} role={role} />

        <div className="min-w-0 flex-1 space-y-4 pb-24">
          <TopBar
            role={role}
            connected={connected}
            search={search}
            onSearchChange={(value) => {
              setSearch(value);
              setActiveView("dashboard");
            }}
            onOpenFilters={() => setPanel("filters")}
            onOpenControls={() => setPanel("controls")}
            onExport={exportReport}
          />

          <div className="glass rounded-lg px-4 py-3 text-sm text-slate-300">{notice}</div>

          <div className="grid gap-4 lg:grid-cols-[21rem_1fr] 2xl:grid-cols-[21rem_1fr]">
            <div className="space-y-4">
              {!token ? (
                <AuthPanel selectedRole={role} onRoleChange={setRole} onLogin={login} />
              ) : (
                <div className="glass rounded-lg p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-cyan/15 text-cyan">
                      <Shield size={20} />
                    </div>
                    <div>
                      <p className="text-xs uppercase text-cyan/80">Secure access</p>
                      <h3 className="font-semibold text-lg">Session Active</h3>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-slate-300">Authenticated as <span className="font-semibold text-white">{role.replace("_", " ")}</span></p>
                  <button onClick={() => { setToken(undefined); setNotice("Session ended."); }} className="mt-4 w-full rounded-lg border border-white/10 bg-white/[0.055] py-2 text-sm text-slate-300 hover:bg-white/[0.08] transition">End session</button>
                </div>
              )}
              <section className="glass rounded-lg p-5">
                <div className="mb-4 flex items-center gap-3">
                  <Activity className="text-cyan" size={22} />
                  <h2 className="text-lg font-semibold">Live telemetry</h2>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Telemetry label="Risk" value={`${telemetry.riskIndex.toFixed(1)}`} />
                  <Telemetry label="Water m" value={`${telemetry.waterLevel.toFixed(1)}`} />
                  <Telemetry label="Magnitude" value={`${telemetry.seismicMagnitude.toFixed(1)}`} />
                  <Telemetry label="AQI" value={`${telemetry.airQuality.toFixed(0)}`} />
                </div>
              </section>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22 }}
                className="min-w-0"
              >
                {content}
              </motion.div>
            </AnimatePresence>
          </div>

          <nav className="glass sticky bottom-4 z-40 grid grid-cols-6 gap-1 rounded-lg p-2 xl:hidden">
            {mobileNav.map((item) => {
              const Icon = item.icon;
              const selected = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  title={item.label}
                  className={`grid min-h-14 place-items-center rounded-lg text-xs ${selected ? "bg-cyan text-ink" : "text-slate-300"}`}
                >
                  <Icon size={18} />
                  <span className="mt-1 hidden sm:block">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <AIAssistant token={token} onNavigate={(view, projectId) => {
          setActiveView(view);
          if (projectId) setActiveProjectId(projectId);
        }} />
      </div>
      {panel ? <UtilityPanel type={panel} onClose={() => setPanel(null)} onApply={(message) => setNotice(message)} /> : null}
    </main>
  );
}

function Telemetry({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.055] p-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function UtilityPanel({ type, onClose, onApply }: { type: "filters" | "controls"; onClose: () => void; onApply: (message: string) => void }) {
  const [threshold, setThreshold] = useState(76);
  const [region, setRegion] = useState("Pune");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [voice, setVoice] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-black/55 p-4 backdrop-blur-sm">
      <section className="glass ml-auto max-w-lg rounded-lg p-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase text-cyan/80">{type === "filters" ? "Data filters" : "Operations controls"}</p>
            <h2 className="text-xl font-semibold">{type === "filters" ? "Refine dashboard data" : "Realtime settings"}</h2>
          </div>
          <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-lg bg-white/[0.08]" title="Close panel">
            <X size={18} />
          </button>
        </div>

        {type === "filters" ? (
          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Region</span>
              <select value={region} onChange={(event) => setRegion(event.target.value)} className="w-full rounded-lg border border-white/10 bg-black/25 p-3 outline-none focus:border-cyan/50">
                <option>Pune</option>
                <option>San Francisco</option>
                <option>NSW</option>
                <option>Gulf Coast</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Minimum risk score: {threshold}</span>
              <input type="range" min="0" max="100" value={threshold} onChange={(event) => setThreshold(Number(event.target.value))} className="w-full accent-cyan" />
            </label>
          </div>
        ) : (
          <div className="space-y-3">
            <label className="flex cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-white/[0.055] p-3">
              <span>Auto-refresh live telemetry</span>
              <input type="checkbox" checked={autoRefresh} onChange={() => setAutoRefresh((value) => !value)} className="h-5 w-5 accent-cyan" />
            </label>
            <label className="flex cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-white/[0.055] p-3">
              <span>Voice command standby</span>
              <input type="checkbox" checked={voice} onChange={() => setVoice((value) => !value)} className="h-5 w-5 accent-cyan" />
            </label>
          </div>
        )}

        <button
          onClick={() => {
            onApply(type === "filters" ? `Filters applied for ${region} with risk >= ${threshold}.` : `Controls updated: refresh ${autoRefresh ? "on" : "off"}, voice ${voice ? "on" : "off"}.`);
            onClose();
          }}
          className="mt-6 w-full rounded-lg bg-cyan py-3 text-sm font-semibold text-ink shadow-glow"
        >
          Apply
        </button>
      </section>
    </div>
  );
}
