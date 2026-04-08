<template>
  <div class="page-wrap">
    <div class="page-header">
      <div class="header-orb" />
      <text class="page-title">提交充值记录</text>
      <text class="page-sub">记录您的 AI 工具使用情况</text>
    </div>

    <div class="container" style="margin-top: 24px; margin-bottom: 100px;">
      <div class="glass-card" style="padding: 20px;">
        <!-- AI 平台 -->
        <div style="margin-bottom: 20px;">
          <div style="font-size: 13px; font-weight: 600; margin-bottom: 10px;">
            <span style="color: #f87171;">*</span> AI 平台
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            <div
              v-for="p in PLATFORMS"
              :key="p"
              class="chip"
              :class="{ active: form.platform === p }"
              @click="form.platform = p; form.customPlatform = ''"
            >{{ p }}</div>
          </div>
          <input
            v-if="form.platform === '其他'"
            v-model="form.customPlatform"
            class="form-input"
            placeholder="请输入平台名称"
            style="margin-top: 10px;"
          />
        </div>

        <div class="divider" />

        <!-- 底层大模型 -->
        <div style="margin-bottom: 20px;">
          <div style="font-size: 13px; font-weight: 600; margin-bottom: 10px;">
            <span style="color: #f87171;">*</span> 底层大模型
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            <div
              v-for="m in LLM_MODELS"
              :key="m"
              class="chip"
              :class="{ active: form.llmModel === m }"
              @click="form.llmModel = m"
            >{{ m }}</div>
          </div>
        </div>

        <div class="divider" />

        <!-- 充值类型 -->
        <div style="margin-bottom: 20px;">
          <div style="font-size: 13px; font-weight: 600; margin-bottom: 10px;">充值类型</div>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            <div
              v-for="t in RECHARGE_TYPES"
              :key="t.value"
              class="chip"
              :class="{ active: form.rechargeType === t.value }"
              @click="form.rechargeType = t.value"
            >{{ t.label }}</div>
          </div>
        </div>

        <div class="divider" />

        <!-- 充值金额 -->
        <div style="margin-bottom: 20px;">
          <div style="font-size: 13px; font-weight: 600; margin-bottom: 8px;">
            <span style="color: #f87171;">*</span> 充值金额 (¥)
          </div>
          <input
            v-model.number="form.amount"
            type="number"
            class="form-input"
            placeholder="请输入金额"
            min="0"
            step="0.01"
          />
        </div>

        <div class="divider" />

        <!-- 充值日期 -->
        <div style="margin-bottom: 20px;">
          <div style="font-size: 13px; font-weight: 600; margin-bottom: 8px;">充值日期</div>
          <input
            v-model="form.rechargeDate"
            type="date"
            class="form-input"
          />
        </div>

        <div class="divider" />

        <!-- 用途标签 -->
        <div style="margin-bottom: 20px;">
          <div style="font-size: 13px; font-weight: 600; margin-bottom: 10px;">用途标签</div>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            <div
              v-for="t in PURPOSE_TAGS"
              :key="t.value"
              class="chip"
              :class="{ active: form.purposeTags.includes(t.value) }"
              @click="toggleTag(t.value)"
            >{{ t.label }}</div>
          </div>
        </div>

        <div class="divider" />

        <!-- 用途说明 -->
        <div style="margin-bottom: 20px;">
          <div style="font-size: 13px; font-weight: 600; margin-bottom: 8px;">用途说明</div>
          <textarea
            v-model="form.purposeDesc"
            class="form-input"
            placeholder="简述使用场景或目的..."
            rows="3"
            style="resize: none; font-family: var(--font-main);"
          />
        </div>

        <!-- 提交按钮 -->
        <button class="btn-primary" style="width: 100%; padding: 12px;" @click="submit">
          {{ loading ? '提交中...' : '✓ 提交记录' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/store/app'
import { PLATFORMS, LLM_MODELS, RECHARGE_TYPES, PURPOSE_TAGS } from '@/store/app'

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
    alert('请填写必填项')
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
