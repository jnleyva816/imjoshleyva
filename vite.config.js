import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Serves api/*.js during `vite dev` the way Vercel does in production.
// Reads RESEND_API_KEY and friends from .env.local.
function localApi() {
  return {
    name: 'local-api',
    apply: 'serve',
    configureServer(server) {
      Object.assign(process.env, loadEnv(server.config.mode, process.cwd(), ''))

      server.middlewares.use('/api/contact', async (req, res) => {
        const chunks = []
        for await (const chunk of req) chunks.push(chunk)
        try {
          req.body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString()) : {}
        } catch {
          req.body = {}
        }
        res.status = (code) => {
          res.statusCode = code
          return res
        }
        res.json = (data) => {
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(data))
        }
        const { default: handler } = await server.ssrLoadModule('/api/contact.js')
        await handler(req, res)
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    localApi()
  ],
  build: {
    // Enable code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-motion': ['framer-motion'],
        }
      }
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true
      }
    }
  },
  // Optimize images
  assetsInlineLimit: 4096, // Inline assets smaller than 4kb as base64
})
