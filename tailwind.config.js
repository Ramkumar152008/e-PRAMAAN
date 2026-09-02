/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gem: {
          navy: '#0F2942',
          navyDark: '#0A1C2E',
          navyLight: '#18385C',
          blue: '#1E40AF',
          blueHover: '#1D4ED8',
          accent: '#0284C7',
          sky: '#E0F2FE',
          slate: '#F8FAFC',
          surface: '#FFFFFF',
          border: '#E2E8F0',
          borderDark: '#CBD5E1',
          textMain: '#0F172A',
          textMuted: '#475569',
          textSubtle: '#64748B',
          success: '#15803D',
          successBg: '#F0FDF4',
          successBorder: '#BBF7D0',
          warning: '#B45309',
          warningBg: '#FFFBEB',
          warningBorder: '#FDE68A',
          danger: '#B91C1C',
          dangerBg: '#FEF2F2',
          dangerBorder: '#FECACA',
          info: '#1D4ED8',
          infoBg: '#EFF6FF',
          infoBorder: '#BFDBFE',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'gov': '0 1px 3px 0 rgba(15, 41, 66, 0.08), 0 1px 2px -1px rgba(15, 41, 66, 0.08)',
        'card': '0 4px 6px -1px rgba(15, 41, 66, 0.06), 0 2px 4px -2px rgba(15, 41, 66, 0.04)',
        'elevated': '0 10px 15px -3px rgba(15, 41, 66, 0.1), 0 4px 6px -4px rgba(15, 41, 66, 0.05)',
      }
    },
  },
  plugins: [],
}
