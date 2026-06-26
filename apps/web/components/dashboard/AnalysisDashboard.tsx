"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Brain, Layers, Radar, Sparkles, Siren } from "lucide-react";
import { RiskChart } from "@/components/visualizations/RiskChart";
import { ResourceChart } from "@/components/visualizations/ResourceChart";
import { DigitalTwin } from "@/components/visualizations/DigitalTwin";
import { WeatherImpactChart } from "@/components/visualizations/WeatherImpactChart";
import { SentimentAnalysisChart } from "@/components/visualizations/SentimentAnalysisChart";
import { EvacuationFlowChart } from "@/components/visualizations/EvacuationFlowChart";
import { FinancialImpactChart } from "@/components/visualizations/FinancialImpactChart";
import { InfrastructureHealthChart } from "@/components/visualizations/InfrastructureHealthChart";
import { ResponseTimeChart } from "@/components/visualizations/ResponseTimeChart";
import { CasualtyProjectionChart } from "@/components/visualizations/CasualtyProjectionChart";
import { SupplyChainResilienceChart } from "@/components/visualizations/SupplyChainResilienceChart";
import { CommunicationCoverageChart } from "@/components/visualizations/CommunicationCoverageChart";
import { DisasterTimeline } from "@/components/dashboard/DisasterTimeline";
import { PredictionSimulator } from "@/components/dashboard/PredictionSimulator";
import { IncidentLogger } from "@/components/dashboard/IncidentLogger";
import { WeatherWidget } from "@/components/dashboard/WeatherWidget";

import { disasterEvents } from "@/lib/mock-data";

const DisasterMap = dynamic(() => import("@/components/visualizations/DisasterMap").then((mod) => mod.DisasterMap), { ssr: false });

