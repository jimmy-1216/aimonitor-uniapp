<template>
  <div class="page-wrap">
    <div class="page-header">
      <div class="header-orb" />
      <text class="page-title">部门总览</text>
      <text class="page-sub">全部成员数据汇总</text>
    </div>

    <div class="container" style="margin-top: 24px; margin-bottom: 100px;">
      <!-- KPI 卡片 2x2 -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
        <div class="glass-card" style="padding: 16px;">
          <div style="font-size: 11px; color: #94a3b8; margin-bottom: 8px;">部门总充值</div>
          <div class="grad-text" style="font-size: 20px; font-weight: 700;">¥{{ store.deptTotal }}</div>
        </div>
        <div class="glass-card" style="padding: 16px;">
          <div style="font-size: 11px; color: #94a3b8; margin-bottom: 8px;">平均投入指数</div>
          <div class="grad-text" style="font-size: 20px; font-weight: 700;">{{ store.deptAvgScore }}</div>
        </div>
        <div class="glass-card" style="padding: 16px;">
          <div style="font-size: 11px; color: #94a3b8; margin-bottom: 8px;">活跃成员</div>
          <div class="grad-text" style="font-size: 20px; font-weight: 700;">{{ store.memberStats.length }}</div>
        </div>
        <div class="glass-card" style="padding: 16px;">
          <div style="font-size: 11px; color: #94a3b8; margin-bottom: 8px;">总记录数</div>
          <div class="grad-text" style="font-size: 20px; font-weight: 700;">{{ store.allRecords.length }}</div>
        </div>
      </div>

      <!-- 月度趋势 -->
      <div class="glass-card" style="padding: 16px; margin-bottom: 20px;">
        <div style="font-size: 13px; font-weight: 600; margin-bottom: 14px;">月度趋势</div>
        <div style="display: flex; align-items: flex-end; justify-content: space-around; height: 100px; gap: 4px;">
          <div v-for="item in store.deptMonthlyTrend" :key="item.month" style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px;">
            <div class="progress-bar" style="width: 100%; height: 40px;">
              <div class="progress-fill" :style="{ height: (item.amount / 500) * 100 + '%' }" />
            </div>
            <div style="font-size: 10px; color: #94a3b8;">{{ item.month }}</div>
          </div>
        </div>
      </div>

      <!-- TOP 5 成员 -->
      <div class="glass-card" style="padding: 16px;">
        <div style="font-size: 13px; font-weight: 600; margin-bottom: 12px;">投入排名 TOP 5</div>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div v-for="(m, i) in store.memberStats.slice(0, 5)" :key="m.id" style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 10px; flex: 1;">
              <div style="width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #7c3aed, #4f46e5); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 600; font-size: 11px;">
                {{ i + 1 }}
              </div>
              <div>
                <div style="font-size: 12px; font-weight: 500;">{{ m.name }}</div>
                <div style="font-size: 10px; color: #94a3b8;">{{ m.recordCount }} 条 · {{ m.platforms }} 平台</div>
              </div>
            </div>
            <div style="text-align: right;">
              <div class="badge badge-purple" style="font-size: 11px; font-weight: 600;">{{ m.score }}</div>
            </div>
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
