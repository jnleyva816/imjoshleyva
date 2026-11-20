import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { imagetools } from 'vite-imagetools'
import photoExif from './scripts/photo-exif.js'

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
        if (!['contact', 'writing', 'running', 'csp-report'].includes(name)) return next()
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

// Clean URLs the way Vercel serves them (cleanUrls in vercel.json). Under
// `vite dev` every project shares the project.html template; the build
// pre-renders one file per project, which `vite preview` serves.
const resumePage = /^\/resume\/?(\?.*)?$/
const projectPage = /^\/projects\/([\w-]+)\/?(\?.*)?$/

function pageRewrites() {
  const rewrite = (projectFile) => (req, _res, next) => {
    if (resumePage.test(req.url)) req.url = '/resume.html'
    const project = req.url.match(projectPage)
    if (project) req.url = projectFile(project[1])
    next()
  }
  return {
    name: 'page-rewrites',
    configureServer(server) {
      server.middlewares.use(rewrite(() => '/project.html'))
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewrite((slug) => `/projects/${slug}.html`))
    },
  }
}

// The HTML templates carry no title, description, or schema.org tags; the
// build adds them in scripts/prerender.mjs. This does the same under
// `vite dev`, from the same src/lib/seo.js, so dev and prod can't drift.
function seoHead() {
  let server
  return {
    name: 'seo-head',
    apply: 'serve',
    configureServer(s) {
      server = s
    },
    async transformIndexHtml(html, ctx) {
      const { pageFor, headTags } = await server.ssrLoadModule('/src/lib/seo.js')
      const page = pageFor(ctx.originalUrl ?? ctx.path)
      return page ? html.replace('</head>', `${headTags(page)}</head>`) : html
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  // No index.html fallback: unknown paths 404 like they do on Vercel.
  appType: 'mpa',
  plugins: [
    react(),
    tailwindcss(),
    imagetools({ removeMetadata: true }),
    photoExif({ dir: 'src/assets/photos/working' }),
    localApi(),
    pageRewrites(),
    seoHead(),
  ],
  // The SSR build (see "build" in package.json) only needs src/entry-server.jsx.
  build: isSsrBuild
    ? { copyPublicDir: false }
    : {
        rollupOptions: {
          input: {
            main: 'index.html',
            resume: 'resume.html',
            project: 'project.html',
          },
        },
      },
}))
