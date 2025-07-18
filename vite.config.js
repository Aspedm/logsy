// vite.config.js
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'styledConsoleLog',
      fileName: (format) => `logsy.${format}.js`,
    },
    outDir: 'dist',
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
  },
});
