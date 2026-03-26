# Homepage Layout System Unification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the homepage into one coherent dark-premium layout system that fixes wide-screen imbalance, mobile awkwardness, excessive gradient noise, and broken pill text while preserving the existing gifting workflow.

**Architecture:** Keep the current App Router page and controller/data flow intact, and concentrate changes inside homepage presentation components plus shared homepage tokens. Implement in staged passes: lock hierarchy expectations in tests, establish the global surface/spacing/text system, rebuild the hero and impact band, restructure the workflow shell and support lane, then normalize the results experience into a recommendation-first advisor memo. Avoid backend changes and keep motion restrained.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Framer Motion, Jest, Testing Library

**References:** `@frontend-design`, `@tailwind-design-system`, `@next-best-practices`, `@vercel-react-best-practices`

---

## Reference spec
- `docs/superpowers/specs/2026-03-26-homepage-layout-system-unification-design.md`

## File map

### Modify
- `app/[locale]/page.tsx` — tighten page-shell width behavior and section rhythm
- `app/[locale]/page.test.tsx` — lock the intended section order and stable homepage hierarchy
- `app/globals.css` — add homepage-wide wrapping, width, and typography utilities
- `components/gifting/home/home-design-tokens.ts` — define unified homepage surfaces, controls, spacing, and text tokens
- `components/gifting/home/sections/home-background.tsx` — quiet the ambient background treatment
- `components/gifting/home/sections/home-hero-section.tsx` — rebuild header, hero grid, impact band, and responsive behavior
- `components/gifting/interactive-flow-demo.tsx` — make the demo calmer and denser across breakpoints
- `components/gifting/workflow-progress.tsx` — simplify the progress strip hierarchy
- `components/gifting/home/sections/workflow-panels.tsx` — enforce the primary lane / support lane layout
- `components/gifting/home/sections/step-gift-input.tsx` — normalize the first workflow step shell
- `components/gifting/home/sections/step-country.tsx` — align the country step with the primary workflow system
- `components/gifting/home/sections/step-analysis.tsx` — keep analysis as the culmination surface with calmer support chrome
- `components/gifting/home/sections/workflow-support-panels.tsx` — subordinate assistant/history styling and fix pill robustness
- `components/gifting/home/cards/country-step-summary-card.tsx` — prevent short Chinese pill labels from breaking and normalize summary density
- `components/gifting/home/sections/page-feedback.tsx` — harmonize loading/error surfaces with the new system
- `components/gifting/home/sections/results-section.tsx` — regroup results into decision/action/evidence layers
- `components/gifting/home/sections/results-section.test.tsx` — lock result ordering and summary emphasis
- `components/gifting/home/sections/results-summary-panel.tsx` — strengthen the lead advisor memo surface
- `components/gifting/home/sections/results-recommendations-panel.tsx` — align recommendation cards with the new hierarchy
- `components/gifting/home/sections/results-detail-panels.tsx` — demote dense evidence panels and normalize meters/alerts
- `components/gifting/home/sections/results-enhancement-panels.tsx` — reduce fragmentation of enhancement surfaces

### Validate with existing scripts
- `pnpm exec jest --runInBand --runTestsByPath 'app/[locale]/page.test.tsx' 'components/gifting/home/sections/results-section.test.tsx'`
- `pnpm lint`
- `pnpm build`

---

### Task 1: Lock hierarchy and ordering in tests

**Files:**
- Modify: `app/[locale]/page.test.tsx`
- Modify: `components/gifting/home/sections/results-section.test.tsx`

- [ ] **Step 1: Extend the localized homepage test to assert the intended major section order**

Add a test in `app/[locale]/page.test.tsx` that proves the page renders in the expected high-level reading sequence:
- hero headline
- guided workflow heading
- results heading when results are present

Also add a workflow DOM-order assertion that `StepGiftInput` renders before `StepCountry`, and `StepCountry` renders before `StepAnalysis`.

Use DOM-order checks like:

```tsx
expect(giftStep.compareDocumentPosition(countryStep) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
expect(countryStep.compareDocumentPosition(analysisStep) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
```

