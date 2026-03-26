# Editorial Homepage And Gifting Flow Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the localized homepage and gifting flow into one light editorial experience while preserving the existing analysis workflow and route behavior.

**Architecture:** Keep `useHomePageController` as the business-logic source of truth, then rebuild both routes around new presentational shells and shared light-theme tokens. Restore `app/[locale]/page.tsx` to a full homepage with editorial sections, and redesign `app/[locale]/gifting/page.tsx` as a narrative rail plus workspace layout that reuses the current workflow and results components.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS v4, Framer Motion, Jest, Testing Library

---

## File Structure

### Existing files to modify

- `app/[locale]/page.tsx`
  Restore the rich localized homepage route and assemble new editorial homepage sections.
- `app/[locale]/page.test.tsx`
  Re-align homepage route tests with the approved editorial structure while keeping stable user-facing intent.
- `app/[locale]/gifting/page.tsx`
  Replace the current photography-led flow shell with the editorial narrative/workspace layout.
- `app/globals.css`
  Add any shared helper classes needed by the light editorial system.
- `components/gifting/home/home-design-tokens.ts`
  Replace the dark-luxury tokens with the new light editorial palette, surfaces, controls, and layout rules.
- `components/gifting/home/sections/home-background.tsx`
  Update background treatment to match the lighter atmosphere and local-asset strategy.
- `components/gifting/home/sections/workflow-panels.tsx`
  Refine the workflow shell to fit the new gifting workspace.
- `components/gifting/home/sections/workflow-support-panels.tsx`
  Make assistant/history surfaces secondary within the new layout.
- `components/gifting/home/sections/step-gift-input.tsx`
  Update the first workflow step presentation for the new shell.
- `components/gifting/home/sections/step-country.tsx`
  Update the second workflow step presentation for the new shell.
- `components/gifting/home/sections/step-analysis.tsx`
  Update the analysis step presentation, loading, and enhancement framing.
- `components/gifting/home/sections/results-section.tsx`
  Reorder and restyle the results surface hierarchy to be recommendation-first.
- `components/gifting/home/sections/results-section.test.tsx`
  Update any expectations broken by the results hierarchy refresh.

### New files to create

- `components/gifting/home/sections/brand-hero.tsx`
  Editorial homepage hero with abstract product composition and dual CTAs.
- `components/gifting/home/sections/capability-band.tsx`
  Three-card capability proof band.
- `components/gifting/home/sections/process-preview.tsx`
  Homepage three-step process preview with CTA into the gifting route.
- `components/gifting/home/sections/result-preview.tsx`
  Homepage preview of the final recommendation output.
- `components/gifting/home/sections/home-footer.tsx`
  Concise closing section for the localized homepage.
- `components/gifting/home/sections/gifting-narrative-rail.tsx`
  Left-side editorial rail for the gifting route.
- `components/gifting/home/sections/gifting-workspace.tsx`
  Wrapper around workflow and results content for the gifting route.
- `app/[locale]/gifting/page.test.tsx`
  Route-level test covering the new gifting shell and retained workflow order.

## Task 1: Establish The Shared Light Editorial Design System

**Files:**
- Modify: `components/gifting/home/home-design-tokens.ts`
- Modify: `components/gifting/home/sections/home-background.tsx`
- Modify: `app/globals.css`
- Test: `app/[locale]/page.test.tsx`

- [ ] **Step 1: Write or update the route assertions that depend on the new visual system entry points**

```tsx
expect(screen.getByRole('button', { name: /开始体验|start gifting/i })).toBeInTheDocument()
expect(screen.getByText(/引导式流程|guided workflow/i)).toBeInTheDocument()
```

- [ ] **Step 2: Run the homepage route test to confirm the current route still fails the editorial expectations**

Run: `pnpm test -- app/[locale]/page.test.tsx --runInBand`
Expected: FAIL because the current `app/[locale]/page.tsx` does not render the richer homepage structure.

- [ ] **Step 3: Replace dark-luxury tokens with the light editorial token set**

Implement:

```ts
export const homeSurface = {
  lead: 'rounded-[2rem] border border-black/6 bg-white/78 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl',
  section: 'rounded-[1.75rem] border border-black/6 bg-[#f7f3ee]/88 shadow-[0_18px_45px_rgba(15,23,42,0.06)]',
  quiet: 'rounded-[1.25rem] border border-black/5 bg-white/72',
}
```

