import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",         // 0.0.0.0/localhost both
    port: 8080,
    proxy: {
      // All API requests -> backend:4000
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
      // Uploaded images/static files -> backend:4000
      "/uploads": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
