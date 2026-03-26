# Homepage Full Beautification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the homepage into a fully unified premium concierge-style gifting advisor experience with calmer hierarchy, standardized controls, and recommendation-first results.

**Architecture:** Keep the App Router page and the existing controller/data flow intact while concentrating work inside the homepage presentation layer. Use test-driven updates for the largest hierarchy changes first, then implement the redesign in staged passes: visual-system tokens + hero/background, workflow restructuring, control/card normalization, and recommendation-first result polishing. Avoid unnecessary business-logic changes; when structure must shift, keep the change inside homepage section components so existing hooks, API calls, and storage behavior remain stable.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Framer Motion, Jest, Testing Library

**References:** `@frontend-design`, `@tailwind-design-system`, `@shadcn`, `@next-best-practices`, `@vercel-react-best-practices`

---

## Reference spec
- `docs/superpowers/specs/2026-03-26-homepage-full-beautification-design.md`

## File map

### Modify
- `app/[locale]/page.test.tsx` — lock hero hierarchy and guided workflow order in tests
- `components/gifting/home/sections/results-section.test.tsx` — lock recommendation-first result structure in tests
- `components/gifting/home/home-design-tokens.ts` — expand homepage surface, accent, control, and motion tokens
- `components/gifting/home/sections/home-background.tsx` — quiet global texture and reduce dashboard-style background competition
- `components/gifting/home/sections/home-hero-section.tsx` — rebuild the hero into a cleaner message-first + advisor-preview split layout
- `components/gifting/interactive-flow-demo.tsx` — restyle the hero-side preview so it feels like a refined advisor console
- `components/gifting/workflow-progress.tsx` — simplify and standardize the progress strip hierarchy
- `components/gifting/home/sections/workflow-panels.tsx` — reorder the primary guided flow and subordinate support/history surfaces
- `components/gifting/home/sections/step-gift-input.tsx` — align step shell styling with the new primary workflow system
- `components/gifting/home/sections/step-country.tsx` — align the country/context step with the primary workflow lane
- `components/gifting/home/sections/step-analysis.tsx` — keep analysis as the workflow culmination and calm advanced controls
- `components/gifting/home/sections/workflow-support-panels.tsx` — demote assistant/history surfaces to secondary and tertiary weight
- `components/gifting/home/cards/gift-input-upload-panel.tsx` — normalize uploader panel chrome and helper actions
- `components/gifting/home/cards/gift-input-text-editor.tsx` — normalize input styling and helper affordances
- `components/gifting/home/cards/gift-input-recognition-panel.tsx` — normalize recognition result and editable follow-up styles
- `components/gifting/home/cards/country-step-selection-card.tsx` — normalize the country-selection shell
- `components/gifting/home/cards/country-step-scene-card.tsx` — normalize scene-choice tiles and active states
- `components/gifting/home/cards/country-step-audience-card.tsx` — normalize audience chips, notes, and custom-audience controls
- `components/gifting/home/cards/country-step-profile-card.tsx` — normalize select-field styling and spacing
- `components/gifting/home/cards/country-step-summary-card.tsx` — normalize the confirmation/summary card and quiet-support blocks
- `components/gifting/country-selector.tsx` — unify the dropdown trigger, search, and list surfaces with the homepage system
- `components/gifting/home/sections/page-feedback.tsx` — restyle loading and error states into the premium system
- `components/gifting/home/sections/results-section.tsx` — keep summary-first composition explicit and integrate quieter section spacing
- `components/gifting/home/sections/results-summary-panel.tsx` — strengthen advisor memo hierarchy and caution framing
- `components/gifting/home/sections/results-recommendations-panel.tsx` — retune recommendation card emphasis and save-state controls
- `components/gifting/home/sections/results-detail-panels.tsx` — demote dense evidence panels while preserving clarity
- `components/gifting/home/sections/results-enhancement-panels.tsx` — quiet advanced evidence surfaces so they support, not dominate

