import type { Config } from 'tailwindcss';

/**
 * Neutral design system.
 *
 * The single brand accent is driven by CSS variables declared in
 * `app/globals.css` (`--color-accent*`). To re-skin the app later, change
 * those variables in one place instead of hunting for hard-coded colors.
 * Everything else leans on Tailwind's default neutral gray scale.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
          fg: 'rgb(var(--color-accent-fg) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [],
};

export default config;
