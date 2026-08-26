import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["var(--font-poppins)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        sans: ["var(--font-poppins)", "var(--font-inter)", "sans-serif"],
      },
      colors: {
        brand: {
          orange: {
            50: "#fff7ed",
            100: "#ffedd5",
            200: "#fed7aa",
            300: "#fdba74",
            400: "#fb923c",
            500: "#f97316",
            600: "#ea580c",
            700: "#c2410c",
            800: "#9a3412",
            900: "#7c2d12",
            DEFAULT: "#f97316",
          },
          maroon: {
            50: "#fff1f2",
            100: "#ffe4e6",
            500: "#f43f5e",
            700: "#be123c",
            800: "#9f1239",
            900: "#881337",
            DEFAULT: "#9f1239",
          },
          whatsapp: {
            DEFAULT: "#25D366",
            hover: "#1EBE57",
            dark: "#128C7E",
          },
        },
      },
      boxShadow: {
        card: "0 2px 10px rgba(0, 0, 0, 0.04)",
        "card-hover": "0 12px 30px rgba(0, 0, 0, 0.08)",
        "card-dark": "0 4px 20px rgba(0, 0, 0, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
