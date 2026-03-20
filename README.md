# Cross-Border AI Gifting Engine

AI-assisted cross-cultural gifting system built with Next.js 16 + React 19.

[中文文档](./README_zh.md)

## Overview

This project helps users avoid cultural gifting taboos by combining:

- Gift recognition from image or text
- Target-country and audience-aware risk analysis
- Practical packaging and greeting-card recommendations
- A polished multilingual UX (currently Chinese and English)

The app currently runs in Web mode via Next.js.

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4 + tw-animate-css
- shadcn/ui + Radix UI
- Framer Motion
- Jest + Testing Library

## Core Capabilities

- Step-based gifting workflow in [app/[locale]/page.tsx](./app/[locale]/page.tsx)
- Image or text gift recognition through [app/api/vision-recognize/route.ts](./app/api/vision-recognize/route.ts)
- Cultural analysis through [app/api/cultural-generate/route.ts](./app/api/cultural-generate/route.ts)
- Country selector with global country list in [lib/countries.ts](./lib/countries.ts)
- Additional visual lab route in [app/lab/page.tsx](./app/lab/page.tsx)
- Root route redirect (`/` -> `/zh`) in [app/page.tsx](./app/page.tsx)

## Prerequisites

### Required

- Node.js 20+
- pnpm (recommended package manager for this repository)

## Quick Start

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000 (it redirects to `/zh`).

## Environment Variables

Create `.env.local` in the project root.

### Required for AI-powered recognition and analysis

```env
ALIYUN_DASHSCOPE_API_KEY=your_dashscope_api_key
```

### Optional (defaults already exist in code)

```env
ALIYUN_DASHSCOPE_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
ALIYUN_DASHSCOPE_VISION_MODEL=qwen-vl-plus-latest
ALIYUN_DASHSCOPE_TEXT_MODEL=qwen-plus-latest
```

Important behavior:

- If the DashScope key is missing, both API routes return errors.
- Local fallback generation is intentionally disabled.

## Scripts

From [package.json](./package.json):

| Command | Description |
| --- | --- |
| `pnpm dev` | Run Next.js dev server |
| `pnpm build` | Build static-exported Next.js output (`out/`) |
| `pnpm start` | Start Next.js production server |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run Jest tests |
| `pnpm test:watch` | Run Jest in watch mode |
| `pnpm test:coverage` | Run Jest with coverage |

## API Endpoints

### `POST /api/vision-recognize`

Supports:

- `multipart/form-data` with `image` and optional `language`
- `application/json` with text fields (`text`, or `name` + `description`)

Example JSON request:

```json
{
   "text": "A premium black fountain pen in a gift box",
   "name": "Fountain pen",
   "description": "Minimal business style",
   "language": "en"
}
```

Example response:

```json
{
   "recognition": {
      "itemKey": "unknown",
      "itemZh": "Fountain Pen",
      "itemEn": "Fountain Pen",
      "category": "General",
      "confidence": 0.78
   },
   "source": "aliyun-dashscope-text",
   "rawLabels": ["fountain pen"],
   "description": "A premium writing instrument suitable for formal gifting.",
   "detectedLabel": "Fountain Pen"
}
```

### `POST /api/cultural-generate`

Requires a valid `recognition` object from step 1.

Example request:

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
      "name": "Fountain Pen",
      "description": "Black metal body, formal business style",
      "visionLabel": "Fountain Pen",
      "visionDescription": "Formal gift for business partner",
      "source": "aliyun-dashscope-text",
      "rawLabels": ["fountain pen"]
   },
   "audience": {
      "group": "client",
      "profile": "First meeting, premium but conservative"
   },
   "language": "en"
}
```

Example response shape:

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

## Project Structure

```text
.
├── app/
│   ├── page.tsx                    # Redirect to /zh
│   ├── [locale]/page.tsx           # Main workflow UI
│   ├── api/vision-recognize/       # Recognition route
│   ├── api/cultural-generate/      # Analysis route
│   └── lab/page.tsx                # Visual lab page
├── components/
│   ├── gifting/                    # Workflow and result UI
│   ├── experience/                 # Lab visual components
│   └── ui/                         # shadcn/ui primitives
├── lib/                            # Domain and utility logic
├── messages/                       # i18n text resources (en/zh)
└── public/                         # Static assets
```

## Build

### Web Build

```bash
pnpm build
```

- `next.config.ts` uses `output: "export"`
- Build output is generated to `out/`

## Testing and Quality

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm test
pnpm test:coverage
```

Related docs:

- [TESTING.md](./TESTING.md)
- [CI_CD.md](./CI_CD.md)

## Troubleshooting

### Port 3000 already in use

```bash
lsof -ti :3000 | xargs -r kill -9
```

### Clean and reinstall dependencies

```bash
rm -rf node_modules .next out
pnpm install
```

## Contributing

Contributions are welcome via issue or pull request.

## License

GNU Affero General Public License v3.0 (AGPL-3.0)
