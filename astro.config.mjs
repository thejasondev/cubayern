import { defineConfig } from "astro/config";
import tailwindcss from "@astrojs/tailwind";
import react from "@astrojs/react";
// https://astro.build/config
export default defineConfig({
  integrations: [tailwindcss(), react()],
  site: 'http://localhost:4321',
  base: '/',
  vite: {
    envPrefix: 'PUBLIC_',
    server: {
      proxy: {
        // Proxy para la API de fútbol
        '/api/football': {
          target: 'https://api.football-data.org/v4',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/football/, ''),
          headers: {
            'X-Auth-Token': process.env.PUBLIC_FOOTBALL_API_KEY || '5446bcd190bd459bbdb672fd26543bc9'
          }
        },
        // Proxy para la API de noticias
        '/api/currents': {
          target: 'https://api.currentsapi.services/v1',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/currents/, '')
        }
      }
    }
  },
});