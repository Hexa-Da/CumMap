import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/CumMap/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})
