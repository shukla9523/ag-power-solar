import { defineConfig } from "vitest/config"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
  },
  // Lets tests render .tsx components (tsconfig keeps jsx: "preserve" for Next.js).
  oxc: { jsx: { runtime: "automatic" } },
  resolve: {
    alias: {
      "@lib": path.resolve(__dirname, "./src/lib"),
      "@modules": path.resolve(__dirname, "./src/modules"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "server-only": path.resolve(__dirname, "./src/test/server-only-stub.ts"),
    },
  },
})
