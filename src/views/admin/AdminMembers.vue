<template>
  <div class="page-wrap">
    <div class="page-nav-bar">
      <div class="page-nav-left">
        <div class="page-nav-title">成员排名</div>
        <div class="page-nav-sub">AI 效能综合评分（满分 100 分）</div>
      </div>
    </div>

    <div class="search-bar">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4a5568" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
      <input v-model="search" placeholder="搜索成员名称..." />
      <button v-if="search" class="search-clear" @click="search=''">✕</button>
    </div>

    <div style="padding: 8px 16px 20px; display:flex; flex-direction:column; gap:8px;">
      <div v-for="(m, i) in filtered" :key="m.id" class="member-card" @click="openDetail(m)">
        <div class="mc-rank-badge" :class="'rb-'+Math.min(i,3)">
          {{ i < 3 ? ['🥇','🥈','🥉'][i] : i+1 }}
        </div>
        <div class="mc-avatar">{{ m.name[0] }}</div>
        <div class="mc-info">
          <div class="mc-name">{{ m.name }}</div>
          <div class="mc-meta">
            投入 <span style="color:#00d4ff;">{{ m.inputTotal }}</span> ·
            产出 <span style="color:#a855f7;">{{ m.outputTotal }}</span>
          </div>
          <div class="mc-bar">
            <div class="mc-bar-fill" :style="{ width: m.score + '%', background: i===0 ? 'linear-gradient(90deg,#ffd60a,#ff9500)' : i===1 ? 'linear-gradient(90deg,#94a3b8,#64748b)' : 'linear-gradient(90deg,#00d4ff,#a855f7)' }"></div>
          </div>
        </div>
        <div class="mc-score">
          <div class="mc-score-val" :style="i===0?'color:#ffd60a':i===1?'color:#94a3b8':'color:#00d4ff'">{{ m.score }}</div>
          <div class="mc-score-lbl">/ 100</div>
        </div>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <div v-if="selected" class="mp-overlay" @click.self="closeDetail">
      <div class="detail-sheet">
        <!-- 头部 -->
        <div class="detail-header">
          <div class="detail-avatar">{{ selected.name[0] }}</div>
          <div>
            <div class="detail-name">{{ selected.name }}</div>
            <div class="detail-sub">AI 效能总分 <span style="color:#00d4ff;font-weight:800;">{{ selected.score }}</span> / 100</div>
          </div>
          <button @click="closeDetail" class="detail-close">✕</button>
        </div>

        <!-- 总分双维度概览 -->
        <div class="score-overview">
          <div class="score-dim" style="border-color:rgba(0,212,255,0.3);">
            <div class="score-dim-label">投入指数</div>
            <div class="score-dim-val" style="color:#00d4ff;">{{ selected.inputTotal }}</div>
            <div class="score-dim-max">/ 50</div>
          </div>
          <div class="score-dim-divider">+</div>
          <div class="score-dim" style="border-color:rgba(168,85,247,0.3);">
            <div class="score-dim-label">产出指数</div>
            <div class="score-dim-val" style="color:#a855f7;">{{ selected.outputTotal }}</div>
            <div class="score-dim-max">/ 50</div>
          </div>
          <div class="score-dim-divider">=</div>
          <div class="score-dim" style="border-color:rgba(255,214,10,0.3);">
            <div class="score-dim-label">AI 效能分</div>
            <div class="score-dim-val" style="color:#ffd60a;">{{ selected.score }}</div>
            <div class="score-dim-max">/ 100</div>
          </div>
        </div>

        <!-- 投入指数明细 -->
        <div class="section-label">📥 投入指数明细（50分）</div>
        <div class="breakdown-list">
          <div class="breakdown-item">
            <div class="breakdown-name">充值金额</div>
            <div class="breakdown-desc">¥{{ selected.breakdown?.amount ?? 0 }}</div>
            <div class="breakdown-bar-wrap">
              <div class="breakdown-bar" :style="{ width: (selected.amountScore/20*100)+'%', background:'#00d4ff' }"></div>
            </div>
            <div class="breakdown-score">{{ selected.amountScore }}<span class="breakdown-max">/20</span></div>
          </div>
          <div class="breakdown-item">
            <div class="breakdown-name">大模型多样性</div>
            <div class="breakdown-desc">{{ selected.breakdown?.modelCount ?? 0 }} 个模型</div>
            <div class="breakdown-bar-wrap">
              <div class="breakdown-bar" :style="{ width: (selected.modelScore/15*100)+'%', background:'#00d4ff' }"></div>
            </div>
            <div class="breakdown-score">{{ selected.modelScore }}<span class="breakdown-max">/15</span></div>
          </div>
          <div class="breakdown-item">
            <div class="breakdown-name">使用频次</div>
            <div class="breakdown-desc">{{ selected.breakdown?.recordCount ?? 0 }} 次充值</div>
            <div class="breakdown-bar-wrap">
              <div class="breakdown-bar" :style="{ width: (selected.freqScore/15*100)+'%', background:'#00d4ff' }"></div>
            </div>
            <div class="breakdown-score">{{ selected.freqScore }}<span class="breakdown-max">/15</span></div>
          </div>
        </div>

        <!-- 产出指数明细 -->
        <div class="section-label">📤 产出指数明细（50分）</div>
        <div class="breakdown-list">
          <div class="breakdown-item">
            <div class="breakdown-name">场景多样性</div>
            <div class="breakdown-desc">{{ selected.purposes }} 种用途</div>
            <div class="breakdown-bar-wrap">
              <div class="breakdown-bar" :style="{ width: (selected.sceneScore/15*100)+'%', background:'#a855f7' }"></div>
            </div>
            <div class="breakdown-score">{{ selected.sceneScore }}<span class="breakdown-max">/15</span></div>
          </div>
          <!-- 用途说明质量（管理员打分） -->
          <div class="breakdown-item editable">
            <div class="breakdown-name">用途说明质量</div>
            <div class="breakdown-desc">管理员评分</div>
            <div class="breakdown-bar-wrap">
              <div class="breakdown-bar" :style="{ width: (editDescScore/20*100)+'%', background:'#a855f7' }"></div>
            </div>
            <div class="breakdown-score-edit">
              <input type="number" v-model.number="editDescScore" min="0" max="20" class="score-input" />
              <span class="breakdown-max">/20</span>
            </div>
          </div>
          <!-- 管理员综合评价 -->
          <div class="breakdown-item editable">
            <div class="breakdown-name">综合评价</div>
            <div class="breakdown-desc">管理员评分</div>
            <div class="breakdown-bar-wrap">
              <div class="breakdown-bar" :style="{ width: (editManagerScore/15*100)+'%', background:'#a855f7' }"></div>
            </div>
            <div class="breakdown-score-edit">
              <input type="number" v-model.number="editManagerScore" min="0" max="15" class="score-input" />
              <span class="breakdown-max">/15</span>
            </div>
          </div>
        </div>

        <!-- 评分标准提示 -->
        <div class="score-hint">
          <div class="hint-row"><span class="hint-tag">用途说明质量</span> 优秀18-20 · 良好12-17 · 一般6-11 · 较差1-5</div>
          <div class="hint-row"><span class="hint-tag">综合评价</span> 优秀13-15 · 良好9-12 · 一般5-8 · 待改进1-4</div>
        </div>

        <!-- 操作按钮 -->
        <div style="display:flex; gap:8px; margin-top:12px;">
          <button class="btn-ghost" style="flex:1; padding:12px;" @click="closeDetail">取消</button>
          <button class="btn-primary" style="flex:2; padding:12px;" @click="saveScore">保存评分</button>
        </div>
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
const editDescScore = ref(10)
const editManagerScore = ref(8)

