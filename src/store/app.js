import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// ===== 平台分类体系 =====
// 三大类：AI 对话、AI 编程、AI 效率工具
export const PLATFORM_CATEGORIES = [
  {
    key: 'chat',
    label: 'AI 对话',
    icon: '💬',
    color: '#00d4ff',
    platforms: [
      { value: 'ChatGPT', label: 'ChatGPT', icon: '🤖', vendor: 'OpenAI' },
      { value: 'Claude', label: 'Claude', icon: '🔮', vendor: 'Anthropic' },
      { value: 'Gemini', label: 'Gemini', icon: '✨', vendor: 'Google' },
      { value: 'Kimi', label: 'Kimi', icon: '🌙', vendor: 'Moonshot' },
      { value: 'Monica', label: 'Monica', icon: '👩', vendor: 'Monica AI' },
      { value: '文心一言', label: '文心一言', icon: '🌊', vendor: '百度' },
      { value: '通义千问', label: '通义千问', icon: '🔯', vendor: '阿里' },
      { value: '讯飞星火', label: '讯飞星火', icon: '⚡', vendor: '科大讯飞' },
      { value: 'DeepSeek', label: 'DeepSeek', icon: '🐋', vendor: 'DeepSeek' },
      { value: 'Grok', label: 'Grok', icon: '🌀', vendor: 'xAI' },
      { value: 'Perplexity', label: 'Perplexity', icon: '🔍', vendor: 'Perplexity AI' },
    ],
  },
  {
    key: 'coding',
    label: 'AI 编程',
    icon: '💻',
    color: '#a855f7',
    platforms: [
      { value: 'Cursor', label: 'Cursor', icon: '⌨️', vendor: 'Anysphere' },
      { value: 'GitHub Copilot', label: 'Copilot', icon: '🐙', vendor: 'GitHub' },
      { value: 'Windsurf', label: 'Windsurf', icon: '🏄', vendor: 'Codeium' },
      { value: 'Codex', label: 'Codex', icon: '📦', vendor: 'OpenAI' },
      { value: 'Bolt', label: 'Bolt', icon: '⚡', vendor: 'StackBlitz' },
      { value: 'v0', label: 'v0', icon: '🎨', vendor: 'Vercel' },
      { value: 'Replit', label: 'Replit', icon: '🔁', vendor: 'Replit' },
      { value: 'Tabnine', label: 'Tabnine', icon: '📝', vendor: 'Tabnine' },
    ],
  },
  {
    key: 'tools',
    label: 'AI 效率工具',
    icon: '🛠️',
    color: '#00ff88',
    platforms: [
      { value: 'Manus', label: 'Manus', icon: '🤲', vendor: 'Manus AI' },
      { value: 'Notion AI', label: 'Notion AI', icon: '📓', vendor: 'Notion' },
      { value: 'Midjourney', label: 'Midjourney', icon: '🎨', vendor: 'Midjourney' },
      { value: 'Suno', label: 'Suno', icon: '🎵', vendor: 'Suno AI' },
      { value: 'ElevenLabs', label: 'ElevenLabs', icon: '🎙️', vendor: 'ElevenLabs' },
      { value: 'Runway', label: 'Runway', icon: '🎬', vendor: 'Runway' },
      { value: 'Pika', label: 'Pika', icon: '📹', vendor: 'Pika Labs' },
      { value: 'Gamma', label: 'Gamma', icon: '📊', vendor: 'Gamma App' },
      { value: 'Napkin AI', label: 'Napkin AI', icon: '🗒️', vendor: 'Napkin' },
    ],
  },
]

// 扁平化平台列表（兼容旧代码）
export const PLATFORMS = [
  ...PLATFORM_CATEGORIES.flatMap(c => c.platforms.map(p => p.value)),
  '其他',
]

// 平台 label/icon/category 映射
export const PLATFORM_MAP = Object.fromEntries(
  PLATFORM_CATEGORIES.flatMap(c =>
    c.platforms.map(p => [p.value, { ...p, category: c.key, categoryLabel: c.label, categoryColor: c.color }])
  )
)

// 大模型列表（按厂商分组）
export const LLM_MODELS = [
  'GPT-4o', 'GPT-4o mini', 'GPT-4', 'o1', 'o3',
  'Claude 3.7', 'Claude 3.5', 'Claude 3',
  'Gemini 2.0', 'Gemini 1.5', 'Gemini Pro',
  'DeepSeek-V3', 'DeepSeek-R1',
  'Moonshot', 'Qwen-Max', 'ERNIE-4',
  '其他',
]

