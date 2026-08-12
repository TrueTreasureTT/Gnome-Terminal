import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', ...defaultTheme.fontFamily.sans],
        mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
      },
      colors: {
        terminal: {
          bg: '#000000',
          fg: '#FFFFFF',
          primary: '#00FF00',
          secondary: '#00CC00',
          error: '#FF0000',
          warning: '#FFFF00',
          info: '#0099FF',
        },
      },
      backgroundColor: {
        'terminal-dark': '#0a0e27',
        'terminal-light': '#1e1e1e',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
