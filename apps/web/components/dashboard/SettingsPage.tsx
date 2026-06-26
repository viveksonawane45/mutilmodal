"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, BellOff, Globe, Lock, Moon, Shield, Sun, Volume2, VolumeX } from "lucide-react";
import { useTheme } from "@/lib/theme-provider";

export function SettingsPage() {
  const { theme, toggle, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [mapLayer, setMapLayer] = useState("satellite");
  const [dataRetention, setDataRetention] = useState("90");

  const sections = [
    {
      title: "Appearance",
      icon: theme === "dark" ? Moon : Sun,
      content: (
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border-themed bg-subtle p-3">
            <div className="flex items-center gap-3">
              {theme === "dark" ? <Moon size={18} className="text-cyan" /> : <Sun size={18} className="text-amber" />}
              <div>
                <p className="text-sm font-medium">Theme Mode</p>
                <p className="text-xs text-themed-dim">{theme === "dark" ? "Dark mode active" : "Light mode active"}</p>
              </div>
            </div>
            <button onClick={toggle} className="relative h-7 w-12 rounded-full bg-cyan/30 transition">
              <div className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-cyan shadow-md transition-transform ${theme === "light" ? "translate-x-5" : ""}`} />
            </button>
          </div>
          <div className="flex items-center justify-between rounded-lg border-themed bg-subtle p-3">
            <div className="flex items-center gap-3">
              <Globe size={18} className="text-blue" />
              <div>
                <p className="text-sm font-medium">Map Layer Default</p>
                <p className="text-xs text-themed-dim">Default map visualization layer</p>
              </div>
            </div>
            <select value={mapLayer} onChange={(e) => setMapLayer(e.target.value)} className="rounded-lg border-themed bg-input px-3 py-1.5 text-sm outline-none">
              <option value="satellite">Satellite</option>
              <option value="terrain">Terrain</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </div>
      ),
    },
    {
      title: "Notifications",
      icon: notifications ? Bell : BellOff,
      content: (
        <div className="space-y-3">
          <label className="flex cursor-pointer items-center justify-between rounded-lg border-themed bg-subtle p-3">
            <div className="flex items-center gap-3">
              <Bell size={18} className={notifications ? "text-cyan" : "text-themed-dim"} />
              <div>
                <p className="text-sm font-medium">Push Notifications</p>
                <p className="text-xs text-themed-dim">Real-time alert notifications</p>
              </div>
            </div>
            <input type="checkbox" checked={notifications} onChange={() => setNotifications((v) => !v)} className="h-5 w-5 accent-cyan" />
          </label>
          <label className="flex cursor-pointer items-center justify-between rounded-lg border-themed bg-subtle p-3">
            <div className="flex items-center gap-3">
              {soundAlerts ? <Volume2 size={18} className="text-cyan" /> : <VolumeX size={18} className="text-themed-dim" />}
              <div>
                <p className="text-sm font-medium">Sound Alerts</p>
                <p className="text-xs text-themed-dim">Audible alerts for critical events</p>
              </div>
            </div>
            <input type="checkbox" checked={soundAlerts} onChange={() => setSoundAlerts((v) => !v)} className="h-5 w-5 accent-cyan" />
          </label>
        </div>
      ),
    },
    {
      title: "Data & Privacy",
      icon: Lock,
      content: (
        <div className="space-y-3">
          <label className="flex cursor-pointer items-center justify-between rounded-lg border-themed bg-subtle p-3">
            <div className="flex items-center gap-3">
              <Shield size={18} className="text-moss" />
              <div>
                <p className="text-sm font-medium">Auto-Refresh Telemetry</p>
                <p className="text-xs text-themed-dim">Automatically refresh live data</p>
              </div>
            </div>
            <input type="checkbox" checked={autoRefresh} onChange={() => setAutoRefresh((v) => !v)} className="h-5 w-5 accent-cyan" />
          </label>
          <div className="flex items-center justify-between rounded-lg border-themed bg-subtle p-3">
            <div className="flex items-center gap-3">
              <Lock size={18} className="text-violet" />
              <div>
                <p className="text-sm font-medium">Data Retention Period</p>
                <p className="text-xs text-themed-dim">Days to retain historical data</p>
              </div>
            </div>
            <select value={dataRetention} onChange={(e) => setDataRetention(e.target.value)} className="rounded-lg border-themed bg-input px-3 py-1.5 text-sm outline-none">
              <option value="30">30 days</option>
              <option value="60">60 days</option>
              <option value="90">90 days</option>
              <option value="180">180 days</option>
            </select>
          </div>
        </div>
      ),
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5 max-w-3xl">
      <div className="glass rounded-xl p-5 md:p-6">
        <h1 className="text-xl font-bold md:text-2xl">Settings</h1>
        <p className="mt-1 text-sm text-themed">Configure your DisasterScope experience</p>
      </div>

      {sections.map((section, i) => {
        const Icon = section.icon;
        return (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass rounded-xl p-5"
          >
            <div className="mb-4 flex items-center gap-2">
              <Icon size={18} className="text-cyan" />
              <h2 className="font-semibold">{section.title}</h2>
            </div>
            {section.content}
          </motion.div>
        );
      })}

      <div className="glass rounded-xl p-5 text-center text-xs text-themed-dim">
        DisasterScope v1.0.0 - Secure Disaster Management Platform
      </div>
    </motion.div>
  );
}
