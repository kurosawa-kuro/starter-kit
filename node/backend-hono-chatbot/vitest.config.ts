import { defineConfig } from 'vitest/config.js'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/test/setup.ts'],
    include: ['./src/test/**/*.test.ts'],
    testTimeout: 20000,
    hookTimeout: 20000
  }
}) 