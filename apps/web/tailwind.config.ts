import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#10131A',
        'ink-2': '#161B26',
        sand: '#F3EFE9',
        'sand-2': '#DCE6F8',
        accent: '#38BDF8',
        slate: '#8EA0BC',
        surface: '#0B1120',
        'surface-2': '#111827',
        line: '#1F2937',
        success: '#34D399',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        soft: '0 20px 60px -40px rgba(56, 189, 248, 0.22)',
        lift: '0 30px 80px -45px rgba(15, 23, 42, 0.85)',
        glow: '0 0 0 1px rgba(56, 189, 248, 0.15), 0 18px 60px -30px rgba(56, 189, 248, 0.28)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 0 rgba(56, 189, 248, 0)' },
          '50%': { boxShadow: '0 0 40px rgba(56, 189, 248, 0.18)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        float: 'float 6s ease-in-out infinite',
        glow: 'glow 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
