<template>
  <div class="page-wrap">
    <!-- 导航栏 -->
    <div class="nav-bar" style="background:linear-gradient(135deg,#1677ff,#4096ff);">
      <div>
        <div class="nav-title" style="color:#fff;">部门总览</div>
        <div class="nav-sub" style="color:rgba(255,255,255,0.8);">全部成员数据汇总</div>
      </div>
      <div style="font-size:22px;">📊</div>
    </div>

    <!-- KPI 横幅 -->
    <div style="background:linear-gradient(135deg,#1677ff,#4096ff); padding:0 16px 20px;">
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <div style="background:rgba(255,255,255,0.15); border-radius:10px; padding:12px;">
          <div style="font-size:11px; color:rgba(255,255,255,0.8);">部门总充值</div>
          <div style="font-size:22px; font-weight:700; color:#fff; margin-top:4px;">¥{{ store.deptTotal }}</div>
        </div>
        <div style="background:rgba(255,255,255,0.15); border-radius:10px; padding:12px;">
          <div style="font-size:11px; color:rgba(255,255,255,0.8);">平均投入指数</div>
          <div style="font-size:22px; font-weight:700; color:#fff; margin-top:4px;">{{ store.deptAvgScore }}</div>
        </div>
        <div style="background:rgba(255,255,255,0.15); border-radius:10px; padding:12px;">
          <div style="font-size:11px; color:rgba(255,255,255,0.8);">活跃成员</div>
          <div style="font-size:22px; font-weight:700; color:#fff; margin-top:4px;">{{ store.memberStats.length }}</div>
        </div>
        <div style="background:rgba(255,255,255,0.15); border-radius:10px; padding:12px;">
          <div style="font-size:11px; color:rgba(255,255,255,0.8);">总记录数</div>
          <div style="font-size:22px; font-weight:700; color:#fff; margin-top:4px;">{{ store.allRecords.length }}</div>
        </div>
      </div>
    </div>

    <div style="padding:12px 0 20px;">
      <!-- 月度趋势 -->
      <div class="card" style="margin:0 16px 10px; padding:16px;">
        <div style="font-size:14px; font-weight:600; margin-bottom:14px;">月度趋势</div>
        <div style="display:flex; align-items:flex-end; gap:6px; height:80px;">
          <div v-for="item in store.deptMonthlyTrend" :key="item.month" style="flex:1; display:flex; flex-direction:column; align-items:center; gap:4px;">
            <div style="font-size:10px; color:var(--blue); font-weight:500;">{{ item.amount > 0 ? '¥'+item.amount : '' }}</div>
            <div style="width:100%; border-radius:4px 4px 0 0; min-height:4px;"
              :style="{ height: Math.max(4, (item.amount / 500) * 60) + 'px', background: item.amount > 0 ? 'linear-gradient(180deg,#4096ff,#1677ff)' : '#f0f1f3' }">
            </div>
            <div style="font-size:10px; color:var(--text-muted);">{{ item.month }}</div>
          </div>
        </div>
      </div>

      <!-- TOP 5 成员 -->
      <div class="card" style="margin:0 16px 10px;">
        <div style="padding:14px 16px 10px; font-size:14px; font-weight:600;">投入排名 TOP 5</div>
        <div v-for="(m, i) in store.memberStats.slice(0, 5)" :key="m.id" class="list-item" :style="i===4?'border-bottom:none':''">
          <div style="width:28px; height:28px; border-radius:50%; background:linear-gradient(135deg,#1677ff,#4096ff); display:flex; align-items:center; justify-content:center; color:#fff; font-weight:700; font-size:12px; margin-right:12px; flex-shrink:0;">
            {{ i + 1 }}
          </div>
          <div style="flex:1;">
            <div style="font-size:13px; font-weight:500;">{{ m.name }}</div>
            <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">{{ m.recordCount }} 条 · ¥{{ m.total }}</div>
          </div>
          <div class="tag tag-blue" style="font-size:12px; font-weight:700;">{{ m.score }} 分</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '@/store/app'
const store = useAppStore()
</script>
