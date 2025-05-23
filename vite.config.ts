import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as dotenv from 'dotenv';
import 'fs';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  dotenv.config({ path: '.env' });
  console.log(command)
  if (mode === 'production') {
    dotenv.config({ path: '/etc/secrets/.env' });
  }
  return {
    base: '/',
    plugins: [react()],
    define: {
      'process.env': process.env,
    },
    server: {
      port: 5173,
      proxy: {
        '/recruitment': {
          target: 'https://develop-back-rota.rota361.com.br',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/recruitment/, ''),
        },
      },
    },
  }
});