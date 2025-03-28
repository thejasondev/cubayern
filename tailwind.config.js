/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "bayern-red": "#DC052D",
        "bayern-blue": "#0066B2",
      },
      fontFamily: {
        bayern: ['FC Bayern Sans', 'sans-serif'],
        'bayern-condensed': ['FC Bayern Sans Condensed', 'sans-serif']
      },
      fontWeight: {
      light: 300,
      normal: 400,
      semibold: 600
      },
    },
  },
  plugins: [],
}