import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Used only by the Vite dev server (local development without Docker).
  // In Docker, nginx handles proxying – this value is ignored in production builds.
  const backendTarget = process.env.BACKEND_URL ?? "http://localhost:5001";

  return {
    server: {
      host: true,
      port: 8080,
      hmr: {
        overlay: false,
      },
      proxy: {
        "/api": {
          target: backendTarget,
          changeOrigin: true,
        },
        "/health": {
          target: backendTarget,
          changeOrigin: true,
        },
        "/socket.io": {
          target: backendTarget,
          changeOrigin: true,
          ws: true,
        },
      },
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
