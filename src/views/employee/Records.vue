<template>
  <div class="page-wrap">
    <div class="page-header">
      <div class="header-orb" />
      <text class="page-title">历史记录</text>
      <text class="page-sub">共 {{ store.myRecords.length }} 条充值记录</text>
    </div>

    <!-- 搜索栏 -->
    <div class="container" style="margin-top: 16px; margin-bottom: 16px;">
      <div style="display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 0 12px;">
        <span style="font-size: 14px;">🔍</span>
        <input
          v-model="search"
          type="text"
          placeholder="搜索平台、模型或用途..."
          style="flex: 1; background: transparent; border: none; color: #f1f5f9; padding: 10px 0; outline: none; font-size: 13px;"
        />
        <button v-if="search" @click="search = ''" style="background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 14px;">✕</button>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="container" style="margin-bottom: 16px;">
      <div style="display: flex; gap: 8px;">
        <div class="glass-card" style="flex: 1; padding: 12px; text-align: center; font-size: 12px;">
          <div class="grad-text" style="font-weight: 600; font-size: 14px;">¥{{ totalAmount }}</div>
          <div style="color: #94a3b8; margin-top: 2px;">累计充值</div>
        </div>
        <div class="glass-card" style="flex: 1; padding: 12px; text-align: center; font-size: 12px;">
          <div class="grad-text" style="font-weight: 600; font-size: 14px;">{{ filtered.length }}</div>
          <div style="color: #94a3b8; margin-top: 2px;">条记录</div>
        </div>
        <div class="glass-card" style="flex: 1; padding: 12px; text-align: center; font-size: 12px;">
          <div class="grad-text" style="font-weight: 600; font-size: 14px;">{{ platformCount }}</div>
          <div style="color: #94a3b8; margin-top: 2px;">个平台</div>
        </div>
      </div>
    </div>

    <!-- 记录列表 -->
    <div class="container" style="margin-bottom: 100px;">
      <div v-if="filtered.length > 0" style="display: flex; flex-direction: column; gap: 12px;">
        <div v-for="r in filtered" :key="r.id" class="glass-card record-card">
          <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 10px; flex: 1;">
              <div style="width: 36px; height: 36px; border-radius: 8px; background: linear-gradient(135deg, #7c3aed, #4f46e5); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 600; font-size: 12px;">
                {{ r.platform[0] }}
              </div>
              <div>
                <div style="font-size: 13px; font-weight: 600;">{{ r.platform }}</div>
                <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">{{ r.llmModel }} · {{ r.rechargeDate }}</div>
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 14px; font-weight: 600; color: #a78bfa;">¥{{ r.amount }}</div>
              <div class="badge badge-purple" style="margin-top: 4px; font-size: 10px;">{{ RECHARGE_TYPE_LABELS[r.rechargeType] }}</div>
            </div>
          </div>
          <div v-if="r.purposeTags.length > 0" style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px;">
            <div v-for="tag in r.purposeTags.slice(0, 3)" :key="tag" class="badge badge-blue" style="font-size: 10px;">
              {{ PURPOSE_LABELS[tag] }}
            </div>
            <div v-if="r.purposeTags.length > 3" class="badge badge-blue" style="font-size: 10px;">
              +{{ r.purposeTags.length - 3 }}
            </div>
          </div>
          <div v-if="r.purposeDesc" style="font-size: 12px; color: #94a3b8; margin-bottom: 8px; line-height: 1.4;">
            {{ r.purposeDesc }}
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.05);">
            <div style="font-size: 11px; color: #64748b;">{{ formatTime(r.createdAt) }}</div>
            <button class="btn-danger" @click="deleteRecord(r.id)">🗑 删除</button>
          </div>
        </div>
      </div>
      <div v-else class="empty-box">
        <div class="empty-emoji">📭</div>
        <div class="empty-title">{{ search ? '没有匹配的记录' : '暂无充值记录' }}</div>
        <div class="empty-desc">{{ search ? '换个关键词试试' : '去提交您的第一条 AI 充值记录吧' }}</div>
        <router-link v-if="!search" to="/record/new" class="btn-primary" style="margin-top: 12px;">
          ➕ 立即填报
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '@/store/app'
import { PURPOSE_LABELS, RECHARGE_TYPE_LABELS } from '@/store/app'

const store = useAppStore()
const search = ref('')

const filtered = computed(() => {
  if (!search.value) return store.myRecords
  const q = search.value.toLowerCase()
  return store.myRecords.filter(r =>
    r.platform.toLowerCase().includes(q) ||
    r.llmModel.toLowerCase().includes(q) ||
    r.purposeTags.some(t => (PURPOSE_LABELS[t] || t).toLowerCase().includes(q)) ||
    r.purposeDesc.toLowerCase().includes(q)
  )
})

const totalAmount = computed(() => filtered.value.reduce((s, r) => s + Number(r.amount), 0))
const platformCount = computed(() => new Set(filtered.value.map(r => r.platform)).size)

function formatTime(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

function deleteRecord(id) {
  if (confirm('确定删除此记录？')) store.deleteRecord(id)
}
</script>

<style scoped>
.record-card { padding: 12px; }
</style>
