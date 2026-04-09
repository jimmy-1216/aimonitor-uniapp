<template>
  <div class="page-wrap">
    <div class="page-nav-bar">
      <div class="page-nav-left">
        <div class="page-nav-title">趋势分析</div>
        <div class="page-nav-sub">部门 AI 使用趋势</div>
      </div>
    </div>

    <div style="padding: 12px 0 24px;">

      <!-- 月度充值趋势 -->
      <div class="section">
        <div class="section-header">
          <div class="section-title">月度充值趋势</div>
          <div class="section-badge">近6月</div>
        </div>
        <div class="trend-chart">
          <div v-for="item in store.deptMonthlyTrend" :key="item.month" class="trend-col">
            <div class="trend-amount">{{ item.amount > 0 ? '¥'+item.amount : '' }}</div>
            <div class="trend-bar-wrap">
              <div class="trend-bar"
                :style="{
                  height: Math.max(4, (item.amount / maxAmount) * 80) + 'px',
                  background: item.amount > 0 ? 'linear-gradient(180deg,#00d4ff,#a855f7)' : 'rgba(255,255,255,0.04)',
                  boxShadow: item.amount > 0 ? '0 0 10px rgba(0,212,255,0.35)' : 'none'
                }">
              </div>
            </div>
            <div class="trend-month">{{ item.month }}</div>
          </div>
        </div>

        <!-- 月度数据表 -->
        <div class="data-table">
          <div class="dt-header">
            <span>月份</span><span>金额</span><span>笔数</span><span>环比</span>
          </div>
          <div v-for="(item, i) in store.deptMonthlyTrend.slice().reverse().slice(0,4)" :key="item.month"
            class="dt-row" :class="{ 'dt-row-alt': i%2===1 }">
            <span class="dt-month">{{ item.month }}</span>
            <span style="color:#00d4ff; font-weight:600;">¥{{ item.amount }}</span>
            <span style="color:#94a3b8;">{{ item.count }}</span>
            <span :style="item.growth > 0 ? 'color:#ff4d6d' : item.growth < 0 ? 'color:#00ff88' : 'color:#4a5568'">
              {{ item.growth > 0 ? '↑' : item.growth < 0 ? '↓' : '—' }}{{ item.growth !== 0 ? Math.abs(item.growth)+'%' : '' }}
            </span>
          </div>
        </div>
      </div>

      <!-- 平台分布 -->
      <div class="section">
        <div class="section-header">
          <div class="section-title">平台分布</div>
        </div>
        <div class="dist-card">
          <div v-for="(item, i) in store.platformStats.slice(0,5)" :key="item.platform||item.name" class="dist-row">
            <div class="dist-dot" :style="{ background: COLORS[i] }"></div>
            <div class="dist-name">{{ item.platform || item.name }}</div>
            <div class="dist-bar-wrap">
              <div class="dist-bar-fill" :style="{ width: (item.amount / (store.platformStats[0]?.amount||1) * 100)+'%', background: COLORS[i] }"></div>
            </div>
            <div class="dist-val">¥{{ item.amount }}</div>
          </div>
        </div>
      </div>

      <!-- 用途分布 -->
      <div class="section">
        <div class="section-header">
          <div class="section-title">用途分布</div>
        </div>
        <div class="purpose-grid">
          <div v-for="(item, i) in store.purposeStats.slice(0,6)" :key="item.tag" class="purpose-cell">
            <div class="purpose-cell-icon" :style="{ background: COLORS_DIM[i], color: COLORS[i] }">
              {{ PURPOSE_ICONS[i] }}
            </div>
            <div class="purpose-cell-count" :style="{ color: COLORS[i] }">{{ item.count }}</div>
            <div class="purpose-cell-label">{{ item.label }}</div>
          </div>
        </div>
      </div>

      <!-- 大模型分布 -->
      <div class="section" style="padding-bottom: 0;">
        <div class="section-header">
          <div class="section-title">大模型分布</div>
        </div>
        <div class="dist-card">
          <div v-for="(item, i) in store.modelStats.slice(0,5)" :key="item.name" class="dist-row">
            <div class="dist-dot" :style="{ background: MODEL_COLORS[i] }"></div>
            <div class="dist-name">{{ item.name }}</div>
            <div class="dist-bar-wrap">
              <div class="dist-bar-fill" :style="{ width: (item.amount / (store.modelStats[0]?.amount||1) * 100)+'%', background: MODEL_COLORS[i] }"></div>
            </div>
            <div class="dist-val">¥{{ item.amount }}</div>
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
const maxAmount = computed(() => Math.max(...store.deptMonthlyTrend.map(m => m.amount), 1))

