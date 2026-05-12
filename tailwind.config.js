/** @type {import('tailwindcss').Config} */

// ============================================================
// OpenUp - Tailwind CSS Configuration
// ============================================================
// To add new colors: add them to the `colors` section
// To add new fonts: add them to the `fontFamily` section
// ============================================================

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  // Dark mode: 'class' means toggle via adding 'dark' class to <html>
  darkMode: "class",

  theme: {
    extend: {
      // --------------------------------------------------------
      // Brand Colors
      // CUSTOMIZE these to change the platform's color scheme
      // --------------------------------------------------------
      colors: {
        brand: {
          orange: "#FF6B35",        // Primary orange
          "orange-light": "#FF8C61",
          "orange-dark": "#E5501A",
          "orange-glow": "#FF6B3520",
          cream: "#FFF8F3",         // Warm off-white
          parchment: "#F5EDE3",
          "warm-gray": "#8B7D74",
          charcoal: "#2D2420",
          "soft-black": "#1A1410",
        },
      },

      // --------------------------------------------------------
      // Typography
      // CUSTOMIZE font families here
      // --------------------------------------------------------
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],  // Headings
        sans: ["DM Sans", "Inter", "system-ui", "sans-serif"],    // Body
        mono: ["JetBrains Mono", "Fira Code", "monospace"],       // Code
      },

      // --------------------------------------------------------
      // Custom Animations
      // ADD new animations here
      // --------------------------------------------------------
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.4s ease-out forwards",
        "slide-down": "slideDown 0.3s ease-out forwards",
        "scale-in": "scaleIn 0.3s ease-out forwards",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },

      // --------------------------------------------------------
      // Spacing
      // --------------------------------------------------------
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        88: "22rem",
        128: "32rem",
      },

      // --------------------------------------------------------
      // Border Radius
      // --------------------------------------------------------
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },

      // --------------------------------------------------------
      // Box Shadows
      // --------------------------------------------------------
      boxShadow: {
        "brand": "0 4px 20px rgba(255, 107, 53, 0.15)",
        "brand-lg": "0 8px 40px rgba(255, 107, 53, 0.25)",
        "card": "0 2px 12px rgba(45, 36, 32, 0.08)",
        "card-hover": "0 8px 30px rgba(45, 36, 32, 0.15)",
        "glass": "0 4px 24px rgba(45, 36, 32, 0.06)",
      },

      // --------------------------------------------------------
      // Background Gradients
      // --------------------------------------------------------
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #FF6B35 0%, #FF8C61 100%)",
        "warm-gradient": "linear-gradient(135deg, #FFF8F3 0%, #F5EDE3 100%)",
        "dark-gradient": "linear-gradient(135deg, #1A1410 0%, #2D2420 100%)",
      },
    },
  },

  plugins: [],
};
