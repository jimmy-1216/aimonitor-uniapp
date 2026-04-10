import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// ===== 平台分类体系 =====
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

export const PLATFORMS = [
  ...PLATFORM_CATEGORIES.flatMap(c => c.platforms.map(p => p.value)),
  '其他',
]

export const PLATFORM_MAP = Object.fromEntries(
  PLATFORM_CATEGORIES.flatMap(c =>
    c.platforms.map(p => [p.value, { ...p, category: c.key, categoryLabel: c.label, categoryColor: c.color }])
  )
)

export const LLM_MODELS = [
  'GPT-4o', 'GPT-4o mini', 'GPT-4', 'o1', 'o3',
  'Claude 3.7', 'Claude 3.5', 'Claude 3',
  'Gemini 2.0', 'Gemini 1.5', 'Gemini Pro',
  'DeepSeek-V3', 'DeepSeek-R1',
  'Moonshot', 'Qwen-Max', 'ERNIE-4',
  '其他',
]

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

// ===== 岗位体系 =====
/**
 * 岗位分类：dev（研发/技术）、product（产品/设计）、general（通用/运营/其他）
 *
 * V2.4 评分规则（对齐《AI时代的绩效考核框架》V2.4）：
 *   投入指数（50分）= dim1（30分）+ dim2（20分）
 *   产出指数（50分）= 场景覆盖度（10分，自动）+ 用途说明质量（25分，管理员）+ 综合评价（15分，管理员）
 *   AI 效能分（100分）= 投入指数 + 产出指数
 *
 *   绩效挂钩：传统考核（KPI/OKR）70% + AI 效能分 30%
 *
 * 注意：V2.1 版本中的"使用频次"维度已取消，不再计入投入指数。
 */
export const JOB_ROLES = [
  { value: 'dev',     label: '研发',   icon: '💻', color: '#a855f7', desc: '前端/后端/算法/测试' },
  { value: 'product', label: '产品',   icon: '🎯', color: '#00d4ff', desc: '产品/设计/UX' },
  { value: 'general', label: '通用',   icon: '⚡', color: '#00ff88', desc: '运营/市场/其他' },
]
export const JOB_ROLE_LABELS = Object.fromEntries(JOB_ROLES.map(r => [r.value, r.label]))

/**
 * 岗位差异化评分配置（V2.4）
 *
 * 研发岗（dev）：
 *   投入：编程工具投入（30分）+ 大模型多样性（20分）= 50
 *   产出：技术场景覆盖（10分，自动）+ 技术产出质量（25分，管理员）+ 综合评价（15分，管理员）= 50
 *
 * 产品岗（product）：
 *   投入：充值总金额（30分）+ 工具多样性（20分）= 50
 *   产出：需求/设计场景（10分，自动）+ 产出物质量（25分，管理员）+ 综合评价（15分，管理员）= 50
 *
 * 通用岗（general）：
 *   投入：充值总金额（30分）+ 大模型多样性（20分）= 50
 *   产出：场景多样性（10分，自动）+ 用途说明质量（25分，管理员）+ 综合评价（15分，管理员）= 50
 */
