import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: "#050714",
          card: "rgba(10, 15, 35, 0.75)",
          cyan: "#00f0ff",
          magenta: "#ff007f",
          purple: "#9d00ff",
          yellow: "#ffe600",
          green: "#00ff66",
        },
      },
      boxShadow: {
        "neon-cyan": "0 0 15px rgba(0, 240, 255, 0.6), 0 0 30px rgba(0, 240, 255, 0.3)",
        "neon-magenta": "0 0 15px rgba(255, 0, 127, 0.6), 0 0 30px rgba(255, 0, 127, 0.3)",
        "neon-yellow": "0 0 15px rgba(255, 230, 0, 0.6), 0 0 30px rgba(255, 230, 0, 0.3)",
        "neon-green": "0 0 15px rgba(0, 255, 102, 0.6), 0 0 30px rgba(0, 255, 102, 0.3)",
      },
      animation: {
        "pulse-glow": "pulseGlow 2s infinite ease-in-out",
        "float": "float 3s ease-in-out infinite",
        "scanline": "scanline 6s linear infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "1", filter: "brightness(1.1)" },
          "50%": { opacity: "0.8", filter: "brightness(0.9)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
