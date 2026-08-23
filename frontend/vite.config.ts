import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
<<<<<<< Updated upstream
  const env = loadEnv(mode, process.cwd(), '')

  // Local/Codespaces backend. In production, the browser uses
  // VITE_TERMINAL_BACKEND_URL directly, so this proxy is only for dev.
  const backendUrl =
    env.TERMINAL_BACKEND_URL ||
    env.VITE_TERMINAL_BACKEND_URL ||
    'ws://127.0.0.1:8765'
=======
  const env = loadEnv(mode, process.cwd(), "");

  const backendUrl =
    env.TERMINAL_BACKEND_URL ||
    "ws://127.0.0.1:8765";
>>>>>>> Stashed changes

  return {
    plugins: [react()],

    server: {
<<<<<<< Updated upstream
      host: '0.0.0.0',
      port: Number(process.env.PORT) || 5173,
=======
      host: "0.0.0.0",

      // Codespaces/local: 5173
      // Render: automatically uses process.env.PORT
      port: Number(process.env.PORT) || 5173,

>>>>>>> Stashed changes
      strictPort: false,

      proxy: {
        "/ws": {
          target: backendUrl,
          ws: true,
          changeOrigin: true,
        },
      },
    },

    preview: {
      host: "0.0.0.0",
      port: Number(process.env.PORT) || 4173,
    },
  };
});