Add matching `homeAccent`, `homeText`, `homeButton`, and `homeLayout` tokens, then update `home-background.tsx` and `app/globals.css` so the global atmosphere uses warm paper whites, mist blues, and local SVG support instead of the current dark treatments.

- [ ] **Step 4: Run lint on the shared styling files**

Run: `pnpm lint -- app/globals.css components/gifting/home/home-design-tokens.ts components/gifting/home/sections/home-background.tsx`
Expected: PASS

- [ ] **Step 5: Commit the design-system foundation**

```bash
git add app/globals.css \
  components/gifting/home/home-design-tokens.ts \
  components/gifting/home/sections/home-background.tsx
git commit -m "feat: add editorial home design tokens"
```

## Task 2: Restore `app/[locale]/page.tsx` As The Full Editorial Homepage

**Files:**
- Modify: `app/[locale]/page.tsx`
- Create: `components/gifting/home/sections/brand-hero.tsx`
- Create: `components/gifting/home/sections/capability-band.tsx`
- Create: `components/gifting/home/sections/process-preview.tsx`
- Create: `components/gifting/home/sections/result-preview.tsx`
- Create: `components/gifting/home/sections/home-footer.tsx`
- Test: `app/[locale]/page.test.tsx`

- [ ] **Step 1: Expand the homepage route test so it checks the approved section structure**

```tsx
expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
expect(screen.getByText(/Why Givia|为什么选择 Givia/i)).toBeInTheDocument()
expect(screen.getByText(/引导式流程|guided workflow/i)).toBeInTheDocument()
expect(screen.getByText(/文化建议预览|recommendation preview/i)).toBeInTheDocument()
```

- [ ] **Step 2: Run the homepage test to verify the richer route structure is still missing**

Run: `pnpm test -- app/[locale]/page.test.tsx --runInBand`
Expected: FAIL because the current route only renders a simplified hero.

- [ ] **Step 3: Implement the editorial homepage sections and route assembly**

Implement these boundaries:

```tsx
<div className="relative min-h-screen overflow-x-hidden bg-[--editorial-bg]">
  <HomeBackground />
  <BrandHero ... />
  <CapabilityBand ... />
  <ProcessPreview ... />
  <ResultPreview ... />
  <HomeFooter ... />
</div>
```

`app/[locale]/page.tsx` should derive locale from `useParams`, wire locale switching and CTA navigation, and use the new section files for content instead of embedding all layout logic inline.

- [ ] **Step 4: Run homepage tests and targeted lint**

Run: `pnpm test -- app/[locale]/page.test.tsx --runInBand`
Expected: PASS

Run: `pnpm lint -- app/[locale]/page.tsx components/gifting/home/sections/brand-hero.tsx components/gifting/home/sections/capability-band.tsx components/gifting/home/sections/process-preview.tsx components/gifting/home/sections/result-preview.tsx components/gifting/home/sections/home-footer.tsx`
Expected: PASS

- [ ] **Step 5: Commit the restored homepage route**

```bash
git add app/[locale]/page.tsx \
  app/[locale]/page.test.tsx \
  components/gifting/home/sections/brand-hero.tsx \
  components/gifting/home/sections/capability-band.tsx \
  components/gifting/home/sections/process-preview.tsx \
  components/gifting/home/sections/result-preview.tsx \
  components/gifting/home/sections/home-footer.tsx
git commit -m "feat: rebuild localized homepage as editorial landing page"
```

## Task 3: Rebuild The Gifting Route Shell Around A Narrative Rail

**Files:**
- Modify: `app/[locale]/gifting/page.tsx`
- Create: `components/gifting/home/sections/gifting-narrative-rail.tsx`
- Create: `components/gifting/home/sections/gifting-workspace.tsx`
- Create: `app/[locale]/gifting/page.test.tsx`

- [ ] **Step 1: Add a route-level test for the gifting page shell**

```tsx
expect(screen.getByText(/步骤 01|step 01/i)).toBeInTheDocument()
expect(screen.getByRole('heading', { name: /您准备了什么礼物|what is the gift/i })).toBeInTheDocument()
expect(screen.getByText(/引导式流程|guided workflow/i)).toBeInTheDocument()
```

- [ ] **Step 2: Run the new gifting route test to confirm the current shell does not yet match**

Run: `pnpm test -- app/[locale]/gifting/page.test.tsx --runInBand`
Expected: FAIL until the narrative rail and workspace structure exist.

