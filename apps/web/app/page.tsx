"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity, AlertTriangle, BarChart3, FileText, FlaskConical, LayoutDashboard,
  Map, Package, Settings, Shield, User, Users, X
} from "lucide-react";
import { AIAssistant } from "@/components/dashboard/AIAssistant";
import { AnalysisDashboard } from "@/components/dashboard/AnalysisDashboard";
import { ToastContainer } from "@/components/dashboard/Toast";
import { ThemeProvider } from "@/lib/theme-provider";
import { useVoiceCommands } from "@/lib/use-voice-commands";
import { AuthPanel } from "@/components/dashboard/AuthPanel";
import { ProjectWorkspace } from "@/components/dashboard/ProjectWorkspace";
import { ReportsWorkspace } from "@/components/dashboard/ReportsWorkspace";
import { ResearchDashboard } from "@/components/dashboard/ResearchDashboard";
import { ResponseWorkspace } from "@/components/dashboard/ResponseWorkspace";
import { ProfilePage } from "@/components/dashboard/ProfilePage";
import { SettingsPage } from "@/components/dashboard/SettingsPage";
import { IncidentCenter } from "@/components/dashboard/IncidentCenter";
import { ResourceCenter } from "@/components/dashboard/ResourceCenter";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { getDemoToken } from "@/lib/api";
import { useLiveTelemetry } from "@/lib/use-live-telemetry";
import type { UserRole, ViewType } from "@/lib/types";

type BottomTab = {
  id: ViewType;
  label: string;
  icon: React.ElementType;
};

const bottomNav: BottomTab[] = [
  { id: "dashboard", label: "Home", icon: LayoutDashboard },
  { id: "projects", label: "Projects", icon: FlaskConical },
  { id: "analysis", label: "Analyze", icon: BarChart3 },
  { id: "incidents", label: "Incidents", icon: AlertTriangle },
  { id: "response", label: "Response", icon: Users },
  { id: "map", label: "Map", icon: Map },
  { id: "profile", label: "Profile", icon: User },
];

export default function Home() {
  return <ThemeProvider><HomeInner /></ThemeProvider>;
}

