import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: "./index.html",
        background: "./src/background.js",
        content: "./src/content.js",
      },
      output: {
        // Output penamaan file untuk background.js
        entryFileNames: "[name].js", // Nama file tetap sesuai dengan nama aslinya
        chunkFileNames: "[name].[hash].js", // Menjaga nama file chunk tetap dengan hash
        assetFileNames: "[name].[hash].[ext]", // Menjaga ekstensi asset tetap konsisten
      },
    },
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
