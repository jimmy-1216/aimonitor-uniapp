<template>
  <div class="page-wrap">
    <div class="page-nav-bar">
      <div class="page-nav-left">
        <div class="page-nav-title">成员排名</div>
        <div class="page-nav-sub">AI 效能综合评分（满分 100 分）</div>
      </div>
    </div>

    <!-- 搜索 + 岗位筛选 -->
    <div class="search-bar">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4a5568" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
      <input v-model="search" placeholder="搜索成员名称..." />
      <button v-if="search" class="search-clear" @click="search=''">✕</button>
    </div>
    <div class="role-filter">
      <button v-for="f in filters" :key="f.value"
        class="role-filter-btn"
        :class="{ active: filterRole === f.value }"
        :style="filterRole === f.value ? `background:${f.color}22; border-color:${f.color}; color:${f.color}` : ''"
        @click="filterRole = f.value">
        {{ f.icon }} {{ f.label }}
      </button>
    </div>

    <!-- 成员列表 -->
    <div style="padding: 4px 16px 20px; display:flex; flex-direction:column; gap:8px;">
      <div v-for="(m, i) in filtered" :key="m.id" class="member-card" @click="openDetail(m)">
        <div class="mc-rank-badge" :class="'rb-'+Math.min(rankOf(m),3)">
          {{ rankOf(m) < 3 ? ['🥇','🥈','🥉'][rankOf(m)] : rankOf(m)+1 }}
        </div>
        <div class="mc-avatar" :style="`border-color:${m.jobColor}55; color:${m.jobColor}`">{{ m.name[0] }}</div>
        <div class="mc-info">
          <div class="mc-name-row">
            <span class="mc-name">{{ m.name }}</span>
            <span class="mc-job-tag" :style="`background:${m.jobColor}18; color:${m.jobColor}; border-color:${m.jobColor}40`">{{ m.jobIcon }} {{ m.jobLabel }}</span>
          </div>
          <div class="mc-meta">
            投入 <span :style="`color:${m.jobColor}`">{{ m.inputTotal }}</span> ·
            产出 <span style="color:#a855f7;">{{ m.outputTotal }}</span>
          </div>
          <div class="mc-bar">
            <div class="mc-bar-fill" :style="{ width: m.score + '%', background: rankOf(m)===0 ? 'linear-gradient(90deg,#ffd60a,#ff9500)' : `linear-gradient(90deg,${m.jobColor},#a855f7)` }"></div>
          </div>
        </div>
        <div class="mc-score">
          <div class="mc-score-val" :style="rankOf(m)===0?'color:#ffd60a':`color:${m.jobColor}`">{{ m.score }}</div>
          <div class="mc-score-lbl">/ 100</div>
        </div>
      </div>
      <div v-if="filtered.length === 0" class="empty-box">暂无匹配成员</div>
    </div>

    <!-- 详情弹窗 -->
    <div v-if="selected" class="mp-overlay" @click.self="closeDetail">
      <div class="detail-sheet">
        <!-- 头部 -->
        <div class="detail-header">
          <div class="detail-avatar" :style="`border-color:${selected.jobColor}55; color:${selected.jobColor}`">{{ selected.name[0] }}</div>
          <div>
            <div class="detail-name-row">
              <span class="detail-name">{{ selected.name }}</span>
              <span class="mc-job-tag" :style="`background:${selected.jobColor}18; color:${selected.jobColor}; border-color:${selected.jobColor}40`">{{ selected.jobIcon }} {{ selected.jobLabel }}岗</span>
            </div>
            <div class="detail-sub">AI 效能总分 <span :style="`color:${selected.jobColor};font-weight:800`">{{ selected.score }}</span> / 100</div>
          </div>
          <button @click="closeDetail" class="detail-close">✕</button>
        </div>

        <!-- 总分双维度概览 -->
        <div class="score-overview">
          <div class="score-dim" :style="`border-color:${selected.jobColor}40`">
            <div class="score-dim-label">投入指数</div>
            <div class="score-dim-val" :style="`color:${selected.jobColor}`">{{ selected.inputTotal }}</div>
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

        <!-- 投入指数明细（V2.4：两个维度，无频次） -->
        <div class="section-label">📥 投入指数明细（50分）<span class="section-role-tag" :style="`color:${selected.jobColor}`">{{ selected.jobLabel }}岗规则</span></div>
        <div class="breakdown-list">
          <div v-for="(dim, key) in inputConfig.input" :key="key" class="breakdown-item">
            <div class="breakdown-name">{{ dim.label }}</div>
            <div class="breakdown-desc">{{ getInputBreakdownDesc(selected, key) }}</div>
            <div class="breakdown-bar-wrap">
              <div class="breakdown-bar" :style="{ width: (getInputDimScore(selected, key) / dim.max * 100)+'%', background: selected.jobColor }"></div>
            </div>
            <div class="breakdown-score">{{ getInputDimScore(selected, key) }}<span class="breakdown-max">/{{ dim.max }}</span></div>
          </div>
        </div>

        <!-- 产出指数明细（V2.4：dim1自动10分，dim2质量25分，dim3评价15分） -->
        <div class="section-label">📤 产出指数明细（50分）<span class="section-role-tag" :style="`color:${selected.jobColor}`">{{ selected.jobLabel }}岗规则</span></div>
        <div class="breakdown-list">
          <!-- dim1 自动计算，满分 10 分 -->
          <div class="breakdown-item">
            <div class="breakdown-name">{{ outputConfig.output.dim1.label }}</div>
            <div class="breakdown-desc">自动计算</div>
            <div class="breakdown-bar-wrap">
              <div class="breakdown-bar" :style="{ width: (selected.dim1OutputScore / outputConfig.output.dim1.max * 100)+'%', background:'#a855f7' }"></div>
            </div>
            <div class="breakdown-score">{{ selected.dim1OutputScore }}<span class="breakdown-max">/{{ outputConfig.output.dim1.max }}</span></div>
          </div>
          <!-- dim2 用途说明质量，满分 25 分，管理员打分 -->
          <div class="breakdown-item editable">
            <div class="breakdown-name">{{ outputConfig.output.dim2.label }}</div>
            <div class="breakdown-desc">管理员评分</div>
            <div class="breakdown-bar-wrap">
              <div class="breakdown-bar" :style="{ width: (editOutputQuality / outputConfig.output.dim2.max * 100)+'%', background:'#a855f7' }"></div>
            </div>
            <div class="breakdown-score-edit">
              <input type="number" v-model.number="editOutputQuality" :min="0" :max="outputConfig.output.dim2.max" class="score-input" />
              <span class="breakdown-max">/{{ outputConfig.output.dim2.max }}</span>
            </div>
          </div>
          <!-- dim3 综合评价，满分 15 分，管理员打分 -->
          <div class="breakdown-item editable">
            <div class="breakdown-name">{{ outputConfig.output.dim3.label }}</div>
            <div class="breakdown-desc">管理员评分</div>
            <div class="breakdown-bar-wrap">
              <div class="breakdown-bar" :style="{ width: (editManagerEval / outputConfig.output.dim3.max * 100)+'%', background:'#a855f7' }"></div>
            </div>
            <div class="breakdown-score-edit">
              <input type="number" v-model.number="editManagerEval" :min="0" :max="outputConfig.output.dim3.max" class="score-input" />
              <span class="breakdown-max">/{{ outputConfig.output.dim3.max }}</span>
            </div>
          </div>
        </div>

        <!-- 评分标准提示 -->
        <div class="score-hint">
          <div class="hint-row"><span class="hint-tag">{{ outputConfig.output.dim2.label }}</span> {{ outputConfig.outputHints.dim2 }}</div>
          <div class="hint-row"><span class="hint-tag">{{ outputConfig.output.dim3.label }}</span> {{ outputConfig.outputHints.dim3 }}</div>
        </div>

        <!-- 绩效挂钩权重说明 -->
        <div class="perf-weight-hint">
          📈 绩效挂钩：传统考核（KPI/OKR）<strong>70%</strong> + AI 效能分 <strong>30%</strong>
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
import { useAppStore, JOB_ROLES, JOB_SCORE_CONFIG } from '@/store/app'

