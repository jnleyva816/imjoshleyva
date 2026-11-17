import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { imagetools } from 'vite-imagetools'

// Serves api/*.js during `vite dev` the way Vercel does in production.
// Reads RESEND_API_KEY and friends from .env.local.
function localApi() {
  return {
    name: 'local-api',
    apply: 'serve',
    configureServer(server) {
      Object.assign(process.env, loadEnv(server.config.mode, process.cwd(), ''))

      server.middlewares.use('/api', async (req, res, next) => {
        const name = req.url.split('?')[0].replace(/^\/+|\/+$/g, '')
        if (!['contact', 'writing', 'running'].includes(name)) return next()
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
          if (!res.getHeader('Content-Type')) res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(data))
        }
        const { default: handler } = await server.ssrLoadModule(`/api/${name}.js`)
        await handler(req, res)
      })
    },
  }
}

// The same rewrites vercel.json does, so /resume and /projects/<slug> work
// under `vite dev` and `vite preview` (which the tests and Lighthouse use).
const pages = [
  [/^\/resume\/?(\?.*)?$/, '/resume.html'],
  [/^\/projects\/[\w-]+\/?(\?.*)?$/, '/project.html'],
]

function pageRewrites() {
  const rewrite = (req, _res, next) => {
    const match = pages.find(([pattern]) => pattern.test(req.url))
    if (match) req.url = match[1]
    next()
  }
  return {
    name: 'page-rewrites',
    configureServer(server) {
      server.middlewares.use(rewrite)
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewrite)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    imagetools({ removeMetadata: true }),
    localApi(),
    pageRewrites(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        resume: 'resume.html',
        project: 'project.html',
      },
    },
  },
})
