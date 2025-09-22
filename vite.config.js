import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks - more granular splitting
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('react-router')) {
              return 'router-vendor';
            }
            if (id.includes('react-dnd')) {
              return 'dnd-vendor';
            }
            if (id.includes('recharts')) {
              return 'chart-vendor';
            }
            if (id.includes('react-icons')) {
              return 'icons-vendor';
            }
            if (id.includes('react-grid-layout') || id.includes('react-resizable')) {
              return 'grid-vendor';
            }
            if (id.includes('date-fns')) {
              return 'utils-vendor';
            }
            if (id.includes('prismjs')) {
              return 'prism-vendor';
            }
            return 'vendor';
          }
          
          // Dashboard builder chunks - more specific splitting
          if (id.includes('DashboardBuilder')) {
            if (id.includes('widgets/')) {
              if (id.includes('RevenueKPI') || id.includes('OrdersKPI') || id.includes('CustomersKPI') || id.includes('ProfessionalKPI')) {
                return 'widgets-kpi';
              }
              if (id.includes('GradientBar') || id.includes('SmoothFunnel') || id.includes('ProfessionalTable')) {
                return 'widgets-advanced';
              }
              if (id.includes('LineChart') || id.includes('BarChart') || id.includes('AreaChart') || id.includes('PieChart')) {
                return 'widgets-charts';
              }
              return 'widgets-basic';
            }
            if (id.includes('context/')) {
              return 'builder-context';
            }
            if (id.includes('utils/')) {
              return 'builder-utils';
            }
            return 'dashboard-builder';
          }
        }
      }
    },
    chunkSizeWarningLimit: 500, // Reduced from 1000
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2, // Multiple passes for better optimization
      },
      mangle: {
        safari10: true,
      },
    },
    // Enable source maps for better debugging
    sourcemap: false, // Disable in production for smaller bundles
    // Optimize CSS
    cssCodeSplit: true,
    // Target modern browsers for better optimization
    target: 'esnext',
  },
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
      'date-fns',
      'prismjs'
    ],
    exclude: ['@vite/client', '@vite/env'],
    // Force pre-bundling of heavy dependencies
    force: true,
  },
  server: {
    hmr: {
      overlay: false,
      // Optimize HMR for better development experience
      port: 24678,
    },
    // Enable file system caching
    fs: {
      cachedChecks: false,
    },
    // Optimize middleware
    middlewareMode: false,
  },
  // Enable experimental features for better performance
  experimental: {
    renderBuiltUrl(filename, { hostType }) {
      if (hostType === 'js') {
        return { js: `/${filename}` }
      } else {
        return { relative: true }
      }
    },
  },
  // Optimize CSS
  css: {
    devSourcemap: false,
  },
  // Enable esbuild optimizations
  esbuild: {
    target: 'esnext',
    format: 'esm',
    treeShaking: true,
  },
})
