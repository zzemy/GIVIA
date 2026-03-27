# README Brand Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reposition the repository README surfaces so they read like a premium, high-recognition product project with a clear Givia-led brand identity.

**Architecture:** Keep the README rewrite documentation-only, but change the top-level narrative architecture completely. The English README should act like a polished global product page for a strong GitHub project, while the Chinese README should preserve the same structure and prestige with 礼智极意 as the localized brand expression under the Givia umbrella.

**Tech Stack:** Markdown, GitHub badges, repository documentation, current route/workflow references.

---

### Task 1: Define the new README narrative hierarchy

**Files:**
- Modify: `docs/superpowers/plans/2026-03-27-readme-brand-refresh.md`
- Inspect: `README.md`
- Inspect: `README_zh.md`

- [ ] **Step 1: Lock the hero narrative**

Target structure:
- `Givia` as the primary title in English
- A memorable editorial brand line
- A direct product definition line
- Badges and language switch directly below

- [ ] **Step 2: Lock the README section architecture**

Target sections:
1. Hero
2. Why Givia exists
3. What makes it distinct
4. Experience surfaces
5. System / infrastructure
6. Run locally
7. Deployment boundary
8. Brand note

- [ ] **Step 3: Keep only factual claims that match the current codebase**

Expected: No speculative roadmap copy, no stale delivery promises, no removed-route references.

### Task 2: Rewrite `README.md` as a premium product-facing project page

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Replace the current opening with a stronger branded hero**

Include:
- `Givia`
- one-line editorial brand thesis
- one-line product definition
- polished but concise value framing

- [ ] **Step 2: Add high-signal project sections**

Include:
- why cross-cultural gifting needs editorial intelligence
- distinct product capabilities
- current routes / experience surfaces
- exact build and validation commands
- CI / Pages explanation

- [ ] **Step 3: Make it feel like a star-worthy GitHub project**

Expected characteristics:
- strong scanability
- no generic template tone
- no internal dev-diary voice
- brand clarity within the first screenful

### Task 3: Rewrite `README_zh.md` with the same prestige and structure

**Files:**
- Modify: `README_zh.md`

- [ ] **Step 1: Keep the structure aligned with English**

Expected: users can switch languages without seeing a different-quality document.

- [ ] **Step 2: Preserve localized brand expression**

Include:
- `礼智极意` as Chinese brand expression
- `Givia` as the international parent name
- premium but readable Chinese copy

- [ ] **Step 3: Remove generic documentation tone**

Expected: the README reads like a serious product project, not a school project or boilerplate starter.

### Task 4: Review for accuracy and commit

**Files:**
- Modify: `README.md`
- Modify: `README_zh.md`

- [ ] **Step 1: Verify route / workflow / environment accuracy**

Run:
```bash
rg -n "/\[locale\]/gifting|/api/analysis/run|deploy-pages|ci\.yml|ALIYUN_DASHSCOPE" README.md README_zh.md
```
Expected: all referenced surfaces exist and are current.

- [ ] **Step 2: Review the opening 60 lines of both files**

Run:
```bash
sed -n '1,120p' README.md
sed -n '1,120p' README_zh.md
```
Expected: strong brand recognition within the first screenful.

- [ ] **Step 3: Commit the README refresh**

```bash
git add README.md README_zh.md docs/superpowers/plans/2026-03-27-readme-brand-refresh.md
git commit -m "docs: elevate repository brand narrative"
```
