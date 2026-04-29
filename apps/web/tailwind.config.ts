import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#081014",
        night: "#10181f",
        panel: "rgba(16, 24, 31, 0.72)",
        cyan: "#50e3d6",
        amber: "#f4b860",
        coral: "#ff6f61",
        moss: "#88c060"
      },
      boxShadow: {
        glow: "0 0 40px rgba(80, 227, 214, 0.18)",
        amber: "0 0 28px rgba(244, 184, 96, 0.22)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: []
};

export default config;
