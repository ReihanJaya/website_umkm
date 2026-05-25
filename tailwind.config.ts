import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF6B2C",
        "primary-soft": "#FFF1E9",
        "primary-light": "#FF8F5E",
        "text-main": "#1A1A1A",
        "text-muted": "#6B7280",
        "bg-surface": "#F9FAFB",
      },
      fontFamily: {
        heading: ['var(--font-heading)'],
        main: ['var(--font-main)'],
      },
    },
  },
  plugins: [],
};
export default config;
