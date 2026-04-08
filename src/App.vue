<template>
  <div id="app-root">
    <div class="phone-shell">

      <!-- 刘海 -->
      <div class="notch"></div>

      <!-- 状态栏 -->
      <div class="status-bar">
        <span class="status-time">{{ currentTime }}</span>
        <div class="status-icons">
          <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
            <rect x="0" y="5" width="3" height="7" rx="0.6" opacity="0.3"/>
            <rect x="4.5" y="3" width="3" height="9" rx="0.6" opacity="0.5"/>
            <rect x="9" y="1" width="3" height="11" rx="0.6" opacity="0.75"/>
            <rect x="13.5" y="0" width="3" height="12" rx="0.6"/>
          </svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
            <path d="M8 3C10.5 3 12.7 4.1 14.2 5.8L15.5 4.4C13.6 2.4 11 1.1 8 1.1C5 1.1 2.4 2.4 0.5 4.4L1.8 5.8C3.3 4.1 5.5 3 8 3Z" opacity="0.35"/>
            <path d="M8 5.8C9.7 5.8 11.2 6.5 12.3 7.7L13.6 6.3C12.1 4.8 10.1 3.9 8 3.9C5.9 3.9 3.9 4.8 2.4 6.3L3.7 7.7C4.8 6.5 6.3 5.8 8 5.8Z" opacity="0.65"/>
            <circle cx="8" cy="10.5" r="1.5"/>
          </svg>
          <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
            <rect x="0.5" y="0.5" width="22" height="12" rx="3.5" stroke="currentColor" stroke-opacity="0.3"/>
            <rect x="2" y="2" width="17" height="9" rx="2" fill="currentColor"/>
            <path d="M24.5 4.5v4a2.2 2.2 0 000-4z" fill="currentColor" opacity="0.4"/>
          </svg>
        </div>
      </div>

      <!-- 微信小程序顶部功能区 -->
      <div class="mp-top-bar">
        <!-- 左侧：小程序名称 + 图标 -->
        <div class="mp-app-info">
          <div class="mp-app-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="#07c160" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span class="mp-app-name">智汇星盘</span>
        </div>

        <!-- 右侧：胶囊按钮 -->
        <div class="mp-capsule">
          <button class="mp-capsule-btn" @click="showMenu = true">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
              <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
            </svg>
          </button>
          <div class="mp-capsule-divider"></div>
          <button class="mp-capsule-btn" @click="showCloseConfirm = true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" width="13" height="13">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Demo 切换条 -->
      <div class="demo-bar">
        <span class="demo-label">Demo 模式</span>
        <div class="demo-btns">
          <button :class="['demo-btn', { active: store.currentUser.role === 'user' }]" @click="store.switchRole('user')">员工</button>
          <button :class="['demo-btn', { active: store.currentUser.role === 'admin' }]" @click="store.switchRole('admin')">管理员</button>
        </div>
      </div>

      <!-- 页面内容区 -->
      <div class="page-content">
        <router-view />
      </div>

      <!-- TabBar -->
      <TabBar />

      <!-- 微信菜单弹窗 -->
      <div v-if="showMenu" class="mp-overlay" @click.self="showMenu = false">
        <div class="mp-menu-sheet">
          <div class="mp-menu-title">更多操作</div>
          <div class="mp-menu-grid">
            <div class="mp-menu-item" v-for="item in menuItems" :key="item.label" @click="showMenu = false">
              <div class="mp-menu-icon">{{ item.icon }}</div>
              <div class="mp-menu-label">{{ item.label }}</div>
            </div>
          </div>
          <button class="mp-menu-cancel" @click="showMenu = false">取消</button>
        </div>
      </div>

      <!-- 关闭确认弹窗 -->
      <div v-if="showCloseConfirm" class="mp-overlay" @click.self="showCloseConfirm = false">
        <div class="mp-confirm-sheet">
          <div class="mp-confirm-icon">👋</div>
          <div class="mp-confirm-title">退出小程序</div>
          <div class="mp-confirm-desc">确定要退出「智汇星盘」吗？</div>
          <div class="mp-confirm-btns">
            <button class="mp-confirm-cancel" @click="showCloseConfirm = false">取消</button>
            <button class="mp-confirm-ok" @click="showCloseConfirm = false">确定</button>
          </div>
        </div>
      </div>

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
const showMenu = ref(false)
const showCloseConfirm = ref(false)

const menuItems = [
  { icon: '⭐', label: '收藏' },
  { icon: '📤', label: '分享' },
  { icon: '🔗', label: '复制链接' },
  { icon: '🔄', label: '刷新' },
  { icon: '💬', label: '反馈' },
  { icon: '📋', label: '关于' },
]

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
*, *::before, *::after { box-sizing: border-box; }

html, body {
  margin: 0; padding: 0;
  width: 100%; height: 100%;
  background: #d1d5db;
  font-family: -apple-system, 'PingFang SC', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
}

#app { width: 100%; height: 100%; }

#app-root {
  width: 100%; min-height: 100vh;
  display: flex; align-items: center; justify-content: center;
  padding: 24px 0;
  background: radial-gradient(ellipse at 50% 0%, #c8d6e5 0%, #b8c4d0 100%);
}