function HomeInner() {
  const [role, setRole] = useState<UserRole>("emergency_manager");
  const [token, setToken] = useState<string>();
  const [activeView, setActiveView] = useState<ViewType>("dashboard");
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [panel, setPanel] = useState<"filters" | "controls" | null>(null);
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);
  const [notice, setNotice] = useState("Ready for operations.");
  const [modalContent, setModalContent] = useState<{ title: string; message: string } | null>(null);

  const { telemetry, connected } = useLiveTelemetry();
  const { listening: voiceListening, toggle: toggleVoice, transcript } = useVoiceCommands(
    (view) => {
      setActiveView(view as ViewType);
      setNotice(`Voice: navigating to ${view}`);
    }
  );

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }
  }, []);

  const setView = useCallback((view: string) => {
    setActiveView(view as ViewType);
  }, []);

  const notify = useCallback((message: string) => {
    setNotice(message);
  }, []);

  const content = useMemo(() => {
    switch (activeView) {
      case "projects":
        return <ProjectWorkspace onNotify={notify} />;
      case "analysis":
      case "map":
        return <AnalysisDashboard activeView={activeView} onNotify={notify} activeProjectId={activeProjectId} setActiveProjectId={setActiveProjectId} />;
      case "reports":
        return <ReportsWorkspace onNotify={notify} />;
      case "response":
        return <ResponseWorkspace onNotify={notify} />;
      case "profile":
        return <ProfilePage />;
      case "settings":
        return <SettingsPage />;
      case "incidents":
        return <IncidentCenter />;
      case "resources":
        return <ResourceCenter />;
      default:
        return <ResearchDashboard search={search} onOpenView={setView} onNotify={notify} onSelectProject={setActiveProjectId} />;
    }
  }, [activeView, search, activeProjectId, setActiveProjectId, notify, setView]);

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
      `Generated: ${new Date().toLocaleString()}`,
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
    <main className="min-h-screen p-2 sm:p-3 md:p-4">
      <div className="mx-auto flex max-w-[1900px] gap-3 md:gap-4">
        <Sidebar activeView={activeView} onViewChange={setView} role={role} />

        <div className="min-w-0 flex-1 space-y-3 md:space-y-4 pb-28 md:pb-24">
          <TopBar
            role={role}
            connected={connected}
            search={search}
            onSearchChange={setSearch}
            onOpenFilters={() => setPanel("filters")}
            onOpenControls={() => setPanel("controls")}
            onExport={exportReport}
            onNavigate={setView}
            activeView={activeView}
          />

          <div className="glass rounded-xl px-4 py-3 text-sm text-themed flex items-center gap-3">
            <span className="flex-1">{notice}</span>
            {voiceListening && (
              <span className="flex items-center gap-1.5 text-coral text-xs shrink-0">
                <span className="w-2 h-2 rounded-full bg-coral animate-pulse" />
                Voice active
              </span>
            )}
            {transcript && !voiceListening && (
              <span className="text-xs text-cyan/70 shrink-0">{transcript}</span>
            )}
          </div>

          <div className="grid gap-4 lg:grid-cols-[21rem_1fr] 2xl:grid-cols-[21rem_1fr]">
            <button
              onClick={() => setMobilePanelOpen((v) => !v)}
              className="flex w-full items-center justify-between rounded-xl border-themed bg-item p-3 text-sm lg:hidden"
            >
              <span className="flex items-center gap-2">
                <Activity size={16} className="text-cyan" />
                Dashboard panel
              </span>
              <span className="flex items-center gap-2 text-xs text-themed-dim">
                {telemetry.riskIndex.toFixed(1)} risk &middot; {telemetry.waterLevel.toFixed(1)}m
                <motion.span animate={{ rotate: mobilePanelOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </motion.span>
              </span>
            </button>

            <AnimatePresence initial={false}>
              {mobilePanelOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden lg:!hidden"
                >
                  <div className="space-y-4 pt-2">
                    <PanelContent
                      token={token}
                      role={role}
                      telemetry={telemetry}
                      onLogin={login}
                      onEndSession={() => { setToken(undefined); setNotice("Session ended."); }}
                      onRoleChange={setRole}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className={`hidden space-y-4 lg:block`}>
              <PanelContent
                token={token}
                role={role}
                telemetry={telemetry}
                onLogin={login}
                onEndSession={() => { setToken(undefined); setNotice("Session ended."); }}
                onRoleChange={setRole}
              />
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

          <nav className="glass fixed bottom-2 left-2 right-2 z-50 xl:hidden mx-auto max-w-[1900px] rounded-2xl px-1.5 py-1">
            <div className="flex items-center justify-around">
              {bottomNav.map((item) => {
                const Icon = item.icon;
                const selected = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setView(item.id)}
                    className={`relative flex flex-col items-center gap-0.5 py-1.5 px-2 min-w-0 transition ${
                      selected ? "text-cyan" : "text-themed-dim"
                    }`}
                  >
                    {selected && (
                      <motion.div
                        layoutId="bottom-indicator"
                        className="absolute -top-1 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full bg-cyan"
                      />
                    )}
                    <Icon size={20} />
                    <span className={`text-[10px] font-medium ${selected ? "font-semibold" : ""}`}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        <AIAssistant
          token={token}
          onNavigate={(view, projectId) => {
            setView(view);
            if (projectId) setActiveProjectId(projectId);
          }}
        />
      </div>

      <AnimatePresence>
        {panel && (
          <UtilityPanel
            type={panel}
            onClose={() => setPanel(null)}
            onApply={(message) => {
              setNotice(message);
              setPanel(null);
            }}
            voiceEnabled={voiceListening}
            onVoiceToggle={toggleVoice}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modalContent && (
          <ModalPopup
            title={modalContent.title}
            message={modalContent.message}
            onClose={() => setModalContent(null)}
          />
        )}
      </AnimatePresence>

      <ToastContainer />
    </main>
  );
}

function PanelContent({
  token, role, telemetry, onLogin, onEndSession, onRoleChange,
}: {
  token?: string;
  role: UserRole;
  telemetry: { riskIndex: number; waterLevel: number; seismicMagnitude: number; airQuality: number };
  onLogin: () => void;
  onEndSession: () => void;
  onRoleChange: (r: UserRole) => void;
}) {
  return (
    <>
      {!token ? (
        <AuthPanel selectedRole={role} onRoleChange={onRoleChange} onLogin={onLogin} />
      ) : (
        <div className="glass rounded-xl p-4 md:p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan/12 text-cyan shrink-0">
              <Shield size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase font-semibold text-cyan/80">Secure access</p>
              <h3 className="font-semibold text-base md:text-lg truncate">Session Active</h3>
            </div>
          </div>
          <p className="mt-4 text-sm text-themed">
            Authenticated as <span className="font-semibold">{role.replace("_", " ")}</span>
          </p>
          <button
            onClick={onEndSession}
            className="mt-4 w-full rounded-xl border-themed bg-subtle py-2.5 text-sm text-themed hover:bg-hover transition"
          >
            End session
          </button>
        </div>
      )}
      <section className="glass rounded-xl p-4 md:p-5">
        <div className="mb-4 flex items-center gap-3">
          <Activity className="text-cyan shrink-0" size={20} />
          <h2 className="text-base md:text-lg font-semibold">Live telemetry</h2>
        </div>
        <div className="grid grid-cols-2 gap-2 md:gap-3 text-sm">
          <Telemetry label="Risk" value={`${telemetry.riskIndex.toFixed(1)}`} />
          <Telemetry label="Water m" value={`${telemetry.waterLevel.toFixed(1)}`} />
          <Telemetry label="Magnitude" value={`${telemetry.seismicMagnitude.toFixed(1)}`} />
          <Telemetry label="AQI" value={`${telemetry.airQuality.toFixed(0)}`} />
        </div>
      </section>
    </>
  );
}

function Telemetry({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border-themed bg-item p-3">
      <p className="text-xs text-themed-dim">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function ModalPopup({ title, message, onClose }: { title: string; message: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="glass rounded-2xl p-6 max-w-md w-full shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg bg-subtle hover:bg-hover transition">
            <X size={16} />
          </button>
        </div>
        <p className="text-sm text-themed leading-relaxed">{message}</p>
        <button
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-cyan py-2.5 text-sm font-semibold text-ink shadow-glow hover:bg-cyan/90 transition"
        >
          Got it
        </button>
      </motion.div>
    </motion.div>
  );
}

function UtilityPanel({
  type, onClose, onApply, voiceEnabled, onVoiceToggle,
}: {
  type: "filters" | "controls";
  onClose: () => void;
  onApply: (message: string) => void;
  voiceEnabled?: boolean;
  onVoiceToggle?: () => void;
}) {
  const [threshold, setThreshold] = useState(76);
  const [region, setRegion] = useState("Pune");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [voice, setVoice] = useState(voiceEnabled ?? false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm p-4 flex items-center justify-center"
    >
      <motion.section
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="glass rounded-2xl p-5 md:p-6 max-w-lg w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase font-semibold text-cyan/80">
              {type === "filters" ? "Data filters" : "Operations controls"}
            </p>
            <h2 className="text-lg md:text-xl font-bold">
              {type === "filters" ? "Refine dashboard data" : "Realtime settings"}
            </h2>
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-xl bg-subtle hover:bg-hover transition" title="Close panel">
            <X size={17} />
          </button>
        </div>

        <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
          {type === "filters" ? (
            <>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-themed">Region</span>
                <select
                  value={region}
                  onChange={(event) => setRegion(event.target.value)}
                  className="w-full rounded-xl border-themed bg-input p-3 outline-none focus:border-cyan/50 text-sm"
                >
                  <option>Pune</option>
                  <option>San Francisco</option>
                  <option>NSW</option>
                  <option>Gulf Coast</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-themed">
                  Minimum risk score: <span className="text-cyan font-semibold">{threshold}</span>
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={threshold}
                  onChange={(event) => setThreshold(Number(event.target.value))}
                  className="w-full"
                />
              </label>
            </>
          ) : (
            <>
              <label className="flex cursor-pointer items-center justify-between rounded-xl border-themed bg-subtle p-3.5">
                <span className="text-sm font-medium">Auto-refresh live telemetry</span>
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={() => setAutoRefresh((v) => !v)}
                  className="h-5 w-5 accent-cyan"
                />
              </label>
              <label className="flex cursor-pointer items-center justify-between rounded-xl border-themed bg-subtle p-3.5">
                <span className="flex items-center gap-2 text-sm font-medium">
                  Voice command standby
                  {voice && <span className="w-2 h-2 rounded-full bg-coral animate-pulse" />}
                </span>
                <input
                  type="checkbox"
                  checked={voice}
                  onChange={() => {
                    setVoice((v) => !v);
                    onVoiceToggle?.();
                  }}
                  className="h-5 w-5 accent-cyan"
                />
              </label>
            </>
          )}
        </div>

        <button
          onClick={() => {
            onApply(
              type === "filters"
                ? `Filters applied for ${region} with risk >= ${threshold}.`
                : `Controls updated: refresh ${autoRefresh ? "on" : "off"}, voice ${voice ? "on" : "off"}.`
            );
          }}
          className="mt-6 w-full rounded-xl bg-cyan py-3 text-sm font-semibold text-ink shadow-glow hover:bg-cyan/90 transition"
        >
          Apply
        </button>
      </motion.section>
    </motion.div>
  );
}
