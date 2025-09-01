import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  test: {
    globals: true,
    // include: ['tests/**/*.{test,spec}.{js,ts}'],
    // exclude: ['src/lib/server/**'],
    coverage: {
      enabled: true,
      reporter: 'html',
      provider: 'v8',
    },
    projects: [
      {
        extends: './vite.config.ts',
        test: {
          name: 'client',
          environment: 'browser',
          browser: {
            enabled: true,
            provider: 'playwright',
            instances: [{ browser: 'chromium' }],
          },
          include: ['tests/**/*.{test,spec}.{js,ts}'],
          exclude: ['src/lib/server/**'],
          setupFiles: ['./vitest-setup-client.ts'],
        },
      },
    ],
  },
  // server: {
  //   fs: {
  //     allow: ['static'],
  //   },
  // },
});
