"use client";

import { useState } from "react";
import { Ambulance, MessageSquare, Route, SendHorizonal, Siren, Warehouse } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const responseCapabilities: Array<[string, string, LucideIcon]> = [
  ["Evacuation planning", "12 routes active, 3 routes blocked", Route],
  ["Shelter allocation", "2,840 beds assigned, 260 buffer", Warehouse],
  ["Medical rescue", "18 ambulances staged near impact core", Ambulance],
  ["Team chat", "4 channels with field confirmation", MessageSquare]
];

const tabData: Record<string, { recommendations: Array<[string, string, string]> }> = {
  "Evacuation planning": {
    recommendations: [
      ["Priority 1", "Move rescue boats from north depot to Sangamwadi staging point within 18 minutes.", "critical"],
      ["Priority 2", "Broadcast evacuation notice for wards in the 22 km projected flood radius.", "watch"],
      ["Priority 3", "Send drone recon to validate satellite flood mask around low-visibility bridges.", "stable"]
    ]
  },
  "Shelter allocation": {
    recommendations: [
      ["Priority 1", "Activate backup shelter at Central High School due to capacity overflow at Main Camp.", "critical"],
      ["Priority 2", "Dispatch 500 emergency rations and water supply to Shelter B.", "watch"],
      ["Priority 3", "Request additional 100 cots from regional logistics hub.", "stable"]
    ]
  },
  "Medical rescue": {
    recommendations: [
      ["Priority 1", "Deploy medevac helicopter to Zone 3 (isolated by floodwaters).", "critical"],
      ["Priority 2", "Restock Ambulances 4 and 7 with advanced trauma life support kits.", "watch"],
      ["Priority 3", "Setup field triage tent near the secondary impact zone perimeter.", "stable"]
    ]
  },
  "Team chat": {
    recommendations: [
      ["Alert", "Field Team Alpha requires immediate comms link refresh.", "critical"],
      ["Update", "Medical channel integration with local hospital network completed.", "stable"],
      ["Status", "Logistics channel active. Awaiting daily supply manifest.", "watch"]
    ]
  }
};

const initialChatContent: Record<string, string[]> = {
  "Evacuation planning": ["Ops: Flood route Alpha is open.", "Field: Traffic diverted from Bridge 3."],
  "Shelter allocation": ["Logistics: Main camp is at 95% capacity.", "Ops: Backup shelter activation authorized."],
  "Medical rescue": ["Med-1: Approaching Zone 3.", "Ops: Helicopter inbound in 5 mins."],
  "Team chat": ["Sys: All channels active.", "Ops: Comms check completed."]
};