export const JOB_SCORE_CONFIG = {
  dev: {
    input: {
      dim1: { key: 'codingTools', label: '编程工具投入', max: 30, hint: '编程 AI 工具（Cursor/Copilot/Windsurf 等）充值金额 ≥¥200 得满分' },
      dim2: { key: 'modelDiversity', label: '大模型多样性', max: 20, hint: '调用不同底层大模型的数量，≥4 个得满分' },
    },
    output: {
      dim1: { key: 'techScene', label: '技术场景覆盖', max: 10, hint: '编程/Agent/分析等技术类用途标签，≥3 种得满分' },
      dim2: { key: 'outputQuality', label: '技术产出质量', max: 25, hint: '管理员评分：代码质量、效率提升、技术方案完整度' },
      dim3: { key: 'managerEval', label: '综合评价', max: 15, hint: '管理员综合评价' },
    },
    outputHints: {
      dim2: '优秀22-25 · 良好15-21 · 一般8-14 · 较差1-7',
      dim3: '优秀13-15 · 良好9-12 · 一般5-8 · 待改进1-4',
    },
  },
  product: {
    input: {
      dim1: { key: 'amount', label: '充值总金额', max: 30, hint: '月度 AI 工具总投入 ≥¥200 得满分' },
      dim2: { key: 'toolDiversity', label: '工具多样性', max: 20, hint: '使用不同 AI 平台数量，≥5 个得满分（产品岗强调广度）' },
    },
    output: {
      dim1: { key: 'designScene', label: '需求/设计场景', max: 10, hint: '文案/设计/调研/PPT 等业务类用途标签，≥3 种得满分' },
      dim2: { key: 'outputQuality', label: '产出物质量', max: 25, hint: '管理员评分：PRD 完整度、设计稿质量、用户洞察深度' },
      dim3: { key: 'managerEval', label: '综合评价', max: 15, hint: '管理员综合评价' },
    },
    outputHints: {
      dim2: '优秀22-25 · 良好15-21 · 一般8-14 · 较差1-7',
      dim3: '优秀13-15 · 良好9-12 · 一般5-8 · 待改进1-4',
    },
  },
  general: {
    input: {
      dim1: { key: 'amount', label: '充值总金额', max: 30, hint: '月度 AI 工具总投入 ≥¥200 得满分' },
      dim2: { key: 'modelDiversity', label: '大模型多样性', max: 20, hint: '调用不同底层大模型的数量，≥4 个得满分' },
    },
    output: {
      dim1: { key: 'sceneDiv', label: '场景多样性', max: 10, hint: '使用 AI 的不同用途标签，≥4 种得满分' },
      dim2: { key: 'outputQuality', label: '用途说明质量', max: 25, hint: '管理员评分：说明是否具体量化、是否与业务结合' },
      dim3: { key: 'managerEval', label: '综合评价', max: 15, hint: '管理员综合评价' },
    },
    outputHints: {
      dim2: '优秀22-25 · 良好15-21 · 一般8-14 · 较差1-7',
      dim3: '优秀13-15 · 良好9-12 · 一般5-8 · 待改进1-4',
    },
  },
}

// ===== 编程类平台集合（用于研发岗投入维度1计算）=====
const CODING_PLATFORMS = new Set(['Cursor', 'GitHub Copilot', 'Windsurf', 'Codex', 'Bolt', 'v0', 'Replit', 'Tabnine'])
// 产品岗关注的用途标签
const PRODUCT_PURPOSE_TAGS = new Set(['writing', 'design', 'research', 'ppt', 'image', 'translation'])
// 研发岗关注的用途标签
const DEV_PURPOSE_TAGS = new Set(['coding', 'agent', 'analysis'])

// ===== 评分函数（V2.4）=====

/**
 * 充值金额得分（产品岗/通用岗 dim1，满分30分）
 * 统一阈值：≥¥200 满分，后期可调整
 */
function scoreAmount(amount) {
  if (amount >= 200) return 30
  if (amount >= 100) return 20
  if (amount >= 50)  return 10
  if (amount >= 1)   return 5
  return 0
}

/**
 * 编程工具投入得分（研发岗 dim1，满分30分）
 * 考察编程 AI 工具充值金额，≥¥200 满分
 */
function scoreCodingTools(records) {
  const codingAmount = records
    .filter(r => CODING_PLATFORMS.has(r.platform))
    .reduce((s, r) => s + Number(r.amount), 0)
  if (codingAmount >= 200) return 30
  if (codingAmount >= 120) return 22
  if (codingAmount >= 70)  return 14
  if (codingAmount >= 1)   return 6
  return 0
}

/**
 * 大模型多样性得分（研发岗/通用岗 dim2，满分20分）
 * ≥4 个模型满分
 */
function scoreModelDiversity(records) {
  const count = new Set(records.map(r => r.llmModel).filter(Boolean)).size
  if (count >= 4) return 20
  if (count === 3) return 15
  if (count === 2) return 10
  if (count === 1) return 5
  return 0
}

