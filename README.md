# SkyView Weather PWA

一个现代化的天气预报渐进式 Web 应用（PWA），提供实时天气信息和预报服务。支持中英文双语界面，具有优雅的用户界面和流畅的用户体验。

## 主要特性

- 🌍 实时天气信息和预报
- 🌐 多语言支持（中文/英文）
- 📱 PWA 支持，可安装到移动设备
- 📍 基于位置的天气查询
- 💾 保存常用位置
- 🌙 深色模式支持
- ⚡ 实时更新的每小时和5天天气预报
- 🎯 精确的天气状况描述

## 技术栈

- **Next.js 14** - React 框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式设计
- **Radix UI** - UI 组件库
- **Open-Meteo API** - 天气数据服务

## 快速开始

### 前置要求

- Node.js 18.0.0 或更高版本
- npm 或 yarn 包管理器

### 安装

1. 克隆仓库

```bash
git clone <repository-url>
cd weatherpwa
```

2. 安装依赖

```bash
npm install
# 或
yarn install
```

3. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

4. 打开浏览器访问 http://localhost:3000

### 生产环境构建

```bash
npm run build
npm start
# 或
yarn build
yarn start
```

## 项目结构

```
├── app/                # Next.js 应用目录
├── components/         # React 组件
├── contexts/          # React Context
├── hooks/             # 自定义 Hooks
├── lib/               # 工具函数和配置
├── public/            # 静态资源
└── types/             # TypeScript 类型定义
```

## 主要功能

- **实时天气**: 显示当前位置或搜索位置的实时天气信息
- **天气预报**: 提供每小时和未来5天的天气预报
- **位置管理**: 支持保存和管理常用位置
- **多语言**: 支持中英文切换
- **响应式设计**: 完美适配各种设备屏幕
- **PWA 特性**: 支持离线访问和设备安装

## 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进项目。

## 许可证

[MIT License](LICENSE)