- [ ] **Step 3: Replace the current page shell with the editorial rail/workspace composition**

Implement:

```tsx
<div className="min-h-screen bg-[--editorial-bg]">
  <GiftingNarrativeRail currentStep={currentStep} ... />
  <GiftingWorkspace
    workflowPanelsProps={workflowPanelsProps}
    resultsProps={resultsProps}
    feedbackProps={feedbackProps}
    ...
  />
</div>
```

The new shell must remove remote photography, keep the existing `currentStep` logic, and preserve the transition into results.

- [ ] **Step 4: Run gifting route tests and lint**

Run: `pnpm test -- app/[locale]/gifting/page.test.tsx --runInBand`
Expected: PASS

Run: `pnpm lint -- app/[locale]/gifting/page.tsx app/[locale]/gifting/page.test.tsx components/gifting/home/sections/gifting-narrative-rail.tsx components/gifting/home/sections/gifting-workspace.tsx`
Expected: PASS

- [ ] **Step 5: Commit the gifting shell redesign**

```bash
git add app/[locale]/gifting/page.tsx \
  app/[locale]/gifting/page.test.tsx \
  components/gifting/home/sections/gifting-narrative-rail.tsx \
  components/gifting/home/sections/gifting-workspace.tsx
git commit -m "feat: redesign gifting route shell as editorial workspace"
```

## Task 4: Refresh Workflow Steps And Support Panels For The New Shell

**Files:**
- Modify: `components/gifting/home/sections/workflow-panels.tsx`
- Modify: `components/gifting/home/sections/workflow-support-panels.tsx`
- Modify: `components/gifting/home/sections/step-gift-input.tsx`
- Modify: `components/gifting/home/sections/step-country.tsx`
- Modify: `components/gifting/home/sections/step-analysis.tsx`
- Test: `app/[locale]/page.test.tsx`
- Test: `app/[locale]/gifting/page.test.tsx`

- [ ] **Step 1: Add assertions for preserved workflow order and enhancement visibility**

```tsx
const giftStep = screen.getByRole('heading', { level: 2, name: /第一步|step 1/i })
const countryStep = screen.getByRole('heading', { level: 2, name: /第二步|step 2/i })
const analysisStep = screen.getByRole('heading', { level: 2, name: /第三步|step 3/i })
expect(giftStep.compareDocumentPosition(countryStep) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
expect(screen.getByText(/高级判断补充项/i)).toBeInTheDocument()
```

- [ ] **Step 2: Run the affected route tests to capture regressions before styling changes**

Run: `pnpm test -- app/[locale]/page.test.tsx app/[locale]/gifting/page.test.tsx --runInBand`
Expected: At least one failure once stronger structure assertions are in place.

- [ ] **Step 3: Refactor the workflow and support panels into the editorial hierarchy**

Implement the following adjustments:
- keep the primary lane focused on `StepGiftInput`, `StepCountry`, and `StepAnalysis`
- reduce the visual weight of assistant and history panels
- remove any dark-glass visual assumptions from the step sections
- keep loading, disabled, and enhancement controls visible and readable in the lighter system

Representative shell:

```tsx
<section className={homeSurface.section}>
  <header>...</header>
  <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
    <div className="space-y-5">{/* primary steps */}</div>
    <aside>{/* assistant/support */}</aside>
  </div>
</section>
```

- [ ] **Step 4: Run route tests and targeted lint**

Run: `pnpm test -- app/[locale]/page.test.tsx app/[locale]/gifting/page.test.tsx --runInBand`
Expected: PASS

Run: `pnpm lint -- components/gifting/home/sections/workflow-panels.tsx components/gifting/home/sections/workflow-support-panels.tsx components/gifting/home/sections/step-gift-input.tsx components/gifting/home/sections/step-country.tsx components/gifting/home/sections/step-analysis.tsx`
Expected: PASS

- [ ] **Step 5: Commit the workflow shell refresh**

```bash
git add components/gifting/home/sections/workflow-panels.tsx \
  components/gifting/home/sections/workflow-support-panels.tsx \
  components/gifting/home/sections/step-gift-input.tsx \
  components/gifting/home/sections/step-country.tsx \
  components/gifting/home/sections/step-analysis.tsx
git commit -m "feat: restyle workflow panels for editorial gifting flow"
```

## Task 5: Rebuild Results Hierarchy As Recommendation-First Output

