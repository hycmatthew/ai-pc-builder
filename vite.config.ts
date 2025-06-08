import { defineConfig } from 'vite'
import dotenv from 'dotenv'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

dotenv.config()

// https://vitejs.dev/config/
export default defineConfig({
  base: "/ai-pc-builder/",
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true, // 啟用縮放支持
        svgo: true, // 啟用 SVGO 優化
      },
      include: "**/*.svg?react",
    }),
  ],
  define: {
    'process.env': process.env,
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler', // or 'modern'
      },
    },
  },
})
