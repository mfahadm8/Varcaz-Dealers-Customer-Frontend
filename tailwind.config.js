/** @type {import('tailwindcss').Config} */
export default {
  // Ensure dark mode uses the data-theme="dark" attribute
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // ----------------- COLOR EXTENSION -----------------
      colors: {
        primary: {
          700: "rgb(var(--color-primary-700) / <alpha-value>)",
          500: "rgb(var(--color-primary-500) / <alpha-value>)",
          600: "rgb(var(--color-primary-600) / <alpha-value>)",
        },
        secondary: {
          700: "rgb(var(--color-secondary-700) / <alpha-value>)",
          500: "rgb(var(--color-secondary-500) / <alpha-value>)",
          300: "rgb(var(--color-secondary-300) / <alpha-value>)",
          100: "rgb(var(--color-secondary-100) / <alpha-value>)",
        },
        neutral: {
          900: "rgb(var(--color-neutral-900) / <alpha-value>)",
          850: "rgb(var(--color-neutral-850) / <alpha-value>)",
          800: "rgb(var(--color-neutral-800) / <alpha-value>)",
          700: "rgb(var(--color-neutral-700) / <alpha-value>)",
          500: "rgb(var(--color-neutral-500) / <alpha-value>)",
          200: "rgb(var(--color-neutral-200) / <alpha-value>)",
          150: "rgb(var(--color-neutral-150) / <alpha-value>)",
          100: "rgb(var(--color-neutral-100) / <alpha-value>)",
          50: "rgb(var(--color-neutral-50) / <alpha-value>)",
        },
        white: {
          DEFAULT: "rgb(var(--color-white) / <alpha-value>)",
          text: "var(--color-white-text)",
          stroke: "var(--color-white-stroke)",
          "10-bg": "rgb(var(--color-white-10-bg) / <alpha-value>)",
        },
        credit: {
          equifax: "rgb(var(--color-credit-equifax) / <alpha-value>)",
          experian: "rgb(var(--color-credit-experian) / <alpha-value>)",
          transunion: "rgb(var(--color-credit-transunion) / <alpha-value>)",
        },
        status: {
          orange: "rgb(var(--color-status-orange) / <alpha-value>)",
          yellow: "rgb(var(--color-status-yellow) / <alpha-value>)",
          "blue-chart": "rgb(var(--color-status-blue-chart) / <alpha-value>)",
          error: "rgb(var(--color-status-error) / <alpha-value>)",
          "blue-10": "var(--color-status-blue-10)",
          "green-300-10": "var(--color-status-green-300-10)",
          "green-10": "var(--color-status-green-10)",
          "gray200-10": "var(--color-status-gray200-10)",
          "red-10": "var(--color-status-red-10)",
          "yellow-10": "var(--color-status-yellow-10)",
          "orange-10": "var(--color-status-orange-10)",
        },

        // General Utility Aliases
        border: "var(--color-border)",
        overlay: "var(--color-overlay)",
      },

      // ----------------- TYPOGRAPHY EXTENSION -----------------
      fontFamily: {
        sans: ["Poppins", "sans-serif"], // Makes Poppins the default font
      },
      fontSize: {
        // Enables class 'text-base' to use your custom variable
        base: "var(--font-size-base)",
      },
      fontWeight: {
        // Enables classes 'font-regular', 'font-medium', 'font-bold'
        regular: "var(--font-weight-regular)",
        medium: "var(--font-weight-medium)",
        bold: "var(--font-weight-bold)",
      },

      // ----------------- SPACING & SHADOWS EXTENSION -----------------
      borderRadius: {
        // Enables classes 'rounded-sm', 'rounded-md', 'rounded-lg', rounded-xl'
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      boxShadow: {
        // Enables classes 'shadow-sm', 'shadow-md', 'shadow-lg'
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
    },
  },
  plugins: [],
};