- [ ] **Step 2: Strengthen the results test so it locks decision → action → evidence order**

Update `components/gifting/home/sections/results-section.test.tsx` so it asserts:
- the advisor summary renders before the recommendation area
- the recommendation area renders before the supporting-analysis label

Preserve the existing high-risk coverage, but add DOM-order assertions so future visual refactors cannot quietly flatten the results hierarchy.

- [ ] **Step 3: Run the focused Jest files and verify the new ordering assertions fail only where the current structure is wrong**

Run:

```bash
pnpm exec jest --runInBand --runTestsByPath 'app/[locale]/page.test.tsx' 'components/gifting/home/sections/results-section.test.tsx'
```

Expected:
- the new workflow-order assertion fails if the current structure still places analysis before country
- the results test remains either green or points to a concrete hierarchy mismatch

- [ ] **Step 4: Commit the test baseline**

```bash
git add 'app/[locale]/page.test.tsx' 'components/gifting/home/sections/results-section.test.tsx'
git commit -m "test: lock homepage layout hierarchy"
```

---

### Task 2: Establish the homepage layout and surface system

**Files:**
- Modify: `app/[locale]/page.tsx`
- Modify: `app/globals.css`
- Modify: `components/gifting/home/home-design-tokens.ts`
- Modify: `components/gifting/home/sections/home-background.tsx`

- [ ] **Step 1: Expand homepage design tokens into a stable visual system**

Refactor `components/gifting/home/home-design-tokens.ts` so it explicitly defines:
- lead / section / utility / chip surface levels
- shared text tones
- control shells
- CTA styles
- any reusable width/spacing helpers that improve consistency

Keep the file homepage-scoped. Do not turn it into a generic design-system abstraction.

- [ ] **Step 2: Add global utilities for line length, balanced wrapping, and pill robustness**

Update `app/globals.css` with homepage-specific utility classes or base helpers for:
- compact pills with `white-space: nowrap`
- minimum inline sizing for status badges
- optional text-measure helpers for wide-screen paragraphs
- any Chinese-specific wrapping safeguards needed by the homepage

These should be additive and low-risk, not a sweeping global typography rewrite.

- [ ] **Step 3: Tighten the top-level page shell and quiet the background**

In `app/[locale]/page.tsx` and `components/gifting/home/sections/home-background.tsx`:
- keep the wide premium canvas
- add inner width discipline for feature sections
- reduce foggy background competition
- preserve atmosphere through restrained ambient light instead of heavy mixed gradients

- [ ] **Step 4: Run lint on the foundational files**

Run:

```bash
pnpm lint
```

Expected:
- no new lint errors
- foundation files are ready for section rebuilds

- [ ] **Step 5: Commit the layout-system foundation**

```bash
git add 'app/[locale]/page.tsx' 'app/globals.css' 'components/gifting/home/home-design-tokens.ts' 'components/gifting/home/sections/home-background.tsx'
git commit -m "refactor: establish homepage layout system tokens"
```

---

### Task 3: Rebuild the hero and impact band for wide-screen balance

**Files:**
- Modify: `components/gifting/home/sections/home-hero-section.tsx`
- Modify: `components/gifting/interactive-flow-demo.tsx`

- [ ] **Step 1: Rebuild the hero into a controlled 12-column split**

In `components/gifting/home/sections/home-hero-section.tsx`:
- keep the sticky header but reduce its weight
- keep locale switching functional but utility-like
- rebuild the hero into a left 7-column narrative zone and right 5-column advisor zone on large screens
- remove the current “fill available height” behavior that causes dead space
- tighten CTA, trust chips, and supporting copy so the hero feels complete instead of stretched

- [ ] **Step 2: Reduce gradient intensity and unify card behavior**

Within the hero:
- use mostly solid dark surfaces with restrained champagne highlights
- remove any mixed-gradient combinations that make transitions look muddy
- align both hero cards to the same surface family and spacing rhythm

- [ ] **Step 3: Redesign the impact-card showcase responsively**

