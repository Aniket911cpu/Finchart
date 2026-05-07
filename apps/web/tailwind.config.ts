// Tailwind CSS v4 — design tokens are configured in globals.css via @theme block.
// This file is kept for editor tooling compatibility only.
// In Tailwind v4, the JS config is NOT used for theme tokens — use globals.css @theme.
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: { extend: {} },
  plugins: [],
};

export default config;
