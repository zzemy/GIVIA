# Homepage Polish Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish the homepage polish pass by aligning CTA behavior, card-count copy, workflow visuals, and mid-page density with the premium advisor direction.

**Architecture:** Keep the existing homepage structure and only refine targeted presentation and interaction boundaries. Use the existing controller and component split, introducing no new backend behavior and only minimal new UI state for collapsing advanced controls.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Framer Motion, Jest, Testing Library

---

## File map
- Modify: `components/gifting/home/hooks/use-home-page-controller.tsx`
- Modify: `components/gifting/home/sections/home-hero-section.tsx`
- Modify: `components/gifting/workflow-progress.tsx`
- Modify: `components/gifting/home/sections/step-analysis.tsx`
- Modify: `components/gifting/home/cards/country-step-summary-card.tsx`
- Modify: `components/gifting/home/sections/step-country.tsx`
- Modify: `app/[locale]/page.test.tsx`

## Validation
- `pnpm exec jest --runInBand --runTestsByPath 'app/[locale]/page.test.tsx' 'components/gifting/home/sections/results-section.test.tsx'`
- `pnpm lint`
- `pnpm build`
