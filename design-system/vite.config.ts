import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The style guide lives in /demo; the library itself is consumed as source.
export default defineConfig({
  root: 'demo',
  publicDir: 'public',
  plugins: [react()],
  build: { outDir: '../dist-demo', emptyOutDir: true },
});
