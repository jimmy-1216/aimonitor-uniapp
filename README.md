# 智汇星盘 — AI 效能台账

> Vue 3 + Vite + Pinia H5 版 · 面向企业/团队的 AI 工具使用成本管理系统

[![Vercel Deploy](https://img.shields.io/badge/Vercel-Deploy-black?logo=vercel)](https://vercel.com)
[![Vue 3](https://img.shields.io/badge/Vue-3.4-42b883?logo=vue.js)](https://vuejs.org)
[![Vite 5](https://img.shields.io/badge/Vite-5.0-646cff?logo=vite)](https://vitejs.dev)

---

## 功能概览

### 员工端
- **看板 (Dashboard)**：投入指数圆环、本月充值统计、月度趋势柱状图、用途分布排行
- **填报 (RecordNew)**：AI 平台 / 大模型 / 充值渠道（含第三方省钱渠道）/ 金额 / 用途标签全流程录入；第三方渠道自动计算折扣率、节省金额、ROI 倍率
- **记录 (Records)**：充值记录列表，支持关键词搜索、删除

### 管理员端
- **总览 (AdminOverview)**：部门汇总、月度趋势、平台分布、用途分布、大模型分布
- **成员 (AdminMembers)**：投入指数排名、成员详情弹窗
- **趋势 (AdminTrends)**：6 个月趋势图表、数据表格、渠道分布

---

## 快速开始

```bash
# 安装依赖
npm install

# 本地开发（默认 http://localhost:5173）
npm run dev

# 生产构建
npm run build

# 预览构建产物
npm run preview
```

---

## Vercel 部署

| 配置项 | 值 |
|---|---|
| Build Command | `vite build` |
| Output Directory | `dist` |
| Framework Preset | Vite |

> **注意**：`vercel.json` 已配置 History 路由重写规则（`/(.*) → /index.html`）、静态资源缓存头（`max-age=31536000, immutable`）及安全响应头，无需额外配置。

---

## 技术架构

| 层次 | 技术选型 |
|---|---|
| 框架 | Vue 3 (Composition API + `<script setup>`) |
| 构建工具 | Vite 5 + `@vitejs/plugin-vue` |
| 状态管理 | Pinia 2 |
| 路由 | Vue Router 4（History 模式） |
| 样式 | 纯 CSS（CSS 变量 + scoped） |
| 数据 | Mock 数据（`src/store/app.js`） |

### 构建分包策略

`vite.config.js` 中配置了 `manualChunks`，将 Vue / Vue Router / Pinia 拆分为独立 `vendor-vue` chunk，利用浏览器长效缓存减少重复下载。

---

## 多端适配规范

项目在 `src/assets/main.css` 中定义了以下 CSS 变量，统一管理多端安全区：

```css
:root {
  --status-bar-height: 44px;           /* 状态栏高度 */
  --nav-bar-content-height: 44px;      /* 导航栏内容高度 */
  --nav-bar-height: calc(...);         /* 导航栏总高度 */
  --capsule-safe-right: 102px;         /* 微信胶囊安全右边距 */
  --safe-area-bottom: env(safe-area-inset-bottom, 0px);  /* 底部安全区 */
  --tab-bar-height: calc(50px + var(--safe-area-bottom)); /* TabBar 总高度 */
}
```

移动端（`max-width: 480px`）下，手机外壳模拟框将自动隐藏，切换为全屏原生布局，底部 TabBar 自动适配 iPhone X+ 系列安全区。

---

## 项目结构

```
aimonitor-uniapp/
├── src/
│   ├── assets/main.css          # 全局样式 + CSS 变量（含多端适配变量）
│   ├── components/
│   │   ├── TabBar.vue           # 底部导航（含 safe-area 适配）
│   │   └── Toast.vue            # 全局提示组件
│   ├── router/index.js          # 路由配置（History 模式）
│   ├── store/app.js             # Pinia Store + Mock 数据 + 投入指数算法
│   └── views/
│       ├── employee/            # 员工端页面（Dashboard / RecordNew / Records）
│       └── admin/               # 管理员端页面（Overview / Members / Trends）
├── index.html
├── vite.config.js               # 构建配置（含 vendor 分包策略）
└── vercel.json                  # Vercel 部署配置（含缓存头、安全头、路由重写）
```

---

## Demo 角色切换

页面顶部 Demo 工具栏可一键切换**员工视角**与**管理员视角**，路由自动跳转至对应首页。

---

## 后续集成说明

当前所有数据均来自 `src/store/app.js` 中的 Mock 数据（`genRecords()`）。接入真实后端时，只需将 `records` 的初始化逻辑替换为 API 请求，所有 computed 统计和视图无需改动。

---

## 许可证

MIT
