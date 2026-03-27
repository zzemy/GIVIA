# Linguist, README, CI & Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct GitHub language classification signals, upgrade bilingual repository documentation, and verify CI / GitHub Pages workflows match the current Next.js product.

**Architecture:** This work stays forward-only: we do not rewrite history. We add repository metadata that guides GitHub Linguist, then align README content with the current editorial gifting product and finally validate automation by testing the same commands CI and Pages depend on. Workflow edits should remain minimal and explicit so the branch stays easy to merge.

**Tech Stack:** Git, GitHub Linguist via `.gitattributes`, Markdown, GitHub Actions, Next.js 16, pnpm, Jest, ESLint, TypeScript.

---

### Task 1: Audit repository language signals and automation surface

**Files:**
- Modify: `docs/superpowers/plans/2026-03-27-linguist-readme-ci-pages.md`
- Inspect: `.github/workflows/ci.yml`
- Inspect: `.github/workflows/deploy-pages.yml`
- Inspect: `package.json`
- Inspect: `next.config.ts`
- Inspect: `.gitignore`

- [ ] **Step 1: Inspect tracked file extensions and workflow files**

Run:
```bash
git ls-files | awk 'match($0,/\.([^.\/]+)$/,a){ext[a[1]]++} END{for (e in ext) print ext[e], e}' | sort -nr
sed -n '1,220p' .github/workflows/ci.yml
sed -n '1,260p' .github/workflows/deploy-pages.yml
sed -n '1,220p' package.json
sed -n '1,220p' next.config.ts
sed -n '1,220p' .gitignore
```
Expected: Identify whether large tracked JS artifacts remain and whether workflows reflect the current build strategy.

- [ ] **Step 2: Record the decisions before editing**

Expected decisions:
- Whether `.gitattributes` is needed
- Whether CI should run `lint`, `test`, and `build`
- Whether Pages workflow should only export static assets or clearly document limitations

- [ ] **Step 3: Commit only if this task produces repo changes**

```bash
git status --short
```
Expected: Usually no commit yet because this task is mostly audit.

### Task 2: Add forward-only GitHub Linguist guidance

**Files:**
- Create: `.gitattributes`
- Inspect: tracked file list from `git ls-files`

- [ ] **Step 1: Write `.gitattributes` with explicit Linguist rules**

Add rules that mark generated/build/output assets as not counted by Linguist, for example:
```gitattributes
.next/** linguist-generated=true
out/** linguist-generated=true
coverage/** linguist-generated=true
public/** linguist-vendored
__mocks__/** linguist-generated=true
*.lock linguist-generated=true
pnpm-lock.yaml linguist-generated=true
```
Keep the rules narrow enough that real source files are still classified.

- [ ] **Step 2: Re-check that no tracked generated JS directories remain**

Run:
```bash
git ls-files .next out coverage '_next' 'dist' 'build' 2>/dev/null
```
Expected: No tracked build output, or an empty result for these generated directories.

- [ ] **Step 3: Review `.gitattributes` for overreach**

Run:
```bash
sed -n '1,200p' .gitattributes
```
Expected: Only non-source / generated / vendored patterns are excluded.

- [ ] **Step 4: Commit the Linguist fix**

```bash
git add .gitattributes
git commit -m "chore: tune github linguist classification"
```

### Task 3: Upgrade README and README_zh for the current brand and product

**Files:**
- Modify: `README.md`
- Modify: `README_zh.md`

- [ ] **Step 1: Rewrite the English README to match the current product**

Include:
- Brand framing centered on `Givia`
- Product purpose as a cross-cultural gifting editorial system
- Clear distinction between web experience and server-backed AI routes
- Accurate local setup and validation commands
- CI / Pages notes that match the real repository behavior

- [ ] **Step 2: Rewrite the Chinese README to match the current product**

Include:
- `礼智极意` as Chinese brand with `Givia` relation handled elegantly
- Story-consistent but practical explanation of the product
- Accurate commands, routes, environment variables, and deployment notes

- [ ] **Step 3: Verify docs do not describe removed routes or outdated flows**

Run:
```bash
rg -n "lab/page|Build static export to out|Jest \+ Testing Library|culture-aware gifting intelligence, built for modern teams|让每一次跨文化送礼" README.md README_zh.md
```
Expected: Outdated phrasing is removed or intentionally replaced.

- [ ] **Step 4: Commit the README refresh**

```bash
git add README.md README_zh.md
git commit -m "docs: refresh bilingual repository narrative"
```

### Task 4: Validate and adjust CI workflow

**Files:**
- Modify: `.github/workflows/ci.yml` (if needed)
- Inspect: `jest.config.*` / `jest.setup.*` if present
- Inspect: `package.json`

- [ ] **Step 1: Run the CI-equivalent checks locally**

Run:
```bash
pnpm lint
pnpm test -- --runInBand
pnpm build
pnpm exec tsc --noEmit
```
Expected: All commands pass, or failures clearly identify what CI needs or what code needs fixing.

- [ ] **Step 2: If CI workflow is outdated, update it minimally**

Typical target:
- install pnpm
- install dependencies
- run lint
- run tests
- run build

- [ ] **Step 3: Re-run the affected commands after workflow/code edits**

Expected: local validation succeeds and matches the workflow behavior.

- [ ] **Step 4: Commit the CI adjustments if any**

```bash
git add .github/workflows/ci.yml package.json
git commit -m "ci: align verification with current next app"
```
Only if files changed.

### Task 5: Validate and adjust GitHub Pages workflow

**Files:**
- Modify: `.github/workflows/deploy-pages.yml` (if needed)
- Modify: `README.md`
- Modify: `README_zh.md`
- Inspect: `next.config.ts`

- [ ] **Step 1: Confirm whether the app can be exported for Pages**

Run:
```bash
sed -n '1,220p' next.config.ts
sed -n '1,260p' .github/workflows/deploy-pages.yml
```
Expected: Determine whether Pages deployment builds a true static export or only a marketing subset. If API routes block export, keep workflow/documentation honest.

- [ ] **Step 2: If the workflow is misleading, correct it**

Examples:
- ensure the workflow uses the correct build/export path
- or restrict Pages deployment to static-compatible output only
- or document clearly that Pages is for a static surface and not AI APIs

- [ ] **Step 3: Validate the Pages path locally as far as possible**

Run the workflow-equivalent build command or the export-compatible command already defined by the workflow.
Expected: either success, or a documented limitation that is reflected in README and workflow comments.

- [ ] **Step 4: Commit the Pages workflow adjustment if any**

```bash
git add .github/workflows/deploy-pages.yml README.md README_zh.md next.config.ts
git commit -m "ci: clarify github pages deployment boundary"
```
Only if files changed.

### Task 6: Final verification and cleanup commit

**Files:**
- Modify: any files changed by prior tasks

- [ ] **Step 1: Inspect final diff and status**

Run:
```bash
git status --short
git diff --stat
```
Expected: Only intentional Linguist / README / workflow changes remain.

- [ ] **Step 2: Run the full final verification sweep**

Run:
```bash
pnpm lint
pnpm test -- --runInBand
pnpm build
pnpm exec tsc --noEmit
```
Expected: All pass.

- [ ] **Step 3: Create final consolidation commit if needed**

```bash
git add .
git commit -m "chore: finalize repo polish and automation checks"
```
Only if there are uncommitted changes after task-level commits.

- [ ] **Step 4: Prepare merge/push summary**

Summarize:
- What changed
- Whether Linguist may take time to refresh on GitHub
- CI/Pages status
- Any remaining limitations
