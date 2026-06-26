"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Plus, Siren, X } from "lucide-react";
import { notify } from "@/components/dashboard/Toast";
import type { DisasterType } from "@/lib/types";

type IncidentForm = {
  type: DisasterType;
  name: string;
  location: string;
  lat: string;
  lng: string;
  severity: number;
  description: string;
};

const initialForm: IncidentForm = {
  type: "flood",
  name: "",
  location: "",
  lat: "18.5204",
  lng: "73.8567",
  severity: 50,
  description: "",
};

export function IncidentLogger() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<IncidentForm>(initialForm);

  function reset() {
    setForm(initialForm);
    setOpen(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    notify({
      type: "success",
      title: "Incident Logged",
      message: `${form.type}: ${form.name} at ${form.location}`,
    });
    reset();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-coral px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-coral/90 transition"
      >
        <Plus size={16} />
        Log Incident
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/55 p-3 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              className="glass mx-auto mt-8 max-w-lg rounded-xl p-5"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Siren className="text-coral" size={22} />
                  <h2 className="text-xl font-semibold">Log New Incident</h2>
                </div>
                <button onClick={reset} className="grid h-10 w-10 place-items-center rounded-lg bg-white/[0.08]"><X size={18} /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="mb-1 block text-xs text-slate-400">Type</span>
                    <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as DisasterType })}
                      className="w-full rounded-lg border border-white/10 bg-black/25 p-2.5 text-sm outline-none focus:border-cyan/50">
                      <option value="flood">Flood</option>
                      <option value="earthquake">Earthquake</option>
                      <option value="wildfire">Wildfire</option>
                      <option value="hurricane">Hurricane</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs text-slate-400">Severity</span>
                    <input type="range" min="0" max="100" value={form.severity} onChange={(e) => setForm({ ...form, severity: Number(e.target.value) })}
                      className="w-full accent-coral mt-3" />
                  </label>
                </div>

                <label className="block">
                  <span className="mb-1 block text-xs text-slate-400">Incident Name</span>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-black/25 p-2.5 text-sm outline-none focus:border-cyan/50" placeholder="e.g. Mumbai Coastal Flooding" />
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs text-slate-400">Location</span>
                  <div className="flex gap-2">
                    <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="flex-1 rounded-lg border border-white/10 bg-black/25 p-2.5 text-sm outline-none focus:border-cyan/50" placeholder="City, Region" />
                    <span className="flex items-center gap-1 text-xs text-slate-400"><MapPin size={12} /> {form.lat}, {form.lng}</span>
                  </div>
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs text-slate-400">Description</span>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="min-h-24 w-full rounded-lg border border-white/10 bg-black/25 p-2.5 text-sm outline-none focus:border-cyan/50" placeholder="Situation details..." />
                </label>

                <button type="submit" className="w-full rounded-lg bg-coral py-3 text-sm font-semibold text-white shadow-lg hover:bg-coral/90 transition">
                  Log Incident
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
