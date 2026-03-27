# GIVIA

<p align="center">
  <strong>Culture-aware gifting intelligence, built for modern teams.</strong>
</p>

<p align="center">
  <a href="./README_zh.md">中文文档</a>
</p>

<p align="center">
  <a href="https://github.com/zzemy/GIVIA/actions/workflows/ci.yml">
    <img src="https://github.com/zzemy/GIVIA/actions/workflows/ci.yml/badge.svg" alt="CI Status" />
  </a>
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/License-AGPL--3.0-0b5fff" alt="AGPL-3.0" />
</p>

<p align="center">
  <a href="https://github.com/zzemy/GIVIA/actions">View GitHub Actions</a>
</p>

## Why GIVIA

GIVIA helps users make better gifting decisions across cultures by combining AI recognition, semantic risk analysis, and practical delivery guidance.

Instead of guessing whether a gift is culturally safe, users can quickly validate the choice and get actionable alternatives.

## Product Flow

1. Recognize a gift from image or text input.
2. Select target country and recipient profile.
3. Generate cultural risk analysis, packaging suggestions, and card copy.

Main experience page: [app/[locale]/page.tsx](app/[locale]/page.tsx)

## Highlights

| Module | Value |
| --- | --- |
| Gift Recognition | Understands items from image upload or direct text input |
| Cultural Risk Engine | Scores potential taboo and semantic risk by market context |
| Audience-aware Advice | Adapts suggestions by recipient type and relationship context |
| Practical Output | Produces packaging direction and greeting-card wording |
| Bilingual UX | Supports Chinese and English routes |

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4 + shadcn/ui + Radix UI
- Framer Motion
- Jest + Testing Library

## Quick Start

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000 (auto redirects to /zh).

## Deploy to GitHub Pages

This repository includes a Pages workflow at `.github/workflows/deploy-pages.yml`.

1. Push to `main` or `master`.
2. In GitHub repo settings, open Pages and set Source to `GitHub Actions`.
3. Wait for the `Deploy GitHub Pages` workflow to finish.
4. Visit `https://<your-user-or-org>.github.io/<repo-name>/`.

Important limits on GitHub Pages:

- GitHub Pages serves static files only.
- API routes under `/api/*` are not available in Pages deployments.
- Features depending on server-side AI routes require a backend deployment target (for example Vercel or your own server).

## Environment Variables

Create a .env.local file in project root.

| Variable | Required | Default |
| --- | --- | --- |
| ALIYUN_DASHSCOPE_API_KEY | Yes | - |
| ALIYUN_DASHSCOPE_BASE_URL | No | https://dashscope.aliyuncs.com/compatible-mode/v1 |
| ALIYUN_DASHSCOPE_VISION_MODEL | No | qwen-vl-plus-latest |
| ALIYUN_DASHSCOPE_TEXT_MODEL | No | qwen-plus-latest |

Behavior note:

- If key is missing, AI routes return error.
- Local fallback generation is disabled by design.

## API Snapshot

| Method | Route | Purpose |
| --- | --- | --- |
| POST | /api/vision-recognize | Recognize gift from image or text |
| POST | /api/cultural-generate | Generate cultural analysis and recommendations |

Route files:

- [app/api/vision-recognize/route.ts](app/api/vision-recognize/route.ts)
- [app/api/cultural-generate/route.ts](app/api/cultural-generate/route.ts)

## Scripts

| Command | Description |
| --- | --- |
| pnpm dev | Start local development server |
| pnpm build | Build static export to out |
| pnpm start | Start production server |
| pnpm lint | Run ESLint |
| pnpm test | Run unit tests |
| pnpm test:watch | Run tests in watch mode |
| pnpm test:coverage | Run tests with coverage |

## Project Layout

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

## Quality

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm test
pnpm test:coverage
```

## License

GNU Affero General Public License v3.0 (AGPL-3.0)
