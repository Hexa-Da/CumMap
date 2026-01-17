import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      // Modules Capacitor optionnels - ne pas les inclure dans le build
      external: [
        '@capacitor/core',
        '@capacitor/push-notifications',
        '@capacitor/local-notifications',
        '@capacitor/geolocation'
      ],
      output: {
        format: 'iife',
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        // Gérer les imports externes dynamiques
        globals: {
          '@capacitor/core': 'Capacitor',
          '@capacitor/push-notifications': 'PushNotifications',
          '@capacitor/local-notifications': 'LocalNotifications',
          '@capacitor/geolocation': 'Geolocation'
        }
      }
    },
    minify: 'terser',
    sourcemap: false
  }
})
