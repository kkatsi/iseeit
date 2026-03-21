import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    open: true,
    port: 5173,
  },
  css: {
    lightningcss: {
      targets: {
        chrome: 61 << 16,
      },
    },
  },
  plugins: [react(), mkcert(), tailwindcss()],
});
