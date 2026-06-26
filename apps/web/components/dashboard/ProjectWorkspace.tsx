"use client";

import { useState } from "react";
import { CheckCircle2, GitBranch, LineChart, Network, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { disasterEvents } from "@/lib/mock-data";

const tabs = ["Overview", "Methodology", "Team Management", "Data Collection", "Timeline"];

export function ProjectWorkspace({ 
  onNotify,
  activeProjectId,
  setActiveProjectId
}: { 
  onNotify?: (message: string) => void;
  activeProjectId?: string | null;
  setActiveProjectId?: (id: string | null) => void;
}) {
  const currentProject = activeProjectId ? disasterEvents.find(e => e.id === activeProjectId) : disasterEvents[0];
  const [tab, setTab] = useState(tabs[0]);
  const [milestones, setMilestones] = useState([
    ["Ingestion", "0%", "26%"],
    ["Feature engineering", "20%", "44%"],
    ["Model evaluation", "45%", "28%"],
    ["Response simulation", "63%", "22%"],
    ["Publication draft", "78%", "16%"]
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  function createMilestone() {
    setIsGenerating(true);
    onNotify?.("Generating automated milestone report based on current data...");
    
    setTimeout(() => {
      setIsGenerating(false);
      setMilestones((current) => [...current, [`Field validation ${current.length - 4}`, "84%", "12%"]]);
      setHasGenerated(true);
      setTab("Timeline");
      onNotify?.("New milestone and milestone reports generated successfully.");
    }, 2000);
  }

  return (
    <div className="relative">
      {/* Extraordinary Glowing Background Orbs */}
      <div className="absolute top-0 left-1/4 h-96 w-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-cyan/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 h-64 w-64 translate-y-1/2 rounded-full bg-coral/10 blur-[100px] pointer-events-none" />

      <section className="glass rounded-xl p-4 md:p-6 border border-white/10 shadow-2xl relative z-10 backdrop-blur-md overflow-hidden">
        {/* Subtle inner top glow */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan/50 to-transparent opacity-50" />
        
        <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <p className="text-xs font-bold uppercase tracking-widest text-cyan/90 bg-cyan/10 px-2 py-1 rounded">Project Workspace</p>
              <select 
                value={currentProject?.id || ""} 
                onChange={(e) => setActiveProjectId?.(e.target.value)}
                className="rounded-lg border border-white/10 bg-black/40 p-1.5 text-xs text-slate-200 outline-none focus:border-cyan/50 focus:ring-1 focus:ring-cyan/50 transition"
              >
                {disasterEvents.map(event => (
                  <option key={event.id} value={event.id}>{event.name}</option>
                ))}
              </select>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentProject?.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                  <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white/90 drop-shadow-sm">
                  {currentProject?.name}
                </h2>
                <div className="mt-3 flex items-center gap-3 text-sm text-slate-300">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan animate-pulse"/> {currentProject?.status}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-600" />
                  <span>{currentProject?.location}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-600" />
                  <span className="text-coral font-semibold">Risk: {currentProject?.riskScore}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <button 
            onClick={createMilestone} 
            disabled={isGenerating}
            className="group relative overflow-hidden rounded-lg bg-cyan px-6 py-3 text-sm font-bold text-ink shadow-[0_0_20px_rgba(80,227,214,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative flex items-center gap-2">
              {isGenerating ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                  Synthesizing...
                </>
              ) : (
                "Generate Milestone"
              )}
            </span>
          </button>
        </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button key={item} onClick={() => setTab(item)} className="relative rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-200 hover:bg-white/[0.08]">
            {tab === item ? <motion.span layoutId="project-tab" className="absolute inset-0 rounded-lg bg-cyan/[0.14] ring-1 ring-cyan/40" /> : null}
            <span className="relative">{item}</span>
          </button>
        ))}
      </div>

      {tab === "Overview" ? <Overview project={currentProject!} /> : null}
      {tab === "Methodology" ? <Methodology project={currentProject!} /> : null}
      {tab === "Team Management" ? <Team onNotify={onNotify} /> : null}
      {tab === "Data Collection" ? <Collection project={currentProject!} onNotify={onNotify} /> : null}
      {tab === "Timeline" ? (
        <div className="space-y-8">
          <Timeline rows={milestones} />
          {hasGenerated && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-4 border-t border-white/10">
              <h3 className="mb-4 text-lg font-semibold">Milestone Report Analysis</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-white/10 bg-black/20 p-4">
                  <h4 className="mb-3 text-sm font-semibold text-cyan">Velocity Tracking</h4>
                  <div className="flex h-32 items-end gap-2">
                    {[30, 45, 60, 40, 75, 85].map((h, i) => (
                      <div key={i} className="w-full rounded-t-sm bg-cyan/80 transition-all hover:bg-cyan" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-slate-400">
                    <span>Phase 1</span>
                    <span>Current</span>
                  </div>
                </div>
                <div className="rounded-lg border border-white/10 bg-black/20 p-4">
                  <h4 className="mb-3 text-sm font-semibold text-amber">Burn-down Chart</h4>
                  <div className="relative flex h-32 items-end">
                    <svg className="h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                      <path d="M0,10 L20,30 L40,25 L60,50 L80,70 L100,90" fill="none" stroke="#f59e0b" strokeWidth="2" />
                      <path d="M0,0 L100,100" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 4" />
                    </svg>
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-slate-400">
                    <span>Start</span>
                    <span>Deadline</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      ) : null}
      </section>
    </div>
  );
}

function Overview({ project }: { project: any }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {[
        ["Hypothesis", `Multi-source fusion improves ${project.type.toLowerCase()} detection lead time by 34 percent in ${project.location}.`],
        ["Coverage", `Monitoring ${Math.floor(project.radiusKm * 1.5)} zones, ${Math.floor(project.riskScore * 5)} sensors, 8 satellite passes, 1.8M social posts.`],
        ["Outcome", `Operational dashboard, report draft, ${project.status} response recommendations.`]
      ].map(([title, body]) => (
        <div key={title} className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
          <p className="mb-2 text-sm font-semibold text-cyan">{title}</p>
          <p className="text-sm leading-6 text-slate-300">{body}</p>
        </div>
      ))}
    </div>
  );
}

function Methodology({ project }: { project: any }) {
  return (
    <div className="grid gap-4 lg:grid-cols-4">
      {[
        { icon: Network, title: "Data fusion", body: `Normalize IoT, weather, and satellite records for ${project.type} event timelines.` },
        { icon: LineChart, title: "Forecasting", body: `Run risk scoring for a ${project.radiusKm}km impact radius prediction.` },
        { icon: GitBranch, title: "Decision graph", body: "Route incidents through LangChain-ready responder workflows." },
        { icon: CheckCircle2, title: "Validation", body: `Compare AI confidence with field reports from ${project.location}.` }
      ].map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.title} className="rounded-lg border border-white/10 bg-black/20 p-4">
            <Icon className="mb-3 text-amber" size={22} />
            <p className="font-semibold">{item.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">{item.body}</p>
          </div>
        );
      })}
    </div>
  );
}