// 充值渠道
export const RECHARGE_CHANNELS = [
  { value: 'official', label: '官方官网', icon: '🏢', tip: '' },
  { value: 'xianyu', label: '闲鱼', icon: '🐟', tip: '第三方渠道，存在一定风险' },
  { value: 'taobao', label: '淘宝/拼多多', icon: '🛒', tip: '第三方渠道，存在一定风险' },
  { value: 'wechat_agent', label: '微信代充', icon: '💬', tip: '第三方渠道，存在一定风险' },
  { value: 'group_buy', label: '团购拼单', icon: '👥', tip: '第三方渠道，存在一定风险' },
  { value: 'other_third', label: '其他第三方', icon: '🔗', tip: '第三方渠道，存在一定风险' },
]
export const THIRD_PARTY_CHANNELS = ['xianyu','taobao','wechat_agent','group_buy','other_third']
export const CHANNEL_LABELS = Object.fromEntries(RECHARGE_CHANNELS.map(c => [c.value, c.label]))

export const RECHARGE_TYPES = [
  { value: 'subscription', label: '订阅套餐' },
  { value: 'topup', label: '充值余额' },
  { value: 'api', label: 'API 额度' },
  { value: 'credits', label: '积分/Credits' },
]
export const PURPOSE_TAGS = [
  { value: 'coding', label: '编程开发' },
  { value: 'writing', label: '文案写作' },
  { value: 'analysis', label: '数据分析' },
  { value: 'design', label: '设计创意' },
  { value: 'research', label: '调研学习' },
  { value: 'translation', label: '翻译润色' },
  { value: 'ppt', label: 'PPT 制作' },
  { value: 'agent', label: 'AI Agent' },
  { value: 'image', label: '图像生成' },
  { value: 'video', label: '视频生成' },
  { value: 'other', label: '其他' },
]
export const RECHARGE_TYPE_LABELS = Object.fromEntries(RECHARGE_TYPES.map(t => [t.value, t.label]))
export const PURPOSE_LABELS = Object.fromEntries(PURPOSE_TAGS.map(t => [t.value, t.label]))

// ===== 投入指数算法 =====
export function calcInputScore(records) {
  if (!records || records.length === 0) return 0
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const recentRecords = records.filter(r => new Date(r.rechargeDate) >= thirtyDaysAgo)
  const totalAmount = recentRecords.reduce((s, r) => s + Number(r.amount), 0)
  const platformCount = new Set(recentRecords.map(r => r.platform)).size
  const purposeCount = new Set(recentRecords.flatMap(r => r.purposeTags)).size
  const amountScore = Math.min(totalAmount / 500 * 40, 40)
  const platformScore = Math.min(platformCount * 8, 24)
  const purposeScore = Math.min(purposeCount * 4.5, 36)
  return Math.round(amountScore + platformScore + purposeScore)
}

// ===== Mock 数据 =====
const MOCK_MEMBERS = [
  { id: 1, name: '张伟', openId: 'user_001', role: 'user' },
  { id: 2, name: '李娜', openId: 'user_002', role: 'user' },
  { id: 3, name: '王芳', openId: 'user_003', role: 'user' },
  { id: 4, name: '刘洋', openId: 'user_004', role: 'user' },
  { id: 5, name: '陈静', openId: 'user_005', role: 'user' },
]

