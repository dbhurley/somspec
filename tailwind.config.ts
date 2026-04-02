import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#080C10',
        surface: '#0F1419',
        border: '#1E2A38',
        accent: '#C7A853',
        code: '#5BA4CF',
        text: '#E8DCC8',
        muted: '#6B7D8F',
        highlight: '#E63946',
        success: '#52B788',
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
