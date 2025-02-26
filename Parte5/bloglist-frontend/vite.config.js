import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3003",
        changeOrigin: true,
      },
    },
  },
  test: {
    globals: true,  // Hace que 'expect' esté disponible globalmente
    environment: 'jsdom',  // Simula un entorno de navegador para pruebas con React
  },
})
