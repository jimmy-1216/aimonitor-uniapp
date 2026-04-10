<template>
  <div class="page-wrap">

    <!-- 顶部 Hero 区 -->
    <div class="dash-hero">
      <!-- 背景光晕 -->
      <div class="hero-glow hero-glow-1"></div>
      <div class="hero-glow hero-glow-2"></div>

      <div class="hero-top">
        <div class="hero-user">
          <div class="hero-avatar">{{ store.currentUser.name[0] }}</div>
          <div>
            <div class="hero-name">{{ store.currentUser.name }}</div>
            <div class="hero-dept">AI 效能台账</div>
          <div class="hero-job-tag" :style="`background:${jobInfo.color}18; color:${jobInfo.color}; border-color:${jobInfo.color}40`">{{ jobInfo.icon }} {{ jobInfo.label }}岗</div>
          </div>
        </div>
        <div class="hero-badge">
          <span class="glow-dot"></span>
          <span>实时</span>
        </div>
      </div>

      <!-- 核心指标 -->
      <div class="hero-kpi">
        <div class="kpi-main">
          <div class="kpi-label">AI 效能分</div>
          <div class="kpi-value">{{ store.inputScore }}<span class="kpi-unit">/50</span></div>
          <div class="kpi-bar">
            <div class="kpi-bar-fill" :style="{ width: (store.inputScore / 50 * 100) + '%' }"></div>
          </div>
        </div>
        <div class="kpi-ring-wrap">
          <svg viewBox="0 0 100 100" width="90" height="90">
            <defs>
              <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#00d4ff"/>
                <stop offset="100%" stop-color="#a855f7"/>
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="6"/>
            <circle cx="50" cy="50" r="42" fill="none" stroke="url(#ringGrad)" stroke-width="6"
              stroke-linecap="round" stroke-dasharray="264"
              :stroke-dashoffset="264 - (store.inputScore / 50) * 264"
              transform="rotate(-90 50 50)"
              style="filter:drop-shadow(0 0 6px rgba(0,212,255,0.7)); transition: stroke-dashoffset 0.8s ease;"/>
          </svg>
          <div class="ring-center">
            <div class="ring-num">{{ store.inputScore }}</div>
            <div class="ring-sub">分</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 三维数据条 -->
    <div class="stat-row">
      <div class="stat-cell">
        <div class="stat-icon" style="background: rgba(0,212,255,0.1); color:#00d4ff;">¥</div>
        <div>
          <div class="stat-val" style="color:#00d4ff;">{{ store.monthAmount }}</div>
          <div class="stat-lbl">本月充值</div>
        </div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-cell">
        <div class="stat-icon" style="background: rgba(168,85,247,0.1); color:#a855f7;">⬡</div>
        <div>
          <div class="stat-val" style="color:#a855f7;">{{ new Set(store.myRecords.map(r=>r.platform)).size }}</div>
          <div class="stat-lbl">平台数量</div>
        </div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-cell">
        <div class="stat-icon" style="background: rgba(0,255,136,0.1); color:#00ff88;">≡</div>
        <div>
          <div class="stat-val" style="color:#00ff88;">{{ store.myRecords.length }}</div>
          <div class="stat-lbl">记录总数</div>
        </div>
      </div>
    </div>

    <!-- 月度趋势 -->
    <div class="section">
      <div class="section-header">
        <div class="section-title">月度趋势</div>
        <div class="section-badge">近6月</div>
      </div>
      <div class="trend-chart">
        <div v-for="item in store.monthlyTrend" :key="item.month" class="trend-col">
          <div class="trend-amount">{{ item.amount > 0 ? '¥'+item.amount : '' }}</div>
          <div class="trend-bar-wrap">
            <div class="trend-bar"
              :style="{
                height: Math.max(4, (item.amount / maxTrend) * 80) + 'px',
                background: item.amount > 0 ? 'linear-gradient(180deg,#00d4ff,#a855f7)' : 'rgba(255,255,255,0.05)',
                boxShadow: item.amount > 0 ? '0 0 10px rgba(0,212,255,0.4)' : 'none'
              }">
            </div>
          </div>
          <div class="trend-month">{{ item.month }}</div>
        </div>
      </div>
    </div>

    <!-- 用途分布 -->
    <div class="section">
      <div class="section-header">
        <div class="section-title">用途分布</div>
      </div>
      <div v-if="store.purposeDist.length > 0" class="purpose-list">
        <div v-for="(item, i) in store.purposeDist.slice(0,5)" :key="item.tag" class="purpose-item">
          <div class="purpose-rank" :class="'rank-'+i">{{ i+1 }}</div>
          <div class="purpose-name">{{ item.label }}</div>
          <div class="purpose-bar-wrap">
            <div class="purpose-bar-fill"
              :style="{
                width: (item.count / store.purposeDist[0].count * 100) + '%',
                background: purposeColors[i % purposeColors.length]
              }">
            </div>
          </div>
          <div class="purpose-count">{{ item.count }}</div>
        </div>
      </div>
      <div v-else class="empty-box" style="padding:20px 0;">
        <div style="font-size:13px; color:var(--text-muted);">暂无数据</div>
      </div>
    </div>

    <!-- 快速操作 -->
    <div style="padding: 0 16px 20px;">
      <router-link to="/record/new" class="btn-primary" style="width:100%; padding:14px; font-size:15px; border-radius:14px; display:flex; align-items:center; justify-content:center; gap:8px;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" width="18" height="18"><path d="M12 5v14M5 12h14"/></svg>
        提交充值记录
      </router-link>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore, JOB_ROLES } from '@/store/app'

