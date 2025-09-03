import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/auth': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      },
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      },
      '/ors-api': {
        target: 'https://api.openrouteservice.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ors-api/, ''),
      },
    }
  }
})