function genRecords() {
  const list = []
  let id = 1
  const platforms = ['ChatGPT', 'Claude', 'Cursor', 'Manus', 'Gemini', 'Kimi', 'Monica', 'GitHub Copilot', 'Midjourney', 'DeepSeek']
  const models = ['GPT-4o', 'Claude 3.5', 'Gemini 1.5', 'Moonshot', 'DeepSeek-V3', 'Claude 3.7', 'GPT-4o mini', 'DeepSeek-R1']
  const types = ['subscription', 'topup', 'api', 'credits']
  const tags = [
    ['coding', 'agent'],
    ['writing', 'ppt'],
    ['research', 'translation'],
    ['design', 'image'],
    ['coding', 'analysis'],
    ['video', 'design'],
    ['agent', 'coding'],
    ['writing', 'other'],
  ]
  MOCK_MEMBERS.forEach((m, mi) => {
    for (let i = 0; i < 8; i++) {
      const d = new Date()
      // 前3条数据固定在本月内（0~20天前），后5条在过去60天内
      if (i < 3) {
        d.setDate(d.getDate() - Math.floor(Math.random() * 20))
      } else {
        d.setDate(d.getDate() - (20 + Math.floor(Math.random() * 40)))
      }
      const plat = platforms[(mi * 2 + i) % platforms.length]
      list.push({
        id: id++,
        userId: m.id,
        userName: m.name,
        platform: plat,
        llmModel: models[(mi + i) % models.length],
        rechargeType: types[i % types.length],
        amount: [20, 29, 49, 99, 199, 39, 59, 149][i % 8],
        rechargeDate: d.toISOString().slice(0, 10),
        purposeTags: tags[(mi + i) % tags.length],
        purposeDesc: ['用于日常编程辅助', '文案撰写与优化', '数据分析报告', '设计方案生成', '技术调研', 'AI Agent 自动化', '图像/视频生成', ''][i % 8],
        channel: ['official','xianyu','taobao','wechat_agent','official','official','official','official'][i % 8],
        faceValue: [20, 29, 49, 99, 199, 39, 59, 149][i % 8],
        actualPaid: [20, 22, 39, 79, 160, 39, 59, 149][i % 8],
        channelRemark: ['', '闲鱼店铺：AI账号铺子', '淘宝：科技优选', '微信好友代充', '', '', '', ''][i % 8],
        screenshotUrls: [],
        createdAt: d.toISOString(),
      })
    }
  })
  return list
}

const ALL_RECORDS = genRecords()