export function AnalysisDashboard({ 
  activeView = "analysis", 
  onNotify, 
  activeProjectId, 
  setActiveProjectId 
}: { 
  activeView?: string; 
  onNotify?: (message: string) => void;
  activeProjectId?: string | null;
  setActiveProjectId?: (id: string | null) => void;
}) {
  const defaultEvent = activeProjectId ? disasterEvents.find(e => e.id === activeProjectId) : null;
  const [model, setModel] = useState(defaultEvent ? defaultEvent.type.charAt(0).toUpperCase() + defaultEvent.type.slice(1) : "Flood");
  const [layers, setLayers] = useState(["Sensors", "Satellite"]);
  const [territory, setTerritory] = useState(defaultEvent?.territory || "All");

  function handleProjectChange(projectId: string) {
    if (projectId === "") {
      setActiveProjectId?.(null);
      return;
    }
    setActiveProjectId?.(projectId);
    const ev = disasterEvents.find(e => e.id === projectId);
    if (ev) {
      const newModel = ev.type.charAt(0).toUpperCase() + ev.type.slice(1);
      setModel(newModel);
      if (ev.territory) setTerritory(ev.territory);
      onNotify?.(`Loaded analysis for ${ev.name}`);
    }
  }

  function toggleLayer(layer: string) {
    setLayers((current) => (current.includes(layer) ? current.filter((item) => item !== layer) : [...current, layer]));
    onNotify?.(`${layer} map layer toggled.`);
  }

  if (activeView === "map") {
    return (
      <div className="glass rounded-lg p-4 md:p-5 flex flex-col h-[calc(100dvh-8rem)] md:h-[calc(100vh-10rem)]">
        <div className="mb-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase text-cyan/80">GIS visualization</p>
              <h2 className="text-xl font-semibold">Live event map layers</h2>
            </div>
            <Layers className="text-cyan" size={22} />
          </div>
          <div className="flex flex-wrap items-center gap-3 bg-black/20 p-2 rounded-lg border border-white/10">
            <span className="text-xs font-semibold text-slate-400">Territory:</span>
            <div className="flex flex-wrap gap-1">
               {["All", "North India", "South India", "East India", "West India", "Central India", "Global"].map(t => (
                  <button key={t} onClick={() => setTerritory(t)} className={`px-2 py-1 text-xs rounded-md transition ${territory === t ? 'bg-cyan/20 text-cyan border border-cyan/30' : 'text-slate-400 border border-transparent hover:text-white hover:bg-white/[0.05]'}`}>{t}</button>
               ))}
            </div>
          </div>
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          {["Sensors", "Satellite", "Shelters", "Teams"].map((layer) => (
            <button key={layer} onClick={() => toggleLayer(layer)} className={`rounded-lg border px-3 py-2 text-xs ${layers.includes(layer) ? "border-cyan bg-cyan/15 text-cyan" : "border-white/10 bg-white/[0.055] text-slate-400"}`}>
              {layer}
            </button>
          ))}
        </div>
        <div className="flex-1 min-h-0 rounded-lg overflow-hidden border border-white/10 relative">
          <DisasterMap territory={territory} onSelectProject={setActiveProjectId || undefined} />
        </div>
      </div>
    );
  }

  const currentProject = activeProjectId ? disasterEvents.find(e => e.id === activeProjectId) : null;
  const currentProjectName = currentProject?.name ?? "Global Overview";

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 glass rounded-xl p-4 md:p-5 border border-white/10 shadow-lg backdrop-blur-md">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-cyan/90 mb-1">Project Context</p>
          <h2 className="text-xl font-bold text-white/90 drop-shadow-sm">Active Disaster Scope</h2>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select 
            value={activeProjectId || ""} 
            onChange={(e) => handleProjectChange(e.target.value)}
            className="rounded-lg border border-white/10 bg-black/40 p-2 text-sm text-slate-200 outline-none focus:border-cyan/50 min-w-[180px] md:min-w-[250px] shadow-inner transition hover:border-white/20"
          >
            <option value="">-- Global Overview --</option>
            {disasterEvents.map(event => (
              <option key={event.id} value={event.id}>{event.name}</option>
            ))}
          </select>
          <IncidentLogger />
        </div>
      </div>

      <section key={`top-${activeProjectId}`} className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="glass rounded-xl p-4 md:p-6 border border-white/10 shadow-xl backdrop-blur-md">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-cyan/90 mb-1">Predictive analytics</p>
              <h2 className="text-lg md:text-xl font-bold text-white/90">Risk trajectories</h2>
            </div>
            <div className="grid h-8 w-8 place-items-center rounded bg-cyan/15">
              <Radar className="text-cyan animate-pulse" size={18} />
            </div>
          </div>
          <div className="mb-4 flex flex-wrap gap-2">
            {["Flood", "Earthquake", "Wildfire", "Hurricane"].map((item) => (
              <button key={item} onClick={() => setModel(item)} className={`rounded-lg border px-3 py-2 text-xs ${model === item ? "border-cyan bg-cyan text-ink" : "border-white/10 bg-white/[0.055] text-slate-300"}`}>
                {item}
              </button>
            ))}
          </div>
          <RiskChart model={model} />
          <p className="mt-4 text-xs text-slate-300 leading-relaxed bg-black/20 p-3 rounded-lg border border-white/5">
            <strong>Summary:</strong> The risk trajectory for {currentProjectName} ({model} model) shows real-time fluctuations based on predictive telemetry. The chart highlights the expected escalation or de-escalation of the threat over the next 24 hours.
          </p>
        </div>
        <div className="space-y-5">
          {currentProject && <PredictionSimulator event={currentProject} />}
          <div className="glass rounded-xl p-4 md:p-6 border border-amber/20 shadow-[0_0_30px_rgba(245,158,11,0.05)] backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber/50 to-transparent opacity-50" />
            <div className="mb-4 flex items-center gap-3">
              <div className="grid h-8 w-8 place-items-center rounded bg-amber/15">
                <Brain className="text-amber animate-pulse" size={18} />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-white/90">AI insight panel</h2>
            </div>
            <div className="space-y-3 text-sm leading-6 text-slate-300">
              <p className="rounded-lg border border-cyan/20 bg-cyan/10 p-3">
                {model} risk is being analyzed with live sensor, satellite, weather, and social signals. Pune flood mode currently shows the highest operational confidence.
              </p>
              <p className="rounded-lg border border-amber/20 bg-amber/10 p-3">
                Recommend opening shelters west of Aundh and staging medical kits near two low-congestion bridges.
              </p>
              <p className="rounded-lg border border-coral/20 bg-coral/10 p-3">
                Anomaly detector flagged one sensor cluster as drifting. Confidence remains 0.84 after satellite confirmation.
              </p>
            </div>
            <button onClick={() => onNotify?.(`${model} insight sent to reports workspace.`)} className="mt-4 rounded-lg bg-cyan px-4 py-2 text-sm font-semibold text-ink">Send to report</button>
          </div>
        </div>
      </section>

      <section key={`mid-${activeProjectId}`} className="grid gap-5 xl:grid-cols-[1fr_0.85fr]">
        <div className="glass rounded-xl p-4 md:p-6 border border-white/10 shadow-xl backdrop-blur-md">
          <div className="mb-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-cyan/90 mb-1">GIS visualization</p>
                <h2 className="text-lg md:text-xl font-bold text-white/90">Live event map layers</h2>
              </div>
              <div className="grid h-8 w-8 place-items-center rounded bg-cyan/15">
                <Layers className="text-cyan" size={18} />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 bg-black/20 p-2 rounded-lg border border-white/10">
              <span className="text-xs font-semibold text-slate-400">Territory:</span>
              <div className="flex flex-wrap gap-1">
                 {["All", "North India", "South India", "East India", "West India", "Central India", "Global"].map(t => (
                    <button key={t} onClick={() => setTerritory(t)} className={`px-2 py-1 text-xs rounded-md transition ${territory === t ? 'bg-cyan/20 text-cyan border border-cyan/30' : 'text-slate-400 border border-transparent hover:text-white hover:bg-white/[0.05]'}`}>{t}</button>
                 ))}
              </div>
            </div>
          </div>
          <div className="mb-4 flex flex-wrap gap-2">
            {["Sensors", "Satellite", "Shelters", "Teams"].map((layer) => (
              <button key={layer} onClick={() => toggleLayer(layer)} className={`rounded-lg border px-3 py-2 text-xs ${layers.includes(layer) ? "border-cyan bg-cyan/15 text-cyan" : "border-white/10 bg-white/[0.055] text-slate-400"}`}>
                {layer}
              </button>
            ))}
          </div>
          <DisasterMap territory={territory} onSelectProject={setActiveProjectId || undefined} />
        </div>
        <div className="space-y-5">
          <div className="glass rounded-xl p-4 md:p-6 border border-white/10 shadow-xl backdrop-blur-md">
            <div className="mb-4 flex items-center gap-3">
              <div className="grid h-8 w-8 place-items-center rounded bg-cyan/15 shrink-0">
                <Sparkles className="text-cyan animate-pulse" size={18} />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-white/90">Resource optimization</h2>
            </div>
            <ResourceChart model={model} />
            <p className="mt-4 text-xs text-slate-300 leading-relaxed bg-black/20 p-3 rounded-lg border border-white/5">
              <strong>Summary:</strong> Visualizes the gap between requested vs. assigned resources for {currentProjectName}. Optimize supply chains immediately for unfulfilled requests.
            </p>
          </div>
          <WeatherWidget lat={currentProject?.lat ?? 18.5204} lng={currentProject?.lng ?? 73.8567} location={currentProject?.location ?? "Pune, India"} />
          <div className="glass rounded-xl p-4 md:p-6 border border-white/10 shadow-xl backdrop-blur-md">
            <h2 className="mb-4 text-lg md:text-xl font-bold text-white/90">Digital twin</h2>
            <DigitalTwin />
          </div>
        </div>
      </section>

      <div className="mb-4 flex items-center gap-3 pt-6">
        <Radar className="text-cyan" size={22} />
        <h2 className="text-xl font-semibold">Extended Analytical Reports</h2>
      </div>
      <section key={`bot-${activeProjectId}`} className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col">
          <WeatherImpactChart model={model} />
          <p className="mt-3 text-xs text-slate-400 bg-black/20 p-3 rounded-lg border border-white/5"><strong>Summary:</strong> Environmental severity progression for {currentProjectName}. Displays intensity vs spread radius over a 5-day forecast.</p>
        </div>
        <div className="flex flex-col">
          <SentimentAnalysisChart model={model} />
          <p className="mt-3 text-xs text-slate-400 bg-black/20 p-3 rounded-lg border border-white/5"><strong>Summary:</strong> Social distress signals mapping public panic levels in the {currentProjectName} area to help prioritize comms.</p>
        </div>
        <div className="flex flex-col">
          <EvacuationFlowChart model={model} />
          <p className="mt-3 text-xs text-slate-400 bg-black/20 p-3 rounded-lg border border-white/5"><strong>Summary:</strong> Tracks population evacuation rate against safe route capacities over time for {currentProjectName}.</p>
        </div>
        <div className="flex flex-col">
          <FinancialImpactChart model={model} />
          <p className="mt-3 text-xs text-slate-400 bg-black/20 p-3 rounded-lg border border-white/5"><strong>Summary:</strong> Estimated cumulative economic damage ($M) versus incoming relief funds tailored for {currentProjectName}.</p>
        </div>
        <div className="flex flex-col">
          <InfrastructureHealthChart model={model} />
          <p className="mt-3 text-xs text-slate-400 bg-black/20 p-3 rounded-lg border border-white/5"><strong>Summary:</strong> Current operational percentage of critical lifelines (hospitals, power, roads) in the {currentProjectName} zone.</p>
        </div>
        <div className="flex flex-col">
          <ResponseTimeChart model={model} />
          <p className="mt-3 text-xs text-slate-400 bg-black/20 p-3 rounded-lg border border-white/5"><strong>Summary:</strong> Average dispatch-to-arrival delays for emergency services operating within {currentProjectName}.</p>
        </div>
        <div className="flex flex-col">
          <CasualtyProjectionChart model={model} />
          <p className="mt-3 text-xs text-slate-400 bg-black/20 p-3 rounded-lg border border-white/5"><strong>Summary:</strong> Estimated vs projected casualties and displacement figures for {currentProjectName}.</p>
        </div>
        <div className="flex flex-col">
          <SupplyChainResilienceChart model={model} />
          <p className="mt-3 text-xs text-slate-400 bg-black/20 p-3 rounded-lg border border-white/5"><strong>Summary:</strong> Current supply chain stock levels against minimum thresholds for {currentProjectName}.</p>
        </div>
        <div className="flex flex-col">
          <CommunicationCoverageChart model={model} />
          <p className="mt-3 text-xs text-slate-400 bg-black/20 p-3 rounded-lg border border-white/5"><strong>Summary:</strong> Communication infrastructure coverage by channel type in the {currentProjectName} zone.</p>
        </div>
      </section>
      
      {currentProject && (
        <section key={`timeline-${activeProjectId}`}>
          <DisasterTimeline event={currentProject} />
        </section>
      )}
    </div>
  );
}
