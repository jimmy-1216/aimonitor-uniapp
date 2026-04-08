<template>
  <div id="app-root">
    <!-- 模拟手机外壳（桌面端显示） -->
    <div class="phone-shell">
      <!-- 刘海 -->
      <div class="notch"></div>

      <!-- 状态栏 -->
      <div class="status-bar">
        <span class="status-time">{{ currentTime }}</span>
        <div class="status-icons">
          <!-- 信号 -->
          <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor">
            <rect x="0" y="4" width="3" height="7" rx="0.5" opacity="0.4"/>
            <rect x="4.5" y="2.5" width="3" height="8.5" rx="0.5" opacity="0.6"/>
            <rect x="9" y="1" width="3" height="10" rx="0.5" opacity="0.8"/>
            <rect x="13.5" y="0" width="2.5" height="11" rx="0.5"/>
          </svg>
          <!-- WiFi -->
          <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor">
            <path d="M7.5 2.5C9.8 2.5 11.8 3.5 13.2 5L14.5 3.7C12.7 1.9 10.2 0.8 7.5 0.8C4.8 0.8 2.3 1.9 0.5 3.7L1.8 5C3.2 3.5 5.2 2.5 7.5 2.5Z" opacity="0.4"/>
            <path d="M7.5 5C9 5 10.3 5.6 11.3 6.6L12.6 5.3C11.2 3.9 9.4 3 7.5 3C5.6 3 3.8 3.9 2.4 5.3L3.7 6.6C4.7 5.6 6 5 7.5 5Z" opacity="0.7"/>
            <circle cx="7.5" cy="9.5" r="1.5"/>
          </svg>
          <!-- 电池 -->
          <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
            <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="currentColor" stroke-opacity="0.35"/>
            <rect x="2" y="2" width="16" height="8" rx="2" fill="currentColor"/>
            <path d="M23 4v4a2 2 0 000-4z" fill="currentColor" opacity="0.4"/>
          </svg>
        </div>
      </div>

      <!-- Demo 切换条 -->
      <div class="demo-bar">
        <span class="demo-label">Demo 模式</span>
        <div class="demo-btns">
          <button
            :class="['demo-btn', { active: store.currentUser.role === 'user' }]"
            @click="store.switchRole('user')"
          >员工</button>
          <button
            :class="['demo-btn', { active: store.currentUser.role === 'admin' }]"
            @click="store.switchRole('admin')"
          >管理员</button>
        </div>
      </div>

      <!-- 页面内容区（可滚动） -->
      <div class="page-content">
        <router-view />
      </div>

      <!-- TabBar（固定在手机底部） -->
      <TabBar />
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import TabBar from '@/components/TabBar.vue'
import { useAppStore } from '@/store/app'

const store = useAppStore()
const router = useRouter()
const currentTime = ref('')

function updateTime() {
  const d = new Date()
  currentTime.value = d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0')
}
updateTime()
const timer = setInterval(updateTime, 10000)
onUnmounted(() => clearInterval(timer))

watch(() => store.currentUser.role, (role) => {
  if (role === 'admin') router.push('/admin/overview')
  else router.push('/dashboard')
})
</script>

<style>
/* ===== 全局重置 ===== */
*, *::before, *::after { box-sizing: border-box; }

html, body {
  margin: 0; padding: 0;
  width: 100%; height: 100%;
  background: #e5e7eb;
  font-family: -apple-system, 'PingFang SC', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
}

#app {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
}

#app-root {
  width: 100%; min-height: 100vh;
  display: flex; align-items: center; justify-content: center;
  padding: 20px 0;
}

/* ===== 手机外壳 ===== */
.phone-shell {
  width: 375px;
  height: 812px;
  background: #f5f6f8;
  border-radius: 44px;
  /* 手机边框 */
  box-shadow:
    0 0 0 2px #555,
    0 0 0 10px #1c1c1e,
    0 0 0 12px #3a3a3c,
    0 28px 80px rgba(0,0,0,0.45),
    0 8px 24px rgba(0,0,0,0.2);
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* ===== 刘海 ===== */
.notch {
  position: absolute;
  top: 0; left: 50%;
  transform: translateX(-50%);
  width: 126px; height: 30px;
  background: #1c1c1e;
  border-radius: 0 0 20px 20px;
  z-index: 999;
}

/* ===== 状态栏 ===== */
.status-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 22px 6px;
  background: #fff;
  flex-shrink: 0;
  position: relative; z-index: 10;
}
.status-time { font-size: 15px; font-weight: 600; color: #1a1a1a; letter-spacing: -0.3px; }
.status-icons { display: flex; align-items: center; gap: 6px; color: #1a1a1a; }

/* ===== Demo 切换条 ===== */
.demo-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 5px 16px;
  background: #fff;
  border-bottom: 1px solid #f0f1f3;
  flex-shrink: 0;
}
.demo-label { font-size: 11px; color: #999; }
.demo-btns { display: flex; gap: 4px; }
.demo-btn {
  padding: 3px 12px; font-size: 11px; font-weight: 500;
  border: 1px solid #e0e0e0; border-radius: 12px;
  background: #f5f6f8; color: #666;
  cursor: pointer; transition: all 0.2s;
  outline: none;
}
.demo-btn.active {
  background: #e8f8ef; color: #07c160; border-color: #07c160;
}

/* ===== 页面内容区 ===== */
.page-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  position: relative;
}
.page-content::-webkit-scrollbar { display: none; }

/* ===== 移动端全屏适配 ===== */
@media (max-width: 480px) {
  html, body { background: #f5f6f8; }
  #app-root { padding: 0; align-items: flex-start; }
  .phone-shell {
    width: 100vw;
    height: 100dvh;
    border-radius: 0;
    box-shadow: none;
  }
  .notch { display: none; }
  .status-bar { padding-top: env(safe-area-inset-top, 14px); }
}
</style>
