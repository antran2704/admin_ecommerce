import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ["crypto", "process", "stream", "util"],
      globals: { global: true, process: true },
    }),
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src/"),
      "@assets": `${path.resolve(__dirname, "./src/assets")}`,
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code into a separate chunk
          vendor: ["react", "react-dom"],
          // Example: Split lodash into a separate chunk
          axios: ["axios"],
          antd: ["antd"],
          exceljs: ["exceljs"],
          "chart.js": ["chart.js", "react-chartjs-2"],
          ckeditor5: ["ckeditor5", "@ckeditor/ckeditor5-react"],
          fullcalendar: [
            "@fullcalendar/core",
            "@fullcalendar/daygrid",
            "@fullcalendar/interaction",
            "@fullcalendar/react",
            "@fullcalendar/timegrid",
          ],
          "react-pdf": ["@react-pdf/renderer"],
          "xyflow/react": ["@xyflow/react"],
          // You can add more chunks as needed
        },
      },
    },
  },
});
