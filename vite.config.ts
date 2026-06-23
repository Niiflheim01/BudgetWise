import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use `BASE_URL` environment variable when deploying (e.g. GitHub Pages).
// If not set, default to '/'. For GitHub Pages repo sites set BASE_URL to
// '/<repo-name>/' so asset paths resolve correctly.
export default defineConfig({
  base: process.env.BASE_URL ?? '/',
  plugins: [react()],
})