const store = useAppStore()
const jobInfo = computed(() => JOB_ROLES.find(r => r.value === store.currentUser.jobRole) || JOB_ROLES[2])
const purposeColors = [
  'linear-gradient(90deg,#00d4ff,#0099cc)',
  'linear-gradient(90deg,#a855f7,#7c3aed)',
  'linear-gradient(90deg,#00ff88,#00cc6a)',
  'linear-gradient(90deg,#ff9500,#cc7700)',
  'linear-gradient(90deg,#ff4d6d,#cc3355)',
]
const maxTrend = computed(() => Math.max(...store.monthlyTrend.map(t => t.amount), 1))
</script>

<style scoped>
/* Hero 区 */
.dash-hero {
  position: relative;
  padding: 16px 16px 20px;
  background: linear-gradient(160deg, #152a45 0%, #111d30 100%);
  overflow: hidden;
  border-bottom: 1px solid rgba(0,212,255,0.1);
}
.hero-glow {
  position: absolute; border-radius: 50%;
  filter: blur(40px); pointer-events: none;
}
.hero-glow-1 { width: 180px; height: 180px; background: rgba(0,212,255,0.16); top: -60px; right: -40px; }
.hero-glow-2 { width: 120px; height: 120px; background: rgba(168,85,247,0.14); bottom: -30px; left: 20px; }

.hero-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.hero-user { display: flex; align-items: center; gap: 10px; }
.hero-avatar {
  width: 38px; height: 38px; border-radius: 50%;
  background: linear-gradient(135deg, rgba(0,212,255,0.25), rgba(168,85,247,0.25));
  border: 1px solid rgba(0,212,255,0.4);
  display: flex; align-items: center; justify-content: center;
  font-size: 15px; font-weight: 700; color: #00d4ff;
}
.hero-name { font-size: 15px; font-weight: 700; color: #edf6ff; }
.hero-dept { font-size: 11px; color: #6b8099; margin-top: 2px; }
.hero-job-tag { display: inline-block; font-size: 10px; font-weight: 600; padding: 1px 7px; border-radius: 10px; border: 1px solid; margin-top: 3px; }
.hero-badge {
  display: flex; align-items: center; gap: 5px;
  padding: 4px 10px; border-radius: 20px;
  background: rgba(0,255,136,0.08); border: 1px solid rgba(0,255,136,0.2);
  font-size: 11px; color: #00ff88; font-weight: 600;
}

/* KPI 区 */
.hero-kpi { display: flex; align-items: center; justify-content: space-between; }
.kpi-main { flex: 1; }
.kpi-label { font-size: 11px; color: #6b8099; margin-bottom: 4px; letter-spacing: 0.5px; }
.kpi-value { font-size: 44px; font-weight: 800; color: #00d4ff; line-height: 1; letter-spacing: -2px; }
.kpi-unit { font-size: 16px; font-weight: 400; color: #6b8099; letter-spacing: 0; }
.kpi-bar { width: 140px; height: 4px; background: rgba(255,255,255,0.09); border-radius: 2px; margin-top: 10px; overflow: hidden; }
.kpi-bar-fill { height: 100%; border-radius: 2px; background: linear-gradient(90deg, #00d4ff, #a855f7); box-shadow: 0 0 8px rgba(0,212,255,0.5); transition: width 0.8s ease; }

/* 圆环 */
.kpi-ring-wrap { position: relative; width: 90px; height: 90px; }
.ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.ring-num { font-size: 22px; font-weight: 800; color: #00d4ff; letter-spacing: -1px; }
.ring-sub { font-size: 10px; color: #6b8099; }

/* 三维数据条 */
.stat-row {
  display: flex; align-items: center;
  background: #1a2840; border-bottom: 1px solid rgba(99,179,237,0.22);
  padding: 12px 0;
}
.stat-cell { flex: 1; display: flex; align-items: center; gap: 10px; justify-content: center; }
.stat-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; }
.stat-val { font-size: 18px; font-weight: 800; line-height: 1; }
.stat-lbl { font-size: 10px; color: #6b8099; margin-top: 2px; }
.stat-divider { width: 1px; height: 32px; background: rgba(99,179,237,0.15); }

/* 通用 Section */
.section { padding: 14px 16px 0; }
.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.section-title { font-size: 14px; font-weight: 700; color: #edf6ff; letter-spacing: 0.3px; }
.section-badge { font-size: 10px; color: #6b8099; background: rgba(255,255,255,0.06); border: 1px solid rgba(99,179,237,0.2); padding: 2px 8px; border-radius: 10px; }

/* 趋势图 */
.trend-chart {
  display: flex; align-items: flex-end; gap: 6px;
  height: 110px; padding: 0 4px;
  background: #1a2840; border-radius: 12px; border: 1px solid rgba(99,179,237,0.28);
  padding: 12px 12px 8px;
  margin-bottom: 14px;
}
.trend-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; }
.trend-amount { font-size: 9px; color: #00d4ff; font-weight: 600; height: 12px; }
.trend-bar-wrap { flex: 1; display: flex; align-items: flex-end; width: 100%; }
.trend-bar { width: 100%; border-radius: 3px 3px 0 0; min-height: 4px; transition: height 0.6s ease; }
.trend-month { font-size: 9px; color: #6b8099; }

/* 用途分布 */
.purpose-list { display: flex; flex-direction: column; gap: 8px; background: #1a2840; border-radius: 12px; border: 1px solid rgba(99,179,237,0.28); padding: 12px; margin-bottom: 14px; }
.purpose-item { display: flex; align-items: center; gap: 8px; }
.purpose-rank { width: 18px; height: 18px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; flex-shrink: 0; }
.rank-0 { background: rgba(255,214,10,0.15); color: #ffd60a; }
.rank-1 { background: rgba(148,163,184,0.1); color: #94a3b8; }
.rank-2 { background: rgba(180,120,60,0.1); color: #b47c3c; }
.rank-3, .rank-4 { background: rgba(99,179,237,0.08); color: #6b8099; }
.purpose-name { font-size: 12px; color: #a8bdd0; min-width: 56px; }
.purpose-bar-wrap { flex: 1; height: 5px; background: rgba(255,255,255,0.10); border-radius: 3px; overflow: hidden; }
.purpose-bar-fill { height: 100%; border-radius: 3px; transition: width 0.6s ease; box-shadow: 0 0 6px rgba(0,212,255,0.3); }
.purpose-count { font-size: 11px; color: #6b8099; min-width: 16px; text-align: right; }
</style>
