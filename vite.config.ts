import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
  },
  css: {
    lightningcss: {
      targets: {
        chrome: (61 << 16),
      },
    },
  },
  plugins: [react(), mkcert(), tailwindcss()],
});