const COLORS = ['#00d4ff','#a855f7','#00ff88','#ff9500','#ff4d6d']
const COLORS_DIM = ['rgba(0,212,255,0.1)','rgba(168,85,247,0.1)','rgba(0,255,136,0.1)','rgba(255,149,0,0.1)','rgba(255,77,109,0.1)']
const MODEL_COLORS = ['#00ff88','#00d4ff','#a855f7','#ff9500','#ffd60a']
const PURPOSE_ICONS = ['⚡','📊','✍️','🔍','🎨','🤖']
</script>

<style scoped>
.section { padding: 0 16px 14px; }
.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.section-title { font-size: 14px; font-weight: 700; color: #edf6ff; }
.section-badge { font-size: 10px; color: #6b8099; background: rgba(255,255,255,0.06); border: 1px solid rgba(99,179,237,0.2); padding: 2px 8px; border-radius: 10px; }

.trend-chart { display: flex; align-items: flex-end; gap: 6px; height: 110px; background: #1a2840; border-radius: 12px; border: 1px solid rgba(99,179,237,0.28); padding: 12px 12px 8px; margin-bottom: 10px; }
.trend-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; }
.trend-amount { font-size: 9px; color: #00d4ff; font-weight: 600; height: 12px; }
.trend-bar-wrap { flex: 1; display: flex; align-items: flex-end; width: 100%; }
.trend-bar { width: 100%; border-radius: 3px 3px 0 0; min-height: 4px; transition: height 0.6s ease; }
.trend-month { font-size: 9px; color: #6b8099; }

.data-table { background: #1a2840; border: 1px solid rgba(99,179,237,0.28); border-radius: 12px; overflow: hidden; margin-bottom: 4px; }
.dt-header { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; padding: 8px 14px; font-size: 10px; color: #7a95aa; letter-spacing: 0.5px; border-bottom: 1px solid rgba(99,179,237,0.18); }
.dt-header span:not(:first-child) { text-align: right; }
.dt-row { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; padding: 9px 14px; font-size: 12px; }
.dt-row span:not(:first-child) { text-align: right; }
.dt-row-alt { background: rgba(255,255,255,0.06); }
.dt-month { font-weight: 600; color: #a8bdd0; }

.dist-card { background: #1a2840; border: 1px solid rgba(99,179,237,0.28); border-radius: 12px; padding: 12px 14px; display: flex; flex-direction: column; gap: 10px; }
.dist-row { display: flex; align-items: center; gap: 8px; }
.dist-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.dist-name { font-size: 12px; color: #a8bdd0; min-width: 68px; }
.dist-bar-wrap { flex: 1; height: 5px; background: rgba(255,255,255,0.10); border-radius: 3px; overflow: hidden; }
.dist-bar-fill { height: 100%; border-radius: 3px; transition: width 0.6s ease; }
.dist-val { font-size: 12px; color: #6b8099; min-width: 40px; text-align: right; }

.purpose-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
.purpose-cell { background: #1a2840; border: 1px solid rgba(99,179,237,0.28); border-radius: 10px; padding: 12px 10px; text-align: center; }
.purpose-cell-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 15px; margin: 0 auto 6px; }
.purpose-cell-count { font-size: 20px; font-weight: 800; line-height: 1; }
.purpose-cell-label { font-size: 10px; color: #6b8099; margin-top: 4px; }
</style>
