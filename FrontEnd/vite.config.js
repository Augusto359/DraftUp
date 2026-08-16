import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,          // Permite que o FrontEnd escute conexões além do localhost
    allowedHosts: true   // Cria a liberação de segurança para o ngrok parar de dar o erro 403
  }
})
