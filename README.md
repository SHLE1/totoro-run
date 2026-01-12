# Totoro-paradise

阳光体育跑步模拟工具，无需 MITM 中间人攻击。

项目名称灵感来自 `nekopara`。

## 功能特性

- 扫描二维码登录，获取用户认证信息
- 生成模拟跑步路线和 GPS 轨迹
- 支持自定义跑步距离和路径
- 集成天地图显示路线信息
- 服务端 API 代理，与阳光体育系统通信

## 技术栈

- **框架**: Nuxt 4 + Vue 3 + TypeScript
- **UI**: Vuetify 3 + Element Plus + UnoCSS
- **地图**: 天地图 API
- **包管理**: pnpm

## 快速开始

### 环境要求

- Node.js 18+
- pnpm 8+

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
pnpm build
```

### 运行生产版本

```bash
pnpm start
```

## Docker 部署

```bash
docker build -t totoro-paradise .
docker run -p 3000:3000 totoro-paradise
```

## 项目结构

```
├── pages/              # 页面组件
├── server/api/         # 服务端 API
├── src/
│   ├── classes/        # 类定义（会话管理、向量计算）
│   ├── utils/          # 工具函数（路线生成、加密等）
│   ├── wrappers/       # API 封装
│   └── types/          # TypeScript 类型定义
├── components/         # Vue 组件
├── composables/        # Vue 组合式函数
└── plugins/            # Nuxt 插件
```

## 许可证

[AGPL-3.0](LICENSE)

## 作者

BeiyanYunyi & SHLE1 & Claude
