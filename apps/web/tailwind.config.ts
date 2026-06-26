import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--color-ink)",
        night: "var(--color-night)",
        panel: "var(--color-panel)",
        cyan: "var(--color-cyan)",
        amber: "var(--color-amber)",
        coral: "var(--color-coral)",
        moss: "var(--color-moss)",
        violet: "var(--color-violet)",
        blue: "var(--color-blue)",
        rose: "var(--color-rose)"
      },
      backgroundColor: {
        base: "var(--bg-base)",
        surface: "var(--bg-surface)",
        elevated: "var(--bg-elevated)",
      },
      textColor: {
        base: "var(--text-base)",
        muted: "var(--text-muted)",
        dim: "var(--text-dim)",
      },
      borderColor: {
        subtle: "var(--border-subtle)",
      },
      boxShadow: {
        glow: "var(--shadow-glow)",
        amber: "var(--shadow-amber)",
        card: "var(--shadow-card)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: []
};

export default config;
