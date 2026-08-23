import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // Local/Codespaces backend. In production, the browser uses
  // VITE_TERMINAL_BACKEND_URL directly, so this proxy is only for dev.
  const backendUrl =
    env.TERMINAL_BACKEND_URL ||
    env.VITE_TERMINAL_BACKEND_URL ||
    'ws://127.0.0.1:8765'

  return {
    plugins: [react()],

    server: {
      host: '0.0.0.0',
      port: Number(process.env.PORT) || 5173,
      strictPort: false,

      proxy: {
        '/ws': {
          target: backendUrl,
          ws: true,
          changeOrigin: true,
          secure: backendUrl.startsWith('wss://'),
        },
      },
    },
  }
})
