<template>
  <div class="page-wrap">
    <!-- 导航栏 -->
    <div class="nav-bar">
      <div>
        <div class="nav-title">提交记录</div>
        <div class="nav-sub">记录 AI 工具使用情况</div>
      </div>
    </div>

    <div style="padding:12px 0 20px;">
      <!-- AI 平台 -->
      <div class="card" style="margin:0 16px 10px; padding:16px;">
        <div style="font-size:13px; font-weight:600; color:var(--text-secondary); margin-bottom:10px;">
          <span style="color:var(--red);">*</span> AI 平台
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:8px;">
          <div v-for="p in PLATFORMS" :key="p" class="chip" :class="{active: form.platform===p}" @click="form.platform=p; form.customPlatform=''">{{ p }}</div>
        </div>
        <input v-if="form.platform==='其他'" v-model="form.customPlatform" class="form-input" placeholder="请输入平台名称" style="margin-top:10px;" />
      </div>

      <!-- 底层大模型 -->
      <div class="card" style="margin:0 16px 10px; padding:16px;">
        <div style="font-size:13px; font-weight:600; color:var(--text-secondary); margin-bottom:10px;">
          <span style="color:var(--red);">*</span> 底层大模型
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:8px;">
          <div v-for="m in LLM_MODELS" :key="m" class="chip" :class="{active: form.llmModel===m}" @click="form.llmModel=m">{{ m }}</div>
        </div>
      </div>

      <!-- 充值类型 -->
      <div class="card" style="margin:0 16px 10px; padding:16px;">
        <div style="font-size:13px; font-weight:600; color:var(--text-secondary); margin-bottom:10px;">充值类型</div>
        <div style="display:flex; flex-wrap:wrap; gap:8px;">
          <div v-for="t in RECHARGE_TYPES" :key="t.value" class="chip" :class="{active: form.rechargeType===t.value}" @click="form.rechargeType=t.value">{{ t.label }}</div>
        </div>
      </div>

      <!-- 金额和日期 -->
      <div class="card" style="margin:0 16px 10px;">
        <div class="list-item" style="justify-content:space-between;">
          <div style="font-size:14px; color:var(--text-secondary);">
            <span style="color:var(--red);">*</span> 充值金额
          </div>
          <div style="display:flex; align-items:center; gap:4px;">
            <span style="color:var(--text-muted); font-size:14px;">¥</span>
            <input v-model.number="form.amount" type="number" placeholder="0.00" min="0" step="0.01"
              style="text-align:right; border:none; outline:none; font-size:16px; font-weight:600; color:var(--primary); width:80px; background:transparent;" />
          </div>
        </div>
        <div class="list-item" style="justify-content:space-between; border-bottom:none;">
          <div style="font-size:14px; color:var(--text-secondary);">充值日期</div>
          <input v-model="form.rechargeDate" type="date"
            style="border:none; outline:none; font-size:14px; color:var(--text-primary); background:transparent; text-align:right;" />
        </div>
      </div>

      <!-- 用途标签 -->
      <div class="card" style="margin:0 16px 10px; padding:16px;">
        <div style="font-size:13px; font-weight:600; color:var(--text-secondary); margin-bottom:10px;">用途标签</div>
        <div style="display:flex; flex-wrap:wrap; gap:8px;">
          <div v-for="t in PURPOSE_TAGS" :key="t.value" class="chip" :class="{active: form.purposeTags.includes(t.value)}" @click="toggleTag(t.value)">{{ t.label }}</div>
        </div>
      </div>

      <!-- 用途说明 -->
      <div class="card" style="margin:0 16px 10px; padding:16px;">
        <div style="font-size:13px; font-weight:600; color:var(--text-secondary); margin-bottom:8px;">用途说明</div>
        <textarea v-model="form.purposeDesc" class="form-input" placeholder="简述使用场景或目的..." rows="3"
          style="resize:none; font-family:var(--font-main); line-height:1.6;" />
      </div>

      <!-- 提交按钮 -->
      <div style="padding:0 16px; margin-top:4px;">
        <button class="btn-primary" style="width:100%; padding:13px; font-size:15px; border-radius:10px;" @click="submit" :disabled="loading">
          {{ loading ? '提交中...' : '提交记录' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore, PLATFORMS, LLM_MODELS, RECHARGE_TYPES, PURPOSE_TAGS } from '@/store/app'

const router = useRouter()
const store = useAppStore()
const loading = ref(false)

const form = ref({
  platform: PLATFORMS[0],
  customPlatform: '',
  llmModel: LLM_MODELS[0],
  rechargeType: 'topup',
  amount: null,
  rechargeDate: new Date().toISOString().slice(0, 10),
  purposeTags: [],
  purposeDesc: '',
})

function toggleTag(tag) {
  const idx = form.value.purposeTags.indexOf(tag)
  if (idx >= 0) form.value.purposeTags.splice(idx, 1)
  else form.value.purposeTags.push(tag)
}

function submit() {
  if (!form.value.platform || !form.value.llmModel || !form.value.amount) {
    alert('请填写必填项（平台、模型、金额）')
    return
  }
  loading.value = true
  setTimeout(() => {
    store.addRecord({
      platform: form.value.customPlatform || form.value.platform,
      llmModel: form.value.llmModel,
      rechargeType: form.value.rechargeType,
      amount: form.value.amount,
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
