<template>
  <div id="app-root">
    <!-- 模拟手机外壳（仅桌面端显示） -->
    <div class="phone-shell">
      <!-- 状态栏 -->
      <div class="status-bar">
        <span class="status-time">{{ currentTime }}</span>
        <div class="status-icons">
          <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor">
            <rect x="0" y="4" width="3" height="7" rx="0.5" opacity="0.4"/>
            <rect x="4.5" y="2.5" width="3" height="8.5" rx="0.5" opacity="0.6"/>
            <rect x="9" y="1" width="3" height="10" rx="0.5" opacity="0.8"/>
            <rect x="13.5" y="0" width="2.5" height="11" rx="0.5"/>
          </svg>
          <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor">
            <path d="M7.5 2.5C9.8 2.5 11.8 3.5 13.2 5L14.5 3.7C12.7 1.9 10.2 0.8 7.5 0.8C4.8 0.8 2.3 1.9 0.5 3.7L1.8 5C3.2 3.5 5.2 2.5 7.5 2.5Z" opacity="0.4"/>
            <path d="M7.5 5C9 5 10.3 5.6 11.3 6.6L12.6 5.3C11.2 3.9 9.4 3 7.5 3C5.6 3 3.8 3.9 2.4 5.3L3.7 6.6C4.7 5.6 6 5 7.5 5Z" opacity="0.7"/>
            <circle cx="7.5" cy="9.5" r="1.5"/>
          </svg>
          <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
            <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="currentColor" stroke-opacity="0.35"/>
            <rect x="2" y="2" width="16" height="8" rx="2" fill="currentColor"/>
            <path d="M23 4v4a2 2 0 000-4z" fill="currentColor" opacity="0.4"/>
          </svg>
        </div>
      </div>

      <!-- Demo 切换条 -->
      <div class="demo-bar">
        <span style="font-size:11px; color:#666;">Demo</span>
        <div style="display:flex; gap:4px;">
          <button :class="['demo-btn', {active: store.currentUser.role==='user'}]" @click="store.switchRole('user')">员工</button>
          <button :class="['demo-btn', {active: store.currentUser.role==='admin'}]" @click="store.switchRole('admin')">管理员</button>
        </div>
      </div>

      <!-- 页面内容 -->
      <div class="page-content">
        <router-view />
      </div>

      <!-- TabBar -->
      <TabBar />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import TabBar from '@/components/TabBar.vue'
import { useAppStore } from '@/store/app'

const store = useAppStore()
const router = useRouter()
const currentTime = ref('')

function updateTime() {
  const d = new Date()
  currentTime.value = d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0')
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
/* 桌面端居中展示手机外壳 */
body { background: #e8eaed; display: flex; align-items: center; justify-content: center; min-height: 100vh; }

#app-root {
  display: flex; align-items: center; justify-content: center;
  min-height: 100vh; width: 100%;
}

.phone-shell {
  width: 375px;
  height: 812px;
  background: #f5f6f8;
  border-radius: 44px;
  box-shadow: 0 0 0 10px #1a1a1a, 0 0 0 12px #333, 0 24px 80px rgba(0,0,0,0.4);
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* 刘海 */
.phone-shell::before {
  content: '';
  position: absolute;
  top: 0; left: 50%;
  transform: translateX(-50%);
  width: 120px; height: 28px;
  background: #1a1a1a;
  border-radius: 0 0 18px 18px;
  z-index: 999;
}

.status-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 20px 6px;
  background: #fff;
  position: relative; z-index: 10;
  flex-shrink: 0;
}
.status-time { font-size: 15px; font-weight: 600; color: #1a1a1a; }
.status-icons { display: flex; align-items: center; gap: 5px; color: #1a1a1a; }

.demo-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 5px 16px;
  background: #fff;
  border-bottom: 1px solid #f0f1f3;
  flex-shrink: 0;
}
.demo-btn {
  padding: 3px 10px; font-size: 11px; font-weight: 500;
  border: 1px solid #e0e0e0; border-radius: 12px;
  background: #f5f6f8; color: #666; cursor: pointer; transition: all 0.2s;
}
.demo-btn.active { background: #e8f8ef; color: #07c160; border-color: #07c160; }

.page-content {
  flex: 1; overflow-y: auto; overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.page-content::-webkit-scrollbar { display: none; }

/* 移动端全屏 */
@media (max-width: 480px) {
  body { background: #f5f6f8; }
  .phone-shell {
    width: 100vw; height: 100vh;
    border-radius: 0;
    box-shadow: none;
  }
  .phone-shell::before { display: none; }
  .status-bar { padding-top: env(safe-area-inset-top, 14px); }
}
</style>
