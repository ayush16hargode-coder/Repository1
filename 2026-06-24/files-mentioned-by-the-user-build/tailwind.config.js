/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'Segoe UI', 'sans-serif'], display: ['Space Grotesk', 'Inter', 'sans-serif'] },
      colors: { void: '#080a12', panel: '#10131f', cyan: '#5ee7f7', violet: '#8b7cf6' },
    },
  },
  plugins: [],
};
