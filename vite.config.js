import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: 'index.html',  // index.html bevindt zich in de root van je project
        configurator: 'configurator.html',  // configurator.html ook in de root van je project
      },
    },
  },
});
