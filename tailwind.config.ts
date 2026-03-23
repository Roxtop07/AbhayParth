import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg)',
        surface: 'var(--surface)',
        card: 'var(--card)',
        'card-2': 'var(--card-2)',
        border: 'var(--border)',
        'border-hover': 'var(--border-hover)',
        primary: {
          DEFAULT: 'var(--primary)',
          dim: 'var(--primary-dim)'
        },
        teal: {
          DEFAULT: 'var(--teal)',
          dim: 'var(--teal-dim)'
        },
        violet: {
          DEFAULT: 'var(--violet)',
          dim: 'var(--violet-dim)'
        },
        red: {
          DEFAULT: 'var(--red)',
          dim: 'var(--red-dim)'
        },
        green: {
          DEFAULT: 'var(--green)',
          dim: 'var(--green-dim)'
        },
        text: 'var(--text)',
        muted: 'var(--muted)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        sora: ['var(--font-sora)', 'sans-serif'],
        dmsans: ['var(--font-dm-sans)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      }
    },
  },
  plugins: [],
}
export default config
