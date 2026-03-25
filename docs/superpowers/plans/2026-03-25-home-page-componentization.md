# Home Page Componentization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Shrink the localized home page into a page assembler and move large workflow/state concerns into focused hooks and section components.

**Architecture:** The refactor keeps existing behavior but redistributes responsibilities. `app/[locale]/page.tsx` becomes a thin composition layer, a controller hook centralizes state/effects/actions, and oversized step components are decomposed into smaller presentational units.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Framer Motion, Tailwind CSS

---

### Task 1: Extract page-level sections

**Files:**
- Create: `components/gifting/home/home-background.tsx`
- Create: `components/gifting/home/page-feedback.tsx`
- Create: `components/gifting/home/workflow-panels.tsx`
- Modify: `app/[locale]/page.tsx`

- [ ] Create `home-background.tsx` for the decorative layers currently in page JSX.
- [ ] Create `page-feedback.tsx` for loading and error UI.
- [ ] Create `workflow-panels.tsx` to compose the three workflow steps plus assistant/history sections.
- [ ] Update `app/[locale]/page.tsx` to use the extracted section components.

### Task 2: Extract page controller hook

**Files:**
- Create: `components/gifting/home/use-home-page-controller.ts`
- Modify: `app/[locale]/page.tsx`

- [ ] Move workflow state, side effects, derived booleans, and handlers from page into the controller hook.
- [ ] Return grouped values that map cleanly to visual sections.
- [ ] Keep translator/locale handling stable for existing child components.
- [ ] Reduce page.tsx to route + composition responsibilities.

### Task 3: Split StepGiftInput by responsibility

**Files:**
- Create: `components/gifting/home/gift-input-upload-panel.tsx`
- Create: `components/gifting/home/gift-input-text-editor.tsx`
- Create: `components/gifting/home/gift-input-recognition-panel.tsx`
- Modify: `components/gifting/home/step-gift-input.tsx`

- [ ] Extract upload/preview/action area into its own component.
- [ ] Extract manual text input editor into its own component.
- [ ] Extract recognition summary and editable recognition fields into its own component.
- [ ] Keep `step-gift-input.tsx` as a thin orchestrator.

### Task 4: Split StepCountry by responsibility

**Files:**
- Create: `components/gifting/home/country-step-selection-card.tsx`
- Create: `components/gifting/home/country-step-scene-card.tsx`
- Create: `components/gifting/home/country-step-audience-card.tsx`
- Create: `components/gifting/home/country-step-profile-card.tsx`
- Create: `components/gifting/home/country-step-summary-card.tsx`
- Modify: `components/gifting/home/step-country.tsx`

- [ ] Extract country selection card.
- [ ] Extract scene template card.
- [ ] Extract audience/notes card.
- [ ] Extract advanced profile card.
- [ ] Extract confirmation summary card.
- [ ] Keep `step-country.tsx` as layout + orchestration only.

### Task 5: Validate refactor

**Files:**
- Modify: touched files above as needed

- [ ] Run lint on the touched surface.
- [ ] Fix any type or lint regressions.
- [ ] Summarize the new boundaries and any follow-up opportunities.
