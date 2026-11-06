/// <reference types="vitest/config" />
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { viteSingleFile } from 'vite-plugin-singlefile'

// SINGLE_FILE=1 inlines everything into dist/index.html so it opens by double-click.
// A service worker cannot run from file://, so that build skips the PWA plugin.
const single = process.env.SINGLE_FILE === '1'

const pwa = VitePWA({
  registerType: 'autoUpdate',
  includeAssets: ['icons/apple-touch-icon.png'],
  manifest: {
    name: 'Music Study',
    short_name: 'Music Study',
    description: 'Fretboard, voicings, circle of fifths and a progression catalog for guitar harmony.',
    theme_color: '#1f2229',
    background_color: '#16181d',
    display: 'standalone',
    orientation: 'any',
    start_url: './',
    scope: './',
    icons: [
      { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: 'icons/icon-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,png,svg,woff2}'],
    navigateFallback: 'index.html',
    // Instrument samples come from the soundfont CDNs; keep what has been played so sound works offline.
    runtimeCaching: [
      {
        urlPattern: ({ url }) => /(^|\.)(gleitz\.github\.io|smpldsnds\.github\.io|goldst\.dev)$/.test(url.hostname),
        handler: 'CacheFirst',
        options: {
          cacheName: 'soundfont-samples',
          expiration: { maxEntries: 2000, maxAgeSeconds: 365 * 24 * 60 * 60 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
    ],
  },
})

export default defineConfig({
  plugins: [react(), ...(single ? [viteSingleFile()] : [pwa])],
  base: './',
  // The single-file build has no PWA plugin, so its register module is stubbed out.
  resolve: single ? { alias: { 'virtual:pwa-register': fileURLToPath(new URL('./src/app/pwa-stub.ts', import.meta.url)) } } : undefined,
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
