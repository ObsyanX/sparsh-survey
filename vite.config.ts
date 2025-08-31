import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          motion: ['framer-motion'],
          three: ['@react-three/fiber', '@react-three/drei', 'three'],
          spline: ['@splinetool/react-spline', '@splinetool/runtime']
        }
      }
    },
    target: 'esnext',
    minify: 'esbuild',
    cssCodeSplit: true,
    sourcemap: false
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'framer-motion',
      '@react-three/fiber',
      '@react-three/drei',
      'three',
      'lodash.debounce',
      '@splinetool/react-spline',
      '@splinetool/runtime'
    ],
    exclude: []
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
