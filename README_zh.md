# Cross-Border AI Gifting Engine

一个面向跨文化送礼场景的 AI 智能引擎：前端使用 Next.js 16 + React 19。

[English Documentation](./README.md)

## 项目简介

本项目聚焦“跨文化送礼风险规避”，核心能力包括：

- 通过图片或文字识别礼物
- 结合目标国家与目标人群进行文化风险分析
- 生成可落地的包装建议与贺卡文案
- 提供完整流程化交互（当前支持中文、英文）

运行形态：

- Web 形态：Next.js 应用

## 技术栈

- Next.js 16（App Router）
- React 19 + TypeScript
- Tailwind CSS v4 + tw-animate-css
- shadcn/ui + Radix UI
- Framer Motion
- Jest + Testing Library

## 核心功能位置

- 主流程页面：[app/[locale]/page.tsx](./app/[locale]/page.tsx)
- 识别接口：[app/api/vision-recognize/route.ts](./app/api/vision-recognize/route.ts)
- 文化分析接口：[app/api/cultural-generate/route.ts](./app/api/cultural-generate/route.ts)
- 国家数据：[lib/countries.ts](./lib/countries.ts)
- 视觉实验页：[app/lab/page.tsx](./app/lab/page.tsx)
- 根路由重定向（`/` -> `/zh`）：[app/page.tsx](./app/page.tsx)

## 环境要求

### 必需

- Node.js 20+
- pnpm（本仓库推荐且默认使用）

## 快速开始

```bash
pnpm install
pnpm dev
```

浏览器打开 http://localhost:3000，系统会自动跳转到 `/zh`。

## 环境变量

在项目根目录创建 `.env.local`。

### AI 识别与分析必需

```env
ALIYUN_DASHSCOPE_API_KEY=你的_dashscope_api_key
```

### 可选（代码内已有默认值）

```env
ALIYUN_DASHSCOPE_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
ALIYUN_DASHSCOPE_VISION_MODEL=qwen-vl-plus-latest
ALIYUN_DASHSCOPE_TEXT_MODEL=qwen-plus-latest
```

重要说明：

- DashScope Key 缺失时，两个 API 路由都会直接报错。
- 项目已关闭本地兜底文案，确保输出来自模型。

## 脚本命令

来自 [package.json](./package.json)：

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 启动 Next.js 开发服务 |
| `pnpm build` | 构建静态导出（输出到 `out/`） |
| `pnpm start` | 启动 Next.js 生产服务 |
| `pnpm lint` | 执行 ESLint |
| `pnpm test` | 运行 Jest 测试 |
| `pnpm test:watch` | 监听模式运行 Jest |
| `pnpm test:coverage` | 生成覆盖率报告 |

## API 说明

### `POST /api/vision-recognize`

支持两种输入：

- `multipart/form-data`：上传 `image`，可选 `language`
- `application/json`：传入文本（`text` 或 `name` + `description`）

示例请求（JSON）：

```json
{
   "text": "高端黑色钢笔，礼盒包装",
   "name": "钢笔",
   "description": "商务简约风",
   "language": "zh"
}
```

示例响应：

```json
{
   "recognition": {
      "itemKey": "unknown",
      "itemZh": "钢笔",
      "itemEn": "Fountain Pen",
      "category": "General",
      "confidence": 0.78
   },
   "source": "aliyun-dashscope-text",
   "rawLabels": ["fountain pen"],
   "description": "适合正式场景的高端书写礼物。",
   "detectedLabel": "Fountain Pen"
}
```

### `POST /api/cultural-generate`

必须携带第一步识别结果 `recognition`。

示例请求：

```json
{
   "country": "Japan",
   "recognition": {
      "itemKey": "unknown",
      "itemZh": "钢笔",
      "itemEn": "Fountain Pen",
      "category": "General",
      "confidence": 0.76
   },
   "giftContext": {
      "name": "钢笔",
      "description": "黑色金属笔身，商务简约",
      "visionLabel": "Fountain Pen",
      "visionDescription": "用于商务赠礼",
      "source": "aliyun-dashscope-text",
      "rawLabels": ["fountain pen"]
   },
   "audience": {
      "group": "client",
      "profile": "首次会面，预算偏高，风格稳重"
   },
   "language": "zh"
}
```

示例响应结构：

```json
{
   "analysis": {
      "country": "Japan",
      "fitScore": 74,
      "riskLevel": "Low",
      "isTaboo": false,
      "warning": "...",
      "rescueItem": "...",
      "rescueReason": "...",
      "semanticSignals": ["..."],
      "packaging": {
         "style": "...",
         "colors": "...",
         "materials": "...",
         "avoid": "..."
      },
      "card": {
         "tone": "...",
         "opener": "...",
         "body": "...",
         "closing": "..."
      }
   },
   "source": "aliyun-dashscope"
}
```

## 目录结构

```text
.
├── app/
│   ├── page.tsx                    # 重定向到 /zh
│   ├── [locale]/page.tsx           # 主流程界面
│   ├── api/vision-recognize/       # 识别接口
│   ├── api/cultural-generate/      # 分析接口
│   └── lab/page.tsx                # 视觉实验页
├── components/
│   ├── gifting/                    # 流程与结果组件
│   ├── experience/                 # 实验页视觉组件
│   └── ui/                         # shadcn/ui 基础组件
├── lib/                            # 领域逻辑与工具函数
├── messages/                       # 国际化文案资源（en/zh）
└── public/                         # 静态资源
```

## 构建

### Web 构建

```bash
pnpm build
```

- [next.config.ts](./next.config.ts) 已配置 `output: "export"`
- 构建产物输出到 `out/`

## 测试与质量

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm test
pnpm test:coverage
```

相关文档：

- [TESTING.md](./TESTING.md)
- [CI_CD.md](./CI_CD.md)

## 常见问题

### 3000 端口被占用

```bash
lsof -ti :3000 | xargs -r kill -9
```

### 清理后重装依赖

```bash
rm -rf node_modules .next out
pnpm install
```

## 贡献

欢迎通过 issue 或 pull request 参与贡献。

## 许可证

GNU Affero General Public License v3.0（AGPL-3.0）