const filtered = computed(() => {
  if (!search.value) return store.memberStats
  return store.memberStats.filter(m => m.name.toLowerCase().includes(search.value.toLowerCase()))
})

function openDetail(m) {
  selected.value = m
  const ms = store.managerScores[m.id] || { descScore: 10, managerScore: 8 }
  editDescScore.value = ms.descScore
  editManagerScore.value = ms.managerScore
}

function closeDetail() {
  selected.value = null
}

function saveScore() {
  if (!selected.value) return
  store.updateManagerScore(selected.value.id, editDescScore.value, editManagerScore.value)
  // 刷新 selected 以反映最新分数
  const updated = store.memberStats.find(m => m.id === selected.value.id)
  if (updated) selected.value = updated
  closeDetail()
}
</script>

<style scoped>
.member-card {
  display: flex; align-items: center; gap: 10px;
  background: #1a2840; border: 1px solid rgba(99,179,237,0.28);
  border-radius: 12px; padding: 12px; cursor: pointer;
  transition: border-color 0.15s, transform 0.1s; position: relative; overflow: hidden;
}
.member-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(0,212,255,0.2), transparent); }
.member-card:active { border-color: rgba(0,212,255,0.5); transform: scale(0.99); }
.mc-rank-badge { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0; }
.rb-0 { background: rgba(255,214,10,0.1); }
.rb-1 { background: rgba(148,163,184,0.1); }
.rb-2 { background: rgba(180,120,60,0.1); }
.rb-3 { background: rgba(99,179,237,0.08); color: #7a95aa; font-size: 11px; font-weight: 700; }
.mc-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, rgba(0,212,255,0.2), rgba(168,85,247,0.2)); border: 1px solid rgba(0,212,255,0.25); display: flex; align-items: center; justify-content: center; color: #00d4ff; font-weight: 700; font-size: 14px; flex-shrink: 0; }
.mc-info { flex: 1; min-width: 0; }
.mc-name { font-size: 13px; font-weight: 600; color: #e8f4fd; }
.mc-meta { font-size: 11px; color: #7a95aa; margin-top: 2px; }
.mc-bar { height: 3px; background: rgba(255,255,255,0.10); border-radius: 2px; margin-top: 6px; overflow: hidden; }
.mc-bar-fill { height: 100%; border-radius: 2px; transition: width 0.6s ease; }
.mc-score { text-align: right; flex-shrink: 0; }
.mc-score-val { font-size: 20px; font-weight: 800; line-height: 1; }
.mc-score-lbl { font-size: 10px; color: #7a95aa; margin-top: 2px; }

/* 详情弹窗 */
.detail-sheet { width: 100%; background: #162438; border: 1px solid rgba(99,179,237,0.28); border-radius: 20px 20px 0 0; padding: 16px 16px 32px; animation: sheet-up 0.25s ease; max-height: 90vh; overflow-y: auto; }
.detail-header { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
.detail-avatar { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, rgba(0,212,255,0.25), rgba(168,85,247,0.25)); border: 1px solid rgba(0,212,255,0.4); display: flex; align-items: center; justify-content: center; color: #00d4ff; font-weight: 700; font-size: 18px; flex-shrink: 0; }
.detail-name { font-size: 16px; font-weight: 700; color: #e8f4fd; }
.detail-sub { font-size: 12px; color: #7a95aa; margin-top: 2px; }
.detail-close { margin-left: auto; background: rgba(255,255,255,0.06); border: 1px solid rgba(99,179,237,0.2); border-radius: 8px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-size: 14px; color: #8ab0c8; cursor: pointer; flex-shrink: 0; }

/* 总分概览 */
.score-overview { display: flex; align-items: center; gap: 6px; margin-bottom: 16px; }
.score-dim { flex: 1; background: rgba(255,255,255,0.05); border: 1px solid; border-radius: 10px; padding: 10px 6px; text-align: center; }
.score-dim-label { font-size: 10px; color: #7a95aa; margin-bottom: 4px; }
.score-dim-val { font-size: 22px; font-weight: 800; line-height: 1; }
.score-dim-max { font-size: 10px; color: #7a95aa; margin-top: 2px; }
.score-dim-divider { font-size: 16px; color: #4a6070; font-weight: 700; flex-shrink: 0; }

/* 明细列表 */
.section-label { font-size: 11px; font-weight: 700; color: #7a95aa; letter-spacing: 0.5px; margin-bottom: 8px; }
.breakdown-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px; }
.breakdown-item { display: grid; grid-template-columns: 80px 60px 1fr 52px; align-items: center; gap: 6px; background: rgba(255,255,255,0.04); border-radius: 8px; padding: 8px 10px; }
.breakdown-item.editable { border: 1px solid rgba(168,85,247,0.15); }
.breakdown-name { font-size: 11px; color: #b8cfe0; font-weight: 600; }
.breakdown-desc { font-size: 10px; color: #7a95aa; }
.breakdown-bar-wrap { height: 4px; background: rgba(255,255,255,0.08); border-radius: 2px; overflow: hidden; }
.breakdown-bar { height: 100%; border-radius: 2px; transition: width 0.4s ease; }
.breakdown-score { font-size: 13px; font-weight: 700; color: #e8f4fd; text-align: right; }
.breakdown-max { font-size: 10px; color: #7a95aa; font-weight: 400; }
.breakdown-score-edit { display: flex; align-items: center; justify-content: flex-end; gap: 2px; }
.score-input { width: 32px; background: rgba(168,85,247,0.12); border: 1px solid rgba(168,85,247,0.3); border-radius: 4px; color: #e8f4fd; font-size: 13px; font-weight: 700; text-align: center; padding: 2px 0; }
.score-input:focus { outline: none; border-color: rgba(168,85,247,0.6); }

/* 评分提示 */
.score-hint { background: rgba(255,255,255,0.03); border: 1px solid rgba(99,179,237,0.12); border-radius: 8px; padding: 8px 10px; margin-bottom: 4px; }
.hint-row { font-size: 10px; color: #7a95aa; line-height: 1.8; }
.hint-tag { color: #8ab0c8; font-weight: 600; margin-right: 4px; }

/* 按钮 */
.btn-primary { background: linear-gradient(135deg, #00d4ff, #a855f7); border: none; border-radius: 10px; color: #fff; font-size: 14px; font-weight: 700; cursor: pointer; }

.search-clear { background: none; border: none; color: #8ab0c8; font-size: 14px; cursor: pointer; padding: 0 4px; }
.search-clear:hover { color: #e8f4fd; }

@keyframes sheet-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
</style>
