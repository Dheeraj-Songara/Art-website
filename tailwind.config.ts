import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        gallery: {
          bg: "#0b0f14",
          bg2: "#111820",
          ink: "#e8e4dc",
          muted: "#7a8390",
          line: "rgba(255,255,255,0.07)",
          accent: "#4fd1c5"
        }
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "serif"],
        sans: ["var(--font-dm-sans)", "DM Sans", "sans-serif"],
        mono: ["var(--font-dm-mono)", "DM Mono", "monospace"]
      },
      boxShadow: {
        artwork: "0 30px 80px rgba(0,0,0,0.72), 0 0 0 1px rgba(79,209,197,0.14)",
        lift: "0 20px 60px rgba(0,0,0,0.75), 0 0 0 1px rgba(79,209,197,0.35)"
      },
      keyframes: {
        f1: {
          "0%,100%": { transform: "translateY(0) rotate(-4deg)" },
          "50%": { transform: "translateY(-18px) rotate(-3deg)" }
        },
        f2: {
          "0%,100%": { transform: "translateY(0) rotate(3deg)" },
          "50%": { transform: "translateY(-22px) rotate(2deg)" }
        },
        f3: {
          "0%,100%": { transform: "translateY(0) rotate(-1.5deg)" },
          "50%": { transform: "translateY(-15px) rotate(-2deg)" }
        },
        f4: {
          "0%,100%": { transform: "translateY(0) rotate(5deg)" },
          "50%": { transform: "translateY(-20px) rotate(4deg)" }
        },
        f5: {
          "0%,100%": { transform: "translateY(0) rotate(-6deg)" },
          "50%": { transform: "translateY(-12px) rotate(-5deg)" }
        },
        f6: {
          "0%,100%": { transform: "translateY(0) rotate(2deg)" },
          "50%": { transform: "translateY(-25px) rotate(1deg)" }
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.93)" },
          to: { opacity: "1", transform: "scale(1)" }
        }
      },
      animation: {
        f1: "f1 7s ease-in-out infinite",
        f2: "f2 9s ease-in-out infinite",
        f3: "f3 13s ease-in-out infinite",
        f4: "f4 10s ease-in-out infinite",
        f5: "f5 7.5s ease-in-out infinite",
        f6: "f6 11s ease-in-out infinite",
        fadeUp: "fadeUp 0.5s ease both",
        scaleIn: "scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both"
      }
    }
  },
  plugins: [forms]
};

export default config;
