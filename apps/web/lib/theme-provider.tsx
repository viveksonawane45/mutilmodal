"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

type ThemeContext = {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
};

const Ctx = createContext<ThemeContext>({ theme: "dark", toggle: () => {}, setTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("disasterscope-theme") as Theme | null;
    if (stored === "light" || stored === "dark") {
      setThemeState(stored);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("disasterscope-theme", theme);
  }, [theme, mounted]);

  const toggle = useCallback(() => setThemeState((p) => (p === "dark" ? "light" : "dark")), []);
  const setTheme = useCallback((t: Theme) => setThemeState(t), []);

  if (!mounted) return <>{children}</>;

  return <Ctx.Provider value={{ theme, toggle, setTheme }}>{children}</Ctx.Provider>;
}

export function useTheme() {
  return useContext(Ctx);
}
