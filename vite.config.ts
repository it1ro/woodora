import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/woodora/',
  plugins: [react()],
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
