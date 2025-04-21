import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'leaflet-vendor': ['leaflet', 'react-leaflet']
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name) {
            if (/\.(gif|jpe?g|png|svg)$/.test(assetInfo.name)) {
              return 'assets/images/[name]-[hash][extname]'
            }
            if (/\.css$/.test(assetInfo.name)) {
              return 'assets/css/[name]-[hash][extname]'
            }
            return 'assets/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js'
      }
    },
    assetsInlineLimit: 0
  },
  server: {
    headers: {
      'Content-Type': 'application/javascript'
    }
  }
})