const store = useAppStore()
const search = ref('')
const filterRole = ref('all')
const selected = ref(null)
const editOutputQuality = ref(12)
const editManagerEval = ref(8)

const filters = [
  { value: 'all',     label: '全部',  icon: '📊', color: '#94a3b8' },
  ...JOB_ROLES.map(r => ({ value: r.value, label: r.label, icon: r.icon, color: r.color })),
]

// 全局排名（不受筛选影响）
const allRanked = computed(() => store.memberStats)
function rankOf(m) {
  return allRanked.value.findIndex(x => x.id === m.id)
}

const filtered = computed(() => {
  let list = store.memberStats
  if (filterRole.value !== 'all') list = list.filter(m => m.jobRole === filterRole.value)
  if (search.value) list = list.filter(m => m.name.includes(search.value))
  return list
})

// 当前选中成员的岗位评分配置
const inputConfig = computed(() => selected.value ? JOB_SCORE_CONFIG[selected.value.jobRole] || JOB_SCORE_CONFIG.general : JOB_SCORE_CONFIG.general)
const outputConfig = computed(() => inputConfig.value)

// 获取投入指数各维度得分（V2.4：仅 dim1/dim2）
function getInputDimScore(m, dimKey) {
  if (dimKey === 'dim1') return m.dim1InputScore
  if (dimKey === 'dim2') return m.dim2InputScore
  return 0
}

