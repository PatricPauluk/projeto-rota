// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/recruitment': {
        target: 'https://develop-back-rota.rota361.com.br', // <<< CORREÇÃO CRÍTICA AQUI! Usando a URL base da API correta
        changeOrigin: true,
        secure: true, // Use 'true' para HTTPS, a menos que você esteja usando um certificado autoassinado que precise ser ignorado
        rewrite: (path) => path.replace(/^\/recruitment/, ''),
      },
    },
  },
});