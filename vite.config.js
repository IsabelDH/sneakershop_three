import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist', // Dit is waar de gebundelde bestanden komen
    rollupOptions: {
      input: '/index.html', // Dit is de hoofdingang van je app
    },
  },
});
