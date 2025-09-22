// Development-specific Vite configuration for faster reloads
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react()
  ],
  server: {
    // Optimize HMR
    hmr: {
      overlay: false,
      port: 24678,
    },
    // Faster file watching
    watch: {
      usePolling: false,
      interval: 100,
    },
    // Optimize middleware
    middlewareMode: false,
    // Enable file system caching
    fs: {
      cachedChecks: false,
      strict: false,
    },
  },
  // Optimize dependencies for development
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-dnd',
      'react-dnd-html5-backend',
      'recharts',
      'react-icons',
      'react-grid-layout',
      'react-resizable',
    ],
    exclude: ['@vite/client', '@vite/env'],
    force: true,
  },
  // Development-specific build options
  build: {
    // Keep source maps for debugging
    sourcemap: true,
    // Faster builds
    minify: false,
    // Optimize chunking for development
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          dnd: ['react-dnd', 'react-dnd-html5-backend'],
          charts: ['recharts'],
          icons: ['react-icons'],
          grid: ['react-grid-layout', 'react-resizable'],
        },
      },
    },
  },
  // CSS optimization for development
  css: {
    devSourcemap: true,
  },
  // Enable experimental features for better DX
  experimental: {
    renderBuiltUrl(filename, { hostType }) {
      if (hostType === 'js') {
        return { js: `/${filename}` }
      } else {
        return { relative: true }
      }
    },
  },
})