export function ResponseWorkspace({ onNotify }: { onNotify?: (message: string) => void }) {
  const [activeTab, setActiveTab] = useState<string>(responseCapabilities[0][0]);
  const [accepted, setAccepted] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [chatContent, setChatContent] = useState<Record<string, string[]>>(initialChatContent);
  const [deploying, setDeploying] = useState<string | null>(null);

  function accept(label: string) {
    setAccepted((current) => (current.includes(label) ? current : [...current, label]));
    onNotify?.(`${label} recommendation accepted. Deploying assets...`);
  }

  function handleDeploy(asset: string) {
    setDeploying(asset);
    onNotify?.(`Initializing deployment for ${asset}...`);
    setTimeout(() => {
      setDeploying(null);
      onNotify?.(`${asset} successfully deployed to active incident zone.`);
    }, 1500);
  }

  function sendMessage() {
    if (!message.trim()) return;
    setChatContent((current) => ({
      ...current,
      [activeTab]: [...(current[activeTab] || []), `You: ${message.trim()}`]
    }));
    setMessage("");
    onNotify?.("Team collaboration message added.");
  }

  const activeData = tabData[activeTab];
  const activeChat = chatContent[activeTab] || [];

  return (
    <section className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
      <div className="glass rounded-lg p-5">
        <div className="mb-4 flex items-center gap-3">
          <Siren className="text-coral" size={22} />
          <h2 className="text-xl font-semibold">Emergency response coordination</h2>
        </div>
        <div className="space-y-3">
          {responseCapabilities.map(([title, body, Icon]) => {
            const isActive = activeTab === title;
            return (
              <button 
                key={title} 
                onClick={() => {
                  setActiveTab(title);
                  onNotify?.(`${title} opened.`);
                }} 
                className={`w-full rounded-lg border p-4 text-left transition ${isActive ? "border-cyan bg-cyan/10" : "border-white/10 bg-black/20 hover:border-cyan/40"}`}
              >
                <Icon className={`mb-3 ${isActive ? "text-cyan" : "text-slate-400"}`} size={22} />
                <p className={`font-semibold ${isActive ? "text-cyan" : ""}`}>{title}</p>
                <p className={`mt-1 text-sm ${isActive ? "text-cyan/70" : "text-slate-400"}`}>{body}</p>
              </button>
            );
          })}
        </div>
      </div>
      <div className="glass rounded-lg p-5 flex flex-col min-h-0">
        <h2 className="mb-4 text-xl font-semibold">{activeTab} - Decision engine</h2>
        <div className="space-y-4 flex-1">
          {activeData.recommendations.map(([label, body, tone]) => (
            <div key={label} className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
              <span className={`rounded-lg px-2 py-1 text-xs ${tone === "critical" ? "bg-coral/15 text-coral" : tone === "watch" ? "bg-amber/15 text-amber" : "bg-moss/15 text-moss"}`}>
                {label}
              </span>
              <p className="mt-3 text-sm leading-6 text-slate-300">{body}</p>
              <button onClick={() => accept(`${activeTab}-${label}`)} className={`mt-3 rounded-lg px-3 py-2 text-xs font-semibold ${accepted.includes(`${activeTab}-${label}`) ? "bg-moss text-ink" : "bg-cyan text-ink"}`}>
                {accepted.includes(`${activeTab}-${label}`) ? "Accepted" : "Accept recommendation"}
              </button>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-lg border border-white/10 bg-black/20 p-4">
          <div className="mb-3 flex items-center gap-2">
            <MessageSquare className="text-cyan" size={18} />
            <p className="font-semibold">{activeTab} chat</p>
          </div>
          <div className="mb-3 space-y-2 h-32 overflow-y-auto thin-scrollbar pr-2">
            {activeChat.map((line, i) => (
              <p key={i} className="rounded-lg bg-white/[0.055] p-2 text-sm text-slate-300">{line}</p>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} className="min-w-0 flex-1 rounded-lg border border-white/10 bg-black/25 px-3 text-sm outline-none focus:border-cyan/50" placeholder="Send update to response team" />
            <button onClick={sendMessage} className="grid h-10 w-10 place-items-center rounded-lg bg-cyan text-ink flex-shrink-0 hover:bg-cyan/90 transition" title="Send team update">
              <SendHorizonal size={17} />
            </button>
          </div>
        </div>

        {/* New Deploy Assets Panel */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-lg border border-white/10 bg-black/20 p-4 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-coral to-amber" />
             <h3 className="text-sm font-semibold mb-3">Live Asset Tracker</h3>
             <div className="space-y-2">
                <div className="flex items-center justify-between text-xs p-2 rounded bg-white/5 border border-white/10">
                   <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan animate-pulse"/> Drone Recon Alpha</span>
                   <span className="text-cyan">En Route (2m)</span>
                </div>
                <div className="flex items-center justify-between text-xs p-2 rounded bg-white/5 border border-white/10">
                   <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-coral animate-pulse"/> Medevac Chopper 1</span>
                   <span className="text-coral">On Scene</span>
                </div>
                <div className="flex items-center justify-between text-xs p-2 rounded bg-white/5 border border-white/10">
                   <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-moss"/> Relief Convoy</span>
                   <span className="text-moss">Staged</span>
                </div>
             </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/20 p-4 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan to-blue-500" />
             <h3 className="text-sm font-semibold mb-3">Quick Deploy</h3>
             <div className="grid grid-cols-2 gap-2">
                {["Heavy Rescue Unit", "Medical Supplies", "Water Pumps", "Sandbags"].map(asset => (
                   <button 
                     key={asset} 
                     onClick={() => handleDeploy(asset)}
                     disabled={deploying === asset}
                     className="text-xs p-2 rounded-lg border border-white/10 bg-white/5 hover:border-cyan/40 hover:bg-white/10 transition disabled:opacity-50 text-left truncate"
                   >
                     {deploying === asset ? "Deploying..." : asset}
                   </button>
                ))}
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
