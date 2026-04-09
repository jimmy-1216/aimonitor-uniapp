<template>
  <div class="page-wrap">
    <div class="page-nav-bar">
      <div class="page-nav-left">
        <div class="page-nav-title">历史记录</div>
        <div class="page-nav-sub">共 {{ store.myRecords.length }} 条</div>
      </div>
    </div>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4a5568" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
      <input v-model="search" placeholder="搜索平台、模型或用途..." />
      <button v-if="search" @click="search=''" style="background:none; border:none; color:#4a5568; cursor:pointer; font-size:14px;">✕</button>
    </div>

    <!-- 统计条 -->
    <div class="records-stat">
      <div class="rs-item">
        <div class="rs-val" style="color:#00d4ff;">¥{{ totalAmount }}</div>
        <div class="rs-lbl">累计充值</div>
      </div>
      <div class="rs-divider"></div>
      <div class="rs-item">
        <div class="rs-val" style="color:#a855f7;">{{ filtered.length }}</div>
        <div class="rs-lbl">条记录</div>
      </div>
      <div class="rs-divider"></div>
      <div class="rs-item">
        <div class="rs-val" style="color:#00ff88;">{{ platformCount }}</div>
        <div class="rs-lbl">个平台</div>
      </div>
    </div>

    <!-- 记录列表 -->
    <div v-if="filtered.length > 0" style="padding: 8px 16px 20px; display:flex; flex-direction:column; gap:8px;">
      <div v-for="r in filtered" :key="r.id" class="record-card">
        <div class="record-card-top">
          <div class="record-card-top-left">
            <div class="record-plat-icon">{{ r.platform[0] }}</div>
            <div>
              <div class="record-plat-name">{{ r.platform }}</div>
              <div class="record-meta">{{ r.llmModel }} · {{ r.rechargeDate }}</div>
            </div>
          </div>
          <div style="text-align:right;">
            <div class="record-amount">¥{{ r.amount }}</div>
            <div class="tag tag-gray" style="margin-top:4px; font-size:10px; padding:2px 6px;">{{ RECHARGE_TYPE_LABELS[r.rechargeType] }}</div>
          </div>
        </div>
        <div v-if="r.purposeTags.length > 0" style="display:flex; flex-wrap:wrap; gap:5px; margin: 8px 0 0;">
          <div v-for="tag in r.purposeTags.slice(0,3)" :key="tag" class="tag tag-blue" style="font-size:10px; padding:2px 7px;">{{ PURPOSE_LABELS[tag] }}</div>
          <div v-if="r.purposeTags.length > 3" class="tag tag-gray" style="font-size:10px; padding:2px 7px;">+{{ r.purposeTags.length - 3 }}</div>
        </div>
        <div v-if="r.purposeDesc" class="record-desc">{{ r.purposeDesc }}</div>
        <div class="record-footer">
          <div class="record-time">{{ formatTime(r.createdAt) }}</div>
          <button class="btn-danger" @click="deleteRecord(r.id)">删除</button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-box">
      <div class="empty-emoji">📭</div>
      <div class="empty-title">{{ search ? '没有匹配的记录' : '暂无充值记录' }}</div>
      <div class="empty-desc">{{ search ? '换个关键词试试' : '去提交您的第一条 AI 充值记录吧' }}</div>
      <router-link v-if="!search" to="/record/new" class="btn-primary" style="margin-top:14px; padding:10px 24px;">立即填报</router-link>
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

<style scoped>
.records-stat {
  display: flex; align-items: center;
  background: #1a2840; border-bottom: 1px solid rgba(99,179,237,0.22);
  padding: 10px 0; margin-bottom: 2px;
}
.rs-item { flex: 1; text-align: center; }
.rs-val { font-size: 17px; font-weight: 800; line-height: 1; }
.rs-lbl { font-size: 10px; color: #7a95aa; margin-top: 3px; }
.rs-divider { width: 1px; height: 28px; background: rgba(99,179,237,0.2); }

.record-card {
  background: #1a2840;
  border: 1px solid rgba(99,179,237,0.28);
  border-radius: 12px; padding: 14px;
  position: relative; overflow: hidden;
}
.record-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0,212,255,0.25), transparent);
}
.record-card-top { display: flex; align-items: flex-start; justify-content: space-between; }
.record-card-top-left { display: flex; align-items: center; gap: 10px; flex: 1; }
.record-plat-icon {
  width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
  background: linear-gradient(135deg, rgba(0,212,255,0.2), rgba(168,85,247,0.2));
  border: 1px solid rgba(0,212,255,0.25);
  display: flex; align-items: center; justify-content: center;
  color: #00d4ff; font-weight: 700; font-size: 14px;
}
.record-plat-name { font-size: 14px; font-weight: 600; color: #f0f8ff; }
.record-meta { font-size: 11px; color: #7a95aa; margin-top: 2px; }
.record-amount { font-size: 17px; font-weight: 800; color: #00d4ff; }
.record-desc { font-size: 12px; color: #7a95aa; margin-top: 8px; line-height: 1.5; }
.record-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(99,179,237,0.15); }
.record-time { font-size: 11px; color: #7a95aa; }
</style>
