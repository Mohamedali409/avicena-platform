import type { Config } from "tailwindcss";

// "Clinical Clarity" design system — ported from the Stitch export.
// Tokens named to match Stitch output so exported HTML classes work as-is.
const font = ["var(--font-plex-arabic)", "IBM Plex Sans Arabic", "sans-serif"];

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#f8f9ff",
        surface: "#f8f9ff",
        "surface-bright": "#f8f9ff",
        "surface-dim": "#cbdbf5",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#eff4ff",
        "surface-container": "#e5eeff",
        "surface-container-high": "#dce9ff",
        "surface-container-highest": "#d3e4fe",
        "surface-variant": "#d3e4fe",
        "surface-tint": "#006781",
        "on-surface": "#0b1c30",
        "on-surface-variant": "#3f484c",
        "on-background": "#0b1c30",
        "inverse-surface": "#213145",
        "inverse-on-surface": "#eaf1ff",
        outline: "#6f787d",
        "outline-variant": "#bec8cd",
        primary: "#005a71",
        "on-primary": "#ffffff",
        "primary-container": "#0e7490", // Medical Teal — core actions
        "on-primary-container": "#d3f1ff",
        "primary-fixed": "#b9eaff",
        "primary-fixed-dim": "#81d1f0",
        "inverse-primary": "#81d1f0",
        secondary: "#5c5f61",
        "secondary-container": "#e0e3e5",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#626567",
        tertiary: "#515353",
        "tertiary-container": "#696b6b",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#ececec",
        error: "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
        brand: { DEFAULT: "#0e7490", fg: "#ffffff" },
      },
      fontFamily: {
        sans: font,
        display: font,
        "headline-lg": font,
        "headline-lg-mobile": font,
        "headline-md": font,
        "body-lg": font,
        "body-md": font,
        "label-md": font,
        caption: font,
      },
      fontSize: {
        display: ["48px", { lineHeight: "1.2", fontWeight: "700" }],
        "headline-lg": ["32px", { lineHeight: "1.3", fontWeight: "600" }],
        "headline-lg-mobile": ["24px", { lineHeight: "1.3", fontWeight: "600" }],
        "headline-md": ["24px", { lineHeight: "1.4", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        "label-md": ["14px", { lineHeight: "1.4", letterSpacing: "0.02em", fontWeight: "500" }],
        caption: ["12px", { lineHeight: "1.4", fontWeight: "400" }],
      },
      spacing: {
        base: "8px",
        gutter: "24px",
        "margin-mobile": "16px",
        "margin-desktop": "32px",
        "section-gap": "64px",
      },
      maxWidth: {
        "container-max": "1280px",
      },
      borderRadius: {
        lg: "0.5rem",
        xl: "1rem",
      },
      boxShadow: {
        card: "0px 4px 20px rgba(0,0,0,0.04)",
        "card-hover": "0px 10px 30px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
