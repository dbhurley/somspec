import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#FAF8F3',
        surface: '#F2EDE3',
        border: '#DDD4C2',
        accent: '#8A6420',
        code: '#7A3E12',
        text: '#1C1209',
        muted: '#6B5E48',
        highlight: '#8B1A1A',
        success: '#1A6B3A',
      },
      borderRadius: {
        card: '8px',
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        serif: ['var(--font-source-serif)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'Consolas', 'monospace'],
      },
      lineHeight: {
        'body': '1.8',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
