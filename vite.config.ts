import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

const page = (name: string) => fileURLToPath(new URL(`./${name}.html`, import.meta.url))

// Applies the saved (or system) theme before first paint so dark mode doesn't flash white.
// Keep the storage key and colors in sync with src/lib/theme.tsx.
const THEME_SCRIPT = `(function () {
  var theme
  try { theme = localStorage.getItem('td-theme') } catch (e) {}
  var dark = theme === 'dark' || (theme !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches)
  var root = document.documentElement
  root.classList.toggle('dark', dark)
  root.style.colorScheme = dark ? 'dark' : 'light'
  var meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', dark ? '#181715' : '#ffffff')
})()`

const themeScript = (): Plugin => ({
  name: 'theme-script',
  transformIndexHtml: () => [{ tag: 'script', children: THEME_SCRIPT, injectTo: 'head' }],
})

// Multi-page build: keeps the old static URLs (/, /faq.html, /legal.html) working on GitHub Pages.
export default defineConfig({
  plugins: [react(), tailwindcss(), themeScript()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: page('index'),
        faq: page('faq'),
        legal: page('legal'),
      },
    },
  },
})
