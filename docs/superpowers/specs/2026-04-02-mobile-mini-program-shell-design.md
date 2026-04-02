# Mobile Mini-Program Shell for Gifting Flow

## Context

The product started as an editorial gifting web app with a desktop-first visual language. The user later clarified that mobile should not be a separate project or a literal mini-program rewrite. Instead, the same codebase should present a different mobile shell that feels closer to a lightweight app:

- desktop remains editorial and spacious
- mobile feels compact, guided, and native
- the business logic stays shared across devices

This spec documents the mobile shell that was implemented for that direction.

## Goals

- Preserve the existing desktop experience.
- Make mobile feel like a distinct product surface instead of a scaled-down web page.
- Keep the same gifting workflow and data flow on both devices.
- Reduce the visual and interaction density on phones.
- Make the home page, workflow steps, and final report read as one mobile journey.

## Non-Goals

- No separate mini-program codebase.
- No rewrite of gifting business logic.
- No redesign of the analysis model or API contract.
- No attempt to change desktop behavior beyond structural sharing.

## Architecture

### Route Layer

The localized route layout wraps all `[locale]` pages in a mobile shell component.

Responsibilities:

- provide a device-friendly bottom navigation on small screens
- preserve the existing page tree and route structure
- keep desktop navigation and composition unchanged

### Home Page Shell

The localized home page uses two visual treatments:

- mobile: a card-first landing surface with a strong primary CTA, compact feature tiles, and image chips
- desktop: the existing editorial split layout with large typography and image-led composition

The two surfaces share the same route and locale logic.

### Gifting Workflow Shell

The gifting route is also split into mobile and desktop treatments:

- mobile: a narrower, denser, app-like shell with stronger vertical progression
- desktop: the existing editorial workflow layout

The workflow state machine is unchanged. Only the shell, spacing, and visual rhythm differ.

## Components

### `MobileAppShell`

Location: `components/gifting/mobile/mobile-app-shell.tsx`

Purpose:

- render a mobile-only bottom nav
- keep the route affordance consistent across the home page and gifting flow
- provide a stable visual frame for the mobile experience

Dependencies:

- `usePathname()` for active state
- locale-aware route construction

### Mobile Home Surface

Location: `app/[locale]/page.tsx`

Purpose:

- present a compact landing screen on phones
- compress the editorial message into a single hero card
- expose the main CTA and supporting feature tiles without the desktop split layout

### Mobile Gifting Surface

Location: `app/[locale]/gifting/page.tsx`

Purpose:

- keep the same step logic
- render step 1 through step 5 in a phone-friendly shell
- maintain step progression, loading states, and final report flow

### Shared Step Components

Locations:

- `components/gifting/home/sections/step-gift-input.tsx`
- `components/gifting/home/sections/step-country.tsx`
- `components/gifting/home/sections/step-analysis.tsx`
- `components/gifting/home/sections/step-country-parts.tsx`
- `components/gifting/home/sections/results-section.tsx`

Purpose:

- keep the mobile interaction density consistent
- reduce padding, card radius, and column pressure on small screens
- preserve the same information hierarchy across steps

## Mobile Interaction Model

### Navigation

Mobile uses a simple bottom nav with three roles:

- home
- start journey
- workflow

This keeps the core entry points visible without requiring a desktop-style header navigation.

### Home Experience

The mobile home page is intentionally shorter and more directive than desktop:

- one hero card communicates the product
- a small set of capability tiles explains the workflow
- a compact image strip gives atmosphere without dominating the viewport

### Workflow Experience

The mobile workflow emphasizes vertical progression:

- step cards are more compact
- shared controls are denser and easier to scan
- the final report is presented as a stacked, sectioned dossier rather than a broad report canvas

## Data Flow

The data flow remains unchanged:

1. the user enters the home page
2. the user starts the gifting journey
3. the workflow controller manages step state and result generation
4. the final report uses the same analysis data as desktop

Only the shell and layout around the data change on mobile.

## Responsive Rules

- Desktop keeps the editorial split layout.
- Mobile uses a single-column, card-first layout.
- Shared components should assume tighter horizontal space on phones.
- Important actions should remain visible without requiring wide-screen grouping.
- Final report sections should collapse earlier on mobile than on desktop.

## Error Handling

- The existing workflow error states remain in place.
- Mobile should not introduce new failure modes beyond layout truncation.
- Any failure to generate the report still falls back to the existing retry surface.

## Testing Strategy

The implementation should be validated by:

- TypeScript compilation
- ESLint
- manual mobile viewport checks for home, workflow, and results

Recommended viewport coverage:

- narrow phone portrait
- modern phone portrait
- small tablet
- desktop

## Risks

- Over-tightening the mobile layout could make the report harder to scan.
- Bottom navigation may compete with the browser's own controls on very short screens.
- Shared components must stay synchronized so mobile polish does not drift from desktop behavior.

## Current Status

This design has already been implemented in the codebase.

The current system now uses:

- a shared locale shell for mobile navigation
- a mobile-first home surface
- a mobile-first gifting workflow surface
- denser shared components for the step flow and final report

## Next Iteration Ideas

- unify the transition between home and the gifting flow on mobile
- add more app-like back behavior for step navigation
- tune final report readability on very small screens