**Files:**
- Modify: `components/gifting/home/sections/results-section.tsx`
- Modify: `components/gifting/home/sections/results-section.test.tsx`
- Modify: `components/gifting/home/sections/results-summary-panel.tsx`
- Modify: `components/gifting/home/sections/results-recommendations-panel.tsx`
- Modify: `components/gifting/home/sections/results-detail-panels.tsx`
- Modify: `components/gifting/home/sections/results-enhancement-panels.tsx`

- [ ] **Step 1: Write or update a results test that enforces summary-first rendering**

```tsx
expect(screen.getByText(/summary|综合判断/i)).toBeInTheDocument()
expect(screen.getByText(/recommendation|建议/i)).toBeInTheDocument()
```

If the current test file already covers this surface, extend it instead of creating a duplicate behavior test.

- [ ] **Step 2: Run the results test to confirm it captures the hierarchy change**

Run: `pnpm test -- components/gifting/home/sections/results-section.test.tsx --runInBand`
Expected: FAIL until the summary-first structure is implemented.

- [ ] **Step 3: Reorder and restyle results panels**

Implementation requirements:
- summary/judgment block first
- recommendations immediately after summary
- detailed evidence next
- enhancement panels after the main recommendation path
- warnings remain prominent but visually integrated with the editorial palette

Representative structure:

```tsx
<div className="space-y-6">
  <ResultsSummaryPanel ... />
  <ResultsRecommendationsPanel ... />
  <ResultsDetailPanels ... />
  <ResultsEnhancementPanels ... />
</div>
```

- [ ] **Step 4: Run results tests and lint**

Run: `pnpm test -- components/gifting/home/sections/results-section.test.tsx --runInBand`
Expected: PASS

Run: `pnpm lint -- components/gifting/home/sections/results-section.tsx components/gifting/home/sections/results-summary-panel.tsx components/gifting/home/sections/results-recommendations-panel.tsx components/gifting/home/sections/results-detail-panels.tsx components/gifting/home/sections/results-enhancement-panels.tsx`
Expected: PASS

- [ ] **Step 5: Commit the results refresh**

```bash
git add components/gifting/home/sections/results-section.tsx \
  components/gifting/home/sections/results-section.test.tsx \
  components/gifting/home/sections/results-summary-panel.tsx \
  components/gifting/home/sections/results-recommendations-panel.tsx \
  components/gifting/home/sections/results-detail-panels.tsx \
  components/gifting/home/sections/results-enhancement-panels.tsx
git commit -m "feat: reorder gifting results around editorial summary"
```

## Task 6: Full Regression Pass And Final Cleanup

**Files:**
- Modify: any touched files only if required by lint/test fixes

- [ ] **Step 1: Run the focused route and section tests together**

Run: `pnpm test -- app/[locale]/page.test.tsx app/[locale]/gifting/page.test.tsx components/gifting/home/sections/results-section.test.tsx --runInBand`
Expected: PASS

- [ ] **Step 2: Run project lint**

Run: `pnpm lint -- app components lib`
Expected: PASS

- [ ] **Step 3: Run a production build smoke check**

Run: `pnpm build`
Expected: PASS with no new route-level errors.

- [ ] **Step 4: If any regressions appear, fix only the touched-route issues and rerun the failing command**

Examples:
- hydration or route-client issues in `app/[locale]/page.tsx`
- missing client boundaries in new section files
- test selector drift caused by renamed headings

- [ ] **Step 5: Commit the final verification fixes**

```bash
git add app/[locale]/page.tsx \
  app/[locale]/gifting/page.tsx \
  app/[locale]/page.test.tsx \
  app/[locale]/gifting/page.test.tsx \
  components/gifting/home/sections \
  components/gifting/home/home-design-tokens.ts \
  app/globals.css
git commit -m "fix: finalize editorial gifting experience"
```

## Notes For Execution

- Do not revert unrelated work already present in the repository.
- Keep all new visual assets local or CSS-composed; do not add remote photography back into the primary experience.
- If a section file becomes too large while implementing, split it during execution rather than letting the route file absorb more complexity.
- Prefer stable, user-facing tests over DOM-fragile snapshots.

## Review Status

Manual review completed in-session against the approved spec at `docs/superpowers/specs/2026-03-26-editorial-homepage-redesign-design.md`.

Subagent plan review was not used here because this session did not have explicit user authorization for delegation. If delegation is later authorized, run a fresh plan review before execution.