/**
 * 工具多样性得分（产品岗 dim2，满分20分，鼓励广度）
 * ≥5 个平台满分
 */
function scoreToolDiversity(records) {
  const count = new Set(records.map(r => r.platform)).size
  if (count >= 5) return 20
  if (count === 4) return 16
  if (count === 3) return 12
  if (count === 2) return 8
  if (count === 1) return 4
  return 0
}

/**
 * 场景多样性得分（通用岗 output dim1，满分10分）
 * ≥4 种标签满分
 */
function scoreSceneDiversity(records) {
  const count = new Set(records.flatMap(r => r.purposeTags)).size
  if (count >= 4) return 10
  if (count === 3) return 7
  if (count === 2) return 4
  if (count === 1) return 2
  return 0
}

/**
 * 技术场景覆盖得分（研发岗 output dim1，满分10分）
 * ≥3 种技术标签满分
 */
function scoreTechScene(records) {
  const count = new Set(
    records.flatMap(r => r.purposeTags).filter(t => DEV_PURPOSE_TAGS.has(t))
  ).size
  if (count >= 3) return 10
  if (count === 2) return 6
  if (count === 1) return 3
  return 0
}

/**
 * 需求/设计场景覆盖得分（产品岗 output dim1，满分10分）
 * ≥3 种业务标签满分
 */
function scoreDesignScene(records) {
  const count = new Set(
    records.flatMap(r => r.purposeTags).filter(t => PRODUCT_PURPOSE_TAGS.has(t))
  ).size
  if (count >= 3) return 10
  if (count === 2) return 6
  if (count === 1) return 3
  return 0
}

/**
 * 按岗位计算投入指数（满分50分，V2.4：仅两个维度，无频次）
 * @param {Array} records - 近30天充值记录
 * @param {string} jobRole - 'dev' | 'product' | 'general'
 */
export function calcInputScoreByRole(records, jobRole = 'general') {
  if (!records || records.length === 0) {
    return { dim1Score: 0, dim2Score: 0, inputTotal: 0, breakdown: {} }
  }
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const recent = records.filter(r => new Date(r.rechargeDate) >= thirtyDaysAgo)
  const totalAmount = recent.reduce((s, r) => s + Number(r.amount), 0)

  let dim1Score = 0, dim2Score = 0
  let breakdown = {}

  if (jobRole === 'dev') {
    dim1Score = scoreCodingTools(recent)
    dim2Score = scoreModelDiversity(recent)
    const codingAmount = recent
      .filter(r => CODING_PLATFORMS.has(r.platform))
      .reduce((s, r) => s + Number(r.amount), 0)
    breakdown = {
      codingAmount,
      totalAmount,
      modelCount: new Set(recent.map(r => r.llmModel).filter(Boolean)).size,
    }
  } else if (jobRole === 'product') {
    dim1Score = scoreAmount(totalAmount)
    dim2Score = scoreToolDiversity(recent)
    breakdown = {
      totalAmount,
      platformCount: new Set(recent.map(r => r.platform)).size,
    }
  } else {
    // general
    dim1Score = scoreAmount(totalAmount)
    dim2Score = scoreModelDiversity(recent)
    breakdown = {
      totalAmount,
      modelCount: new Set(recent.map(r => r.llmModel).filter(Boolean)).size,
    }
  }

  return {
    dim1Score,
    dim2Score,
    inputTotal: dim1Score + dim2Score,
    breakdown,
  }
}

/**
 * 按岗位计算产出指数（满分50分，V2.4）
 * dim1 自动计算（10分），dim2 用途说明质量（25分，管理员），dim3 综合评价（15分，管理员）
 */
