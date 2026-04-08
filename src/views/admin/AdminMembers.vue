<template>
  <div class="page-wrap">
    <div class="page-header">
      <div class="header-orb" />
      <text class="page-title">成员排名</text>
      <text class="page-sub">按投入指数排序</text>
    </div>

    <div class="container" style="margin-bottom: 100px;">
      <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 24px;">
        <div
          v-for="(m, i) in store.memberStats"
          :key="m.id"
          class="glass-card"
          style="padding: 14px; cursor: pointer;"
          @click="selectedId = m.id"
        >
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
              <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #7c3aed, #4f46e5); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 14px;">
                {{ i + 1 }}
              </div>
              <div>
                <div style="font-size: 13px; font-weight: 600;">{{ m.name }}</div>
                <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">{{ m.recordCount }} 条记录 · ¥{{ m.total }}</div>
              </div>
            </div>
            <div class="badge badge-purple" style="font-size: 13px; font-weight: 700;">{{ m.score }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 详情抽屉 -->
    <teleport to="body">
      <transition name="fade">
        <div v-if="selectedId" class="overlay" @click.self="selectedId = null">
          <div class="sheet">
            <div v-if="selectedMember" style="display: flex; flex-direction: column; gap: 16px;">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                <div style="width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #7c3aed, #4f46e5); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 16px;">
                  {{ store.memberStats.indexOf(selectedMember) + 1 }}
                </div>
                <div>
                  <div style="font-size: 16px; font-weight: 700;">{{ selectedMember.name }}</div>
                  <div style="font-size: 12px; color: #94a3b8;">ID: {{ selectedMember.openId }}</div>
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div class="glass-card" style="padding: 12px; text-align: center;">
                  <div style="font-size: 11px; color: #94a3b8; margin-bottom: 6px;">投入指数</div>
                  <div class="grad-text" style="font-size: 18px; font-weight: 700;">{{ selectedMember.score }}</div>
                </div>
                <div class="glass-card" style="padding: 12px; text-align: center;">
                  <div style="font-size: 11px; color: #94a3b8; margin-bottom: 6px;">总充值</div>
                  <div class="grad-text" style="font-size: 18px; font-weight: 700;">¥{{ selectedMember.total }}</div>
                </div>
                <div class="glass-card" style="padding: 12px; text-align: center;">
                  <div style="font-size: 11px; color: #94a3b8; margin-bottom: 6px;">记录数</div>
                  <div class="grad-text" style="font-size: 18px; font-weight: 700;">{{ selectedMember.recordCount }}</div>
                </div>
                <div class="glass-card" style="padding: 12px; text-align: center;">
                  <div style="font-size: 11px; color: #94a3b8; margin-bottom: 6px;">平台数</div>
                  <div class="grad-text" style="font-size: 18px; font-weight: 700;">{{ selectedMember.platforms }}</div>
                </div>
              </div>

              <button class="btn-ghost" style="width: 100%; padding: 10px;" @click="selectedId = null">
                ✕ 关闭
              </button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '@/store/app'

const store = useAppStore()
const selectedId = ref(null)

const selectedMember = computed(() => store.memberStats.find(m => m.id === selectedId.value))
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
