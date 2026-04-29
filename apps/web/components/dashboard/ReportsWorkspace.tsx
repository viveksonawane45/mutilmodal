"use client";

import { useState } from "react";
import { Check, FileCheck2, PenLine, Share2 } from "lucide-react";

const checks = ["Methodology reviewed", "Data lineage attached", "Bias and confidence noted", "Emergency manager sign-off", "Publication formatting complete"];

export function ReportsWorkspace({ onNotify }: { onNotify?: (message: string) => void }) {
  const [title, setTitle] = useState("Regional Flood Resilience Study: Situation Brief");
  const [body, setBody] = useState(
    "The current multimodal assessment indicates elevated flood risk across low-lying Pune wards. IoT gauges show rapid river-level rise, satellite-derived water indices confirm surface expansion, and social channels report localized road closures.\n\nRecommended actions include staged evacuation, resource pre-positioning, shelter balancing, and continuous anomaly review for drifting sensors."
  );
  const [checked, setChecked] = useState([true, true, true, false, false]);

  function generateReport() {
    setTitle("AI Generated Flood Operations Brief");
    setBody(
      "Executive summary: Flood risk in Pune remains high with cross-confirmed IoT, weather, social, and satellite evidence. Confidence is strongest for water-level acceleration and shelter demand.\n\nRecommended actions: open west-side shelters, stage rescue boats near low-congestion access points, validate drifting gauges, and publish a public update with uncertainty notes."
    );
    setChecked([true, true, true, true, false]);
    onNotify?.("AI report generated and QA checklist updated.");
  }

  return (
    <section className="grid gap-5 xl:grid-cols-[1fr_0.7fr]">
      <div className="glass rounded-lg p-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase text-cyan/80">Reports and publications</p>
            <h2 className="text-2xl font-semibold">AI-assisted incident report</h2>
          </div>
          <button onClick={generateReport} className="flex items-center gap-2 rounded-lg bg-cyan px-4 py-3 text-sm font-semibold text-ink shadow-glow">
            <FileCheck2 size={18} />
            Generate
          </button>
        </div>
        <div className="min-h-96 rounded-lg border border-white/10 bg-black/20 p-5">
          <div className="mb-4 flex items-center gap-2 text-slate-300">
            <PenLine size={18} className="text-cyan" />
            <span className="text-sm">Collaborative editor</span>
          </div>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/[0.055] px-3 py-3 text-xl font-semibold outline-none focus:border-cyan/50"
          />
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            className="mt-4 min-h-72 w-full resize-y rounded-lg border border-white/10 bg-white/[0.055] p-4 leading-7 text-slate-300 outline-none focus:border-cyan/50"
          />
        </div>
      </div>

      <aside className="glass rounded-lg p-5">
        <div className="mb-5 flex items-center gap-3">
          <Share2 className="text-amber" size={22} />
          <h2 className="text-xl font-semibold">QA checklist</h2>
        </div>
        <div className="space-y-3">
          {checks.map((check, index) => (
            <label key={check} className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-white/[0.055] p-3">
              <input
                type="checkbox"
                checked={checked[index]}
                onChange={() => setChecked((current) => current.map((value, itemIndex) => (itemIndex === index ? !value : value)))}
                className="sr-only"
              />
              <span className={`grid h-6 w-6 place-items-center rounded-md ${checked[index] ? "bg-cyan text-ink" : "bg-white/[0.08] text-slate-400"}`}>
                {checked[index] ? <Check size={15} /> : null}
              </span>
              <span className="text-sm text-slate-300">{check}</span>
            </label>
          ))}
        </div>
      </aside>
    </section>
  );
}
