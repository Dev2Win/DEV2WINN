import type { Config } from 'tailwindcss';

// Port the v1 theme (colors, fonts) from legacy/tailwind.config.ts during the UI port.
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // brand purple from the v1 design — extend as the UI is ported
        'purple-1': '#7421FC',
      },
    },
  },
  plugins: [],
};

export default config;
