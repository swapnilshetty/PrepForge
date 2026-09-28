import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Proxies /api requests to the Django backend during local development so
// the browser never has to deal with cross-origin requests. In production
// you'll point axios at wherever Django is actually deployed (see
// src/services/api.js).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
});
