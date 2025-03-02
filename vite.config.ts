import { defineConfig } from 'vite'
import path from 'node:path'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'
import tsConfigPaths from 'vite-tsconfig-paths'
import renderer from 'vite-plugin-electron-renderer'
// const { resolve } = require('path')
import resolve from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    renderer({
        resolve: {
            'music-metadata': { type: 'esm' },
        }
    }),
    tsConfigPaths(),
    electron({
      main: {
        // Shortcut of `build.lib.entry`.
        entry: 'electron/main.ts',
      },
      preload: {
        // Shortcut of `build.rollupOptions.input`.
        // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
        input: {
          main_window: path.join(__dirname, 'electron/preload.ts'),
        //   modal_window: resolve(__dirname, 'modalWindow.html')
        } 
      },
      // Ployfill the Electron and Node.js built-in modules for Renderer process.
      // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
      renderer: {},
    }),
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        player: path.resolve(__dirname, 'player.html')
      }
    }
  }
})