export function calcOutputScoreByRole(records, jobRole = 'general', outputQuality = 12, managerEval = 8) {
  if (!records || records.length === 0) {
    return { dim1Score: 0, dim2Score: 0, dim3Score: 0, outputTotal: 0 }
  }
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const recent = records.filter(r => new Date(r.rechargeDate) >= thirtyDaysAgo)

  let dim1Score = 0
  if (jobRole === 'dev') {
    dim1Score = scoreTechScene(recent)
  } else if (jobRole === 'product') {
    dim1Score = scoreDesignScene(recent)
  } else {
    dim1Score = scoreSceneDiversity(recent)
  }

  // 管理员打分上限：用途说明质量 25 分，综合评价 15 分
  const safeQuality = Math.min(Math.max(Number(outputQuality) || 0, 0), 25)
  const safeEval = Math.min(Math.max(Number(managerEval) || 0, 0), 15)

  return {
    dim1Score,
    dim2Score: safeQuality,
    dim3Score: safeEval,
    outputTotal: dim1Score + safeQuality + safeEval,
  }
}

// ===== Mock 数据 =====
const MOCK_MEMBERS = [
  { id: 1, name: '张伟', openId: 'user_001', role: 'user', jobRole: 'dev'     },
  { id: 2, name: '李娜', openId: 'user_002', role: 'user', jobRole: 'product' },
  { id: 3, name: '王芳', openId: 'user_003', role: 'user', jobRole: 'general' },
  { id: 4, name: '刘洋', openId: 'user_004', role: 'user', jobRole: 'dev'     },
  { id: 5, name: '陈静', openId: 'user_005', role: 'user', jobRole: 'product' },
]