// 获取投入指数各维度描述文字
function getInputBreakdownDesc(m, dimKey) {
  const b = m.breakdown || {}
  const jr = m.jobRole
  if (dimKey === 'dim1') {
    if (jr === 'dev') return `编程工具 ¥${b.codingAmount ?? 0}（满分≥¥200）`
    return `充值总额 ¥${b.totalAmount ?? 0}（满分≥¥200）`
  }
  if (dimKey === 'dim2') {
    if (jr === 'product') return `${b.platformCount ?? 0} 个平台（满分≥5个）`
    return `${b.modelCount ?? 0} 个模型（满分≥4个）`
  }
  return ''
}

function openDetail(m) {
  selected.value = m
  const ms = store.managerScores[m.id] || { outputQuality: 12, managerEval: 8 }
  editOutputQuality.value = ms.outputQuality
  editManagerEval.value = ms.managerEval
}

function closeDetail() {
  selected.value = null
}

function saveScore() {
  if (!selected.value) return
  store.updateManagerScore(selected.value.id, editOutputQuality.value, editManagerEval.value)
  closeDetail()
}
</script>

<style scoped>
/* 岗位筛选栏 */
.role-filter { display: flex; gap: 6px; padding: 0 16px 10px; overflow-x: auto; }
.role-filter::-webkit-scrollbar { display: none; }
.role-filter-btn { flex-shrink: 0; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); color: #7a95aa; cursor: pointer; white-space: nowrap; transition: all 0.15s; }

