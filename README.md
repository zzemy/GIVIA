# Givia

<p align="center">
  <strong>Editorial intelligence for gestures that travel across cultures.</strong>
</p>

<p align="center">
  Givia is a premium cross-cultural gifting system that turns taste, etiquette, symbolism, and delivery tone into a composed editorial workflow.
</p>

<p align="center">
  <a href="./README_zh.md">中文文档</a> ·
  <a href="https://github.com/zzemy/GIVIA/actions">Actions</a>
</p>

<p align="center">
  <a href="https://github.com/zzemy/GIVIA/actions/workflows/ci.yml">
    <img src="https://github.com/zzemy/GIVIA/actions/workflows/ci.yml/badge.svg" alt="CI Status" />
  </a>
  <a href="https://github.com/zzemy/GIVIA/actions/workflows/deploy-pages.yml">
    <img src="https://github.com/zzemy/GIVIA/actions/workflows/deploy-pages.yml/badge.svg" alt="Pages Status" />
  </a>
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&logoColor=white" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/License-AGPL--3.0-0b5fff" alt="AGPL-3.0" />
</p>

---

## Why Givia exists

A gift rarely arrives as an object alone.

It arrives with implication, etiquette, memory, hierarchy, timing, and tone already attached. What feels thoughtful in one place can feel excessive, intimate, ceremonial, awkward, or even inappropriate in another.

**Givia** exists to read that difference before the gesture is sent.

Instead of behaving like a generic recommendation engine, it treats cross-cultural gifting as an editorial problem: something to be framed, interpreted, revised, and delivered with tact.

## What makes it distinct

- **Editorial, not dashboard-driven** — the experience is built as a narrative flow rather than a SaaS control panel.
- **Cross-cultural by design** — gift reading is grounded in recipient context, market etiquette, symbolic risk, and delivery tone.
- **Recommendation with judgment** — the system does not only score; it rewrites, reframes, and proposes more suitable directions.
- **Bilingual brand system** — Chinese and English routes are treated as first-class product surfaces, not afterthought translations.
- **Premium product language** — the interface, copy, and result framing are built to feel composed, calm, and internationally credible.

## Experience surfaces

Givia currently ships as a multi-surface editorial web experience:

| Surface | Route | Role |
| --- | --- | --- |
| Brand entry | `/` | Global entry into the product world |
| Localized home | `/zh`, `/en` | Language-specific landing surfaces |
| Editorial workflow | `/[locale]/gifting` | Guided gifting composition and analysis |
| Final dossier | in workflow | Report-like recommendation and rewrite output |

The product is not a gift marketplace and not a simple rule checker. It is a composed decision surface for gestures moving between cultures.

## Core capabilities

| Capability | Description |
| --- | --- |
| Gift recognition | Reads a gift candidate from image or text input |
| Cultural reading | Evaluates symbolism, etiquette, and market-sensitive risk |
| Recipient framing | Interprets relationship, scene, and audience context |
| Editorial rewrite | Produces more tactful gifting directions and message suggestions |
| Delivery guidance | Extends recommendations into packaging and logistics considerations |
| Bilingual presentation | Preserves brand clarity across Chinese and English routes |

## System snapshot

### Application stack

- Next.js 16 App Router
- React 19 + TypeScript
- Tailwind CSS v4
- Framer Motion
- Jest + Testing Library
- GitHub Actions for CI and GitHub Pages deployment
- Optional Tauri wrapper in `src-tauri/`

### API surfaces

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/api/analysis/run` | Runs the end-to-end gifting analysis pipeline |
| `POST` | `/api/vision-recognize` | Recognizes a gift candidate from image or text |
| `POST` | `/api/cultural-generate` | Generates cultural guidance and editorial suggestions |
| `POST` | `/api/logistics-assistant` | Returns delivery and logistics guidance |

### Project layout

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

## Run locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

### Verification

```bash
pnpm lint
pnpm test --runInBand
pnpm build
pnpm exec tsc --noEmit
```

## Environment variables

Create `.env.local` in the project root.

| Variable | Required | Default |
| --- | --- | --- |
| `ALIYUN_DASHSCOPE_API_KEY` | Yes for AI-backed routes | - |
| `ALIYUN_DASHSCOPE_BASE_URL` | No | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| `ALIYUN_DASHSCOPE_VISION_MODEL` | No | `qwen-vl-plus-latest` |
| `ALIYUN_DASHSCOPE_TEXT_MODEL` | No | `qwen-plus-latest` |

If the API key is missing, AI-backed server routes fail by design.

## CI and deployment boundary

### CI

The repository CI workflow runs on pushes and pull requests to `main` and `master`.

It verifies:
- ESLint
- TypeScript type checking
- Jest test suite
- Next.js production build

Workflow file: `.github/workflows/ci.yml`

### GitHub Pages

The repository also ships a Pages workflow at `.github/workflows/deploy-pages.yml`.

Pages publishes the static export produced by Next.js (`output: "export"`) from the `out/` directory.

Important boundary:
- GitHub Pages can host the static editorial shell
- GitHub Pages cannot execute Next.js server-side route handlers
- `/api/*` capabilities require a server-capable deployment target

In other words: Pages is a valid surface for the static brand experience, but not for live AI-backed analysis.

## Brand note

**Givia** is the global-facing brand name of the system.

In Chinese contexts, the product also appears as **礼智极意** — a localized brand expression that carries the same editorial, premium, and cross-cultural positioning.

## Language statistics note

This is a TypeScript-first repository. `.gitattributes` is included to help GitHub Linguist ignore generated or auxiliary artifacts when calculating language percentages. GitHub may take some time to refresh language statistics after a push.

## License

GNU Affero General Public License v3.0 (AGPL-3.0)
