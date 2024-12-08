import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',  // Zorg ervoor dat de output naar de dist-map gaat
    rollupOptions: {
      input: {
        index: 'index.html',
        configurator: 'configurator.html',  // Als je configurator.html hebt
      },
    },
  },
});
