<template>
  <div id="app-root">
    <!-- Demo 角色切换条 -->
    <div class="demo-bar">
      <span class="demo-label">Demo 模式</span>
      <div class="demo-btns">
        <button
          :class="['demo-btn', { active: store.currentUser.role === 'user' }]"
          @click="store.switchRole('user')"
        >员工视图</button>
        <button
          :class="['demo-btn', { active: store.currentUser.role === 'admin' }]"
          @click="store.switchRole('admin')"
        >管理员视图</button>
      </div>
    </div>

    <router-view />
    <TabBar />
  </div>
</template>

<script setup>
import TabBar from '@/components/TabBar.vue'
import { useAppStore } from '@/store/app'
import { watch } from 'vue'
import { useRouter } from 'vue-router'

const store = useAppStore()
const router = useRouter()

watch(() => store.currentUser.role, (role) => {
  if (role === 'admin') router.push('/admin/overview')
  else router.push('/dashboard')
})
</script>

<style>
.demo-bar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 999;
  display: flex; align-items: center; justify-content: space-between;
  padding: 6px 16px;
  background: rgba(124,58,237,0.15);
  border-bottom: 1px solid rgba(124,58,237,0.25);
  backdrop-filter: blur(8px);
}
.demo-label { font-size: 11px; color: #a78bfa; font-weight: 600; letter-spacing: 0.05em; }
.demo-btns  { display: flex; gap: 6px; }
.demo-btn {
  padding: 3px 10px; font-size: 11px; font-weight: 500;
  border: 1px solid rgba(167,139,250,0.3); border-radius: 12px;
  background: transparent; color: #94a3b8; cursor: pointer; transition: all 0.2s;
}
.demo-btn.active { background: rgba(124,58,237,0.3); color: #a78bfa; border-color: #a78bfa; }
</style>
