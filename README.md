# Totoro-run

阳光体育跑步模拟工具，无需 MITM 中间人攻击。

项目名称灵感来自 `nekopara`。

## 功能特性

- 扫描二维码登录，获取用户认证信息
- 生成模拟跑步路线和 GPS 轨迹
- 路线几何预览，不依赖外部地图服务
- 服务端 API 代理，与阳光体育系统通信

## 技术栈

- **框架**: Nuxt 4 + Vue 3 + TypeScript
- **状态**: Pinia
- **样式**: UnoCSS + 设计令牌
- **校验**: Zod（接口边界）
- **测试**: Vitest
- **包管理**: pnpm

## 快速开始

### 环境要求

- Node.js 20+
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

### 检查

```bash
pnpm lint
pnpm typecheck
pnpm test
```

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
├── app/
│   ├── pages/          # 页面
│   ├── components/     # 界面组件
│   ├── composables/    # 组合式函数
│   ├── stores/         # Pinia 状态
│   ├── assets/styles/  # 设计令牌与基础样式
│   └── utils/          # 前端工具与接口校验
├── server/api/         # 服务端 API 代理
├── src/
│   ├── classes/        # 类定义（向量计算等）
│   ├── utils/          # 协议工具（加密、路线生成）
│   ├── wrappers/       # 第三方接口封装
│   └── types/          # TypeScript 类型定义
└── tests/              # 核心逻辑测试
```

## 许可证

[AGPL-3.0](LICENSE)

## 作者

BeiyanYunyi & SHLE1 & Claude
