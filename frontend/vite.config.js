import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/": "https://long-erin-dibbler-tux.cyclic.app/",
      "/uploads/": "https://long-erin-dibbler-tux.cyclic.app/",
    },
  },
});
