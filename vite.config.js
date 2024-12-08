import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: 'index.html', // Hoofdpagina
        configurator: 'configurator.html', // Andere pagina
      },
    },
  },
});
