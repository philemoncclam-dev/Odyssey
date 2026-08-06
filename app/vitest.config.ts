import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // The model store persists to localStorage, so its tests need a DOM.
    environment: 'jsdom',
  },
})
