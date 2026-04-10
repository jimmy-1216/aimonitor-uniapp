<template>
  <div class="page-wrap">
    <div class="page-nav-bar">
      <button class="page-nav-back" @click="$router.back()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" width="18" height="18"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <div class="page-nav-title">提交充值记录</div>
      <div style="width:36px;"></div>
    </div>

    <div style="padding: 12px 0 32px; display:flex; flex-direction:column; gap:10px;">

      <!-- ① AI 平台（分类展示，可折叠） -->
      <div class="form-block">
        <div class="form-block-title" style="display:flex; align-items:center; justify-content:space-between;">
          <span>AI 平台 <span class="req">*</span></span>
          <button class="plat-toggle-btn" @click="platExpanded = !platExpanded">
            {{ platExpanded ? '收起 ▲' : '展开全部 ▼' }}
          </button>
        </div>

        <!-- 已选平台预览（折叠时显示） -->
        <div v-if="!platExpanded" class="plat-selected-preview">
          <template v-if="form.platform && form.platform !== '其他'">
            <div class="plat-selected-card" :style="{ borderColor: selectedCatColor }">
              <span class="plat-item-icon" style="font-size:20px;">{{ selectedPlatInfo?.icon }}</span>
              <div>
                <div style="font-size:13px; font-weight:700; color:#f0f8ff;">{{ selectedPlatInfo?.label }}</div>
                <div style="font-size:10px; color:#7a95aa;">{{ selectedPlatInfo?.vendor }}</div>
              </div>
              <div class="plat-selected-cat" :style="{ color: selectedCatColor, borderColor: selectedCatColor + '40', background: selectedCatColor + '15' }">{{ selectedCatLabel }}</div>
            </div>
          </template>
          <template v-else-if="form.platform === '其他'">
            <div class="plat-selected-card" style="border-color: rgba(148,163,184,0.4);">
              <span class="plat-item-icon" style="font-size:20px;">➕</span>
              <div>
                <div style="font-size:13px; font-weight:700; color:#f0f8ff;">其他平台</div>
                <div style="font-size:10px; color:#7a95aa;">自定义</div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="plat-empty-hint">点击「展开全部」选择 AI 平台</div>
          </template>
        </div>

        <!-- 展开后的完整列表 -->
        <template v-if="platExpanded">
          <div v-for="cat in PLATFORM_CATEGORIES" :key="cat.key" class="plat-category">
            <div class="plat-cat-header">
              <span class="plat-cat-icon">{{ cat.icon }}</span>
              <span class="plat-cat-label" :style="{ color: cat.color }">{{ cat.label }}</span>
            </div>
            <div class="plat-grid">
              <div
                v-for="p in cat.platforms" :key="p.value"
                class="plat-item"
                :class="{ active: form.platform === p.value }"
                :style="form.platform === p.value ? { borderColor: cat.color, boxShadow: `0 0 10px ${cat.color}30` } : {}"
                @click="form.platform = p.value; form.customPlatform = ''; platExpanded = false"
              >
                <span class="plat-item-icon">{{ p.icon }}</span>
                <span class="plat-item-name" :style="form.platform === p.value ? { color: cat.color } : {}">{{ p.label }}</span>
                <span class="plat-item-vendor">{{ p.vendor }}</span>
              </div>
            </div>
          </div>
          <!-- 其他 -->
          <div class="plat-category">
            <div class="plat-grid">
              <div
                class="plat-item"
                :class="{ active: form.platform === '其他' }"
                @click="form.platform = '其他'; platExpanded = false"
              >
                <span class="plat-item-icon">➕</span>
                <span class="plat-item-name" :style="form.platform === '其他' ? { color: '#94a3b8' } : {}">其他</span>
                <span class="plat-item-vendor">自定义</span>
              </div>
            </div>
          </div>
        </template>

        <input v-if="form.platform === '其他'" v-model="form.customPlatform" class="form-input" placeholder="请输入平台名称" style="margin-top:10px;" />
      </div>

      <!-- ② 底层大模型 -->
      <div class="form-block">
        <div class="form-block-title">底层大模型 <span class="req">*</span></div>
        <div class="chip-group">
          <div v-for="m in LLM_MODELS" :key="m" class="chip" :class="{active: form.llmModel===m}" @click="form.llmModel=m">{{ m }}</div>
        </div>
      </div>

      <!-- ③ 充值渠道 -->
      <div class="form-block">
        <div class="form-block-title">充值渠道 <span class="req">*</span></div>
        <div class="channel-grid">
          <div v-for="ch in RECHARGE_CHANNELS" :key="ch.value"
            class="channel-item" :class="{ active: form.channel === ch.value, third: isThird(ch.value) }"
            @click="form.channel = ch.value">
            <div class="channel-icon">{{ ch.icon }}</div>
            <div class="channel-label">{{ ch.label }}</div>
            <div v-if="isThird(ch.value)" class="channel-badge">省钱</div>
          </div>
        </div>
        <div v-if="isThird(form.channel)" class="risk-tip">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="14" height="14"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <span>第三方渠道存在封号/失效风险，请留存凭证截图</span>
        </div>
      </div>

      <!-- ④ 充值类型 -->
      <div class="form-block">
        <div class="form-block-title">充值类型</div>
        <div class="chip-group">
          <div v-for="t in RECHARGE_TYPES" :key="t.value" class="chip" :class="{active: form.rechargeType===t.value}" @click="form.rechargeType=t.value">{{ t.label }}</div>
        </div>
      </div>

      <!-- ⑤ 金额区 -->
      <div class="form-block">
        <div class="form-block-title">
          充值金额 <span class="req">*</span>
          <span v-if="isThird(form.channel) && discount > 0" class="discount-badge">省 {{ discount }}%</span>
        </div>
        <div v-if="!isThird(form.channel)" class="amount-row">
          <div class="amount-label">充值金额</div>
          <div class="amount-input-wrap">
            <span class="amount-symbol">¥</span>
            <input v-model.number="form.faceValue" type="number" placeholder="0.00" min="0" step="0.01" class="amount-input" @input="form.actualPaid = form.faceValue" />
          </div>
        </div>
        <template v-else>
          <div class="amount-row">
            <div class="amount-label">账户面值<span class="amount-hint">充入账户的金额</span></div>
            <div class="amount-input-wrap">
              <span class="amount-symbol">¥</span>
              <input v-model.number="form.faceValue" type="number" placeholder="0.00" min="0" step="0.01" class="amount-input" />
            </div>
          </div>
          <div class="amount-divider"></div>
          <div class="amount-row">
            <div class="amount-label">实际支付<span class="amount-hint">你实际花了多少钱</span></div>
            <div class="amount-input-wrap">
              <span class="amount-symbol" style="color:#00ff88;">¥</span>
              <input v-model.number="form.actualPaid" type="number" placeholder="0.00" min="0" step="0.01" class="amount-input" style="color:#00ff88;" />
            </div>
          </div>
          <div v-if="form.faceValue > 0 && form.actualPaid > 0" class="discount-calc">
            <div class="dc-item">
              <div class="dc-label">折扣率</div>
              <div class="dc-val" style="color:#ffd60a;">{{ discountRate }}折</div>
            </div>
            <div class="dc-item">
              <div class="dc-label">节省金额</div>
              <div class="dc-val" style="color:#00ff88;">¥{{ savedAmount }}</div>
            </div>
            <div class="dc-item">
              <div class="dc-label">ROI 倍率</div>
              <div class="dc-val" style="color:#00d4ff;">{{ roiRate }}x</div>
            </div>
          </div>
        </template>
      </div>

      <!-- ⑥ 渠道备注（第三方专属） -->
      <div v-if="isThird(form.channel)" class="form-block">
        <div class="form-block-title">渠道备注 <span class="form-optional">选填</span></div>
        <input v-model="form.channelRemark" class="form-input" placeholder="如：闲鱼店铺名、淘宝链接、微信好友备注..." />
      </div>

      <!-- ⑦ 充值日期 -->
      <div class="form-block" style="padding:0; overflow:hidden;">
        <div class="form-row">
          <div class="form-row-label">充值日期</div>
          <input v-model="form.rechargeDate" type="date"
            style="border:none; outline:none; font-size:13px; color:#94a3b8; background:transparent; text-align:right;" />
        </div>
      </div>

      <!-- ⑧ 用途标签 -->
      <div class="form-block">
        <div class="form-block-title">用途标签 <span class="form-optional">可多选</span></div>
        <div class="chip-group">
          <div v-for="t in PURPOSE_TAGS" :key="t.value" class="chip" :class="{active: form.purposeTags.includes(t.value)}" @click="toggleTag(t.value)">{{ t.label }}</div>
        </div>
      </div>

      <!-- ⑨ 用途说明 -->
      <div class="form-block">
        <div class="form-block-title">用途说明 <span class="form-optional">选填</span></div>
        <textarea v-model="form.purposeDesc" class="form-input" placeholder="简述使用场景或目的..." rows="3" style="resize:none; line-height:1.6;" />
      </div>

      <!-- 提交按钮 -->
      <div style="padding: 0 16px;">
        <button class="btn-primary" style="width:100%; padding:14px; font-size:15px; border-radius:14px;" @click="submit" :disabled="loading">
          <svg v-if="!loading" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" width="16" height="16"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          <span>{{ loading ? '提交中...' : '确认提交' }}</span>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore, PLATFORM_CATEGORIES, LLM_MODELS, RECHARGE_TYPES, RECHARGE_CHANNELS, PURPOSE_TAGS, THIRD_PARTY_CHANNELS } from '@/store/app'

