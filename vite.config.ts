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
        manualChunks: undefined
      }
    }
  },
  optimizeDeps: {
    exclude: ['@rollup/rollup-linux-x64-gnu', '@esbuild/linux-x64']
  },
  esbuild: {
    platform: 'node'
  }
})