/* 成员卡片 */
.member-card { display: flex; align-items: center; gap: 10px; background: #1a2840; border: 1px solid rgba(99,179,237,0.28); border-radius: 12px; padding: 12px; cursor: pointer; transition: border-color 0.15s, transform 0.1s; position: relative; overflow: hidden; }
.member-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(0,212,255,0.2), transparent); }
.member-card:active { transform: scale(0.99); }
.mc-rank-badge { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0; }
.rb-0 { background: rgba(255,214,10,0.1); }
.rb-1 { background: rgba(148,163,184,0.1); }
.rb-2 { background: rgba(180,120,60,0.1); }
.rb-3 { background: rgba(99,179,237,0.08); color: #7a95aa; font-size: 11px; font-weight: 700; }
.mc-avatar { width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.05); border: 1px solid; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0; }
.mc-info { flex: 1; min-width: 0; }
.mc-name-row { display: flex; align-items: center; gap: 6px; }
.mc-name { font-size: 13px; font-weight: 600; color: #e8f4fd; }
.mc-job-tag { font-size: 10px; font-weight: 600; padding: 1px 6px; border-radius: 10px; border: 1px solid; flex-shrink: 0; }
.mc-meta { font-size: 11px; color: #7a95aa; margin-top: 2px; }
.mc-bar { height: 3px; background: rgba(255,255,255,0.10); border-radius: 2px; margin-top: 6px; overflow: hidden; }
.mc-bar-fill { height: 100%; border-radius: 2px; transition: width 0.6s ease; }
.mc-score { text-align: right; flex-shrink: 0; }
.mc-score-val { font-size: 20px; font-weight: 800; line-height: 1; }
.mc-score-lbl { font-size: 10px; color: #7a95aa; margin-top: 2px; }

/* 详情弹窗 */
.mp-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 100; display: flex; align-items: flex-end; }
.detail-sheet { width: 100%; background: #162438; border: 1px solid rgba(99,179,237,0.28); border-radius: 20px 20px 0 0; padding: 16px 16px 32px; animation: sheet-up 0.25s ease; max-height: 90vh; overflow-y: auto; }
.detail-header { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
.detail-avatar { width: 44px; height: 44px; border-radius: 50%; background: rgba(255,255,255,0.05); border: 1px solid; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 18px; flex-shrink: 0; }
.detail-name-row { display: flex; align-items: center; gap: 6px; }
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
.section-label { font-size: 11px; font-weight: 700; color: #7a95aa; letter-spacing: 0.5px; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
.section-role-tag { font-size: 10px; font-weight: 600; }
.breakdown-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px; }
.breakdown-item { display: grid; grid-template-columns: 80px 90px 1fr 52px; align-items: center; gap: 6px; background: rgba(255,255,255,0.04); border-radius: 8px; padding: 8px 10px; }
.breakdown-item.editable { border: 1px solid rgba(168,85,247,0.15); }
.breakdown-name { font-size: 11px; color: #b8cfe0; font-weight: 600; }
.breakdown-desc { font-size: 10px; color: #7a95aa; }
.breakdown-bar-wrap { height: 4px; background: rgba(255,255,255,0.08); border-radius: 2px; overflow: hidden; }
.breakdown-bar { height: 100%; border-radius: 2px; transition: width 0.4s ease; }
.breakdown-score { font-size: 13px; font-weight: 700; color: #e8f4fd; text-align: right; }
.breakdown-max { font-size: 10px; color: #7a95aa; font-weight: 400; }
.breakdown-score-edit { display: flex; align-items: center; justify-content: flex-end; gap: 2px; }
.score-input { width: 34px; background: rgba(168,85,247,0.12); border: 1px solid rgba(168,85,247,0.3); border-radius: 4px; color: #e8f4fd; font-size: 13px; font-weight: 700; text-align: center; padding: 2px 0; }
.score-input:focus { outline: none; border-color: rgba(168,85,247,0.6); }

/* 评分提示 */
.score-hint { background: rgba(255,255,255,0.03); border: 1px solid rgba(99,179,237,0.12); border-radius: 8px; padding: 8px 10px; margin-bottom: 8px; }
.hint-row { font-size: 10px; color: #7a95aa; line-height: 1.8; }
.hint-tag { color: #8ab0c8; font-weight: 600; margin-right: 4px; }

/* 绩效挂钩权重说明 */
.perf-weight-hint {
  font-size: 11px; color: #4a6080;
  background: rgba(255,214,10,0.04); border: 1px solid rgba(255,214,10,0.12);
  border-radius: 8px; padding: 7px 10px; margin-bottom: 4px; text-align: center;
}
.perf-weight-hint strong { color: #ffd60a; }

/* 按钮 */
.btn-primary { background: linear-gradient(135deg, #00d4ff, #a855f7); border: none; border-radius: 10px; color: #fff; font-size: 14px; font-weight: 700; cursor: pointer; }
.btn-ghost { background: rgba(255,255,255,0.05); border: 1px solid rgba(99,179,237,0.2); border-radius: 10px; color: #8ab0c8; font-size: 14px; font-weight: 600; cursor: pointer; }
.search-clear { background: none; border: none; color: #8ab0c8; font-size: 14px; cursor: pointer; padding: 0 4px; }
.search-clear:hover { color: #e8f4fd; }

@keyframes sheet-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
</style>