const router = useRouter()
const store = useAppStore()
const loading = ref(false)

const platExpanded = ref(false)

// 已选平台信息
const selectedPlatInfo = computed(() => {
  if (!form.value.platform || form.value.platform === '其他') return null
  for (const cat of PLATFORM_CATEGORIES) {
    const p = cat.platforms.find(p => p.value === form.value.platform)
    if (p) return p
  }
  return null
})
const selectedCatColor = computed(() => {
  if (!form.value.platform || form.value.platform === '其他') return '#94a3b8'
  for (const cat of PLATFORM_CATEGORIES) {
    if (cat.platforms.some(p => p.value === form.value.platform)) return cat.color
  }
  return '#94a3b8'
})
const selectedCatLabel = computed(() => {
  if (!form.value.platform || form.value.platform === '其他') return ''
  for (const cat of PLATFORM_CATEGORIES) {
    if (cat.platforms.some(p => p.value === form.value.platform)) return cat.label
  }
  return ''
})

const form = ref({
  platform: PLATFORM_CATEGORIES[0].platforms[0].value,
  customPlatform: '',
  llmModel: LLM_MODELS[0],
  rechargeType: 'subscription',
  channel: 'official',
  faceValue: null,
  actualPaid: null,
  channelRemark: '',
  rechargeDate: new Date().toISOString().slice(0, 10),
  purposeTags: [],
  purposeDesc: '',
})

