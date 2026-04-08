<template>
  <div class="page-wrap">
    <div class="page-header">
      <div class="header-orb" />
      <text class="page-title">我的看板</text>
      <text class="page-sub">{{ store.currentUser.name }} · 投入指数追踪</text>
    </div>

    <!-- 投入指数圆环 -->
    <div class="container" style="margin-top: 24px;">
      <div class="glass-card" style="padding: 28px; text-align: center;">
        <div class="score-ring">
          <svg viewBox="0 0 140 140" class="ring-svg">
            <circle cx="70" cy="70" r="60" class="ring-bg" />
            <circle
              cx="70" cy="70" r="60" class="ring-fill"
              :style="{ strokeDashoffset: 377 - (store.inputScore / 100) * 377 }"
            />
          </svg>
          <div class="score-text">
            <div class="score-num">{{ store.inputScore }}</div>
            <div class="score-label">投入指数</div>
          </div>
        </div>
        <div style="margin-top: 20px; font-size: 12px; color: #94a3b8; line-height: 1.6;">
          <div>本月充值 <span class="grad-text" style="font-weight: 600;">¥{{ store.monthAmount }}</span></div>
          <div style="margin-top: 4px;">{{ store.myRecords.length }} 条记录 · {{ new Set(store.myRecords.map(r => r.platform)).size }} 个平台</div>
        </div>
      </div>
    </div>

    <!-- 月度趋势 -->
    <div class="container" style="margin-top: 20px;">
      <div class="glass-card" style="padding: 16px;">
        <div style="font-size: 13px; font-weight: 600; margin-bottom: 14px;">月度趋势</div>
        <div style="display: flex; align-items: flex-end; justify-content: space-around; height: 100px; gap: 4px;">
          <div v-for="item in store.monthlyTrend" :key="item.month" style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px;">
            <div class="progress-bar" style="width: 100%; height: 40px;">
              <div class="progress-fill" :style="{ height: (item.amount / 300) * 100 + '%' }" />
            </div>
            <div style="font-size: 10px; color: #94a3b8;">{{ item.month }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 用途分布 -->
    <div class="container" style="margin-top: 20px; margin-bottom: 20px;">
      <div class="glass-card" style="padding: 16px;">
        <div style="font-size: 13px; font-weight: 600; margin-bottom: 12px;">用途分布</div>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          <div v-for="item in store.purposeDist" :key="item.tag" class="badge badge-purple" style="flex: 1; min-width: 80px; justify-content: center;">
            {{ item.label }} ({{ item.count }})
          </div>
        </div>
      </div>
    </div>

    <!-- 快速操作 -->
    <div class="container" style="margin-bottom: 100px;">
      <router-link to="/record/new" class="btn-primary" style="width: 100%; justify-content: center; padding: 12px;">
        ➕ 提交新记录
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '@/store/app'
const store = useAppStore()
</script>

<style scoped>
.score-ring {
  position: relative; width: 140px; height: 140px; margin: 0 auto;
}
.ring-svg {
  position: absolute; inset: 0; transform: rotate(-90deg);
}
.ring-bg {
  fill: none; stroke: rgba(255,255,255,0.08); stroke-width: 6;
}
.ring-fill {
  fill: none; stroke: url(#grad); stroke-width: 6; stroke-linecap: round;
  stroke-dasharray: 377; transition: stroke-dashoffset 0.8s ease;
}
.score-text {
  position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.score-num   { font-size: 36px; font-weight: 700; color: #a78bfa; }
.score-label { font-size: 11px; color: #94a3b8; margin-top: 2px; }
</style>
