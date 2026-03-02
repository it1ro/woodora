import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

export default defineConfig({
  base: '/steelwood/',
  plugins: [
    react(),
    ViteImageOptimizer({
      test: /\.(jpe?g|png|gif|tiff|webp|avif)$/i, // без svg — не тянем svgo
      jpg: { quality: 80 },
      jpeg: { quality: 80 },
      logStats: true,
    }),
  ],
  server: {
    host: true, // слушать на 0.0.0.0 — доступ с других устройств в сети
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/three/')) return 'three'
          if (id.includes('node_modules/@react-three/')) return 'react-three'
          return undefined
        },
      },
    },
    chunkSizeWarningLimit: 700, // three.js ~680 kB — ожидаемо
  },
})
