import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    // Each file gets its own in-memory Mongo; running them in parallel would
    // race on the shared mongoose connection singleton.
    fileParallelism: false,
    setupFiles: ["./tests/setup.ts"],
    testTimeout: 30_000,
    hookTimeout: 60_000, // first run downloads the mongodb-memory-server binary
  },
});
