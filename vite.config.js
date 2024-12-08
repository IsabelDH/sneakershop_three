import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: 'index.html',       // De hoofdpagina
        configurator: 'configurator.html',  // Je tweede pagina
      },
    },
  },
});
