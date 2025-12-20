import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,                       // accepte connexions externes
    allowedHosts: ['phpbb-elected-default-rear.trycloudflare.com'], // autorise tous les liens TryCloudflare
    hmr: { clientPort: 443 }          // HMR derrière le tunnel https
  }
})