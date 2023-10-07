/** @type {import('tailwindcss').Config} */

const tailwindConfigs = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        bgColor: 'var(--bg-color)',
        textColor: 'var(--text-color)',
      },
      width: {
        screen: '100dvw',
      },
      height: {
        screen: '100dvh',
      },
    },
  },
  plugins: [],
}

export default tailwindConfigs