function isThird(ch) { return THIRD_PARTY_CHANNELS.includes(ch) }

const discount = computed(() => {
  if (!form.value.faceValue || !form.value.actualPaid) return 0
  return Math.max(0, Math.round((1 - form.value.actualPaid / form.value.faceValue) * 100))
})
const discountRate = computed(() => {
  if (!form.value.faceValue || !form.value.actualPaid) return '-'
  return (form.value.actualPaid / form.value.faceValue * 10).toFixed(1)
})
const savedAmount = computed(() => {
  if (!form.value.faceValue || !form.value.actualPaid) return 0
  return Math.max(0, (form.value.faceValue - form.value.actualPaid).toFixed(2))
})
const roiRate = computed(() => {
  if (!form.value.faceValue || !form.value.actualPaid || form.value.actualPaid === 0) return '-'
  return (form.value.faceValue / form.value.actualPaid).toFixed(2)
})

function toggleTag(tag) {
  const idx = form.value.purposeTags.indexOf(tag)
  if (idx >= 0) form.value.purposeTags.splice(idx, 1)
  else form.value.purposeTags.push(tag)
}

function submit() {
  const fv = form.value.faceValue
  if (!form.value.platform || !fv || fv <= 0) {
    alert('请填写必填项（平台、金额）')
    return
  }
  loading.value = true
  setTimeout(() => {
    store.addRecord({
      platform: form.value.customPlatform || form.value.platform,
      llmModel: form.value.llmModel,
      rechargeType: form.value.rechargeType,
      channel: form.value.channel,
      faceValue: fv,
      actualPaid: isThird(form.value.channel) ? (form.value.actualPaid || fv) : fv,
      amount: fv,
      channelRemark: form.value.channelRemark,
      rechargeDate: form.value.rechargeDate,
      purposeTags: form.value.purposeTags,
      purposeDesc: form.value.purposeDesc,
      screenshotUrls: [],
    })
    loading.value = false
    router.push('/records')
  }, 600)
}
</script>

