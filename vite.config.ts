import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit(), svelteTesting()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
    // exclude: ['src/lib/server/**'],
    setupFiles: ['./vitest.setup.js'],
    coverage: {
      enabled: true,
      reporter: 'html',
      provider: 'v8',
    },
  },
});