### Validate with existing scripts
- `pnpm exec jest --runInBand --runTestsByPath 'app/[locale]/page.test.tsx' 'components/gifting/home/sections/results-section.test.tsx'`
- `pnpm lint`
- `pnpm build`

---

### Task 1: Lock the new hierarchy in tests first

**Files:**
- Modify: `app/[locale]/page.test.tsx`
- Modify: `components/gifting/home/sections/results-section.test.tsx`

- [ ] **Step 1: Add a failing guided-workflow order assertion to the localized page test**

Extend `app/[locale]/page.test.tsx` with a new test that proves the homepage DOM order matches the desired primary lane: gift input → country/context → analysis.

Use DOM-order assertions instead of just checking presence:

```tsx
it('renders the guided concierge workflow in the intended order', () => {
  render(<Home />)

  const giftStep = screen.getByRole('heading', { level: 2, name: /第一步：上传图片或输入礼物/i })
  const countryStep = screen.getByRole('heading', { level: 2, name: /第二步：选择目标国家/i })
  const analysisStep = screen.getByRole('heading', { level: 2, name: /第三步：AI 文化分析|analysis title/i })

  expect(giftStep.compareDocumentPosition(countryStep) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  expect(countryStep.compareDocumentPosition(analysisStep) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
})
```

This should fail against the current layout because `StepAnalysis` renders before `StepCountry`.

- [ ] **Step 2: Strengthen the results test so it locks summary → recommendations → supporting analysis order**

Update `components/gifting/home/sections/results-section.test.tsx` so it asserts the advisor summary appears before the recommendations heading, and that recommendations appear before the “支持分析 / SUPPORTING ANALYSIS” label.

Add a DOM-order assertion like:

```tsx
const summary = screen.getByRole('heading', { name: /赠礼顾问结论|advisor summary/i })
const recommendations = screen.getByRole('heading', { name: /更稳妥的替代推荐|safer alternatives/i })
const supporting = screen.getByText(/支持分析|supporting analysis/i)

expect(summary.compareDocumentPosition(recommendations) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
expect(recommendations.compareDocumentPosition(supporting) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
```

Keep the existing high-risk handling assertions in place.

- [ ] **Step 3: Run the localized homepage test file and verify the new workflow-order assertion fails**

Run:

```bash
pnpm exec jest --runInBand --runTestsByPath 'app/[locale]/page.test.tsx'
```

Expected:
- the new workflow-order assertion fails because `StepAnalysis` still appears before `StepCountry`
- the existing hero/language assertions continue to pass

- [ ] **Step 4: Run the results test file separately and confirm the recommendation-first assertions stay green**

Run:

```bash
pnpm exec jest --runInBand --runTestsByPath 'components/gifting/home/sections/results-section.test.tsx'
```

Expected:
- the results test passes, proving the new summary/order assertions are valid without waiting for later UI work

- [ ] **Step 5: Commit the failing-test baseline**

```bash
git add 'app/[locale]/page.test.tsx' 'components/gifting/home/sections/results-section.test.tsx'
git commit -m "test: lock homepage beautification hierarchy"
```

---

### Task 2: Expand the visual system and rebuild the first screen

**Files:**
- Modify: `components/gifting/home/home-design-tokens.ts`
- Modify: `components/gifting/home/sections/home-background.tsx`
- Modify: `components/gifting/home/sections/home-hero-section.tsx`
- Modify: `components/gifting/interactive-flow-demo.tsx`

- [ ] **Step 1: Expand the homepage token file so surface/control hierarchy is explicit**

Refactor `components/gifting/home/home-design-tokens.ts` so it defines more than just `primary / secondary / quiet` surfaces. Add focused token groups for:
- primary / secondary / quiet surfaces
- premium labels and intelligence labels
- consistent control shells for inputs/selects
- CTA emphasis classes
- text hierarchy helpers if repeated across sections

A small target shape is enough:

```ts
export const homeSurface = {
  primary: '...',
  secondary: '...',
  quiet: '...',
  inset: '...',
}

export const homeControl = {
  input: 'rounded-xl border ...',
  pill: 'rounded-full border ...',
}

export const homeButton = {
  primary: 'rounded-full border ...',
  secondary: 'rounded-full border ...',
}
```

Do not over-engineer this into a full design-system library; keep it homepage-focused.

- [ ] **Step 2: Rebuild the hero so the message is the obvious first focal point**

In `components/gifting/home/sections/home-hero-section.tsx`:
- keep the sticky header, but visually quiet it
- keep locale switching functional, but reduce its visual weight
- tighten the left message zone to one dominant headline, one description, one primary CTA, one secondary CTA, and compact trust proof
- keep the right-hand advisor/credibility content, but make it quieter than the left-hand promise
- reduce equal-weight chips and decorative competition in the first viewport

Use the new token helpers instead of more one-off class strings where it improves reuse.

- [ ] **Step 3: Quiet the background and hero-side preview so they support the premium tone**

In `components/gifting/home/sections/home-background.tsx` and `components/gifting/interactive-flow-demo.tsx`:
- lower grid/noise intensity
- reduce background map competition
- keep cross-border atmosphere, but avoid technical-dashboard energy
- restyle the demo into a calmer advisor-console preview instead of a bright cyan mini-panel

- [ ] **Step 4: Run hero-focused tests and lint the touched files**

Run:

```bash
pnpm exec jest --runInBand --runTestsByPath 'app/[locale]/page.test.tsx' --testNamePattern 'premium advisor hero|language switch buttons'
pnpm lint 'components/gifting/home/home-design-tokens.ts' 'components/gifting/home/sections/home-background.tsx' 'components/gifting/home/sections/home-hero-section.tsx' 'components/gifting/interactive-flow-demo.tsx'
```

Expected:
- the hero/language tests pass
- lint passes for the touched files
- the new workflow-order test can still fail until Task 3

- [ ] **Step 5: Commit the first-screen redesign**

```bash
git add   'components/gifting/home/home-design-tokens.ts'   'components/gifting/home/sections/home-background.tsx'   'components/gifting/home/sections/home-hero-section.tsx'   'components/gifting/interactive-flow-demo.tsx'
git commit -m "feat: rebuild homepage first screen for concierge hierarchy"
```

---

### Task 3: Restructure the workflow into one guided concierge lane

**Files:**
- Modify: `components/gifting/workflow-progress.tsx`
- Modify: `components/gifting/home/sections/workflow-panels.tsx`
- Modify: `components/gifting/home/sections/step-gift-input.tsx`
- Modify: `components/gifting/home/sections/step-country.tsx`
- Modify: `components/gifting/home/sections/step-analysis.tsx`

- [ ] **Step 1: Reorder the workflow DOM and layout so the main lane matches the real decision sequence**

Update `components/gifting/home/sections/workflow-panels.tsx` so the primary lane reads in this order:

```tsx
<div className="flex flex-col gap-6">
  <StepGiftInput {...giftInputProps} />
  <StepCountry {...countryProps} />
  <StepAnalysis {...analysisProps} />
</div>
```

Move the assistant into the secondary lane and keep history/favorites in a tertiary band below the main workflow shell.

Clarify the column ratio so the primary lane visually dominates on desktop.

- [ ] **Step 2: Simplify `WorkflowProgress` so it reinforces progress instead of adding another competing panel**

In `components/gifting/workflow-progress.tsx`:
- keep the three-step structure
- reduce connector and badge noise
- make current/completed/pending states readable but calmer
- ensure mobile still communicates progress clearly without extra bulk

- [ ] **Step 3: Normalize the three primary workflow section shells**

In `StepGiftInput`, `StepCountry`, and `StepAnalysis`:
- align border strength, radius, shadow, and padding with the new token system
- make headings/subheadings feel like one family
- keep `StepAnalysis` as the culmination surface, but demote dense helper chrome and advanced-toggle noise
- make each step feel like part of the same guided workflow rather than three different card styles