Still in `home-hero-section.tsx`:
- keep the desktop stacked-card concept, but reduce rotation, side offset, and opacity contrast
- on mobile, switch to a single-card focused presentation with calmer pagination behavior
- remove excessive fixed height where content-driven height is enough

- [ ] **Step 4: Restyle the interactive demo into a refined advisor-console preview**

In `components/gifting/interactive-flow-demo.tsx`:
- reduce visual noise
- improve mobile density
- align borders, fills, and progress treatment with the new token system

- [ ] **Step 5: Run homepage tests and lint after the hero rebuild**

Run:

```bash
pnpm exec jest --runInBand --runTestsByPath 'app/[locale]/page.test.tsx'
pnpm lint
```

Expected:
- homepage tests pass or fail only on not-yet-updated downstream hierarchy assertions
- the hero no longer depends on the old stretched layout

- [ ] **Step 6: Commit the first-screen rebuild**

```bash
git add 'components/gifting/home/sections/home-hero-section.tsx' 'components/gifting/interactive-flow-demo.tsx'
git commit -m "feat: rebalance homepage hero and impact band"
```

---

### Task 4: Restructure the guided workflow and support lane

**Files:**
- Modify: `components/gifting/workflow-progress.tsx`
- Modify: `components/gifting/home/sections/workflow-panels.tsx`
- Modify: `components/gifting/home/sections/step-gift-input.tsx`
- Modify: `components/gifting/home/sections/step-country.tsx`
- Modify: `components/gifting/home/sections/step-analysis.tsx`
- Modify: `components/gifting/home/sections/workflow-support-panels.tsx`
- Modify: `components/gifting/home/cards/country-step-summary-card.tsx`
- Modify: `components/gifting/home/sections/page-feedback.tsx`

- [ ] **Step 1: Rebuild the workflow shell into a dominant primary lane and subordinate support lane**

Update `components/gifting/home/sections/workflow-panels.tsx` so the main lane renders in this order:

```tsx
<StepGiftInput {...giftInputProps} />
<StepCountry {...countryProps} />
<StepAnalysis {...analysisProps} />
```

Keep the assistant in the right lane on desktop, but visually attach it to the workflow shell rather than letting it appear detached.

- [ ] **Step 2: Simplify `WorkflowProgress` and align the three step shells**

In `components/gifting/workflow-progress.tsx`, `step-gift-input.tsx`, `step-country.tsx`, and `step-analysis.tsx`:
- reduce decorative noise
- align padding, heading hierarchy, and border/shadow behavior
- keep `StepAnalysis` as the culminating card without letting dense helper chrome overpower it

- [ ] **Step 3: Normalize support, summary, and feedback surfaces**

In `workflow-support-panels.tsx`, `country-step-summary-card.tsx`, and `page-feedback.tsx`:
- fix pill sizing so short Chinese labels stay on one line
- reduce the “floating utility module” feeling of the assistant
- keep history and saved items visually tertiary
- align loading and error surfaces with the calmer premium system

- [ ] **Step 4: Run the localized homepage test and lint after the workflow restructure**

Run:

```bash
pnpm exec jest --runInBand --runTestsByPath 'app/[locale]/page.test.tsx'
pnpm lint
```

Expected:
- the workflow-order test passes
- the localized page still renders the expected hero/workflow text and controls
- lint remains clean

- [ ] **Step 5: Commit the workflow-shell rewrite**

```bash
git add 'components/gifting/workflow-progress.tsx' 'components/gifting/home/sections/workflow-panels.tsx' 'components/gifting/home/sections/step-gift-input.tsx' 'components/gifting/home/sections/step-country.tsx' 'components/gifting/home/sections/step-analysis.tsx' 'components/gifting/home/sections/workflow-support-panels.tsx' 'components/gifting/home/cards/country-step-summary-card.tsx' 'components/gifting/home/sections/page-feedback.tsx'
git commit -m "refactor: unify homepage workflow shell"
```

---

### Task 5: Rebuild the results area into a recommendation-first memo

