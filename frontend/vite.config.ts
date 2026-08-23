import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendUrl = env.TERMINAL_BACKEND_URL || 'ws://127.0.0.1:8765'

  return {
    plugins: [react()],

    server: {
      host: '0.0.0.0',
      // Vite uses 5173 locally. Render supplies its own PORT.
      port: Number(process.env.PORT) || 5173,
      strictPort: true,

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
