# Homepage Luxury Advisor Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the homepage into a premium cross-border gifting advisor experience with stronger hierarchy, calmer styling, and recommendation-first results.

**Architecture:** Keep the existing App Router page and controller/data flow intact while refactoring presentational sections into a clearer visual system. Concentrate changes inside homepage sections, extract any repeated style tokens into a focused helper, and introduce a dedicated result summary surface so recommendation-first reading order is explicit.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Framer Motion, Jest, Testing Library

---

## File map

### Modify
- `app/[locale]/page.test.tsx` — update homepage assertions to match the new hero hierarchy and supported-locale presentation
- `components/gifting/home/sections/home-hero-section.tsx` — rebuild hero into message-first + credibility split layout
- `components/gifting/home/sections/home-background.tsx` — quiet background texture and reduce competing dashboard noise
- `components/gifting/home/sections/workflow-panels.tsx` — rebalance workflow/support/history hierarchy
- `components/gifting/home/sections/workflow-support-panels.tsx` — tone down support surfaces so they no longer compete with the main workflow
- `components/gifting/home/sections/page-feedback.tsx` — restyle loading and error panels to match the premium system
- `components/gifting/home/sections/results-section.tsx` — reorder result composition so recommendation summary appears first
- `components/gifting/home/sections/results-recommendations-panel.tsx` — retune recommendation card emphasis to fit the new advisor layout
- `components/gifting/home/sections/results-detail-panels.tsx` — demote dense metrics into quieter secondary panels

### Create
- `components/gifting/home/home-design-tokens.ts` — shared class/token helpers for premium hierarchy surfaces, accents, and spacing
- `components/gifting/home/sections/results-summary-panel.tsx` — top-level advisor memo summary for recommendation-first results
- `components/gifting/home/sections/results-section.test.tsx` — verify recommendation-first result order and high-risk caution rendering

### Validate with existing scripts
- `pnpm test -- app/[locale]/page.test.tsx --runInBand`
- `pnpm test -- components/gifting/home/sections/results-section.test.tsx --runInBand`
- `pnpm lint`
- `pnpm build`

---

### Task 1: Lock the new homepage hierarchy in tests first

**Files:**
- Modify: `app/[locale]/page.test.tsx`
- Create: `components/gifting/home/sections/results-section.test.tsx`

- [ ] **Step 1: Write the failing homepage hierarchy assertions**

Update `app/[locale]/page.test.tsx` so the test expects the new premium-advisor framing instead of the older dashboard-heavy cues. Add assertions for:
- the hero H1 remaining the dominant page heading
- a primary CTA for starting analysis
- a visible secondary orientation CTA or equivalent explanatory action
- only supported locale buttons (`中文`, `English`)

Use Testing Library queries in the same style already used in the file, for example:

```tsx
expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/跨文化被理解|cultural clarity/i)
expect(screen.getByRole('button', { name: /开始分析|start gift analysis/i })).toBeInTheDocument()
expect(screen.getByRole('button', { name: /查看流程|see how it works/i })).toBeInTheDocument()
```

- [ ] **Step 2: Write the failing result-order test**

Create `components/gifting/home/sections/results-section.test.tsx`. Render `ResultsSection` with a compact mocked `analysis` object and assert that:
- recommendation summary content appears before lower-priority detail blocks
- high-risk or taboo caution text still renders when present
- the reset action remains available

Sketch the test data directly in the file so it is self-contained:

```tsx
const analysis = {
  riskScore: 78,
  riskLevel: 'High',
  fitScore: 62,
  isTaboo: true,
  matchedRules: [],
  warning: 'Avoid direct gifting without changes',
  giftProfile: { category: 'Accessory', colors: ['red'], materials: ['silk'], styles: ['formal'], semanticTags: ['luxury'] },
  scoreBreakdown: { phonetic: 40, symbol: 70, color: 55 },
  recommendations: [{ id: 'alt-1', name: 'Neutral leather notebook', reason: 'Safer and premium' }],
}
```

- [ ] **Step 3: Run the targeted tests and confirm failure**

Run:

```bash
pnpm test -- app/[locale]/page.test.tsx --runInBand
pnpm test -- components/gifting/home/sections/results-section.test.tsx --runInBand
```

Expected: at least one failure because the new secondary CTA/result-summary ordering is not implemented yet.

- [ ] **Step 4: Commit the failing-test baseline**

