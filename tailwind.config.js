/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "bayern-red": "#DC052D",
        "bayern-blue": "#0066B2",
      },
    },
  },
  plugins: [],
}

