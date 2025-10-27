
import react from '@vitejs/plugin-react-swc'
import dts from 'vite-plugin-dts'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  // Dev mode (dev, preview) - regular React app
  if (command === 'serve') {
    return {
      plugins: [react({
        jsxImportSource: 'react'
      })],
      root: '.',
      server: {
        port: 3000,
        open: true
      }
    }
  }
  
  // Build mode - library mode
  return {
    plugins: [
      react({
        jsxImportSource: 'react'
      }),
      dts({
        include: ['src/**/*.ts', 'src/**/*.tsx', 'index.ts'],
        outDir: 'dist',
        rollupTypes: true
      })
    ],
    build: {
      lib: {
        entry: path.resolve(__dirname, 'index.ts'),
        formats: ['es', 'umd'],
        name: 'Example Form',
        fileName: (format) => `index.${format}.js`
      },
      rollupOptions: {
        external: ['react', 'react-dom'],
        output: {
          assetFileNames: 'styles.css',
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM'
          }
        }
      },
      cssCodeSplit: false
    }
  }
})




// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-swc'
// import dts from 'vite-plugin-dts'
// import path from 'path'

// export default defineConfig({
//   plugins: [
//     react(),
//     dts({
//       include: ['src/**/*.ts', 'src/**/*.tsx', 'index.ts'],
//       beforeWriteFile: (filePath, content) => ({
//         filePath: filePath,
//         content: content
//       }),
//       outDir: 'dist',
//       insertTypesEntry: true,
//       rollupTypes: true
//     })
//   ],
//   build: {
//     lib: {
//       entry: path.resolve(__dirname, 'index.ts'),
//       formats: ['es', 'cjs'],
//       fileName: (format) => `index.${format}.js`
//     },
//     rollupOptions: {
//       external: ['react', 'react-dom'],
//     }
//   }
// })
