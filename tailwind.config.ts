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
        navy: '#0A1F44',
        gold: '#C9A84C',
      },
      fontFamily: {
        heading: ['Georgia', 'Times New Roman', 'serif'],
        body: ['Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', 'Tahoma', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
