<template>
  <div class="page-wrap">
    <div class="page-header">
      <div class="header-orb" />
      <text class="page-title">趋势分析</text>
      <text class="page-sub">多维度数据统计</text>
    </div>

    <div class="container" style="margin-top: 24px; margin-bottom: 100px;">
      <!-- 月度趋势表 -->
      <div class="glass-card" style="padding: 16px; margin-bottom: 20px;">
        <div style="font-size: 13px; font-weight: 600; margin-bottom: 14px;">月度充值趋势</div>
        <div style="overflow-x: auto;">
          <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                <th style="text-align: left; padding: 8px 0; color: #94a3b8; font-weight: 500;">月份</th>
                <th style="text-align: right; padding: 8px 0; color: #94a3b8; font-weight: 500;">金额</th>
                <th style="text-align: right; padding: 8px 0; color: #94a3b8; font-weight: 500;">环比</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in store.deptMonthlyTrend" :key="item.month" style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                <td style="padding: 10px 0; color: #f1f5f9;">{{ item.month }}</td>
                <td style="text-align: right; color: #a78bfa; font-weight: 600;">¥{{ item.amount }}</td>
                <td style="text-align: right;">
                  <span :class="['badge', item.growth > 0 ? 'badge-green' : item.growth < 0 ? 'badge-red' : 'badge-yellow']" style="font-size: 10px;">
                    {{ item.growth > 0 ? '+' : '' }}{{ item.growth }}%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 平台分布 -->
      <div class="glass-card" style="padding: 16px; margin-bottom: 20px;">
        <div style="font-size: 13px; font-weight: 600; margin-bottom: 12px;">平台分布</div>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div v-for="item in store.platformStats" :key="item.name" style="display: flex; align-items: center; gap: 10px;">
            <div style="flex: 1;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="font-size: 12px;">{{ item.name }}</span>
                <span style="font-size: 11px; color: #94a3b8;">{{ item.pct }}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: item.pct + '%' }" />
              </div>
            </div>
            <div style="font-size: 12px; color: #a78bfa; font-weight: 600; min-width: 50px; text-align: right;">¥{{ item.amount }}</div>
          </div>
        </div>
      </div>

      <!-- 用途分布 -->
      <div class="glass-card" style="padding: 16px; margin-bottom: 20px;">
        <div style="font-size: 13px; font-weight: 600; margin-bottom: 12px;">用途分布</div>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          <div v-for="item in store.purposeStats" :key="item.tag" class="badge badge-blue" style="flex: 1; min-width: 100px; justify-content: center; padding: 8px 6px;">
            <div style="text-align: center;">
              <div style="font-size: 11px;">{{ item.label }}</div>
              <div style="font-size: 12px; font-weight: 600; margin-top: 2px;">{{ item.count }} ({{ item.pct }}%)</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 大模型分布 -->
      <div class="glass-card" style="padding: 16px;">
        <div style="font-size: 13px; font-weight: 600; margin-bottom: 12px;">大模型分布</div>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div v-for="item in store.modelStats" :key="item.name" style="display: flex; align-items: center; gap: 10px;">
            <div style="flex: 1;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="font-size: 12px;">{{ item.name }}</span>
                <span style="font-size: 11px; color: #94a3b8;">{{ item.pct }}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: item.pct + '%' }" />
              </div>
            </div>
            <div style="font-size: 12px; color: #a78bfa; font-weight: 600; min-width: 50px; text-align: right;">¥{{ item.amount }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '@/store/app'
const store = useAppStore()
</script>

<style scoped>
.badge-red { background: rgba(248,113,113,0.15); color: #f87171; border: 1px solid rgba(248,113,113,0.25); }
</style>