/* ===== 手机外壳 ===== */
.phone-shell {
  width: 375px;
  height: 812px;
  background: #f5f6f8;
  border-radius: 48px;
  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,0.15),
    0 0 0 1px #444,
    0 0 0 9px #1c1c1e,
    0 0 0 11px #3d3d3f,
    0 0 0 12px #2a2a2c,
    0 32px 80px rgba(0,0,0,0.5),
    0 8px 20px rgba(0,0,0,0.25);
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* 侧边按钮装饰 */
.phone-shell::after {
  content: '';
  position: absolute;
  right: -13px;
  top: 160px;
  width: 4px;
  height: 60px;
  background: #2a2a2c;
  border-radius: 0 3px 3px 0;
  box-shadow: 0 80px 0 #2a2a2c;
}

/* ===== 刘海 ===== */
.notch {
  position: absolute;
  top: 0; left: 50%;
  transform: translateX(-50%);
  width: 130px; height: 30px;
  background: #1c1c1e;
  border-radius: 0 0 22px 22px;
  z-index: 999;
}

/* ===== 状态栏 ===== */
.status-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 22px 4px;
  background: #fff;
  flex-shrink: 0;
  position: relative; z-index: 10;
}
.status-time { font-size: 15px; font-weight: 600; color: #1a1a1a; letter-spacing: -0.3px; }
.status-icons { display: flex; align-items: center; gap: 5px; color: #1a1a1a; }

/* ===== 微信小程序顶部功能区 ===== */
.mp-top-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 6px 12px 6px 16px;
  background: #fff;
  border-bottom: 1px solid #f0f1f3;
  flex-shrink: 0;
}

.mp-app-info {
  display: flex; align-items: center; gap: 8px;
}

.mp-app-icon {
  width: 28px; height: 28px;
  background: linear-gradient(135deg, #e8f8ef, #d0f0e0);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid rgba(7,193,96,0.2);
}

.mp-app-name {
  font-size: 14px; font-weight: 600; color: #1a1a1a;
}

/* 胶囊按钮 */
.mp-capsule {
  display: flex; align-items: center;
  height: 32px;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  background: #f7f7f7;
  overflow: hidden;
}

.mp-capsule-btn {
  display: flex; align-items: center; justify-content: center;
  width: 44px; height: 100%;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #555;
  transition: background 0.15s;
  padding: 0;
}
.mp-capsule-btn:active { background: #eee; }

.mp-capsule-divider {
  width: 1px; height: 18px;
  background: #ddd;
  flex-shrink: 0;
}

/* ===== Demo 切换条 ===== */
.demo-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 5px 16px;
  background: #fffbf0;
  border-bottom: 1px solid #fde68a;
  flex-shrink: 0;
}
.demo-label { font-size: 11px; color: #92400e; font-weight: 500; }
.demo-btns { display: flex; gap: 4px; }
.demo-btn {
  padding: 3px 12px; font-size: 11px; font-weight: 500;
  border: 1px solid #e0e0e0; border-radius: 12px;
  background: #fff; color: #666;
  cursor: pointer; transition: all 0.2s; outline: none;
}
.demo-btn.active { background: #e8f8ef; color: #07c160; border-color: #07c160; }

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

/* ===== 微信菜单弹窗 ===== */
.mp-overlay {
  position: absolute; inset: 0; z-index: 500;
  background: rgba(0,0,0,0.5);
  display: flex; align-items: flex-end; justify-content: center;
}

.mp-menu-sheet {
  width: 100%;
  background: #f5f6f8;
  border-radius: 16px 16px 0 0;
  padding: 20px 16px 24px;
  animation: sheet-up 0.25s ease;
}

.mp-menu-title {
  text-align: center; font-size: 13px; color: #999;
  margin-bottom: 16px;
}

.mp-menu-grid {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 16px; margin-bottom: 16px;
}

.mp-menu-item {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  cursor: pointer;
}

.mp-menu-icon {
  width: 52px; height: 52px;
  background: #fff; border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}

.mp-menu-label { font-size: 11px; color: #555; }

.mp-menu-cancel {
  width: 100%; padding: 14px;
  background: #fff; border: none; border-radius: 12px;
  font-size: 16px; color: #333; font-weight: 500;
  cursor: pointer;
}

/* ===== 关闭确认弹窗 ===== */
.mp-confirm-sheet {
  width: calc(100% - 48px);
  background: #fff;
  border-radius: 16px;
  padding: 28px 24px 20px;
  text-align: center;
  margin-bottom: 60px;
  animation: scale-in 0.2s ease;
}

.mp-confirm-icon { font-size: 40px; margin-bottom: 12px; }
.mp-confirm-title { font-size: 17px; font-weight: 600; color: #1a1a1a; margin-bottom: 8px; }
.mp-confirm-desc { font-size: 14px; color: #666; margin-bottom: 24px; }

.mp-confirm-btns { display: flex; gap: 12px; }
.mp-confirm-cancel {
  flex: 1; padding: 12px;
  background: #f5f6f8; border: none; border-radius: 10px;
  font-size: 15px; color: #555; cursor: pointer;
}
.mp-confirm-ok {
  flex: 1; padding: 12px;
  background: #07c160; border: none; border-radius: 10px;
  font-size: 15px; color: #fff; font-weight: 500; cursor: pointer;
}

@keyframes sheet-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
@keyframes scale-in { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }

/* ===== 移动端全屏适配 ===== */
@media (max-width: 480px) {
  html, body { background: #f5f6f8; }
  #app-root { padding: 0; background: #f5f6f8; align-items: flex-start; }
  .phone-shell {
    width: 100vw; height: 100dvh;
    border-radius: 0; box-shadow: none;
  }
  .phone-shell::after { display: none; }
  .notch { display: none; }
  .status-bar { padding-top: env(safe-area-inset-top, 14px); }
}
</style>
