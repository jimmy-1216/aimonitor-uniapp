# 智汇星盘 — AI 效能台账 | H5 版本

基于 **Vue 3 + Vite + Pinia** 构建的深色毛玻璃风格微信小程序 H5 版本，支持 Vercel 一键部署。

## 🎯 功能特性

### 员工端
- **我的看板**：投入指数圆环、月度趋势、用途分布
- **提交记录**：充值平台、大模型、金额、日期、用途标签、截图上传
- **历史记录**：搜索、详情展示、删除操作

### 管理员端
- **部门总览**：KPI 卡片、月度趋势、TOP 5 成员排名
- **成员排名**：全部成员投入指数排序、详情弹窗
- **趋势分析**：月度表、平台/用途/大模型分布图表

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器 (http://localhost:5173)
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

### Vercel 部署

1. 推送代码到 GitHub
2. 在 Vercel 中导入仓库
3. 自动检测到 `vercel.json` 配置，一键部署

## 🎨 设计语言

- **配色**：深夜蓝黑 (#0f0c29) + 紫蓝渐变 (#7c3aed → #38bdf8)
- **风格**：毛玻璃卡片 (Glassmorphism) + 发光边框
- **字体**：Inter + Noto Sans SC
- **单位**：px（响应式设计）

## 📁 项目结构

```
src/
├── assets/
│   └── main.css              # 全局样式 + 深色主题
├── components/
│   ├── TabBar.vue            # 底部导航栏
│   └── Toast.vue             # 提示组件
├── router/
│   └── index.js              # 路由配置
├── store/
│   └── app.js                # Pinia 全局状态 + Mock 数据
├── views/
│   ├── employee/
│   │   ├── Dashboard.vue     # 员工看板
│   │   ├── RecordNew.vue     # 填报记录
│   │   └── Records.vue       # 历史记录
│   └── admin/
│       ├── AdminOverview.vue # 部门总览
│       ├── AdminMembers.vue  # 成员排名
│       └── AdminTrends.vue   # 趋势分析
├── App.vue                   # 根组件 + Demo 角色切换
└── main.js                   # 应用入口
```

## 🔧 配置文件

- **vite.config.js**：Vite 构建配置
- **vercel.json**：Vercel 部署配置
- **package.json**：项目依赖和脚本

## 📊 Mock 数据

所有数据均来自 `src/store/app.js` 中的 Mock 层，包括：
- 5 个虚拟成员
- 每个成员 6 条充值记录
- 投入指数算法（金额 + 平台 + 用途）

## 🔐 Demo 模式

顶部固定条可切换员工/管理员视图，用于快速预览不同角色的界面。

## 📱 响应式设计

- 移动优先设计
- 支持 iOS/Android 安全区域
- 底部 TabBar 固定导航

## 🌐 后端对接

当需要对接真实后端时，只需替换 `src/store/app.js` 中的 Mock 数据为 API 调用即可，无需修改组件代码。

## 📄 许可证

MIT
