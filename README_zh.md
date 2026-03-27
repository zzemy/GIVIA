# Givia

<p align="center">
  <strong>为跨文化送达的心意，提供带有判断力的编辑式智能。</strong>
</p>

<p align="center">
  Givia 是一个面向跨文化礼赠场景的高端编辑式系统，将审美、礼仪、语境、象征意义与送达方式组织成一条完整的判断链路。
</p>

<p align="center">
  <a href="./README.md">English</a> ·
  <a href="https://github.com/zzemy/GIVIA/actions">GitHub Actions</a>
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

---

## 为什么需要 Givia

一份礼物真正被接收时，从来不只是一个物件本身。

它总会连同关系、礼仪、文化联想、时间节点、表达方式与身份距离一起抵达。一个在本地语境中显得自然得体的选择，换到另一种文化之中，可能会被理解为过界、失衡、过度亲密，甚至不合时宜。

**Givia** 的价值，就在于在心意被送出之前，先读懂这种差异。

它不把跨文化送礼当作普通推荐问题，而是把它视为一个需要被理解、修订、改写与妥帖送达的**编辑式判断问题**。

## 它的独特之处

- **不是后台，而是叙事型体验** —— 整体流程更接近一份被编排的礼赠提案，而不是传统 SaaS 控制台。
- **不是泛化推荐，而是跨文化判断** —— 系统会同时考虑对象关系、目标市场礼仪、象征意义与送达语气。
- **不是只打分，而是会改写** —— 除了分析风险，也会提出更体面、更高级、更适合当前语境的替代方向。
- **不是附属翻译，而是双语品牌系统** —— 中文与英文界面都作为正式产品表面被完整对待。
- **不是模板化 AI，而是品牌化表达** —— 界面、语言与结果呈现都服务于高级、克制、国际化的品牌感。

## 当前体验结构

Givia 当前由多层叙事界面组成：

| 界面 | 路由 | 作用 |
| --- | --- | --- |
| 品牌入口 | `/` | 进入整个产品世界的统一入口 |
| 本地化首页 | `/zh`、`/en` | 中文与英文语境下的首页表面 |
| 礼赠流程页 | `/[locale]/gifting` | 进行礼物分析、判断与改写的主流程 |
| 终稿结果页 | 流程内部 | 以 dossier 式结构呈现最终建议 |

它不是商品商城，也不是简单规则检测器，而是一个为跨文化送达场景而设计的编辑式决策表面。

## 核心能力

| 能力 | 说明 |
| --- | --- |
| 礼物识别 | 从图片或文本中读取礼物候选 |
| 文化解读 | 评估礼仪风险、象征意义与目标市场敏感度 |
| 对象建模 | 将关系、场景与受众身份纳入判断 |
| 编辑式改写 | 生成更得体的送礼方向与表达建议 |
| 送达延展 | 将建议延伸到包装与物流层面 |
| 双语品牌呈现 | 在中英两个语境下保持品牌一致性 |

## 系统概览

### 应用栈

- Next.js 16 App Router
- React 19 + TypeScript
- Tailwind CSS v4
- Framer Motion
- Jest + Testing Library
- GitHub Actions（CI 与 GitHub Pages）
- `src-tauri/` 下的可选桌面封装

### API 能力面

| 方法 | 路由 | 作用 |
| --- | --- | --- |
| `POST` | `/api/analysis/run` | 执行完整礼赠分析流程 |
| `POST` | `/api/vision-recognize` | 从图片或文本识别礼物候选 |
| `POST` | `/api/cultural-generate` | 生成文化建议与编辑式提案 |
| `POST` | `/api/logistics-assistant` | 提供配送与物流建议 |

### 目录结构

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

## 本地运行

```bash
pnpm install
pnpm dev
```

打开 `http://localhost:3000`。

### 校验命令

```bash
pnpm lint
pnpm test --runInBand
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

如果缺少 API Key，依赖 AI 的服务端路由会按设计直接失败。

## CI 与部署边界

### CI

仓库 CI 会在 `main` 与 `master` 的 push / pull request 上运行，校验内容包括：

- ESLint
- TypeScript 类型检查
- Jest 测试
- Next.js 生产构建

工作流文件：`.github/workflows/ci.yml`

### GitHub Pages

仓库内置 Pages 工作流：`.github/workflows/deploy-pages.yml`。

Pages 使用 Next.js 静态导出能力（`output: "export"`），发布构建后的 `out/` 目录。

需要明确的边界：
- GitHub Pages 只能承载静态叙事壳层
- GitHub Pages 无法执行 Next.js 服务端路由处理器
- `/api/*` 相关能力必须部署到具备服务端能力的平台

也就是说，Pages 适合承载静态品牌界面，但并不适合作为 AI 实时分析能力的完整生产环境。

## 品牌说明

**Givia** 是该系统的国际主品牌名。

在中文语境中，它同时以 **礼智极意** 作为本地化品牌表达出现，两者共同服务于同一套高端、编辑式、跨文化的品牌定位。

## 语言占比说明

当前仓库是一个 **TypeScript 优先** 的项目。仓库已加入 `.gitattributes`，用于帮助 GitHub Linguist 忽略生成物与辅助文件对语言统计的干扰。GitHub 的语言条刷新通常会有一定延迟，推送后可能不会立刻变化。

## 许可证

GNU Affero General Public License v3.0（AGPL-3.0）
