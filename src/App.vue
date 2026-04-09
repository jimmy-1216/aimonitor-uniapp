<template>
  <div id="app-root">
    <div class="phone-shell">
      <div class="notch"></div>
      <div class="status-bar">
        <span class="status-time">{{ currentTime }}</span>
        <div class="status-icons">
          <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor"><rect x="0" y="5" width="3" height="7" rx="0.6" opacity="0.4"/><rect x="4.5" y="3" width="3" height="9" rx="0.6" opacity="0.6"/><rect x="9" y="1" width="3" height="11" rx="0.6" opacity="0.8"/><rect x="13.5" y="0" width="3" height="12" rx="0.6"/></svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor"><path d="M8 3C10.5 3 12.7 4.1 14.2 5.8L15.5 4.4C13.6 2.4 11 1.1 8 1.1C5 1.1 2.4 2.4 0.5 4.4L1.8 5.8C3.3 4.1 5.5 3 8 3Z" opacity="0.4"/><path d="M8 5.8C9.7 5.8 11.2 6.5 12.3 7.7L13.6 6.3C12.1 4.8 10.1 3.9 8 3.9C5.9 3.9 3.9 4.8 2.4 6.3L3.7 7.7C4.8 6.5 6.3 5.8 8 5.8Z" opacity="0.7"/><circle cx="8" cy="10.5" r="1.5"/></svg>
          <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="22" height="12" rx="3.5" stroke="currentColor" stroke-opacity="0.4"/><rect x="2" y="2" width="17" height="9" rx="2" fill="currentColor"/><path d="M24.5 4.5v4a2.2 2.2 0 000-4z" fill="currentColor" opacity="0.4"/></svg>
        </div>
      </div>
      <div class="mp-top-bar">
        <div class="mp-app-info">
          <div class="mp-app-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="#00d4ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          </div>
          <span class="mp-app-name">智汇星盘</span>
          <span class="glow-dot" style="margin-left:4px;"></span>
        </div>
        <div class="mp-capsule" @click.stop>
          <button class="mp-capsule-btn" @click="showMenu = true">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
          </button>
          <div class="mp-capsule-divider"></div>
          <button class="mp-capsule-btn" @click="showCloseConfirm = true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" width="13" height="13"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
      </div>
      <div class="demo-bar">
        <div class="demo-label">
          <span class="glow-dot" style="width:5px;height:5px;"></span>
          <span>DEMO</span>
        </div>
        <div class="demo-btns">
          <button :class="['demo-btn', { active: store.currentUser.role === 'user' }]" @click="store.switchRole('user')">员工视角</button>
          <button :class="['demo-btn', { active: store.currentUser.role === 'admin' }]" @click="store.switchRole('admin')">管理员</button>
        </div>
      </div>
      <div class="page-content">
        <router-view />
      </div>
      <TabBar />
      <div v-if="showMenu" class="mp-overlay" @click.self="showMenu = false">
        <div class="mp-menu-sheet">
          <div class="mp-menu-title">MORE OPTIONS</div>
          <div class="mp-menu-grid">
            <div class="mp-menu-item" v-for="item in menuItems" :key="item.label" @click="showMenu = false">
              <div class="mp-menu-icon">{{ item.icon }}</div>
              <div class="mp-menu-label">{{ item.label }}</div>
            </div>
          </div>
          <button class="mp-menu-cancel" @click="showMenu = false">取消</button>
        </div>
      </div>
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
html, body { margin: 0; padding: 0; width: 100%; height: 100%; font-family: -apple-system, 'PingFang SC', 'SF Pro Display', sans-serif; -webkit-font-smoothing: antialiased; }
#app { width: 100%; height: 100%; }
#app-root { width: 100%; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px 0; background: radial-gradient(ellipse at 30% 20%, #152a50 0%, #0f1a2e 60%, #121030 100%); }
.phone-shell { width: 375px; height: 812px; background: #111d30; border-radius: 50px; box-shadow: inset 0 0 0 1px rgba(0,212,255,0.18), 0 0 0 1px #223350, 0 0 0 9px #162038, 0 0 0 11px #223350, 0 0 0 12px #162038, 0 40px 100px rgba(0,0,0,0.5), 0 0 100px rgba(0,212,255,0.14); overflow: hidden; position: relative; display: flex; flex-direction: column; }
.phone-shell::after { content: ''; position: absolute; right: -13px; top: 160px; width: 4px; height: 60px; background: #223350; border-radius: 0 3px 3px 0; box-shadow: 0 80px 0 #223350; }
.notch { position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 130px; height: 30px; background: #0c1525; border-radius: 0 0 22px 22px; z-index: 999; }
.status-bar { display: flex; align-items: center; justify-content: space-between; padding: 14px 22px 4px; background: #111d30; flex-shrink: 0; position: relative; z-index: 10; }
.status-time { font-size: 15px; font-weight: 600; color: #e8f4fd; letter-spacing: -0.3px; }
.status-icons { display: flex; align-items: center; gap: 5px; color: #94a3b8; }
.mp-top-bar { display: flex; align-items: center; justify-content: space-between; padding: 5px 12px 5px 14px; background: rgba(17,29,48,0.98); border-bottom: 1px solid rgba(99,179,237,0.18); flex-shrink: 0; }
.mp-app-info { display: flex; align-items: center; gap: 8px; }
.mp-app-icon { width: 26px; height: 26px; background: linear-gradient(135deg, rgba(0,212,255,0.15), rgba(168,85,247,0.15)); border-radius: 8px; border: 1px solid rgba(0,212,255,0.3); display: flex; align-items: center; justify-content: center; }
.mp-app-name { font-size: 13px; font-weight: 700; color: #e8f4fd; letter-spacing: 0.5px; }
.mp-capsule { display: flex; align-items: center; height: 28px; border: 1px solid rgba(99,179,237,0.25); border-radius: 14px; background: rgba(255,255,255,0.04); overflow: hidden; }
.mp-capsule-btn { display: flex; align-items: center; justify-content: center; width: 40px; height: 100%; background: transparent; border: none; cursor: pointer; color: #94a3b8; transition: all 0.15s; padding: 0; }
.mp-capsule-btn:active { background: rgba(0,212,255,0.1); color: #00d4ff; }
.mp-capsule-divider { width: 1px; height: 14px; background: rgba(99,179,237,0.2); flex-shrink: 0; }
.demo-bar { display: flex; align-items: center; justify-content: space-between; padding: 4px 14px; background: rgba(0,212,255,0.06); border-bottom: 1px solid rgba(0,212,255,0.15); flex-shrink: 0; }
.demo-label { display: flex; align-items: center; gap: 5px; font-size: 10px; color: rgba(0,212,255,0.6); font-weight: 600; letter-spacing: 1px; }
.demo-btns { display: flex; gap: 4px; }
.demo-btn { padding: 3px 10px; font-size: 11px; font-weight: 500; border: 1px solid rgba(99,179,237,0.25); border-radius: 12px; background: transparent; color: #6b8099; cursor: pointer; transition: all 0.2s; outline: none; }
.demo-btn.active { background: rgba(0,212,255,0.15); color: #00d4ff; border-color: rgba(0,212,255,0.5); box-shadow: 0 0 8px rgba(0,212,255,0.2); }
.page-content { flex: 1; overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; scrollbar-width: none; position: relative; }
.page-content::-webkit-scrollbar { display: none; }
.mp-overlay { position: absolute; inset: 0; z-index: 500; background: rgba(0,0,0,0.7); display: flex; align-items: flex-end; justify-content: center; backdrop-filter: blur(4px); }
.mp-menu-sheet { width: 100%; background: #1a2840; border: 1px solid rgba(99,179,237,0.15); border-radius: 20px 20px 0 0; padding: 20px 16px 24px; animation: sheet-up 0.25s ease; }
.mp-menu-title { text-align: center; font-size: 11px; color: #6b8099; margin-bottom: 16px; letter-spacing: 2px; }
.mp-menu-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 16px; }
.mp-menu-item { display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer; }
.mp-menu-icon { width: 50px; height: 50px; background: #223350; border: 1px solid rgba(99,179,237,0.15); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
.mp-menu-label { font-size: 11px; color: #a8bdd0; }
.mp-menu-cancel { width: 100%; padding: 13px; background: #223350; border: 1px solid rgba(99,179,237,0.2); border-radius: 12px; font-size: 15px; color: #a8bdd0; cursor: pointer; }
.mp-confirm-sheet { width: calc(100% - 48px); background: #1a2840; border: 1px solid rgba(99,179,237,0.25); border-radius: 18px; padding: 28px 24px 20px; text-align: center; margin-bottom: 60px; animation: scale-in 0.2s ease; }
.mp-confirm-icon { font-size: 40px; margin-bottom: 12px; }
.mp-confirm-title { font-size: 17px; font-weight: 600; color: #edf6ff; margin-bottom: 8px; }
.mp-confirm-desc { font-size: 13px; color: #6b8099; margin-bottom: 24px; }
.mp-confirm-btns { display: flex; gap: 12px; }
.mp-confirm-cancel { flex: 1; padding: 12px; background: #223350; border: 1px solid rgba(99,179,237,0.2); border-radius: 10px; font-size: 15px; color: #a8bdd0; cursor: pointer; }
.mp-confirm-ok { flex: 1; padding: 12px; background: linear-gradient(135deg, #00d4ff, #0099cc); border: none; border-radius: 10px; font-size: 15px; color: #000; font-weight: 600; cursor: pointer; }
@keyframes sheet-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
@keyframes scale-in { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@media (max-width: 480px) {
  html, body { background: #0f1a2e; }
  #app-root { padding: 0; background: #0f1a2e; align-items: flex-start; }
  .phone-shell { width: 100vw; height: 100dvh; border-radius: 0; box-shadow: none; }
  .phone-shell::after { display: none; }
  .notch { display: none; }
  /* 顶部安全区：小程序内已由微信处理，此处仅应对独立 H5 访问场景 */
  .status-bar { padding-top: max(env(safe-area-inset-top, 14px), 14px); }
}
</style>