- [ ] **Step 4: Run the full localized page test file and lint the workflow files**

Run:

```bash
pnpm exec jest --runInBand --runTestsByPath 'app/[locale]/page.test.tsx'
pnpm lint   'components/gifting/workflow-progress.tsx'   'components/gifting/home/sections/workflow-panels.tsx'   'components/gifting/home/sections/step-gift-input.tsx'   'components/gifting/home/sections/step-country.tsx'   'components/gifting/home/sections/step-analysis.tsx'
```

Expected:
- the new workflow-order test now passes
- earlier hero/language assertions still pass
- lint stays clean

- [ ] **Step 5: Commit the workflow restructuring**

```bash
git add   'components/gifting/workflow-progress.tsx'   'components/gifting/home/sections/workflow-panels.tsx'   'components/gifting/home/sections/step-gift-input.tsx'   'components/gifting/home/sections/step-country.tsx'   'components/gifting/home/sections/step-analysis.tsx'   'app/[locale]/page.test.tsx'
git commit -m "refactor: turn homepage flow into guided concierge lane"
```

---

### Task 4: Normalize card-level controls and subordinate support surfaces

**Files:**
- Modify: `components/gifting/home/sections/workflow-support-panels.tsx`
- Modify: `components/gifting/home/cards/gift-input-upload-panel.tsx`
- Modify: `components/gifting/home/cards/gift-input-text-editor.tsx`
- Modify: `components/gifting/home/cards/gift-input-recognition-panel.tsx`
- Modify: `components/gifting/home/cards/country-step-selection-card.tsx`
- Modify: `components/gifting/home/cards/country-step-scene-card.tsx`
- Modify: `components/gifting/home/cards/country-step-audience-card.tsx`
- Modify: `components/gifting/home/cards/country-step-profile-card.tsx`
- Modify: `components/gifting/home/cards/country-step-summary-card.tsx`
- Modify: `components/gifting/country-selector.tsx`

- [ ] **Step 1: Demote assistant/history panels so they stop competing with the main workflow**

In `components/gifting/home/sections/workflow-support-panels.tsx`:
- keep functionality unchanged
- reduce the visual weight of the logistics assistant, history, and favorites cards
- use `secondary` + `quiet` surfaces consistently instead of repeating stronger card treatments
- keep the assistant actionable, but make it clearly support the main path instead of competing with it

- [ ] **Step 2: Normalize gift-input card chrome and controls**

Refine the gift-input card files so they share one control language:
- uploader surface, helper pills, and file actions
- text input and textarea shells
- recognition result block and editable follow-up fields

A target pattern is:

```tsx
className={cn(homeSurface.inset, homeControl.input)}
```

Use `cn()` where conditional styling is required; avoid proliferating near-duplicate literal class strings.

- [ ] **Step 3: Normalize country/context cards and the country selector dropdown**

Refine the country-step cards and `components/gifting/country-selector.tsx` so:
- active states feel premium, not neon
- dropdown/search/list surfaces match the homepage system
- summary/confirmation panels feel quieter and more orderly
- audience chips, summary stats, and select fields all follow the same radius/border/spacing rhythm

- [ ] **Step 4: Run regression tests and lint the normalized card files**

Run:

```bash
pnpm exec jest --runInBand --runTestsByPath 'app/[locale]/page.test.tsx'
pnpm lint   'components/gifting/home/sections/workflow-support-panels.tsx'   'components/gifting/home/cards/gift-input-upload-panel.tsx'   'components/gifting/home/cards/gift-input-text-editor.tsx'   'components/gifting/home/cards/gift-input-recognition-panel.tsx'   'components/gifting/home/cards/country-step-selection-card.tsx'   'components/gifting/home/cards/country-step-scene-card.tsx'   'components/gifting/home/cards/country-step-audience-card.tsx'   'components/gifting/home/cards/country-step-profile-card.tsx'   'components/gifting/home/cards/country-step-summary-card.tsx'   'components/gifting/country-selector.tsx'
```

