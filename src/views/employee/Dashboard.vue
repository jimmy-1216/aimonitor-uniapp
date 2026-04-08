<template>
  <div class="page-wrap">
    <!-- 页面标题栏（微信小程序风格） -->
    <div class="page-nav-bar" style="background: linear-gradient(135deg, #07c160, #09e870);">
      <div class="page-nav-left">
        <div class="page-nav-title" style="color:#fff;">我的看板</div>
        <div class="page-nav-sub" style="color:rgba(255,255,255,0.8);">AI 效能台账</div>
      </div>
      <div style="font-size:22px;">🌟</div>
    </div>

    <!-- 用户信息横幅 -->
    <div style="background: linear-gradient(135deg, #07c160, #09e870); padding: 0 16px 24px;">
      <div style="display:flex; align-items:center; gap:12px;">
        <div class="avatar-circle">
          {{ store.currentUser.name[0] }}
        </div>
        <div>
          <div style="font-size:15px; font-weight:600; color:#fff;">{{ store.currentUser.name }}</div>
          <div style="font-size:12px; color:rgba(255,255,255,0.8); margin-top:2px;">本月已充值 ¥{{ store.monthAmount }}</div>
        </div>
      </div>
    </div>

    <!-- 投入指数卡片（悬浮） -->
    <div style="margin: -16px 16px 0; position:relative; z-index:1;">
      <div class="card" style="padding:20px;">
        <div style="display:flex; align-items:center; justify-content:space-between;">
          <div>
            <div style="font-size:12px; color:var(--text-muted); margin-bottom:8px;">投入指数</div>
            <div style="font-size:40px; font-weight:700; color:var(--primary); line-height:1;">{{ store.inputScore }}</div>
            <div style="font-size:12px; color:var(--text-muted); margin-top:6px;">满分 100 分</div>
          </div>
          <div class="score-ring-wrap">
            <svg class="score-ring-svg" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" class="ring-bg" />
              <circle cx="60" cy="60" r="54" class="ring-fill"
                :style="{ strokeDashoffset: 339 - (store.inputScore / 100) * 339 }" />
            </svg>
            <div class="score-inner">
              <div class="score-big">{{ store.inputScore }}</div>
              <div class="score-small">投入指数</div>
            </div>
          </div>
        </div>

        <!-- 三维分数 -->
        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; margin-top:16px; padding-top:16px; border-top:1px solid var(--border-light);">
          <div style="text-align:center;">
            <div style="font-size:16px; font-weight:700; color:var(--blue);">{{ store.monthAmount }}</div>
            <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">本月金额</div>
          </div>
          <div style="text-align:center; border-left:1px solid var(--border-light); border-right:1px solid var(--border-light);">
            <div style="font-size:16px; font-weight:700; color:var(--orange);">{{ new Set(store.myRecords.map(r=>r.platform)).size }}</div>
            <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">平台数量</div>
          </div>
          <div style="text-align:center;">
            <div style="font-size:16px; font-weight:700; color:var(--purple);">{{ store.myRecords.length }}</div>
            <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">记录总数</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 月度趋势 -->
    <div style="margin:12px 16px 0;">
      <div class="card" style="padding:16px;">
        <div style="font-size:14px; font-weight:600; margin-bottom:14px;">月度趋势</div>
        <div style="display:flex; align-items:flex-end; gap:6px; height:80px;">
          <div v-for="item in store.monthlyTrend" :key="item.month" style="flex:1; display:flex; flex-direction:column; align-items:center; gap:4px;">
            <div style="font-size:10px; color:var(--primary); font-weight:500;">{{ item.amount > 0 ? '¥'+item.amount : '' }}</div>
            <div style="width:100%; border-radius:4px 4px 0 0; min-height:4px;"
              :style="{ height: Math.max(4, (item.amount / 300) * 60) + 'px', background: item.amount > 0 ? 'linear-gradient(180deg,#09e870,#07c160)' : '#f0f1f3' }">
            </div>
            <div style="font-size:10px; color:var(--text-muted);">{{ item.month }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 用途分布 -->
    <div style="margin:12px 16px 0;">
      <div class="card" style="padding:16px;">
        <div style="font-size:14px; font-weight:600; margin-bottom:12px;">用途分布</div>
        <div v-if="store.purposeDist.length > 0" style="display:flex; flex-direction:column; gap:10px;">
          <div v-for="item in store.purposeDist.slice(0,4)" :key="item.tag" style="display:flex; align-items:center; gap:10px;">
            <div style="font-size:12px; color:var(--text-secondary); min-width:60px;">{{ item.label }}</div>
            <div class="progress-bar" style="flex:1;">
              <div class="progress-fill" :style="{ width: (item.count / store.purposeDist[0].count * 100) + '%' }" />
            </div>
            <div style="font-size:12px; color:var(--text-muted); min-width:20px; text-align:right;">{{ item.count }}</div>
          </div>
        </div>
        <div v-else class="empty-box" style="padding:20px 0;">
          <div style="font-size:13px; color:var(--text-muted);">暂无数据</div>
        </div>
      </div>
    </div>

    <!-- 快速操作 -->
    <div style="margin:12px 16px 16px;">
      <router-link to="/record/new" class="btn-primary" style="width:100%; padding:13px; font-size:15px;">
        ＋ 提交充值记录
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '@/store/app'
const store = useAppStore()
</script>
