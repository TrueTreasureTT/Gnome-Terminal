import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backendUrl = env.TERMINAL_BACKEND_URL || "ws://127.0.0.1:8765";
  const renderPort = Number(process.env.PORT) || 5173;

  return {
    plugins: [react()],

    server: {
      host: "0.0.0.0",
      port: renderPort,
      strictPort: true,
      allowedHosts: [
        "gnome-terminal-4.onrender.com",
      ],
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
      port: renderPort,
      strictPort: true,
      allowedHosts: [
        "gnome-terminal-4.onrender.com",
      ],
    },
  };
});
