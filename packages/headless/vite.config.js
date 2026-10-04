import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      entryRoot: fileURLToPath(new URL('./src', import.meta.url)),
      outDir: 'dist',
      insertTypesEntry: true,
      copyDtsFiles: false,
      rollupTypes: false,
    }),
  ],
  resolve: {
    alias: {
      '@headless-kit/vue': fileURLToPath(new URL('./src/index.js', import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.js', import.meta.url)),
      name: 'HeadlessKit',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: { vue: 'Vue' },
        exports: 'named',
      },
    },
    sourcemap: true,
    emptyOutDir: true,
    target: 'es2020',
  },
})
