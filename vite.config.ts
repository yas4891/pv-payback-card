import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/pv-payback-card.ts",
      formats: ["es"],
      fileName: () => "pv-payback-card.js",
    },
    outDir: "dist",
    emptyOutDir: true,
  },
  test: { environment: "happy-dom" },
});
