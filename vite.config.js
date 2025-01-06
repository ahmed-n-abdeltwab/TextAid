import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        content: 'content.js',
        popup: 'popup.js'
      },
      output: {
        dir: 'dist',
        format: 'es',
        entryFileNames: '[name].js'
      }
    }
  }
});
