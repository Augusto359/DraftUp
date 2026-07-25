import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/analisar-planta': 'http://localhost:5000', // Encaminha requisições do front para o Node
    },
  },
});