function Team({ onNotify }: { onNotify?: (message: string) => void }) {
  const team = ["Principal investigator", "Hydrologist", "GIS analyst", "Emergency coordinator", "ML engineer", "Field supervisor"];
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {team.map((member, index) => (
        <button key={member} onClick={() => onNotify?.(`${member} assigned to the active incident room.`)} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.055] p-4 text-left hover:border-cyan/40">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-cyan/15 text-cyan">
            <Users size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold">{member}</p>
            <p className="text-xs text-slate-400">{index % 2 === 0 ? "On call" : "Research track"}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

function Collection({ project, onNotify }: { project: any, onNotify?: (message: string) => void }) {
  const sources = [
    project.type === "Flood" ? "IoT water gauges" : project.type === "Earthquake" ? "Seismic sensors" : "Thermal satellites", 
    "Weather API", 
    "Sentinel-2 imagery", 
    `${project.location} safety hotline`, 
    "Social stream", 
    "Municipal shelters"
  ];
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {sources.map((source, index) => {
        const quality = 88 - index * 5 + Math.floor(project.riskScore % 10);
        return (
          <button key={source} onClick={() => onNotify?.(`${source} validation opened.`)} className="rounded-lg border border-white/10 bg-black/20 p-4 text-left hover:border-cyan/40">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-semibold">{source}</p>
              <span className="text-xs text-cyan">{quality}% quality</span>
            </div>
            <div className="h-2 rounded-full bg-white/[0.08]">
              <div className="h-full rounded-full bg-cyan" style={{ width: `${quality}%` }} />
            </div>
          </button>
        );
      })}
    </div>
  );
}

function Timeline({ rows }: { rows: string[][] }) {
  return (
    <div className="space-y-4">
      {rows.map(([label, left, width]) => (
          <div key={label} className="grid grid-cols-[7rem_1fr] md:grid-cols-[9rem_1fr] items-center gap-2 md:gap-3">
          <p className="text-sm text-slate-300">{label}</p>
          <div className="relative h-8 rounded-lg bg-white/[0.08]">
            <div className="absolute top-1 h-6 rounded-lg bg-cyan/70" style={{ left, width }} />
          </div>
        </div>
      ))}
    </div>
  );
}
