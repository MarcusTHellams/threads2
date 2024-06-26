import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        changeOrigin: true,
        target: 'http://localhost:4000',
      },
      '/graphql': {
        changeOrigin: true,
        target: 'http://localhost:4000',
      },
    },
  },
});