function genRecords() {
  const list = []
  let id = 1
  const platformsByRole = {
    dev:     ['Cursor', 'GitHub Copilot', 'ChatGPT', 'Claude', 'Windsurf', 'Codex', 'DeepSeek', 'Gemini'],
    product: ['ChatGPT', 'Midjourney', 'Gamma', 'Notion AI', 'Kimi', 'Monica', 'Runway', 'Claude'],
    general: ['ChatGPT', 'Kimi', '文心一言', 'Manus', 'Gemini', 'Monica', 'DeepSeek', 'Perplexity'],
  }
  const models = ['GPT-4o', 'Claude 3.5', 'Gemini 1.5', 'Moonshot', 'DeepSeek-V3', 'Claude 3.7', 'GPT-4o mini', 'DeepSeek-R1']
  const types = ['subscription', 'topup', 'api', 'credits']
  const tagsByRole = {
    dev:     [['coding','agent'],['coding','analysis'],['agent','coding'],['coding','translation'],['analysis','coding'],['coding','other'],['agent','analysis'],['coding','research']],
    product: [['writing','ppt'],['design','image'],['research','writing'],['ppt','translation'],['design','writing'],['image','video'],['writing','research'],['design','ppt']],
    general: [['writing','other'],['research','translation'],['analysis','writing'],['ppt','other'],['translation','research'],['writing','analysis'],['other','research'],['ppt','writing']],
  }

  MOCK_MEMBERS.forEach((m, mi) => {
    const jr = m.jobRole
    const platforms = platformsByRole[jr]
    const tags = tagsByRole[jr]
    for (let i = 0; i < 8; i++) {
      const d = new Date()
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
  const currentUser = ref({ id: 1, name: '张伟', openId: 'user_001', role: 'user', jobRole: 'dev' })
  const records = ref([...ALL_RECORDS])

  // 管理员对每个成员的产出指数手动打分
  // V2.4：用途说明质量上限 25 分，综合评价上限 15 分
  const managerScores = ref({
    1: { outputQuality: 22, managerEval: 13 },  // 张伟（研发）- 优秀
    2: { outputQuality: 20, managerEval: 11 },  // 李娜（产品）- 良好
    3: { outputQuality: 9,  managerEval: 7  },  // 王芳（通用）- 一般
    4: { outputQuality: 16, managerEval: 10 },  // 刘洋（研发）- 良好
    5: { outputQuality: 8,  managerEval: 5  },  // 陈静（产品）- 待改进
  })

  const myRecords = computed(() =>
    records.value.filter(r => r.userId === currentUser.value.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  )

  const inputScoreDetail = computed(() => calcInputScoreByRole(myRecords.value, currentUser.value.jobRole))
  const inputScore = computed(() => inputScoreDetail.value.inputTotal)

  // 当前用户的产出指数（使用管理员打分）
  const outputScoreDetail = computed(() => {
    const ms = managerScores.value[currentUser.value.id] || { outputQuality: 12, managerEval: 8 }
    return calcOutputScoreByRole(myRecords.value, currentUser.value.jobRole, ms.outputQuality, ms.managerEval)
  })
  const outputScore = computed(() => outputScoreDetail.value.outputTotal)
  const totalScore = computed(() => inputScore.value + outputScore.value)

  const thisMonth = computed(() => new Date().toISOString().slice(0, 7))
  const monthAmount = computed(() =>
    myRecords.value.filter(r => r.rechargeDate.startsWith(thisMonth.value)).reduce((s, r) => s + Number(r.amount), 0)
  )

  // 填报截止日：次月5号
  const submitDeadline = computed(() => {
    const now = new Date()
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 5)
    return `${nextMonth.getMonth() + 1}月${nextMonth.getDate()}日`
  })

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
      const ms = managerScores.value[m.id] || { outputQuality: 12, managerEval: 8 }
      const jr = m.jobRole || 'general'
      const input = calcInputScoreByRole(mrs, jr)
      const output = calcOutputScoreByRole(mrs, jr, ms.outputQuality, ms.managerEval)
      const total = mrs.reduce((s, r) => s + Number(r.amount), 0)
      const platforms = new Set(mrs.map(r => r.platform)).size
      const purposes = new Set(mrs.flatMap(r => r.purposeTags)).size
      const jobInfo = JOB_ROLES.find(j => j.value === jr) || JOB_ROLES[2]
      return {
        ...m,
        jobRole: jr,
        jobLabel: jobInfo.label,
        jobIcon: jobInfo.icon,
        jobColor: jobInfo.color,
        // 投入指数明细（V2.4：两个维度）
        dim1InputScore: input.dim1Score,
        dim2InputScore: input.dim2Score,
        inputTotal: input.inputTotal,
        // 产出指数明细
        dim1OutputScore: output.dim1Score,
        dim2OutputScore: output.dim2Score,
        dim3OutputScore: output.dim3Score,
        outputTotal: output.outputTotal,
        // 总分
        score: input.inputTotal + output.outputTotal,
        // 其他统计
        total, recordCount: mrs.length, platforms, purposes,
        breakdown: input.breakdown,
        // 兼容旧字段
        amountScore: input.dim1Score,
        modelScore: input.dim2Score,
        sceneScore: output.dim1Score,
        descScore: output.dim2Score,
        managerEvalScore: output.dim3Score,
      }
    }).sort((a, b) => b.score - a.score)
  })

  const deptTotal = computed(() => records.value.reduce((s, r) => s + Number(r.amount), 0))
  const deptAvgScore = computed(() => {
    const scores = memberStats.value.map(m => m.score)
    return scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
  })

  function updateManagerScore(userId, outputQuality, managerEval) {
    managerScores.value[userId] = {
      outputQuality: Math.min(Math.max(Number(outputQuality) || 0, 0), 25),
      managerEval: Math.min(Math.max(Number(managerEval) || 0, 0), 15),
    }
  }

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
      map[ch] = (map[ch] || 0) + 1
    })
    const total = Object.values(map).reduce((a, b) => a + b, 0)
    return Object.entries(map).map(([channel, count]) => ({
      channel,
      label: CHANNEL_LABELS[channel] || channel,
      count,
      pct: total ? Math.round(count / total * 100) : 0,
    })).sort((a, b) => b.count - a.count)
  })

  function addRecord(rec) {
    records.value.unshift({ ...rec, id: Date.now(), createdAt: new Date().toISOString() })
  }

  function deleteRecord(id) {
    records.value = records.value.filter(r => r.id !== id)
  }

  return {
    currentUser, records, managerScores,
    myRecords, inputScore, inputScoreDetail,
    outputScore, outputScoreDetail, totalScore,
    thisMonth, monthAmount, monthlyTrend, purposeDist, categoryStats,
    submitDeadline,
    allRecords, memberStats, deptTotal, deptAvgScore,
    deptMonthlyTrend, platformStats, purposeStats, modelStats, channelStats,
    addRecord, deleteRecord, updateManagerScore,
  }
})
