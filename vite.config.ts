import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Charger les variables d'environnement 
  const env = loadEnv(mode, process.cwd(), '');
  console.log('Variables d\'environnement chargées:', env);
  
  return {
    plugins: [react()],
    base: './',
    build: {
      rollupOptions: {
        external: ['uuid'],
      },
    }
  }
})
