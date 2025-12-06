# komari-agent卸载
```bash
sudo systemctl stop komari-agent && sudo systemctl disable komari-agent && sudo rm -f /etc/systemd/system/komari-agent.service && sudo systemctl daemon-reload && sudo rm -rf /opt/komari /var/log/komari
```
# ServerSentry - 现代化服务器监控面板

一个基于 Next.js 15 + React 19 的现代化服务器监控主题，专为 Komari 服务端设计，使用 TypeScript、Tailwind CSS 4 和现代 React 技术栈构建。

<img width="2004" height="1121" alt="image" src="https://github.com/user-attachments/assets/8e18a7ae-2c9b-4deb-9578-3f6bf4ddfcad" />

## ✨ 功能特点

- 🚀 **现代技术栈**：Next.js 15 + React 19 + TypeScript + Tailwind CSS 4
- 📊 **实时监控**：CPU、内存、硬盘、SWAP、网络流量实时监控
- 🌐 **IPv4/IPv6 支持**：智能识别和显示双栈网络状态
- 📈 **数据可视化**：直观的进度条、图表和统计面板
- 🎨 **现代 UI**：基于 Shadcn UI 的优雅设计，支持深色/浅色模式
- 📱 **响应式设计**：完美适配桌面、平板和移动设备
- ⚡ **高性能**：Turbopack 开发模式，优化的生产构建
- 🔄 **实时更新**：2秒间隔自动刷新，支持 WebSocket 连接
- 🏷️ **地区分组**：支持按地区分组显示服务器
- 🧩 **模块化架构**：组件化设计，易于定制和扩展

## 快速开始

### 环境要求

- **Node.js**: 18.17.0 或更高版本
- **包管理器**: npm、yarn 或 pnpm（推荐使用 npm）
- **现代浏览器**: 支持 ES2022 的现代浏览器

### 安装依赖

```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install

# 或使用 pnpm
pnpm install
```

### 开发模式

```bash
# 使用 npm
npm run dev

# 或使用 yarn
yarn dev

# 或使用 pnpm
pnpm dev
```

默认情况下，应用将在 http://localhost:3000 上运行，使用 Turbopack 进行快速开发。

### 构建生产版本

```bash
# 使用 npm
npm run build

# 或使用 yarn
yarn build

# 或使用 pnpm
pnpm build
```

### 启动生产版本

```bash
# 使用 npm
npm start

# 或使用 yarn
yarn start

# 或使用 pnpm
pnpm start
```

## 🔧 环境变量配置

在项目根目录创建 `.env.local` 文件，配置后端地址：

```bash
# 指向 Komari 服务端根地址，例如：https://status.example.com
KOMARI_BASE_URL=https://your-komari-host

# Komari API 密钥（可选），用于访问需要认证的接口
KOMARI_API_KEY=your-api-key-here
```

### 代理路由说明

本主题内置以下代理路由（转发至 `KOMARI_BASE_URL` 的 Komari 接口）：

- **`/api/servers`**：主要基于 RPC2 聚合（`common:getNodes` + `common:getNodesLatestStatus`）。为确保与部分主题字段兼容，暂时使用传统接口 `/api/recent/{uuid}` 仅获取 uptime 秒数（若未来 RPC2 提供等价字段可移除此回退）。
- **`/api/public`**：获取公开配置信息（RPC2 `common:getPublicInfo`）。
- **`/api/version`**：获取版本信息（RPC2 `common:getVersion`）。
- **`/api/rpc2`**：JSON-RPC2 代理接口（POST 透传）。
- **`/api/rpc2/ws`**：WebSocket RPC2 接入信息（返回可用的 ws 链接）。

### 环境变量说明

- **`KOMARI_BASE_URL`**: 必需，Komari 服务端的基础 URL
- **`KOMARI_API_KEY`**: 可选，仅当 Komari 服务端需要 API 密钥认证时才需要设置

### IPv4/IPv6 显示功能说明

**重要提示**：IPv4/IPv6 状态显示功能依赖于 `KOMARI_API_KEY` 的配置：

- **有 API 密钥时**：可以获取完整的节点信息，IPv4/IPv6 状态显示准确
- **无 API 密钥时**：
  - 如果 Komari 服务端允许无认证访问，仍能获取基本节点信息
  - 如果服务端要求认证，可能无法获取 IP 地址信息，导致 IPv4/IPv6 状态显示不准确
  - 不会导致功能崩溃，但 IP 状态可能都显示为不支持

**建议**：为了确保 IPv4/IPv6 显示功能的准确性，特别是当 Komari 服务端需要认证时，推荐配置 `KOMARI_API_KEY`。

## 🚀 部署指南

### 独立部署

1. **构建生产版本**：

```bash
npm run build
```

2. **部署到 Web 服务器**：
   - 将生成的 `.next` 目录部署到您的 Web 服务器
   - 支持 Vercel、Netlify、Nginx、Apache 等

3. **Nginx 配置示例**：

```nginx
server {
    listen 80;
    server_name status.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Vercel 部署（推荐）

1. 连接 GitHub 仓库到 Vercel
2. 设置环境变量：
   - `KOMARI_BASE_URL`: 您的 Komari 服务端地址
   - `KOMARI_API_KEY`: API 密钥（可选）
3. 自动部署完成

## 🎨 自定义主题

您可以根据需要修改主题，调整颜色、布局等：

### 配置文件

- **`src/lib/config.ts`**: 全局配置（网站标题、刷新间隔等）
- **`src/app/globals.css`**: 全局样式和 CSS 变量
- **`tailwind.config.ts`**: Tailwind CSS 配置
- **`src/components/`**: UI 组件库

### 主要组件

- **`DashboardStats`**: 监控概览面板
- **`ServerCard`**: 服务器卡片组件
- **`ServerMetric`**: 指标显示组件
- **`Navbar`**: 导航栏组件
- **`RegionFilter`**: 地区筛选组件

### 样式定制

项目使用 Tailwind CSS 4 和 CSS 变量，支持：
- 深色/浅色主题切换
- 自定义颜色方案
- 响应式布局调整
- 动画效果定制

## 📚 技术栈

- **框架**: Next.js 15 + React 19
- **语言**: TypeScript
- **样式**: Tailwind CSS 4
- **UI 组件**: Shadcn UI + Radix UI
- **状态管理**: TanStack Query
- **图标**: Lucide React
- **字体**: HarmonyOS Sans SC

## 📄 许可证

MIT License



