import daisyui from 'daisyui';
import { forest } from 'daisyui/src/theming/themes';
import type { Config } from 'tailwindcss';
import * as twAnimate from 'tailwindcss-animate';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [daisyui, twAnimate],
  daisyui: {
    themes: [
      {
        forest: {
          ...forest,
          primary: '#66b14e',
          neutral: '#313131',
        },
      },
    ],
  },
};
export default config;
