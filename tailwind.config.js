/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FF4A3E",
        bg: "#FFFFFF",
        bgAlt: "#FAF7F4",
        text: "#1F2937",
        muted: "#6B7280",
        line: "#E5E7EB",
        overlay: "rgba(0,0,0,.35)"
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display","Georgia","serif"],
        sans: ["var(--font-sans)",  "Inter","system-ui","-apple-system","Segoe UI","Roboto","sans-serif"],
        brand: ["'League Spartan'", "Montserrat", "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem"
      }
    },
  },
  plugins: [],
}
