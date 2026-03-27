# 礼智极意 · Givia

<p align="center">
  <strong>以编辑式叙事重构跨文化礼赠决策，让每一份心意更准确、更体面、更具世界感。</strong>
</p>

<p align="center">
  <a href="./README.md">English</a>
</p>

<p align="center">
  <a href="https://github.com/zzemy/GIVIA/actions/workflows/ci.yml">
    <img src="https://github.com/zzemy/GIVIA/actions/workflows/ci.yml/badge.svg" alt="CI 状态" />
  </a>
  <a href="https://github.com/zzemy/GIVIA/actions/workflows/deploy-pages.yml">
    <img src="https://github.com/zzemy/GIVIA/actions/workflows/deploy-pages.yml/badge.svg" alt="Pages 状态" />
  </a>
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&logoColor=white" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/License-AGPL--3.0-0b5fff" alt="AGPL-3.0" />
</p>

## 项目是什么

**礼智极意（Givia）** 是一个面向跨文化礼赠场景的编辑式决策系统。

它不把送礼理解成普通的商品选择，而是把语境、对象、文化敏感度、表达方式与最终呈现整合成一条完整叙事链路。用户不是在“选一个礼物”，而是在完成一次更得体的跨文化表达。

当前 Web 版本采用明亮、国际化、杂志化的叙事体验：从品牌入口、到本地化首页、再到礼赠流程与最终 dossier 式结果页，整体更接近一份被精心编排的礼赠提案，而不是传统后台或表单工具。

## 体验结构

当前主要由三部分组成：

1. **品牌入口页**：`/`
2. **本地化首页**：`/zh` 与 `/en`
3. **礼赠流程页**：`/[locale]/gifting`

最终输出不是商品列表，而是一份围绕跨文化送礼判断生成的编辑式建议结果。

## 核心能力

| 能力 | 说明 |
| --- | --- |
| 礼物识别 | 支持图片或文本输入识别礼物候选 |
| 文化解读 | 评估礼物在目标市场中的象征意义、礼仪风险与敏感点 |
| 对象建模 | 根据关系、身份和场景调整表达与建议方向 |
| 文案改写 | 生成更体面、更合语境的礼赠表达与卡片建议 |
| 双语呈现 | 支持中英文路由，并保持品牌表达一致 |

## 技术栈

- Next.js 16 App Router
- React 19 + TypeScript
- Tailwind CSS v4
- Framer Motion
- Jest + Testing Library
- GitHub Actions（CI 与 Pages）
- `src-tauri/` 下的可选桌面封装

## 本地开发

```bash
pnpm install
pnpm dev
```

打开 `http://localhost:3000`。

## 校验命令

```bash
pnpm lint
pnpm test -- --runInBand
pnpm build
pnpm exec tsc --noEmit
```

## 环境变量

在项目根目录创建 `.env.local`：

| 变量名 | 是否必填 | 默认值 |
| --- | --- | --- |
| `ALIYUN_DASHSCOPE_API_KEY` | AI 路由必填 | - |
| `ALIYUN_DASHSCOPE_BASE_URL` | 否 | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| `ALIYUN_DASHSCOPE_VISION_MODEL` | 否 | `qwen-vl-plus-latest` |
| `ALIYUN_DASHSCOPE_TEXT_MODEL` | 否 | `qwen-plus-latest` |

如果没有配置 API Key，服务端 AI 路由会按设计直接失败。

## API 能力面

| 方法 | 路由 | 作用 |
| --- | --- | --- |
| `POST` | `/api/analysis/run` | 执行完整礼赠分析流程 |
| `POST` | `/api/vision-recognize` | 从图片或文本识别礼物候选 |
| `POST` | `/api/cultural-generate` | 生成文化建议与编辑式提案 |
| `POST` | `/api/logistics-assistant` | 提供配送与物流建议 |

## 目录结构

```text
.
├── app/
│   ├── page.tsx
│   ├── [locale]/page.tsx
│   ├── [locale]/gifting/page.tsx
│   └── api/
├── components/
├── lib/
├── public/
└── src-tauri/
```

## CI

GitHub Actions 会在 `main` 与 `master` 的 push / pull request 上运行 CI。

当前校验内容包括：

- ESLint
- TypeScript 类型检查
- Jest 测试
- Next.js 生产构建

工作流文件：`.github/workflows/ci.yml`

## GitHub Pages

仓库内置 Pages 工作流：`.github/workflows/deploy-pages.yml`。

Pages 使用 Next.js 的静态导出能力（`output: "export"`），发布构建后的 `out/` 目录。

需要明确的边界：

- GitHub Pages 只能承载静态体验外壳
- GitHub Pages 无法执行 Next.js 服务端路由
- `/api/*` 相关能力需要部署到具备服务端能力的平台

因此，Pages 适合展示静态叙事页面，不适合作为 AI 分析能力的完整生产承载环境。

## 语言占比说明

当前仓库是一个 **TypeScript 优先** 的项目。仓库已加入 `.gitattributes`，用于帮助 GitHub Linguist 忽略生成物与辅助文件对语言统计的干扰。GitHub 的语言条刷新通常会有一定延迟，推送后可能不会立刻变化。

## 许可证

GNU Affero General Public License v3.0（AGPL-3.0）
