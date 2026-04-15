import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig(({ mode }) => {
  const isAnalyzeBuild = mode === "analyze";

  return {
    plugins: [
      react(),
      tailwindcss(),
      isAnalyzeBuild &&
        visualizer({
          filename: "dist/bundle-stats.html",
          template: "treemap",
          gzipSize: true,
          brotliSize: true,
        }),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    build: {
      chunkSizeWarningLimit: 900,
      rollupOptions: {
        output: {
          manualChunks(id) {
            const normalizedId = id.replace(/\\/g, "/");

            if (normalizedId.includes("/node_modules/pptxgenjs/")) {
              return "vendor-pptx";
            }

            if (
              normalizedId.includes("/node_modules/react/") ||
              normalizedId.includes("/node_modules/react-dom/") ||
              normalizedId.includes("/node_modules/scheduler/")
            ) {
              return "vendor-react";
            }

            if (
              normalizedId.includes("/node_modules/@radix-ui/") ||
              normalizedId.includes("/node_modules/lucide-react/") ||
              normalizedId.includes("/node_modules/class-variance-authority/") ||
              normalizedId.includes("/node_modules/clsx/") ||
              normalizedId.includes("/node_modules/tailwind-merge/")
            ) {
              return "vendor-ui";
            }

            return undefined;
          },
        },
      },
    },
  };
});
