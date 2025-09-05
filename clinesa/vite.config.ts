import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Sentry plugin for source maps and release tracking
    sentryVitePlugin({
      org: 'clinesa',
      project: 'clinesa-frontend',
      authToken: process.env.SENTRY_AUTH_TOKEN,
      sourcemaps: {
        assets: './dist/**',
      },
      release: {
        name: process.env.npm_package_version || '1.0.0',
        setCommits: {
          auto: true,
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: true, // Generate source maps for Sentry
  },
})
