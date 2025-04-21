import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rollupOptions: {
      external: [],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'leaflet', 'react-leaflet'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/database']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    exclude: []
  },
  esbuild: {
    platform: 'node'
  }
})