<style scoped>
/* 表单块 */
.form-block {
  margin: 0 16px;
  background: #1a2840;
  border: 1px solid rgba(99,179,237,0.28);
  border-radius: 14px;
  padding: 14px;
  position: relative;
  overflow: hidden;
}
.form-block::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0,212,255,0.3), transparent);
}
.form-block-title {
  font-size: 12px; font-weight: 600; color: #b0c4d8;
  margin-bottom: 12px; letter-spacing: 0.5px;
  display: flex; align-items: center; gap: 6px;
}
.req { color: #ff4d6d; }
.form-optional { font-size: 11px; color: #6b7f96; font-weight: 400; }
.chip-group { display: flex; flex-wrap: wrap; gap: 7px; }

/* 平台分类 */
.plat-category { margin-bottom: 14px; }
.plat-category:last-child { margin-bottom: 0; }
.plat-cat-header {
  display: flex; align-items: center; gap: 5px;
  margin-bottom: 8px;
}
.plat-cat-icon { font-size: 13px; }
.plat-cat-label { font-size: 11px; font-weight: 700; letter-spacing: 0.5px; }
.plat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 7px; }
.plat-item {
  display: flex; flex-direction: column; align-items: center; gap: 3px;
  padding: 8px 4px 7px;
  border-radius: 10px;
  border: 1px solid rgba(99,179,237,0.12);
  background: rgba(255,255,255,0.03);
  cursor: pointer; transition: all 0.18s;
}
.plat-item:active { opacity: 0.7; }
.plat-item.active {
  background: rgba(0,212,255,0.07);
}
.plat-item-icon { font-size: 18px; line-height: 1; }
.plat-item-name { font-size: 11px; color: #b0c4d8; font-weight: 600; text-align: center; line-height: 1.2; }
.plat-item-vendor { font-size: 9px; color: #5a7080; text-align: center; line-height: 1; }

/* 渠道选择网格 */
.channel-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.channel-item {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  padding: 10px 6px; border-radius: 10px;
  border: 1px solid rgba(99,179,237,0.12);
  background: rgba(255,255,255,0.03);
  cursor: pointer; transition: all 0.18s; position: relative;
}
.channel-item:active { opacity: 0.7; }
.channel-item.active {
  border-color: rgba(0,212,255,0.5);
  background: rgba(0,212,255,0.08);
  box-shadow: 0 0 12px rgba(0,212,255,0.15);
}
.channel-item.third.active {
  border-color: rgba(0,255,136,0.5);
  background: rgba(0,255,136,0.06);
  box-shadow: 0 0 12px rgba(0,255,136,0.15);
}
.channel-icon { font-size: 20px; }
.channel-label { font-size: 11px; color: #b0c4d8; text-align: center; line-height: 1.3; }
.channel-item.active .channel-label { color: #00d4ff; }
.channel-item.third.active .channel-label { color: #00ff88; }
.channel-badge {
  position: absolute; top: 4px; right: 4px;
  font-size: 9px; padding: 1px 5px; border-radius: 4px;
  background: rgba(0,255,136,0.15); color: #00ff88;
  border: 1px solid rgba(0,255,136,0.25); font-weight: 600;
}

/* 风险提示 */
.risk-tip {
  display: flex; align-items: flex-start; gap: 7px;
  margin-top: 12px; padding: 10px 12px;
  background: rgba(255,149,0,0.07); border: 1px solid rgba(255,149,0,0.25);
  border-radius: 8px; color: #ff9500; font-size: 12px; line-height: 1.5;
}
.risk-tip svg { flex-shrink: 0; margin-top: 1px; }

/* 金额输入 */
.amount-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 0;
}
.amount-label { font-size: 14px; color: #b0c4d8; display: flex; flex-direction: column; gap: 2px; }
.amount-hint { font-size: 11px; color: #6b7f96; }
.amount-input-wrap { display: flex; align-items: center; gap: 4px; }
.amount-symbol { font-size: 16px; color: #6b7f96; font-weight: 600; }
.amount-input {
  border: none; outline: none; background: transparent;
  font-size: 22px; font-weight: 800; color: #00d4ff;
  text-align: right; width: 100px;
}
.amount-input::placeholder { color: #2a3a4a; font-weight: 400; font-size: 18px; }
.amount-divider { height: 1px; background: rgba(99,179,237,0.1); margin: 2px 0; }

/* 折扣计算结果 */
.discount-calc {
  display: flex; gap: 0;
  margin-top: 12px;
  background: rgba(0,212,255,0.05);
  border: 1px solid rgba(0,212,255,0.15);
  border-radius: 10px; overflow: hidden;
}
.dc-item { flex: 1; padding: 10px 8px; text-align: center; border-right: 1px solid rgba(99,179,237,0.1); }
.dc-item:last-child { border-right: none; }
.dc-label { font-size: 10px; color: #6b7f96; margin-bottom: 4px; }
.dc-val { font-size: 16px; font-weight: 800; }

/* 折扣徽章 */
.discount-badge {
  font-size: 11px; padding: 2px 8px; border-radius: 10px;
  background: rgba(0,255,136,0.1); color: #00ff88;
  border: 1px solid rgba(0,255,136,0.25); font-weight: 600;
}

/* 日期行 */
.form-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 13px 16px;
  background: #1a2840;
  border: 1px solid rgba(99,179,237,0.15);
  border-radius: 14px;
}
.form-row-label { font-size: 14px; color: #b0c4d8; }

/* 平台折叠按钮 */
.plat-toggle-btn {
  background: rgba(0,212,255,0.08);
  border: 1px solid rgba(0,212,255,0.25);
  border-radius: 8px;
  padding: 4px 10px;
  font-size: 11px; color: #00d4ff;
  cursor: pointer; font-weight: 600;
  transition: background 0.15s;
}
.plat-toggle-btn:active { background: rgba(0,212,255,0.15); }

/* 已选平台预览卡片 */
.plat-selected-preview { margin-top: 4px; }
.plat-selected-card {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 14px;
  background: rgba(255,255,255,0.04);
  border: 1.5px solid;
  border-radius: 12px;
  cursor: pointer;
  transition: opacity 0.15s;
}
.plat-selected-card:active { opacity: 0.7; }
.plat-selected-cat {
  margin-left: auto;
  font-size: 10px; font-weight: 700;
  padding: 3px 9px; border-radius: 8px;
  border: 1px solid;
  flex-shrink: 0;
}
.plat-empty-hint {
  padding: 12px;
  text-align: center;
  font-size: 12px; color: #5a7080;
  border: 1px dashed rgba(99,179,237,0.2);
  border-radius: 10px;
}
</style>