// ===== Store =====
export const useAppStore = defineStore('app', () => {
  const currentUser = ref({ id: 1, name: '张伟', openId: 'user_001', role: 'user' })
  const records = ref([...ALL_RECORDS])

  const myRecords = computed(() =>
    records.value.filter(r => r.userId === currentUser.value.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  )

  const inputScore = computed(() => calcInputScore(myRecords.value))

  const thisMonth = computed(() => new Date().toISOString().slice(0, 7))
  const monthAmount = computed(() =>
    myRecords.value.filter(r => r.rechargeDate.startsWith(thisMonth.value)).reduce((s, r) => s + Number(r.amount), 0)
  )

  const monthlyTrend = computed(() => {
    const months = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(); d.setMonth(d.getMonth() - i)
      months.push(d.toISOString().slice(0, 7))
    }
    return months.map(m => ({
      month: m.slice(5) + '月',
      amount: myRecords.value.filter(r => r.rechargeDate.startsWith(m)).reduce((s, r) => s + Number(r.amount), 0),
    }))
  })

  const purposeDist = computed(() => {
    const map = {}
    myRecords.value.forEach(r => r.purposeTags.forEach(t => { map[t] = (map[t] || 0) + 1 }))
    return Object.entries(map).map(([tag, count]) => ({ tag, label: PURPOSE_LABELS[tag] || tag, count }))
      .sort((a, b) => b.count - a.count)
  })

  // 按平台分类统计（新增）
  const categoryStats = computed(() => {
    const map = {}
    records.value.forEach(r => {
      const info = PLATFORM_MAP[r.platform]
      const cat = info ? info.category : 'other'
      const catLabel = info ? info.categoryLabel : '其他'
      const catColor = info ? info.categoryColor : '#94a3b8'
      if (!map[cat]) map[cat] = { category: cat, label: catLabel, color: catColor, amount: 0, count: 0 }
      map[cat].amount += Number(r.amount)
      map[cat].count++
    })
    return Object.values(map).sort((a, b) => b.amount - a.amount)
  })

  // ===== 管理员数据 =====
  const allRecords = computed(() => [...records.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))

  const memberStats = computed(() => {
    return MOCK_MEMBERS.map(m => {
      const mrs = records.value.filter(r => r.userId === m.id)
      const score = calcInputScore(mrs)
      const total = mrs.reduce((s, r) => s + Number(r.amount), 0)
      const platforms = new Set(mrs.map(r => r.platform)).size
      const purposes = new Set(mrs.flatMap(r => r.purposeTags)).size
      return { ...m, score, total, recordCount: mrs.length, platforms, purposes }
    }).sort((a, b) => b.score - a.score)
  })

  const deptTotal = computed(() => records.value.reduce((s, r) => s + Number(r.amount), 0))
  const deptAvgScore = computed(() => {
    const scores = memberStats.value.map(m => m.score)
    return scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
  })

  const deptMonthlyTrend = computed(() => {
    const months = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(); d.setMonth(d.getMonth() - i)
      months.push(d.toISOString().slice(0, 7))
    }
    return months.map((m, i) => {
      const prev = i > 0 ? months[i - 1] : null
      const monthRecs = records.value.filter(r => r.rechargeDate.startsWith(m))
      const amount = monthRecs.reduce((s, r) => s + Number(r.amount), 0)
      const count = monthRecs.length
      const prevAmount = prev ? records.value.filter(r => r.rechargeDate.startsWith(prev)).reduce((s, r) => s + Number(r.amount), 0) : 0
      const growth = prevAmount > 0 ? Math.round((amount - prevAmount) / prevAmount * 100) : 0
      return { month: m.slice(5) + '月', amount, count, growth }
    })
  })

  const platformStats = computed(() => {
    const map = {}
    records.value.forEach(r => { map[r.platform] = (map[r.platform] || 0) + Number(r.amount) })
    const total = Object.values(map).reduce((a, b) => a + b, 0)
    return Object.entries(map).map(([name, amount]) => ({ name, amount, pct: total ? Math.round(amount / total * 100) : 0 }))
      .sort((a, b) => b.amount - a.amount)
  })

  const purposeStats = computed(() => {
    const map = {}
    records.value.forEach(r => r.purposeTags.forEach(t => { map[t] = (map[t] || 0) + 1 }))
    const total = Object.values(map).reduce((a, b) => a + b, 0)
    return Object.entries(map).map(([tag, count]) => ({ tag, label: PURPOSE_LABELS[tag] || tag, count, pct: total ? Math.round(count / total * 100) : 0 }))
      .sort((a, b) => b.count - a.count)
  })

  const modelStats = computed(() => {
    const map = {}
    records.value.forEach(r => { map[r.llmModel] = (map[r.llmModel] || 0) + Number(r.amount) })
    const total = Object.values(map).reduce((a, b) => a + b, 0)
    return Object.entries(map).map(([name, amount]) => ({ name, amount, pct: total ? Math.round(amount / total * 100) : 0 }))
      .sort((a, b) => b.amount - a.amount)
  })

  const channelStats = computed(() => {
    const map = {}
    records.value.forEach(r => {
      const ch = r.channel || 'official'
      if (!map[ch]) map[ch] = { channel: ch, label: CHANNEL_LABELS[ch] || ch, count: 0, faceValue: 0, actualPaid: 0 }
      map[ch].count++
      map[ch].faceValue += Number(r.faceValue || r.amount || 0)
      map[ch].actualPaid += Number(r.actualPaid || r.amount || 0)
    })
    return Object.values(map).sort((a, b) => b.count - a.count)
  })

  const totalDiscount = computed(() => {
    const face = records.value.reduce((s, r) => s + Number(r.faceValue || r.amount || 0), 0)
    const paid = records.value.reduce((s, r) => s + Number(r.actualPaid || r.amount || 0), 0)
    return face > 0 ? Math.round((1 - paid / face) * 100) : 0
  })

  function addRecord(data) {
    const rec = {
      id: Date.now(),
      userId: currentUser.value.id,
      userName: currentUser.value.name,
      createdAt: new Date().toISOString(),
      ...data,
    }
    records.value.unshift(rec)
    return rec
  }

  function deleteRecord(id) {
    records.value = records.value.filter(r => r.id !== id)
  }

  function switchRole(role) {
    currentUser.value = role === 'admin'
      ? { id: 99, name: '管理员', openId: 'admin_001', role: 'admin' }
      : { id: 1, name: '张伟', openId: 'user_001', role: 'user' }
  }

  return {
    currentUser, records,
    myRecords, inputScore, monthAmount, monthlyTrend, purposeDist,
    allRecords, memberStats, deptTotal, deptAvgScore, deptMonthlyTrend,
    platformStats, purposeStats, modelStats, categoryStats,
    channelStats, totalDiscount,
    addRecord, deleteRecord, switchRole,
  }
})
