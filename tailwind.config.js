/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    // Accent color variants used in the ACCENT map (dynamic class strings)
    { pattern: /bg-(amber|cyan|violet|sky|orange|pink|yellow|red|emerald|green)-(400|500|600)\/(10|15|20|25|30)/ },
    { pattern: /text-(amber|cyan|violet|sky|orange|pink|yellow|red|emerald|green)-(300|400)/ },
    { pattern: /border-(amber|cyan|violet|sky|orange|pink|yellow|red|emerald|green)-(400|500|600)\/(20|25|30)/ },
    { pattern: /shadow-(amber|cyan|violet|sky|orange|pink|yellow|red|emerald|green)-(500)\/(25|30|40)/ },
    { pattern: /from-(amber|cyan|violet|purple|sky|blue|teal|orange|pink|rose|yellow|red|emerald|green)-(400|500|600)/ },
    { pattern: /to-(amber|cyan|violet|purple|sky|blue|teal|orange|pink|rose|yellow|red|emerald|green)-(400|500|600)/ },
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
