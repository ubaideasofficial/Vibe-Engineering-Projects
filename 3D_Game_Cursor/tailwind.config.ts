import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: "#00f5ff",
          magenta: "#ff00aa",
          purple: "#1a0a2e",
          dark: "#0a0612",
        },
      },
      fontFamily: {
        display: ["var(--font-orbitron)", "system-ui", "sans-serif"],
        body: ["var(--font-rajdhani)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        neon: "0 0 20px rgba(0, 245, 255, 0.4), 0 0 40px rgba(255, 0, 170, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
