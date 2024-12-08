import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: 'public/index.html',
        configurator: 'public/configurator.html',
      },
    },
  },
});
