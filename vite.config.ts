import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rollupOptions: {
      external: ['@rollup/rollup-linux-x64-gnu', '@esbuild/linux-x64'],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'leaflet', 'react-leaflet'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/database']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    target: 'es2020'
  },
  optimizeDeps: {
    exclude: ['@rollup/rollup-linux-x64-gnu', '@esbuild/linux-x64'],
    esbuildOptions: {
      target: 'es2020',
      platform: 'browser'
    }
  }
})
