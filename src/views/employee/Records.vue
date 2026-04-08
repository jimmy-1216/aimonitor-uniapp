<template>
  <div class="page-wrap">
    <!-- 页面标题栏 -->
    <div class="page-nav-bar">
      <div class="page-nav-left">
        <div class="page-nav-title">历史记录</div>
        <div class="page-nav-sub">共 {{ store.myRecords.length }} 条</div>
      </div>
    </div>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bbb" stroke-width="2" stroke-linecap="round">
        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
      </svg>
      <input v-model="search" placeholder="搜索平台、模型或用途..." />
      <button v-if="search" @click="search=''" style="background:none; border:none; color:#bbb; cursor:pointer; font-size:14px;">✕</button>
    </div>

    <!-- 统计横条 -->
    <div style="display:flex; gap:1px; margin:0 16px 12px; background:var(--border-light); border-radius:10px; overflow:hidden;">
      <div style="flex:1; background:#fff; padding:10px; text-align:center;">
        <div style="font-size:16px; font-weight:700; color:var(--primary);">¥{{ totalAmount }}</div>
        <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">累计充值</div>
      </div>
      <div style="flex:1; background:#fff; padding:10px; text-align:center;">
        <div style="font-size:16px; font-weight:700; color:var(--blue);">{{ filtered.length }}</div>
        <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">条记录</div>
      </div>
      <div style="flex:1; background:#fff; padding:10px; text-align:center;">
        <div style="font-size:16px; font-weight:700; color:var(--orange);">{{ platformCount }}</div>
        <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">个平台</div>
      </div>
    </div>

    <!-- 记录列表 -->
    <div v-if="filtered.length > 0" style="display:flex; flex-direction:column; gap:0; margin:0 16px;">
      <div v-for="(r, i) in filtered" :key="r.id" class="card" style="margin-bottom:10px; padding:14px;">
        <!-- 头部 -->
        <div style="display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:8px;">
          <div style="display:flex; align-items:center; gap:10px; flex:1;">
            <div style="width:38px; height:38px; border-radius:10px; background:linear-gradient(135deg,#07c160,#09e870); display:flex; align-items:center; justify-content:center; color:#fff; font-weight:700; font-size:14px; flex-shrink:0;">
              {{ r.platform[0] }}
            </div>
            <div style="flex:1; min-width:0;">
              <div style="font-size:14px; font-weight:600; color:var(--text-primary);">{{ r.platform }}</div>
              <div style="font-size:12px; color:var(--text-muted); margin-top:2px;">{{ r.llmModel }} · {{ r.rechargeDate }}</div>
            </div>
          </div>
          <div style="text-align:right; flex-shrink:0; margin-left:8px;">
            <div style="font-size:16px; font-weight:700; color:var(--primary);">¥{{ r.amount }}</div>
            <div class="tag tag-gray" style="font-size:10px; margin-top:4px; padding:2px 6px;">{{ RECHARGE_TYPE_LABELS[r.rechargeType] }}</div>
          </div>
        </div>
        <!-- 标签 -->
        <div v-if="r.purposeTags.length > 0" style="display:flex; flex-wrap:wrap; gap:5px; margin-bottom:8px;">
          <div v-for="tag in r.purposeTags.slice(0,3)" :key="tag" class="tag tag-green" style="font-size:11px; padding:2px 8px;">{{ PURPOSE_LABELS[tag] }}</div>
          <div v-if="r.purposeTags.length > 3" class="tag tag-gray" style="font-size:11px; padding:2px 8px;">+{{ r.purposeTags.length - 3 }}</div>
        </div>
        <!-- 描述 -->
        <div v-if="r.purposeDesc" style="font-size:12px; color:var(--text-secondary); margin-bottom:8px; line-height:1.5;">{{ r.purposeDesc }}</div>
        <!-- 底部 -->
        <div style="display:flex; align-items:center; justify-content:space-between; padding-top:8px; border-top:1px solid var(--border-light);">
          <div style="font-size:11px; color:var(--text-light);">{{ formatTime(r.createdAt) }}</div>
          <button class="btn-danger" @click="deleteRecord(r.id)">删除</button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-box">
      <div class="empty-emoji">📭</div>
      <div class="empty-title">{{ search ? '没有匹配的记录' : '暂无充值记录' }}</div>
      <div class="empty-desc">{{ search ? '换个关键词试试' : '去提交您的第一条 AI 充值记录吧' }}</div>
      <router-link v-if="!search" to="/record/new" class="btn-primary" style="margin-top:12px;">立即填报</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore, PURPOSE_LABELS, RECHARGE_TYPE_LABELS } from '@/store/app'

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
