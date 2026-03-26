# Homepage Final Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the final homepage polish pass so the upgraded luxury advisor experience feels fully finished on desktop and mobile.

**Architecture:** Keep the current homepage component structure and controller flow intact, and focus only on presentational refinements, spacing, hierarchy, and responsive polish. Reuse the existing design-token layer and tune the specific section components that still carry extra density or inconsistent emphasis.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Framer Motion, Jest, Testing Library

---

## File map

### Modify
- `app/[locale]/page.test.tsx`
- `components/gifting/home/home-design-tokens.ts`
- `components/gifting/home/sections/home-hero-section.tsx`
- `components/gifting/home/sections/workflow-panels.tsx`
- `components/gifting/home/sections/step-analysis.tsx`
- `components/gifting/home/sections/results-section.tsx`
- `components/gifting/home/sections/results-detail-panels.tsx`
- `components/gifting/home/sections/results-summary-panel.tsx`
- `components/gifting/home/sections/results-recommendations-panel.tsx`
- `components/gifting/workflow-progress.tsx`

### Validate
- `pnpm exec jest --runInBand --runTestsByPath 'app/[locale]/page.test.tsx' 'components/gifting/home/sections/results-section.test.tsx'`
- `pnpm lint`
- `pnpm build`

### Task 1: Tighten hero rhythm and first-screen emphasis
- [ ] Update hero spacing, supporting-chip weight, and CTA emphasis so the first screen reads more calmly.
- [ ] Tune the right-hand credibility surface to feel quieter and more premium.
- [ ] Re-run homepage tests and lint for touched files.
- [ ] Commit the hero polish.

### Task 2: Reduce workflow density and support-card competition
- [ ] Refine workflow band spacing and internal hierarchy.
- [ ] Simplify the analysis card so advanced controls stay available but visually subordinate.
- [ ] Reduce repeated or overly heavy summary/support treatment.
- [ ] Re-run homepage tests and lint for touched files.
- [ ] Commit the workflow polish.

### Task 3: Lower result-detail noise and improve responsive polish
- [ ] Reduce the visual intensity of secondary result panels while preserving recommendation-first structure.
- [ ] Tune mobile spacing/stacking across hero, workflow, and results.
- [ ] Normalize borders, shadows, and contrast through the shared design-token layer.
- [ ] Run focused tests, then full `pnpm lint` and `pnpm build`.
- [ ] Commit the final polish pass.
