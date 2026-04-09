import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  preview: {
    allowedHosts: ['all'],
  },
  build: {
    // 提升 chunk 大小警告阈值（单位 kB）
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // 将 Vue 核心库单独拆包，利用浏览器长效缓存
        manualChunks: {
          'vendor-vue': ['vue', 'vue-router', 'pinia'],
        }
      }
    }
  }
})
