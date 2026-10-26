import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    build: {
      // Three.js (~560 kB raw, ~140 kB gzip) is its own lazy chunk, loaded only by the 3D studio.
      chunkSizeWarningLimit: 600,
    },
    server: {
      // In development the API is reached through this proxy, so the browser sees one
      // origin and the session cookie just works. Override the target with VITE_DEV_API_TARGET.
      proxy: {
        '/api': {
          target: env.VITE_DEV_API_TARGET || 'http://localhost:8000',
          changeOrigin: true,
        },
      },
    },
  };
});
