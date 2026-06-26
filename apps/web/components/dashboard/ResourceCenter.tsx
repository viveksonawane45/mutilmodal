"use client";

import { motion } from "framer-motion";
import { BatteryFull, Box, Package, Truck } from "lucide-react";
import { resources } from "@/lib/mock-data";

const categoryIcons: Record<string, React.ElementType> = {
  Marine: Truck,
  Medical: BatteryFull,
  Surveillance: Package,
  Logistics: Box,
  Infrastructure: Truck,
  Communication: BatteryFull,
};

const categoryColors: Record<string, string> = {
  Marine: "text-cyan bg-cyan/12",
  Medical: "text-coral bg-coral/12",
  Surveillance: "text-violet bg-violet/12",
  Logistics: "text-amber bg-amber/12",
  Infrastructure: "text-blue bg-blue/12",
  Communication: "text-moss bg-moss/12",
};

export function ResourceCenter() {
  const totalAssigned = resources.reduce((s, r) => s + r.assigned, 0);
  const totalAvailable = resources.reduce((s, r) => s + r.available, 0);
  const totalRequested = resources.reduce((s, r) => s + r.requested, 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="glass rounded-xl p-4 md:p-5">
        <h1 className="text-xl font-bold md:text-2xl">Resource Center</h1>
        <p className="text-sm text-themed mt-0.5">Track and manage deployed resources</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Total Assigned", value: totalAssigned.toLocaleString(), color: "text-cyan", bar: "bg-cyan" },
          { label: "Total Available", value: totalAvailable.toLocaleString(), color: "text-moss", bar: "bg-moss" },
          { label: "Total Requested", value: totalRequested.toLocaleString(), color: "text-amber", bar: "bg-amber" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-4"
          >
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-themed mt-0.5">{stat.label}</p>
            <div className="mt-2 h-1.5 rounded-full bg-subtle">
              <div className={`h-full rounded-full ${stat.bar}`} style={{ width: stat.label === "Total Assigned" ? "65%" : stat.label === "Total Available" ? "85%" : "70%" }} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-themed bg-subtle">
                <th className="px-4 py-3 text-left font-medium text-themed-dim text-xs uppercase tracking-wider">Resource</th>
                <th className="px-4 py-3 text-left font-medium text-themed-dim text-xs uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-right font-medium text-themed-dim text-xs uppercase tracking-wider">Assigned</th>
                <th className="px-4 py-3 text-right font-medium text-themed-dim text-xs uppercase tracking-wider">Available</th>
                <th className="px-4 py-3 text-right font-medium text-themed-dim text-xs uppercase tracking-wider">Requested</th>
                <th className="px-4 py-3 text-right font-medium text-themed-dim text-xs uppercase tracking-wider">Fill Rate</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((res, i) => {
                const Icon = categoryIcons[res.category] || Package;
                const color = categoryColors[res.category] || categoryColors.Logistics;
                const fillRate = Math.round((res.assigned / res.requested) * 100);
                return (
                  <motion.tr
                    key={res.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-themed/50 last:border-0 hover:bg-subtle transition"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`grid h-8 w-8 place-items-center rounded-lg ${color}`}>
                          <Icon size={16} />
                        </div>
                        <span className="font-medium">{res.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-themed">{res.category}</td>
                    <td className="px-4 py-3 text-right font-semibold">{res.assigned.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-themed">{res.available.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-themed">{res.requested.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className={`text-xs font-medium ${fillRate >= 90 ? "text-moss" : fillRate >= 70 ? "text-amber" : "text-coral"}`}>
                          {fillRate}%
                        </span>
                        <div className="h-1.5 w-16 rounded-full bg-subtle">
                          <div className={`h-full rounded-full ${fillRate >= 90 ? "bg-moss" : fillRate >= 70 ? "bg-amber" : "bg-coral"}`} style={{ width: `${fillRate}%` }} />
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
