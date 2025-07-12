import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Enable class-based dark mode
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Your custom color scheme
        primary: {
          DEFAULT: "#8B55F6",
          50: "#F3EDFF",
          100: "#E6DBFF",
          200: "#D1BFFF",
          300: "#BBA3FF",
          400: "#A579FF",
          500: "#8B55F6",
          600: "#6D2EF0",
          700: "#5319D6",
          800: "#3F13A1",
          900: "#2D0E6B",
          950: "#1A0840",
        },
        background: {
          DEFAULT: "#09090B",
          primary: "#f8f8f8",
          secondary: "#000000",
        },
        // Light and dark variants
        foreground: {
          DEFAULT: "#FFFFFF", // For dark backgrounds
          muted: "#71717A", // Subtle text
        },
        // Card and surface colors
        card: {
          DEFAULT: "#FFFFFF", // Light card background
          dark: "#18181B", // Dark card background
        },
        // Text colors with variants
        text: {
          primary: "#FFFFFF", // Main text on dark
          secondary: "#71717A", // Subtle text
          inverse: "#09090B", // Text on light backgrounds
        },
        // Border colors
        border: {
          DEFAULT: "#27272A", // Default border on dark
          light: "#E4E4E7", // Border on light backgrounds
        },
        // Input and form colors
        input: {
          DEFAULT: "#FFFFFF", // Input backgrounds
          dark: "#27272A", // Dark input backgrounds
        },
        // Muted colors for less important elements
        muted: {
          DEFAULT: "#71717A",
          foreground: "#A1A1AA",
        },
        // Additional semantic colors
        subtle: "#71717A",
      },
      // Custom animations
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 8s linear infinite",
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        scaleIn: {
          "0%": {
            opacity: "0",
            transform: "scale(0.95)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },
      },
      // Custom gradients
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      // Custom spacing
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
      },
      // Custom typography
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      // Custom border radius
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      // Custom shadows
      boxShadow: {
        glow: "0 0 20px rgba(139, 85, 246, 0.3)",
        "glow-lg": "0 0 40px rgba(139, 85, 246, 0.4)",
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "card-hover":
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
      // Custom backdrop blur
      backdropBlur: {
        xs: "2px",
      },
      screens: {
        'small': '400px', // Add the custom breakpoint
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;