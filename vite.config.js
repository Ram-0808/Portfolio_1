import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// `base` controls the public path assets are served from.
//  - Local dev / build: defaults to '/'.
//  - GitHub Pages project site (https://<user>.github.io/<repo>/): the Actions
//    workflow sets VITE_BASE to '/<repo>/' so asset URLs resolve correctly.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || '/',
})