```bash
git add app/[locale]/page.test.tsx components/gifting/home/sections/results-section.test.tsx
git commit -m "test: lock homepage luxury advisor hierarchy"
```

---

### Task 2: Build the premium visual system and hero redesign

**Files:**
- Create: `components/gifting/home/home-design-tokens.ts`
- Modify: `components/gifting/home/sections/home-hero-section.tsx`
- Modify: `components/gifting/home/sections/home-background.tsx`

- [ ] **Step 1: Add shared design tokens/helpers**

Create `components/gifting/home/home-design-tokens.ts` with focused exported constants/helpers for primary, secondary, and quiet surfaces so style ranking stays consistent across the homepage.

Include small string helpers like:

```ts
export const homeSurface = {
  primary: 'rounded-[2rem] border border-[#e7d2af]/18 bg-[linear-gradient(135deg,rgba(231,210,175,0.10),rgba(147,197,253,0.06))] shadow-[0_30px_90px_rgba(4,10,24,0.45)]',
  secondary: 'rounded-[1.6rem] border border-white/10 bg-white/4',
  quiet: 'rounded-[1.25rem] border border-white/6 bg-white/[0.03]',
}

export const homeAccent = {
  premiumLabel: 'text-[#e7d2af]',
  intelligenceLabel: 'text-sky-200/85',
}
```

- [ ] **Step 2: Rebuild the hero around one dominant message**

Refactor `home-hero-section.tsx` so it uses a cleaner split layout:
- left side = message, description, primary CTA, secondary CTA, compact trust proof
- right side = compact credibility/advisor stack
- reduce equal-weight chips and nonessential emphasis in the first viewport
- keep locale switching functional, but visually quieter

Do not change controller props unless absolutely necessary. Prefer rearranging existing content and trimming visual noise over introducing new state.

- [ ] **Step 3: Quiet the background so it supports rather than competes**

Update `home-background.tsx` to reduce grid visibility, lower map opacity, and let the hero surfaces hold attention. Keep the global/cross-border cue, but remove the feeling of a technical dashboard grid dominating the screen.

- [ ] **Step 4: Run the homepage test and visual sanity checks**

Run:

```bash
pnpm test -- app/[locale]/page.test.tsx --runInBand
pnpm lint components/gifting/home/home-design-tokens.ts components/gifting/home/sections/home-hero-section.tsx components/gifting/home/sections/home-background.tsx
```

Expected: homepage test passes or moves closer; lint passes for the touched files.

- [ ] **Step 5: Commit the hero/system refactor**

```bash
git add components/gifting/home/home-design-tokens.ts components/gifting/home/sections/home-hero-section.tsx components/gifting/home/sections/home-background.tsx app/[locale]/page.test.tsx
git commit -m "feat: redesign homepage hero with luxury advisor hierarchy"
```

---

### Task 3: Rebalance workflow, support, and feedback surfaces

**Files:**
- Modify: `components/gifting/home/sections/workflow-panels.tsx`
- Modify: `components/gifting/home/sections/workflow-support-panels.tsx`
- Modify: `components/gifting/home/sections/page-feedback.tsx`

- [ ] **Step 1: Make workflow the unmistakable primary action region**

Adjust `workflow-panels.tsx` so the main task lane gets the strongest width, spacing, and visual emphasis. Support/history regions should remain useful but no longer feel like equal co-headliners.

Implementation targets:
- clearer primary/secondary column ratios
- more vertical spacing between workflow and support/history groups
- fewer heavy wrappers that duplicate card treatment

- [ ] **Step 2: Tone down support/history panels without harming usability**

Refactor `workflow-support-panels.tsx` so assistant/history cards use the new `secondary` and `quiet` surface tokens instead of the same intensity as the core workflow panels.

Keep these panels readable and actionable, but visually subordinate.

- [ ] **Step 3: Refresh loading/error feedback into the same premium system**

Update `page-feedback.tsx` so:
- progress indicators feel calmer and more refined
- copy is reassuring and concise
- error surfaces still read as important without looking disconnected from the rest of the homepage

- [ ] **Step 4: Run focused regression checks**

Run:

```bash
pnpm test -- app/[locale]/page.test.tsx --runInBand
pnpm lint components/gifting/home/sections/workflow-panels.tsx components/gifting/home/sections/workflow-support-panels.tsx components/gifting/home/sections/page-feedback.tsx
```

