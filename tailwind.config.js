/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#0B1F3A",
          800: "#122A4C",
          700: "#1A3A66",
        },
        brand: {
          50: "#EEF4FF",
          100: "#DCE8FF",
          200: "#B7D0FF",
          300: "#8FB6FF",
          400: "#5C93F5",
          500: "#3468D9",
          600: "#254FB3",
          700: "#1B3B8C",
          800: "#152C69",
          900: "#101F4A",
        },
        mint: {
          500: "#16A38A",
          600: "#0F8571",
        },
        coral: {
          500: "#E0546B",
          600: "#C43E54",
        },
        slate: {
          50: "#F6F8FC",
          100: "#EEF1F8",
          200: "#E1E6F0",
        },
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,31,74,0.06), 0 8px 24px -8px rgba(16,31,74,0.10)",
        pop: "0 12px 32px -12px rgba(16,31,74,0.28)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
}
