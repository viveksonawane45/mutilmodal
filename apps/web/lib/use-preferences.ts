"use client";

import { useCallback, useEffect, useState } from "react";

type Preferences = {
  activeView: string;
  activeProjectId: string | null;
  territory: string;
  autoRefresh: boolean;
  riskThreshold: number;
};

const defaults: Preferences = {
  activeView: "dashboard",
  activeProjectId: null,
  territory: "All",
  autoRefresh: true,
  riskThreshold: 76,
};

export function usePreferences() {
  const [loaded, setLoaded] = useState(false);
  const [prefs, setPrefs] = useState<Preferences>(defaults);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("disasterscope-prefs");
      if (stored) {
        setPrefs({ ...defaults, ...JSON.parse(stored) });
      }
    } catch { /* ignore */ }
    setLoaded(true);
  }, []);

  const update = useCallback((patch: Partial<Preferences>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem("disasterscope-prefs", JSON.stringify(next));
      } catch { /* ignore */ }
      return next;
    });
  }, []);

  return { prefs, update, loaded };
}
