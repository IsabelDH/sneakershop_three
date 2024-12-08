import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: 'index.html',  // index.html is nu in de root
        configurator: 'configurator.html',  // configurator.html is ook in de root
      },
    },
  },
});
