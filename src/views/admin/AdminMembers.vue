<template>
  <div class="page-wrap">
    <!-- 导航栏 -->
    <div class="nav-bar">
      <div>
        <div class="nav-title">成员排名</div>
        <div class="nav-sub">投入指数综合排名</div>
      </div>
    </div>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bbb" stroke-width="2" stroke-linecap="round">
        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
      </svg>
      <input v-model="search" placeholder="搜索成员名称..." />
    </div>

    <!-- 排名列表 -->
    <div style="margin:0 16px; display:flex; flex-direction:column; gap:8px;">
      <div v-for="(m, i) in filtered" :key="m.id" class="card" style="padding:14px; cursor:pointer;" @click="selected=m">
        <!-- 头部 -->
        <div style="display:flex; align-items:center; gap:12px;">
          <!-- 排名徽章 -->
          <div style="width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:13px; flex-shrink:0;"
            :style="i===0 ? 'background:#fff7e6; color:#fa8c16;' : i===1 ? 'background:#f0f5ff; color:#1677ff;' : i===2 ? 'background:#f6ffed; color:#52c41a;' : 'background:#f5f6f8; color:#999;'">
            {{ i < 3 ? ['🥇','🥈','🥉'][i] : i+1 }}
          </div>
          <!-- 头像 -->
          <div style="width:38px; height:38px; border-radius:50%; background:linear-gradient(135deg,#07c160,#09e870); display:flex; align-items:center; justify-content:center; color:#fff; font-weight:700; font-size:15px; flex-shrink:0;">
            {{ m.name[0] }}
          </div>
          <!-- 信息 -->
          <div style="flex:1; min-width:0;">
            <div style="font-size:14px; font-weight:600;">{{ m.name }}</div>
            <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">{{ m.recordCount }} 条记录 · ¥{{ m.total }}</div>
          </div>
          <!-- 分数 -->
          <div style="text-align:right; flex-shrink:0;">
            <div style="font-size:20px; font-weight:700; color:var(--primary);">{{ m.score }}</div>
            <div style="font-size:10px; color:var(--text-muted);">投入指数</div>
          </div>
        </div>
        <!-- 进度条 -->
        <div class="progress-bar" style="margin-top:10px;">
          <div class="progress-fill" :style="{ width: (m.score/100*100)+'%' }" />
        </div>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <div v-if="selected" class="overlay" @click.self="selected=null">
      <div class="sheet">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;">
          <div style="font-size:16px; font-weight:600;">{{ selected.name }} 的详情</div>
          <button @click="selected=null" style="background:none; border:none; font-size:20px; color:#999; cursor:pointer;">✕</button>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:16px;">
          <div style="background:#f5f6f8; border-radius:10px; padding:12px; text-align:center;">
            <div style="font-size:20px; font-weight:700; color:var(--primary);">{{ selected.score }}</div>
            <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">投入指数</div>
          </div>
          <div style="background:#f5f6f8; border-radius:10px; padding:12px; text-align:center;">
            <div style="font-size:20px; font-weight:700; color:var(--blue);">¥{{ selected.total }}</div>
            <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">累计充值</div>
          </div>
          <div style="background:#f5f6f8; border-radius:10px; padding:12px; text-align:center;">
            <div style="font-size:20px; font-weight:700; color:var(--orange);">{{ selected.recordCount }}</div>
            <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">记录数量</div>
          </div>
          <div style="background:#f5f6f8; border-radius:10px; padding:12px; text-align:center;">
            <div style="font-size:20px; font-weight:700; color:var(--purple);">{{ selected.platforms ?? selected.platformCount ?? 0 }}</div>
            <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">平台数量</div>
          </div>
        </div>
        <button class="btn-ghost" style="width:100%; padding:10px;" @click="selected=null">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '@/store/app'

const store = useAppStore()
const search = ref('')
const selected = ref(null)

const filtered = computed(() => {
  if (!search.value) return store.memberStats
  const q = search.value.toLowerCase()
  return store.memberStats.filter(m => m.name.toLowerCase().includes(q))
})
</script>
