# Editorial Steps Two and Three Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Step 2 and Step 3 into narrative editorial chapters that continue the Step 1 aesthetic while adding structured recipient and arrival detail capture with AI-guided synthesis.

**Architecture:** Keep the existing single-page workflow shell in `app/[locale]/gifting/page.tsx`, but replace the internals of `StepCountry` and `StepAnalysis` with editorial layouts that reuse current controller state where possible. Extend the controller props only where Step 3 needs more contextual inputs and generate AI checkpoint content locally from structured form state so the UI feels participatory without requiring a new backend flow in this pass.

**Tech Stack:** Next.js App Router, React 19 client components, TypeScript, Tailwind CSS v4, Framer Motion, lucide-react

---

### Task 1: Expand the Step 2 and Step 3 data contract

**Files:**
- Modify: `components/gifting/home/hooks/use-home-page-controller.tsx`
- Modify: `components/gifting/home/sections/step-analysis.tsx`
- Modify: `components/gifting/home/sections/step-country.tsx`

- [ ] **Step 1: Map the fields each chapter needs**

Use the existing controller state as the baseline:

- Step 2 uses `selectedCountry`, `targetGroup`, `customAudienceGroup`, `ageBand`, `gender`, `occupation`, `relationship`, `budgetRange`, `formality`, `targetProfile`
- Step 3 uses `selectedCountry`, `sceneTemplate`, `occasion`, `targetProfile`, `budgetRange`, `formality`, plus recipient summary fields already derived in Step 2

- [ ] **Step 2: Extend `analysisProps` with the Step 3 fields**

Pass through:

- `sceneTemplate`
- `sceneTemplateOptions`
- `occasion`
- `targetProfile`
- `budgetRange`
- `budgetLabel`
- `formality`
- `formalityLabel`
- `onSceneTemplateChange`
- `onOccasionChange`
- `onTargetProfileChange`
- `onBudgetRangeChange`
- `onFormalityChange`

- [ ] **Step 3: Keep state ownership in the controller**

Do not move form state into section-local state. Reuse the existing `clearAnalysisOnChange(...)` setters so any Step 2 or Step 3 input change invalidates stale results consistently.

- [ ] **Step 4: Verify types compile mentally before UI rewrite**

Confirm the section prop interfaces match the controller payload before touching layout-heavy code.

### Task 2: Rewrite Step 2 as `Recipient dossier`

**Files:**
- Modify: `components/gifting/home/sections/step-country.tsx`

- [ ] **Step 1: Replace the current dual-card utility layout**

Move from:

- country card
- template card

To:

- a single editorial panel
- left primary `Recipient stage`
- right secondary `Profile notes`
- bottom `AI checkpoint`

- [ ] **Step 2: Surface recipient-identity fields in narrative order**

Order the section around:

1. destination / country
2. who the recipient is
3. relationship distance
4. age / occupation / gender context
5. budget and formality
6. freeform target profile note

- [ ] **Step 3: Add AI-guided synthesis blocks**

Render local editorial summaries:

- a short `recipient sketch`
- a `missing context` list
- a `tact notes` list

These should react to field state and feel like AI guidance, not static helper copy.

- [ ] **Step 4: Keep the aesthetic language aligned with Step 1**

Reuse the same visual grammar:

- rounded dossier shell
- soft borders
- split layout
- editorial eyebrow labels
- restrained accent palette
- bottom checkpoint band

### Task 3: Rewrite Step 3 as `Arrival composition`

**Files:**
- Modify: `components/gifting/home/sections/step-analysis.tsx`

- [ ] **Step 1: Replace the parameter-confirmation UI**

Remove the current:

- chip summary row
- advanced engine toggle matrix
- utility-heavy CTA styling

Replace with:

- editorial `Arrival stage`
- scenario composition controls
- AI summary and checkpoint output

- [ ] **Step 2: Organize scene inputs into a narrative composition flow**

Use:

1. purpose / scene template
2. occasion or moment description
3. public vs private tone through the existing formality/budget context
4. expanded delivery note through `targetProfile`

Even if the underlying fields are reused, the UI should present them as scene-writing rather than settings.

- [ ] **Step 3: Add AI checkpoint outputs**

Compute:

- `arrival draft`
- `proportion check`
- `risk watch`

These summaries should reference recipient context plus scene context so Step 3 clearly feels downstream of Step 2.

- [ ] **Step 4: Preserve the analyze action as the chapter handoff**

Keep `onAnalyze` as the primary CTA, but rewrite its framing so it feels like moving from narrative composition into editorial judgment.

### Task 4: Verification

**Files:**
- Modify: `components/gifting/home/sections/step-country.tsx`
- Modify: `components/gifting/home/sections/step-analysis.tsx`
- Modify: `components/gifting/home/hooks/use-home-page-controller.tsx`

- [ ] **Step 1: Run targeted lint for touched files**

Run:

```bash
pnpm exec eslint components/gifting/home/sections/step-country.tsx components/gifting/home/sections/step-analysis.tsx components/gifting/home/hooks/use-home-page-controller.tsx
```

Expected:

- the touched files pass even if the repository still has unrelated lint errors elsewhere

- [ ] **Step 2: Review visual continuity**

Check for:

- Step 2 and Step 3 using the same chapter family as Step 1
- Step 2 clearly feeling recipient-centered
- Step 3 clearly feeling arrival-centered
- AI checkpoint copy changing meaningfully with form state

- [ ] **Step 3: Summarize residual gaps**

Document any remaining limitations, especially if future work should add:

- real conversational AI follow-up
- richer field models
- backend-assisted summary generation
