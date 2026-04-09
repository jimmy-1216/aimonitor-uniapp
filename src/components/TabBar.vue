<template>
  <nav class="tab-bar">
    <router-link
      v-for="item in tabs"
      :key="item.to"
      :to="item.to"
      class="tab-item"
      :class="{ active: isActive(item) }"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
        stroke-linecap="round" stroke-linejoin="round">
        <path :d="item.icon" />
      </svg>
      <span>{{ item.label }}</span>
    </router-link>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/store/app'

const route = useRoute()
const store = useAppStore()

const employeeTabs = [
  { to: '/dashboard',  label: '看板', icon: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10' },
  { to: '/record/new', label: '填报', icon: 'M12 5v14M5 12h14' },
  { to: '/records',    label: '记录', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
]

const adminTabs = [
  { to: '/admin/overview', label: '总览', icon: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10' },
  { to: '/admin/members',  label: '成员', icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75' },
  { to: '/admin/trends',   label: '趋势', icon: 'M18 20V10M12 20V4M6 20v-6' },
]

const tabs = computed(() => store.currentUser.role === 'admin' ? adminTabs : employeeTabs)
function isActive(item) {
  return route.path === item.to || route.path.startsWith(item.to + '/')
}
</script>

<style scoped>
.tab-bar {
  display: flex;
  align-items: stretch;
  background: rgba(10,14,26,0.97);
  border-top: 1px solid rgba(99,179,237,0.12);
  flex-shrink: 0;
  backdrop-filter: blur(12px);
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* 底部 padding 含安全区，防止 iPhone X+ 系列底部被黑条遇挡 */
  padding: 8px 0 calc(12px + env(safe-area-inset-bottom, 0px));
  gap: 3px;
  cursor: pointer;
  text-decoration: none;
  color: #2d3f55;
  transition: color 0.2s;
}

.tab-item.active {
  color: #00d4ff;
}

.tab-item.active svg {
  filter: drop-shadow(0 0 5px rgba(0,212,255,0.6));
}

.tab-item svg {
  width: 22px;
  height: 22px;
}

.tab-item span {
  font-size: 10px;
  font-weight: 500;
}
</style>
