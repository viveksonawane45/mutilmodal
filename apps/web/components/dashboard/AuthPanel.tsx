"use client";

import { Lock, ShieldCheck, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import type { UserRole } from "@/lib/types";

type Props = {
  selectedRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onLogin: () => void;
};

const roles: { id: UserRole; title: string; copy: string }[] = [
  { id: "researcher", title: "Researcher", copy: "Studies, reports, datasets" },
  { id: "emergency_manager", title: "Emergency Manager", copy: "Response plans and alerts" },
  { id: "admin", title: "Admin", copy: "Users, services, audit" }
];

export function AuthPanel({ selectedRole, onRoleChange, onLogin }: Props) {
  return (
    <section className="glass rounded-xl p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase font-semibold text-cyan/80">Secure access</p>
          <h2 className="text-lg md:text-xl font-bold">Authentication</h2>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan/12 text-cyan">
          <Lock size={20} />
        </div>
      </div>

      <div className="grid gap-3">
        {roles.map((role) => {
          const selected = selectedRole === role.id;
          return (
            <button
              key={role.id}
              onClick={() => onRoleChange(role.id)}
              className="relative rounded-xl border-themed bg-item p-3 text-left transition hover:bg-hover"
            >
              {selected ? (
                <motion.span layoutId="role-select" className="absolute inset-0 rounded-xl border border-cyan/50 bg-cyan/8" />
              ) : null}
              <span className="relative flex items-center gap-3">
                <ShieldCheck size={18} className={selected ? "text-cyan" : "text-themed-dim"} />
                <span>
                  <span className="block text-sm font-semibold">{role.title}</span>
                  <span className="text-xs text-themed-dim">{role.copy}</span>
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <button
        onClick={onLogin}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan py-3 text-sm font-semibold text-ink shadow-glow hover:bg-cyan/90 transition"
      >
        <UserPlus size={18} />
        Start secure session
      </button>
    </section>
  );
}
