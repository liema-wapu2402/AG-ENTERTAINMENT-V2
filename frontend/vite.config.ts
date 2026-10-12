import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// Vite config: "@" alias -> src, and a dev proxy so the React app can call
// the Laravel backend (php artisan serve, port 8000) without CORS trouble.
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8000',
      '/storage': 'http://localhost:8000', // uploaded mp3s, covers & profile pictures
    },
  },
});
