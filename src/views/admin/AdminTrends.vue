<template>
  <div class="page-wrap">
    <!-- 页面标题栏 -->
    <div class="page-nav-bar">
      <div class="page-nav-left">
        <div class="page-nav-title">趋势分析</div>
        <div class="page-nav-sub">部门 AI 使用趋势</div>
      </div>
    </div>

    <div style="padding:12px 0 20px;">
      <!-- 月度充值趋势 -->
      <div class="card" style="margin:0 16px 10px; padding:16px;">
        <div style="font-size:14px; font-weight:600; margin-bottom:14px;">月度充值趋势</div>
        <div style="display:flex; align-items:flex-end; gap:6px; height:100px;">
          <div v-for="item in store.deptMonthlyTrend" :key="item.month" style="flex:1; display:flex; flex-direction:column; align-items:center; gap:4px;">
            <div style="font-size:10px; color:var(--blue); font-weight:500;">{{ item.amount > 0 ? '¥'+item.amount : '' }}</div>
            <div style="width:100%; border-radius:4px 4px 0 0; min-height:4px;"
              :style="{ height: Math.max(4, (item.amount / maxAmount) * 80) + 'px', background: item.amount > 0 ? 'linear-gradient(180deg,#4096ff,#1677ff)' : '#f0f1f3' }">
            </div>
            <div style="font-size:10px; color:var(--text-muted);">{{ item.month }}</div>
          </div>
        </div>
        <!-- 月度数据表 -->
        <div style="margin-top:14px; padding-top:14px; border-top:1px solid var(--border-light);">
          <div style="display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:4px; font-size:11px; color:var(--text-muted); margin-bottom:6px; padding:0 4px;">
            <span>月份</span><span style="text-align:right;">金额</span><span style="text-align:right;">笔数</span><span style="text-align:right;">环比</span>
          </div>
          <div v-for="(item, i) in store.deptMonthlyTrend.slice().reverse().slice(0,4)" :key="item.month"
            style="display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:4px; font-size:12px; padding:6px 4px; border-radius:6px;"
            :style="i%2===0 ? 'background:#f9fafb;' : ''">
            <span style="font-weight:500;">{{ item.month }}</span>
            <span style="text-align:right; color:var(--primary); font-weight:600;">¥{{ item.amount }}</span>
            <span style="text-align:right; color:var(--text-secondary);">{{ item.count }}</span>
            <span style="text-align:right;" :style="item.growth > 0 ? 'color:#f5222d;' : item.growth < 0 ? 'color:#52c41a;' : 'color:#999;'">
              {{ item.growth > 0 ? '↑' : item.growth < 0 ? '↓' : '-' }}{{ item.growth !== 0 ? Math.abs(item.growth)+'%' : '' }}
            </span>
          </div>
        </div>
      </div>

      <!-- 平台分布 -->
      <div class="card" style="margin:0 16px 10px; padding:16px;">
        <div style="font-size:14px; font-weight:600; margin-bottom:12px;">平台分布</div>
        <div style="display:flex; flex-direction:column; gap:10px;">
          <div v-for="(item, i) in store.platformStats.slice(0,5)" :key="item.platform || item.name" style="display:flex; align-items:center; gap:10px;">
            <div style="width:6px; height:6px; border-radius:50%; flex-shrink:0;"
              :style="{ background: ['#07c160','#1677ff','#fa8c16','#722ed1','#eb2f96'][i] }" />
            <div style="font-size:12px; color:var(--text-secondary); min-width:70px;">{{ item.platform || item.name }}</div>
            <div class="progress-bar" style="flex:1;">
              <div style="height:100%; border-radius:3px; transition:width 0.6s ease;"
                :style="{ width: (item.amount / (store.platformStats[0]?.amount || 1) * 100)+'%', background: ['#07c160','#1677ff','#fa8c16','#722ed1','#eb2f96'][i] }" />
            </div>
            <div style="font-size:12px; color:var(--text-muted); min-width:36px; text-align:right;">¥{{ item.amount }}</div>
          </div>
        </div>
      </div>

      <!-- 用途分布 -->
      <div class="card" style="margin:0 16px 10px; padding:16px;">
        <div style="font-size:14px; font-weight:600; margin-bottom:12px;">用途分布</div>
        <div style="display:flex; flex-wrap:wrap; gap:8px;">
          <div v-for="(item, i) in store.purposeStats.slice(0,6)" :key="item.tag"
            style="flex:1; min-width:calc(50% - 4px); background:#f5f6f8; border-radius:10px; padding:10px 12px;">
            <div style="font-size:12px; color:var(--text-secondary); margin-bottom:4px;">{{ item.label }}</div>
            <div style="font-size:16px; font-weight:700;" :style="{ color: ['#07c160','#1677ff','#fa8c16','#722ed1','#eb2f96','#13c2c2'][i] }">{{ item.count }} 次</div>
          </div>
        </div>
      </div>

      <!-- 大模型分布 -->
      <div class="card" style="margin:0 16px 10px; padding:16px;">
        <div style="font-size:14px; font-weight:600; margin-bottom:12px;">大模型分布</div>
        <div style="display:flex; flex-direction:column; gap:10px;">
          <div v-for="(item, i) in store.modelStats.slice(0,5)" :key="item.name" style="display:flex; align-items:center; gap:10px;">
            <div style="font-size:12px; color:var(--text-secondary); min-width:70px;">{{ item.name }}</div>
            <div class="progress-bar" style="flex:1;">
              <div style="height:100%; border-radius:3px; background:linear-gradient(90deg,#07c160,#09e870); transition:width 0.6s ease;"
                :style="{ width: (item.amount / (store.modelStats[0]?.amount || 1) * 100)+'%' }" />
            </div>
            <div style="font-size:12px; color:var(--text-muted); min-width:36px; text-align:right;">¥{{ item.amount }}</div>
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
</script>
