<template>
  <div class="page-wrap">
    <div class="page-nav-bar">
      <div class="page-nav-left">
        <div class="page-nav-title">成员排名</div>
        <div class="page-nav-sub">投入指数综合排名</div>
      </div>
    </div>

    <div class="search-bar">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4a5568" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
      <input v-model="search" placeholder="搜索成员名称..." />
    </div>

    <div style="padding: 8px 16px 20px; display:flex; flex-direction:column; gap:8px;">
      <div v-for="(m, i) in filtered" :key="m.id" class="member-card" @click="selected=m">
        <div class="mc-rank-badge" :class="'rb-'+Math.min(i,3)">
          {{ i < 3 ? ['🥇','🥈','🥉'][i] : i+1 }}
        </div>
        <div class="mc-avatar">{{ m.name[0] }}</div>
        <div class="mc-info">
          <div class="mc-name">{{ m.name }}</div>
          <div class="mc-meta">{{ m.recordCount }} 条 · ¥{{ m.total }}</div>
          <div class="mc-bar">
            <div class="mc-bar-fill" :style="{ width: m.score + '%', background: i===0 ? 'linear-gradient(90deg,#ffd60a,#ff9500)' : i===1 ? 'linear-gradient(90deg,#94a3b8,#64748b)' : 'linear-gradient(90deg,#00d4ff,#a855f7)' }"></div>
          </div>
        </div>
        <div class="mc-score">
          <div class="mc-score-val" :style="i===0?'color:#ffd60a':i===1?'color:#94a3b8':'color:#00d4ff'">{{ m.score }}</div>
          <div class="mc-score-lbl">分</div>
        </div>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <div v-if="selected" class="mp-overlay" @click.self="selected=null">
      <div class="detail-sheet">
        <div class="detail-header">
          <div class="detail-avatar">{{ selected.name[0] }}</div>
          <div>
            <div class="detail-name">{{ selected.name }}</div>
            <div class="detail-sub">成员详情</div>
          </div>
          <button @click="selected=null" class="detail-close">✕</button>
        </div>
        <div class="detail-grid">
          <div class="detail-cell" style="border-color:rgba(0,212,255,0.2);">
            <div class="detail-val" style="color:#00d4ff;">{{ selected.score }}</div>
            <div class="detail-lbl">投入指数</div>
          </div>
          <div class="detail-cell" style="border-color:rgba(168,85,247,0.2);">
            <div class="detail-val" style="color:#a855f7;">¥{{ selected.total }}</div>
            <div class="detail-lbl">累计充值</div>
          </div>
          <div class="detail-cell" style="border-color:rgba(255,149,0,0.2);">
            <div class="detail-val" style="color:#ff9500;">{{ selected.recordCount }}</div>
            <div class="detail-lbl">记录数量</div>
          </div>
          <div class="detail-cell" style="border-color:rgba(0,255,136,0.2);">
            <div class="detail-val" style="color:#00ff88;">{{ selected.platforms ?? selected.platformCount ?? 0 }}</div>
            <div class="detail-lbl">平台数量</div>
          </div>
        </div>
        <button class="btn-ghost" style="width:100%; padding:12px; margin-top:4px;" @click="selected=null">关闭</button>
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
  return store.memberStats.filter(m => m.name.toLowerCase().includes(search.value.toLowerCase()))
})
</script>

<style scoped>
.member-card {
  display: flex; align-items: center; gap: 10px;
  background: #111827; border: 1px solid rgba(99,179,237,0.1);
  border-radius: 12px; padding: 12px; cursor: pointer;
  transition: border-color 0.15s; position: relative; overflow: hidden;
}
.member-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(0,212,255,0.2), transparent); }
.member-card:active { border-color: rgba(0,212,255,0.3); }
.mc-rank-badge { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0; }
.rb-0 { background: rgba(255,214,10,0.1); }
.rb-1 { background: rgba(148,163,184,0.1); }
.rb-2 { background: rgba(180,120,60,0.1); }
.rb-3 { background: rgba(99,179,237,0.06); color: #4a5568; font-size: 11px; font-weight: 700; }
.mc-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, rgba(0,212,255,0.2), rgba(168,85,247,0.2)); border: 1px solid rgba(0,212,255,0.25); display: flex; align-items: center; justify-content: center; color: #00d4ff; font-weight: 700; font-size: 14px; flex-shrink: 0; }
.mc-info { flex: 1; min-width: 0; }
.mc-name { font-size: 13px; font-weight: 600; color: #e8f4fd; }
.mc-meta { font-size: 11px; color: #4a5568; margin-top: 2px; }
.mc-bar { height: 3px; background: rgba(255,255,255,0.05); border-radius: 2px; margin-top: 6px; overflow: hidden; }
.mc-bar-fill { height: 100%; border-radius: 2px; transition: width 0.6s ease; }
.mc-score { text-align: right; flex-shrink: 0; }
.mc-score-val { font-size: 20px; font-weight: 800; line-height: 1; }
.mc-score-lbl { font-size: 10px; color: #4a5568; margin-top: 2px; }

.detail-sheet { width: 100%; background: #111827; border: 1px solid rgba(99,179,237,0.15); border-radius: 20px 20px 0 0; padding: 20px 16px 24px; animation: sheet-up 0.25s ease; }
.detail-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.detail-avatar { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, rgba(0,212,255,0.25), rgba(168,85,247,0.25)); border: 1px solid rgba(0,212,255,0.4); display: flex; align-items: center; justify-content: center; color: #00d4ff; font-weight: 700; font-size: 18px; flex-shrink: 0; }
.detail-name { font-size: 16px; font-weight: 700; color: #e8f4fd; }
.detail-sub { font-size: 12px; color: #4a5568; margin-top: 2px; }
.detail-close { margin-left: auto; background: none; border: none; font-size: 18px; color: #4a5568; cursor: pointer; }
.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px; }
.detail-cell { background: rgba(255,255,255,0.03); border: 1px solid; border-radius: 10px; padding: 12px; text-align: center; }
.detail-val { font-size: 22px; font-weight: 800; line-height: 1; }
.detail-lbl { font-size: 11px; color: #4a5568; margin-top: 4px; }
@keyframes sheet-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
</style>
