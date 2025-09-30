import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({ jsxRuntime: "classic" })],
  build: {
    manifest: true,
    commonjsOptions: {
      include: [/tea-pop/, /node_modules/],
    },
  },
  optimizeDeps: {
    include: [
      "tea-pop-menu",
      "tea-pop-core",
      "tea-pop-dropdown",
      "tea-pop-combobox",
    ],
  },
});
