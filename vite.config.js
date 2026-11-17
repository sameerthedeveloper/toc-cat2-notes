import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

// Three pages in one site: "/" is the AI notes, "/toc/" Theory of Computation, "/nsc/" Network Security and Cryptography.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        toc: resolve(__dirname, 'toc/index.html'),
        nsc: resolve(__dirname, 'nsc/index.html'),
      },
    },
  },
});
