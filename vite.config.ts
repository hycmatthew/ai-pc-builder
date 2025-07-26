import { defineConfig, loadEnv } from 'vite'
import dotenv from 'dotenv'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

dotenv.config()

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 只加载以 VITE_ 为前缀的环境变量
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    build: {
      outDir: 'dist',
    },
    esbuild: {
      drop: ['console', 'debugger'],
    },
    base: process.env.NODE_ENV === 'production' ? '/' : '/',
    plugins: [
      react(),
      svgr({
        svgrOptions: {
          icon: true, // 啟用縮放支持
          svgo: true, // 啟用 SVGO 優化
        },
        include: '**/*.svg?react',
      }),
    ],
    define: {
      'import.meta.env': JSON.stringify(env),
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler', // or 'modern'
        },
      },
    },
  }
})
