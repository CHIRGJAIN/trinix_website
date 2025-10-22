import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/styles/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-poppins)", "var(--font-inter)", "system-ui"],
      },
      colors: {
        "cosmic-black": "#03030c",
        "indigo-core": "#3f3cd8",
        "aurora-teal": "#3df5f2",
        "copper-gold": "#f0b35a",
      },
      backgroundImage: {
        "cosmic-gradient": "radial-gradient(circle at 20% 20%, rgba(61,245,242,0.35), transparent 45%), radial-gradient(circle at 80% 10%, rgba(63,60,216,0.35), transparent 40%), radial-gradient(circle at 50% 80%, rgba(240,179,90,0.25), transparent 50%)",
      },
      boxShadow: {
        "aurora": "0 20px 60px -20px rgba(61,245,242,0.45)",
        "circuit": "0 0 0 1px rgba(63,60,216,0.45), 0 12px 40px -24px rgba(3,3,12,0.8)",
      },
      animation: {
        "pulse-soft": "pulseSoft 6s ease-in-out infinite",
        "glow-loop": "glowLoop 8s linear infinite",
      },
      keyframes: {
        pulseSoft: {
          "0%, 100%": { opacity: "0.7", transform: "scale(0.98)" },
          "50%": { opacity: "1", transform: "scale(1.02)" },
        },
        glowLoop: {
          "0%": { boxShadow: "0 0 15px rgba(61,245,242,0.4), 0 0 30px rgba(63,60,216,0.2)" },
          "50%": { boxShadow: "0 0 25px rgba(61,245,242,0.6), 0 0 45px rgba(63,60,216,0.35)" },
          "100%": { boxShadow: "0 0 15px rgba(61,245,242,0.4), 0 0 30px rgba(63,60,216,0.2)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
