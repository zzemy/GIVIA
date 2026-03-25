# Home Page Componentization Design

**Date:** 2026-03-25
**Scope:** Continue componentizing the localized home page so `app/[locale]/page.tsx` becomes a thin assembler and oversized UI modules are split into smaller React units.

## Goal
Reduce the responsibility of `app/[locale]/page.tsx` and other oversized home-page files by separating page assembly, stateful workflow control, and large visual sections into smaller components/hooks with clear interfaces.

## Recommended approach
Use a page-level controller hook plus section-level presentational components.

- `app/[locale]/page.tsx` keeps routing, top-level composition, and almost no inline business logic.
- A dedicated controller hook owns page state, effects, derived flags, and action handlers.
- Large visual blocks become section components so JSX is composed from named units.
- `StepGiftInput` and `StepCountry` are further split by responsibility rather than by technical layer.

## Component boundaries
### Page assembler
`app/[locale]/page.tsx`
- Read locale from route
- Call controller hook
- Render background, hero, workflow, feedback, history, results

### Controller
`components/gifting/home/use-home-page-controller.ts`
- Own workflow state, recognition state, analysis state, logistics assistant state
- Own timers and UI toggles
- Expose grouped props for section components and action handlers

### Page sections
- `home-background.tsx`: decorative background only
- `workflow-panels.tsx`: compose gift input, analysis, country, assistant, history
- `page-feedback.tsx`: loading and error display only

### Gift-input subcomponents
Split `step-gift-input.tsx` into focused blocks:
- upload surface/actions
- manual text editor
- recognition result editor
- keep `step-gift-input.tsx` as orchestration shell

### Country-step subcomponents
Split `step-country.tsx` into focused blocks:
- country selection card
- scene template card
- audience notes card
- advanced profile card
- confirmation summary card

## Data flow
- Route locale enters `page.tsx`
- Controller derives locale-bound translator and workflow state
- Section components receive already-shaped props and emit intent callbacks only
- Subcomponents remain mostly stateless and presentation-focused

## Error handling
- Network/action errors stay centralized in controller state
- `PageFeedback` renders transient loading/error UI from controller outputs
- Section components do not duplicate async state ownership

## Testing impact
- Existing page behavior should remain unchanged
- Validation should focus on TypeScript and lint stability
- Future tests become easier because handlers and UI shells are more isolated
