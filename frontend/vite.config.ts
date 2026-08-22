import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/ws': {
        target: process.env.TERMINAL_BACKEND_URL || 'ws://127.0.0.1:8765',
        ws: true,
        changeOrigin: true,
      },
    },
  },
})
