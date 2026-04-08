<template>
  <div class="page-wrap">
    <!-- Hero 区 -->
    <div class="admin-hero">
      <div class="hero-glow-a"></div>
      <div class="hero-glow-b"></div>
      <div class="hero-header">
        <div>
          <div class="hero-title">部门总览</div>
          <div class="hero-sub">全部成员 AI 效能数据</div>
        </div>
        <div class="hero-badge-admin">
          <span class="glow-dot" style="background:#a855f7; box-shadow:0 0 8px #a855f7;"></span>
          <span>ADMIN</span>
        </div>
      </div>
      <!-- KPI 四宫格 -->
      <div class="kpi-grid">
        <div class="kpi-cell">
          <div class="kpi-cell-label">部门总充值</div>
          <div class="kpi-cell-val" style="color:#00d4ff;">¥{{ store.deptTotal }}</div>
        </div>
        <div class="kpi-cell">
          <div class="kpi-cell-label">平均投入指数</div>
          <div class="kpi-cell-val" style="color:#a855f7;">{{ store.deptAvgScore }}</div>
        </div>
        <div class="kpi-cell">
          <div class="kpi-cell-label">活跃成员</div>
          <div class="kpi-cell-val" style="color:#00ff88;">{{ store.memberStats.length }}</div>
        </div>
        <div class="kpi-cell">
          <div class="kpi-cell-label">总记录数</div>
          <div class="kpi-cell-val" style="color:#ff9500;">{{ store.allRecords.length }}</div>
        </div>
      </div>
    </div>

    <!-- 月度趋势 -->
    <div class="section">
      <div class="section-header">
        <div class="section-title">月度趋势</div>
        <div class="section-badge">部门汇总</div>
      </div>
      <div class="trend-chart">
        <div v-for="item in store.deptMonthlyTrend" :key="item.month" class="trend-col">
          <div class="trend-amount">{{ item.amount > 0 ? '¥'+item.amount : '' }}</div>
          <div class="trend-bar-wrap">
            <div class="trend-bar"
              :style="{
                height: Math.max(4, (item.amount / maxDeptTrend) * 80) + 'px',
                background: item.amount > 0 ? 'linear-gradient(180deg,#a855f7,#1677ff)' : 'rgba(255,255,255,0.04)',
                boxShadow: item.amount > 0 ? '0 0 10px rgba(168,85,247,0.4)' : 'none'
              }">
            </div>
          </div>
          <div class="trend-month">{{ item.month }}</div>
        </div>
      </div>
    </div>

    <!-- TOP 5 排名 -->
    <div class="section" style="padding-bottom:20px;">
      <div class="section-header">
        <div class="section-title">投入排名 TOP 5</div>
      </div>
      <div class="rank-list">
        <div v-for="(m, i) in store.memberStats.slice(0, 5)" :key="m.id" class="rank-item">
          <div class="rank-num" :class="'rn-'+i">{{ i+1 }}</div>
          <div class="rank-info">
            <div class="rank-name">{{ m.name }}</div>
            <div class="rank-meta">{{ m.recordCount }} 条记录 · ¥{{ m.total }}</div>
          </div>
          <div class="rank-score">
            <span class="rank-score-val">{{ m.score }}</span>
            <span class="rank-score-unit">分</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/store/app'
const store = useAppStore()
const maxDeptTrend = computed(() => Math.max(...store.deptMonthlyTrend.map(t => t.amount), 1))
</script>

<style scoped>
.admin-hero {
  position: relative; padding: 16px 16px 20px;
  background: linear-gradient(160deg, #120d2e 0%, #0a0e1a 100%);
  border-bottom: 1px solid rgba(168,85,247,0.15);
  overflow: hidden;
}
.hero-glow-a { position: absolute; width: 200px; height: 200px; border-radius: 50%; background: rgba(168,85,247,0.1); filter: blur(50px); top: -80px; right: -50px; pointer-events: none; }
.hero-glow-b { position: absolute; width: 120px; height: 120px; border-radius: 50%; background: rgba(0,212,255,0.08); filter: blur(40px); bottom: -30px; left: 10px; pointer-events: none; }
.hero-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
.hero-title { font-size: 20px; font-weight: 800; color: #e8f4fd; letter-spacing: -0.5px; }
.hero-sub { font-size: 12px; color: #4a5568; margin-top: 3px; }
.hero-badge-admin {
  display: flex; align-items: center; gap: 5px;
  padding: 4px 10px; border-radius: 20px;
  background: rgba(168,85,247,0.1); border: 1px solid rgba(168,85,247,0.3);
  font-size: 11px; color: #a855f7; font-weight: 700; letter-spacing: 1px;
}
.kpi-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.kpi-cell {
  background: rgba(255,255,255,0.04); border: 1px solid rgba(99,179,237,0.1);
  border-radius: 10px; padding: 12px;
}
.kpi-cell-label { font-size: 11px; color: #4a5568; margin-bottom: 6px; }
.kpi-cell-val { font-size: 22px; font-weight: 800; line-height: 1; }

.section { padding: 14px 16px 0; }
.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.section-title { font-size: 14px; font-weight: 700; color: #e8f4fd; }
.section-badge { font-size: 10px; color: #4a5568; background: rgba(255,255,255,0.04); border: 1px solid rgba(99,179,237,0.15); padding: 2px 8px; border-radius: 10px; }

.trend-chart { display: flex; align-items: flex-end; gap: 6px; height: 110px; background: #111827; border-radius: 12px; border: 1px solid rgba(99,179,237,0.1); padding: 12px 12px 8px; margin-bottom: 14px; }
.trend-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; }
.trend-amount { font-size: 9px; color: #a855f7; font-weight: 600; height: 12px; }
.trend-bar-wrap { flex: 1; display: flex; align-items: flex-end; width: 100%; }
.trend-bar { width: 100%; border-radius: 3px 3px 0 0; min-height: 4px; transition: height 0.6s ease; }
.trend-month { font-size: 9px; color: #4a5568; }

.rank-list { background: #111827; border: 1px solid rgba(99,179,237,0.1); border-radius: 12px; overflow: hidden; }
.rank-item { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-bottom: 1px solid rgba(99,179,237,0.08); }
.rank-item:last-child { border-bottom: none; }
.rank-num { width: 26px; height: 26px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; flex-shrink: 0; }
.rn-0 { background: rgba(255,214,10,0.15); color: #ffd60a; }
.rn-1 { background: rgba(148,163,184,0.1); color: #94a3b8; }
.rn-2 { background: rgba(180,120,60,0.1); color: #b47c3c; }
.rn-3, .rn-4 { background: rgba(99,179,237,0.06); color: #4a5568; }
.rank-info { flex: 1; }
.rank-name { font-size: 13px; font-weight: 600; color: #e8f4fd; }
.rank-meta { font-size: 11px; color: #4a5568; margin-top: 2px; }
.rank-score { text-align: right; }
.rank-score-val { font-size: 18px; font-weight: 800; color: #a855f7; }
.rank-score-unit { font-size: 11px; color: #4a5568; margin-left: 2px; }
</style>