Expected:
- homepage tests stay green
- no lint warnings/errors on the touched control files

- [ ] **Step 5: Commit the control/support normalization**

```bash
git add   'components/gifting/home/sections/workflow-support-panels.tsx'   'components/gifting/home/cards/gift-input-upload-panel.tsx'   'components/gifting/home/cards/gift-input-text-editor.tsx'   'components/gifting/home/cards/gift-input-recognition-panel.tsx'   'components/gifting/home/cards/country-step-selection-card.tsx'   'components/gifting/home/cards/country-step-scene-card.tsx'   'components/gifting/home/cards/country-step-audience-card.tsx'   'components/gifting/home/cards/country-step-profile-card.tsx'   'components/gifting/home/cards/country-step-summary-card.tsx'   'components/gifting/country-selector.tsx'
git commit -m "refactor: normalize homepage controls and support surfaces"
```

---

### Task 5: Finish with premium feedback states and recommendation-first results polish

**Files:**
- Modify: `components/gifting/home/sections/page-feedback.tsx`
- Modify: `components/gifting/home/sections/results-section.tsx`
- Modify: `components/gifting/home/sections/results-summary-panel.tsx`
- Modify: `components/gifting/home/sections/results-recommendations-panel.tsx`
- Modify: `components/gifting/home/sections/results-detail-panels.tsx`
- Modify: `components/gifting/home/sections/results-enhancement-panels.tsx`
- Modify: `components/gifting/home/sections/results-section.test.tsx`

- [ ] **Step 1: Finalize the results test so it locks the recommendation-first memo structure**

If Task 1 only added basic order assertions, extend `components/gifting/home/sections/results-section.test.tsx` now so it also verifies:
- the advisor summary heading is present
- the reset action remains visible
- high-risk handling guidance remains visible
- recommendations still render before the shared supporting-analysis label

Keep the test self-contained with the inline `analysis` fixture already in the file.

- [ ] **Step 2: Retune `ResultsSection` and `ResultsSummaryPanel` so the advisor memo is unmistakably dominant**

In `components/gifting/home/sections/results-section.tsx` and `components/gifting/home/sections/results-summary-panel.tsx`:
- preserve summary → recommendations → supporting analysis order
- make the top memo surface visually stronger than all detail panels
- keep context chips readable but quiet
- keep the reset action available without letting it steal summary emphasis

- [ ] **Step 3: Demote dense results detail and enhancement panels while preserving caution clarity**

In `results-recommendations-panel.tsx`, `results-detail-panels.tsx`, and `results-enhancement-panels.tsx`:
- keep recommendation cards premium and scannable
- quiet dense evidence blocks so they support the advisor memo instead of competing with it
- keep high-risk, taboo, rescue, packaging, and greeting-card guidance readable and explicit
- ensure enhancement panels feel like advanced evidence, not equal top-level conclusions

- [ ] **Step 4: Restyle `page-feedback.tsx` into the same premium system and run full validation**

Update loading/error states so they feel calm and integrated, then run the full validation suite:

```bash
pnpm exec jest --runInBand --runTestsByPath 'app/[locale]/page.test.tsx' 'components/gifting/home/sections/results-section.test.tsx'
pnpm lint
pnpm build
```

Expected:
- both Jest files pass
- lint passes with no new warnings/errors
- build succeeds

- [ ] **Step 5: Commit the final results/feedback polish**

```bash
git add   'components/gifting/home/sections/page-feedback.tsx'   'components/gifting/home/sections/results-section.tsx'   'components/gifting/home/sections/results-summary-panel.tsx'   'components/gifting/home/sections/results-recommendations-panel.tsx'   'components/gifting/home/sections/results-detail-panels.tsx'   'components/gifting/home/sections/results-enhancement-panels.tsx'   'components/gifting/home/sections/results-section.test.tsx'
git commit -m "refactor: finish homepage advisor results and feedback polish"
```
