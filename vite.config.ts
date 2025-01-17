import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  server: {
    proxy: {
      // '/api': {
      //   target: 'https://api.klout.club',
      //   changeOrigin: true,
      //   secure: true, 
      //   rewrite: (path) => path.replace(/^\/api/, ''),
      // }
      'api': 'https://api.klout.club'
    }
  },
  plugins: [react()],
})