**Files:**
- Modify: `components/gifting/home/sections/results-section.tsx`
- Modify: `components/gifting/home/sections/results-summary-panel.tsx`
- Modify: `components/gifting/home/sections/results-recommendations-panel.tsx`
- Modify: `components/gifting/home/sections/results-detail-panels.tsx`
- Modify: `components/gifting/home/sections/results-enhancement-panels.tsx`
- Modify: `components/gifting/home/sections/results-section.test.tsx`

- [ ] **Step 1: Make the results shell follow decision → action → evidence order explicitly**

In `components/gifting/home/sections/results-section.tsx`:
- keep the existing data flow
- make the summary the strongest surface
- keep recommendations directly after the summary
- move supporting analysis into a clearly subordinate section

- [ ] **Step 2: Strengthen the advisor-summary surface and quiet dense detail panels**

In `results-summary-panel.tsx`, `results-detail-panels.tsx`, and `results-enhancement-panels.tsx`:
- style the summary like an executive gifting memo
- turn warnings into professional caution framing rather than alarm-console styling
- normalize charts, meters, and evidence blocks under one quieter surface language

- [ ] **Step 3: Align recommendation cards with the new hierarchy**

In `results-recommendations-panel.tsx`:
- keep save/favorite behavior
- make recommendation cards visually secondary to the summary but clearly more important than evidence
- ensure wide screens do not produce a flat wall of equal-weight cards

- [ ] **Step 4: Run results tests and full lint**

Run:

```bash
pnpm exec jest --runInBand --runTestsByPath 'components/gifting/home/sections/results-section.test.tsx'
pnpm lint
```

Expected:
- the results-order assertions pass
- no lint regressions

- [ ] **Step 5: Commit the result-system rewrite**

```bash
git add 'components/gifting/home/sections/results-section.tsx' 'components/gifting/home/sections/results-summary-panel.tsx' 'components/gifting/home/sections/results-recommendations-panel.tsx' 'components/gifting/home/sections/results-detail-panels.tsx' 'components/gifting/home/sections/results-enhancement-panels.tsx' 'components/gifting/home/sections/results-section.test.tsx'
git commit -m "feat: unify homepage results hierarchy"
```

---

### Task 6: Run full validation and polish regressions

**Files:**
- Modify as needed based on validation feedback from prior tasks

- [ ] **Step 1: Run the targeted Jest suite for homepage hierarchy**

Run:

```bash
pnpm exec jest --runInBand --runTestsByPath 'app/[locale]/page.test.tsx' 'components/gifting/home/sections/results-section.test.tsx'
```

Expected:
- all targeted homepage hierarchy tests pass

- [ ] **Step 2: Run full lint**

Run:

```bash
pnpm lint
```

Expected:
- lint passes cleanly

- [ ] **Step 3: Run a production build**

Run:

```bash
pnpm build
```

Expected:
- production build succeeds without introducing route or type errors

- [ ] **Step 4: Fix any validation regressions and rerun the failing command**

If any command fails:
- address the specific regression in the touched homepage files
- rerun only the failing command first
- rerun the full validation set once it passes

- [ ] **Step 5: Commit the validated polish pass**

```bash
git add app/[locale]/page.tsx app/[locale]/page.test.tsx app/globals.css components/gifting/home/home-design-tokens.ts components/gifting/home/sections/home-background.tsx components/gifting/home/sections/home-hero-section.tsx components/gifting/interactive-flow-demo.tsx components/gifting/workflow-progress.tsx components/gifting/home/sections/workflow-panels.tsx components/gifting/home/sections/step-gift-input.tsx components/gifting/home/sections/step-country.tsx components/gifting/home/sections/step-analysis.tsx components/gifting/home/sections/workflow-support-panels.tsx components/gifting/home/cards/country-step-summary-card.tsx components/gifting/home/sections/page-feedback.tsx components/gifting/home/sections/results-section.tsx components/gifting/home/sections/results-section.test.tsx components/gifting/home/sections/results-summary-panel.tsx components/gifting/home/sections/results-recommendations-panel.tsx components/gifting/home/sections/results-detail-panels.tsx components/gifting/home/sections/results-enhancement-panels.tsx
git commit -m "feat: unify homepage layout system"
```
