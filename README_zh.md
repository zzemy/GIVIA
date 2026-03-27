# GIVIA

<p align="center">
  <strong>让每一次跨文化送礼，都更稳、更体面。</strong>
</p>

<p align="center">
  <a href="./README.md">English</a>
</p>

<p align="center">
  <a href="https://github.com/zzemy/GIVIA/actions/workflows/ci.yml">
    <img src="https://github.com/zzemy/GIVIA/actions/workflows/ci.yml/badge.svg" alt="CI 状态" />
  </a>
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/License-AGPL--3.0-0b5fff" alt="AGPL-3.0" />
</p>

<p align="center">
  <a href="https://github.com/zzemy/GIVIA/actions">查看 GitHub Actions</a>
</p>

## 项目定位

GIVIA 是一个跨文化送礼决策助手。它将礼物识别、文化语义风险判断和落地建议整合到一个流程中，让用户更快得到可执行结论。

## 核心流程

1. 上传图片或输入文字，识别礼物对象。
2. 选择目标国家与收礼人画像。
3. 获取风险分析、包装方向与贺卡文案建议。

主流程页面见 [app/[locale]/page.tsx](app/[locale]/page.tsx)

## 亮点能力

| 模块 | 价值 |
| --- | --- |
| 礼物识别 | 支持图像上传与文字输入两种入口 |
| 文化风险分析 | 针对目标国家做语义和禁忌风险评估 |
| 人群画像适配 | 根据对象关系调整建议语气和表达 |
| 输出可落地 | 给出包装方向与贺卡文案组合 |
| 双语体验 | 当前支持中文与英文路由 |

## 技术栈

- Next.js 16（App Router）
- React 19 + TypeScript
- Tailwind CSS v4 + shadcn/ui + Radix UI
- Framer Motion
- Jest + Testing Library

## 快速开始

```bash
pnpm install
pnpm dev
```

访问 http://localhost:3000（自动跳转 /zh）。

## 部署到 GitHub Pages

仓库已内置 Pages 工作流：`.github/workflows/deploy-pages.yml`。

1. 推送到 `main` 或 `master` 分支。
2. 在 GitHub 仓库设置中打开 Pages，将 Source 设为 `GitHub Actions`。
3. 等待 `Deploy GitHub Pages` 工作流完成。
4. 访问 `https://<你的用户名或组织>.github.io/<仓库名>/`。

GitHub Pages 重要限制：

- Pages 只能托管静态文件。
- `/api/*` 下的 Next.js API 路由在 Pages 上不可用。
- 依赖服务端 AI 路由的功能需要部署到有后端能力的平台（如 Vercel 或自建服务）。

## 环境变量

在根目录创建 .env.local。

| 变量名 | 必填 | 默认值 |
| --- | --- | --- |
| ALIYUN_DASHSCOPE_API_KEY | 是 | - |
| ALIYUN_DASHSCOPE_BASE_URL | 否 | https://dashscope.aliyuncs.com/compatible-mode/v1 |
| ALIYUN_DASHSCOPE_VISION_MODEL | 否 | qwen-vl-plus-latest |
| ALIYUN_DASHSCOPE_TEXT_MODEL | 否 | qwen-plus-latest |

说明：

- 缺少 Key 时，AI 路由会直接返回错误。
- 本地兜底文案已关闭。

## API 概览

| 方法 | 路由 | 作用 |
| --- | --- | --- |
| POST | /api/vision-recognize | 识别礼物（图像或文本） |
| POST | /api/cultural-generate | 生成跨文化分析与建议 |

接口文件：

- [app/api/vision-recognize/route.ts](app/api/vision-recognize/route.ts)
- [app/api/cultural-generate/route.ts](app/api/cultural-generate/route.ts)

## 常用命令

| 命令 | 说明 |
| --- | --- |
| pnpm dev | 启动开发环境 |
| pnpm build | 构建静态导出到 out |
| pnpm start | 启动生产服务 |
| pnpm lint | 运行 ESLint |
| pnpm test | 运行测试 |
| pnpm test:watch | 监听模式测试 |
| pnpm test:coverage | 覆盖率报告 |

## 目录结构

```text
.
├── app/
│   ├── page.tsx
│   ├── [locale]/page.tsx
│   ├── api/vision-recognize/route.ts
│   ├── api/cultural-generate/route.ts
├── components/
├── lib/
├── messages/
└── public/
```

## 质量检查

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm test
pnpm test:coverage
```

## 许可证

GNU Affero General Public License v3.0（AGPL-3.0）