Expected: homepage render assertions still pass and lint stays clean.

- [ ] **Step 5: Commit the workflow/support cleanup**

```bash
git add components/gifting/home/sections/workflow-panels.tsx components/gifting/home/sections/workflow-support-panels.tsx components/gifting/home/sections/page-feedback.tsx
git commit -m "refactor: rebalance homepage workflow and support hierarchy"
```

---

### Task 4: Make results recommendation-first with an advisor memo summary

**Files:**
- Create: `components/gifting/home/sections/results-summary-panel.tsx`
- Modify: `components/gifting/home/sections/results-section.tsx`
- Modify: `components/gifting/home/sections/results-recommendations-panel.tsx`
- Modify: `components/gifting/home/sections/results-detail-panels.tsx`
- Modify: `components/gifting/home/sections/results-section.test.tsx`

- [ ] **Step 1: Create the new summary panel component**

Add `results-summary-panel.tsx` that accepts only the top-level data needed to present the advisor memo surface:
- recommendation headline or safest-next-step framing
- short explanation paragraph
- visible caution state when risk/taboo is high
- compact context line (country, audience, scene)

Keep the component presentation-focused; avoid moving analysis logic out of the controller unless a tiny formatting helper is necessary.

- [ ] **Step 2: Reorder `results-section.tsx` so summary appears first**

Compose the new result order as:
1. header/context
2. `ResultsSummaryPanel`
3. recommendation list
4. detail/enhancement panels

If `ResultsEnhancementPanels` still needs to render, place it after the recommendation-led block unless a specific enhanced insight is required inside the summary.

- [ ] **Step 3: Demote dense detail cards to secondary status**

Update `results-recommendations-panel.tsx` and `results-detail-panels.tsx` so:
- recommendation cards feel polished and premium
- metric-heavy sections use quieter surfaces
- caution and taboo messaging remains clearly visible but framed as professional guidance

- [ ] **Step 4: Run the new result tests and homepage regression**

Run:

```bash
pnpm test -- components/gifting/home/sections/results-section.test.tsx --runInBand
pnpm test -- app/[locale]/page.test.tsx --runInBand
pnpm lint components/gifting/home/sections/results-summary-panel.tsx components/gifting/home/sections/results-section.tsx components/gifting/home/sections/results-recommendations-panel.tsx components/gifting/home/sections/results-detail-panels.tsx
```

Expected: result-order test passes, homepage test still passes, and lint is clean.

- [ ] **Step 5: Commit the result-experience redesign**

```bash
git add components/gifting/home/sections/results-summary-panel.tsx components/gifting/home/sections/results-section.tsx components/gifting/home/sections/results-recommendations-panel.tsx components/gifting/home/sections/results-detail-panels.tsx components/gifting/home/sections/results-section.test.tsx
git commit -m "feat: make homepage results recommendation first"
```

---

### Task 5: Finish responsive polish and run full validation

**Files:**
- Modify: any files touched in Tasks 2–4 if responsive/accessibility issues are found during final validation

- [ ] **Step 1: Sweep desktop, tablet, and mobile hierarchy issues**

Check the touched surfaces in responsive modes and fix only concrete problems found:
- stacked hero order on mobile
- CTA spacing/clickability
- support cards crowding the workflow on tablet
- result summary remaining first and readable on small screens

- [ ] **Step 2: Sweep accessibility and interaction states**

Verify and correct:
- visible focus states on dark and warm-highlight surfaces
- sufficient contrast on premium labels and body copy
- no critical meaning communicated by color alone
- hover motion reduced enough to feel premium rather than flashy

- [ ] **Step 3: Run full project validation**

Run:

```bash
pnpm test -- app/[locale]/page.test.tsx --runInBand
pnpm test -- components/gifting/home/sections/results-section.test.tsx --runInBand
pnpm lint
pnpm build
```

Expected: all commands succeed.

- [ ] **Step 4: Update the changelog or internal progress note only if the repo already tracks this kind of design milestone nearby**

If no existing nearby log is appropriate, skip this step to stay YAGNI.

- [ ] **Step 5: Commit the final validated upgrade**

```bash
git add components/gifting/home/sections components/gifting/home/home-design-tokens.ts app/[locale]/page.test.tsx docs/superpowers/specs/2026-03-26-homepage-luxury-advisor-upgrade-design.md
git commit -m "feat: upgrade homepage to luxury advisor experience"
```
