/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: {
            primary: 'var(--bg-primary)',
            secondary: 'var(--bg-secondary)',
            surface: 'var(--bg-surface)',
            elevated: 'var(--bg-elevated)',
          },
          text: {
            primary: 'var(--text-primary)',
            secondary: 'var(--text-secondary)',
            muted: 'var(--text-muted)',
          },
          accent: {
            primary: 'var(--accent-primary)',
            secondary: 'var(--accent-secondary)',
          },
          border: 'var(--border-default)',
        }
      }
    },
  },
  plugins: [],
}
