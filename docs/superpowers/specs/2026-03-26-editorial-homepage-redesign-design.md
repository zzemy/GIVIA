# Editorial Homepage And Gifting Flow Redesign

## Summary

This redesign replaces the current fragmented homepage and gifting-flow presentation with one coherent **light editorial product system**. The goal is not only to fix visible layout issues, but to make both `/${locale}` and `/${locale}/gifting` feel like the same premium cross-cultural gifting product.

The chosen direction is **Light Editorial Advisory**:
- light, airy, warm-neutral surfaces instead of dark luxury glass
- brand storytelling first, product entry second
- abstract product visualizations instead of external photography
- a guided, advisor-like flow instead of a tool-heavy dashboard feel

This spec covers route structure, section hierarchy, shared visual tokens, responsive behavior, state styling, and validation expectations. It intentionally preserves the existing recognition, analysis, storage, and API logic.

## Scope

In scope:
- `app/[locale]/page.tsx`
- `app/[locale]/gifting/page.tsx`
- shared presentational components and layout shells used by those routes
- `components/gifting/home/home-design-tokens.ts`
- homepage and gifting-flow hierarchy, spacing, typography, motion, and responsive rules
- alignment of route structure with the current controller and test expectations

Out of scope:
- API contract changes
- AI recognition or cultural analysis logic changes
- storage schema changes
- new locales beyond `zh` and `en`
- new product capabilities unrelated to the redesigned presentation

## Problems In The Current Experience

### 1. The localized homepage has regressed into a disconnected simplified page
`app/[locale]/page.tsx` no longer uses the more complete homepage architecture already present in the repository. It renders a one-screen hero that is visually separate from the established gifting workflow and does not match the existing test expectations.

### 2. Homepage and gifting flow do not feel like one product
The landing page currently reads like a lightweight marketing page while the gifting flow reads like a separate multi-step form shell. The shift between the two is too abrupt.

### 3. Visual hierarchy is unstable
The current light homepage uses strong imagery, floating blocks, and large empty areas without enough structural discipline. The result is visually attractive at a glance, but weak in rhythm, alignment, and reading order.

### 4. External photography makes the look less controlled
The current flow and homepage both rely on remote photography. This creates inconsistent tone, unpredictable loading behavior, and a mismatch with the product-first visual system the redesign needs.

### 5. The gifting flow feels functional, but not editorial
The current `/${locale}/gifting` experience has solid logic and complete interactions, but it still reads as a form stack with decorative side imagery rather than a guided premium advisory experience.

### 6. Existing tests and route intent no longer match rendered UI
`app/[locale]/page.test.tsx` expects a richer homepage with hero, guided workflow, and enhancement controls. The current implementation does not satisfy that intent, which is a signal that the route structure drifted away from the designed product shape.

## Design Goals

1. Re-establish `/${locale}` as the true product homepage instead of a detached splash screen.
2. Make `/${locale}` and `/${locale}/gifting` feel like one coherent editorial product system.
3. Preserve the existing analysis workflow and controller logic while redesigning the shells and surfaces around them.
4. Replace external photography with stable, branded, abstract visual treatments.
5. Improve layout discipline, spacing, and focal hierarchy on both wide screens and mobile.
6. Make the product feel like a cross-cultural gifting advisor, not merely a utility form.
7. Restore route structure that aligns with current product expectations and tests.
8. Keep the experience strong in both Chinese and English.

## Non-Goals

- No rethinking of the three-step analysis sequence itself.
- No controller rewrite unless a small presentational cleanup is required.
- No unrelated feature additions.
- No visual experimentation that breaks usability, accessibility, or loading stability.

## Chosen Direction: Light Editorial Advisory

### Positioning statement
GIVIA should feel like a calm, refined, internationally aware gifting advisor. The redesign should communicate trust through proportion, typography, and clarity rather than through heavy effects or loud dashboards.

### Tone mix
- **Primary:** editorial brand storytelling
- **Secondary:** premium product guidance
- **Accent only:** AI analysis and system intelligence

### Core visual principle
Each viewport should have one dominant message and one obvious next action. Decorative surfaces must support narrative flow instead of competing with it.

## Information Architecture

## Route 1: `/${locale}` homepage

The homepage becomes a complete brand-to-product landing journey with five ordered sections.

### Section 1: Editorial hero

Required structure:
- compact sticky header with logo, locale switch, and primary CTA
- left narrative zone with headline, short supporting copy, primary CTA, secondary CTA
- right abstract product composition showing gifting object, global context, and recommendation signals

Intent:
- communicate brand taste first
- explain the product promise quickly
- give an immediate path into the gifting flow without leading with a large form

### Section 2: Capability proof band

Required structure:
- three concise capability cards
- one short section intro
- emphasis on how GIVIA thinks rather than raw features

Capability themes:
- cultural interpretation of the gift
- taboo and risk detection
- delivery, etiquette, and recipient-fit guidance

Intent:
- build trust before the user enters the workflow

### Section 3: Guided process preview

Required structure:
- editorial introduction to the three-step flow
- visual step sequence preview
- direct CTA into `/${locale}/gifting`

Step framing:
1. identify or describe the gift
2. add country and recipient context
3. receive cultural guidance and recommendation output

Intent:
- make the product feel structured and human-guided
- preview the real workflow without embedding the full interactive stack into the homepage hero

### Section 4: Result preview

Required structure:
- summary card that previews the final analysis outcome
- smaller supporting cards for warnings, packaging tone, and greeting guidance

Intent:
- show what the user gets at the end
- make the recommendation output feel tangible before the user commits to the flow

### Section 5: Footer / trust close

Required structure:
- concise brand statement
- utility links or lightweight footer actions
- locale continuity and product positioning

Intent:
- give the page a clean landing instead of an abrupt stop

## Route 2: `/${locale}/gifting`

The gifting route keeps the existing analysis experience, but the page shell changes to a unified editorial two-zone composition.

### Desktop structure

- **Left narrative rail**
  - fixed or sticky editorial guidance surface
  - current step framing
  - short emotional / advisory copy
  - progress markers and atmosphere

- **Right workspace**
  - actual workflow cards
  - result output
  - loading / error states

### Mobile structure

- top narrative strip replaces the desktop left rail
- progress and context move above the interactive workspace
- workflow cards remain in a single readable column
- result content follows the same visual language without side-by-side assumptions

### Intent

The gifting route should feel like a premium guided session. The left rail provides orientation and emotional pacing, while the right side remains the practical workspace.

## Component And Boundary Strategy

### Preserve the controller as the business-logic source of truth

`useHomePageController` remains responsible for:
- locale and translation selection
- workflow state
- image/text recognition state
- country, audience, and scenario context
- analysis requests and results
- history and favorites
- logistics assistant state

The redesign should not move visual shell state into the controller unless a small presentational state is clearly required.

### Homepage components

The homepage should be rebuilt from presentational sections such as:
- `BrandHero`
- `CapabilityBand`
- `ProcessPreview`
- `ResultPreview`
- `HomeFooter`

These sections should consume stable props and remain presentation-focused.

### Gifting route shells

The gifting route should introduce editorial wrappers such as:
- `GiftingNarrativeRail`
- `GiftingWorkspace`

Existing business-oriented sections should be reused where possible:
- `StepGiftInput`
- `StepCountry`
- `StepAnalysis`
- `ResultsSection`

### Shared token source

`components/gifting/home/home-design-tokens.ts` becomes the shared source for:
- color tokens
- surface tiers
- button styles
- control styles
- text hierarchy
- layout widths and spacing rules

The token system must serve both the homepage and gifting route so they do not diverge again.

## Visual Language System

## Palette

The redesign should move to a controlled light editorial palette:
- **base background:** warm off-white / paper white
- **secondary background:** mist gray / pale blue-gray
- **primary ink:** charcoal / soft black
- **accent:** restrained cobalt / ink blue
- **support neutrals:** stone, fog, desaturated sand

Usage rules:
- no purple-led palette
- no heavy dark-glass system as the page default
- accent color reserved for CTAs, active states, and important signals
- error and warning states remain clear, but harmonized with the editorial palette

## Typography

Typography should create a clear editorial contrast:
- display and major headings use a refined serif family already available in the project
- body copy and controls use the existing sans family
- Chinese should keep readable density and avoid decorative overtracking
- bilingual layouts should preserve rhythm without feeling like two unrelated designs

## Surface hierarchy

The new system should use three main tiers.

### Tier 1: Lead cards
Used for:
- homepage hero narrative block
- gifting route narrative rail
- results summary anchor

Characteristics:
- brightest and most spacious surfaces
- strongest shadow depth, but still soft
- restrained gradients only where needed

### Tier 2: Section cards
Used for:
- workflow wrappers
- process preview blocks
- capability cards
- result panels

Characteristics:
- subtle border
- layered but calm shadow
- consistent corner radius family

### Tier 3: Utility surfaces
Used for:
- inputs
- helper panels
- status chips
- smaller evidence cards

Characteristics:
- quiet contrast
- minimal ornament
- strong readability

## Motion

Motion should be sparse and purposeful:
- soft entrance stagger on first paint
- subtle floating or drift on hero abstract cards
- restrained hover movement on buttons and cards
- no exaggerated perpetual motion
- no transitions that make the product feel playful or unstable

## Asset Strategy

The redesigned experience should prefer:
- local SVG assets already in `public/brand/`
- CSS-composed abstract product cards
- branded diagram-like visualizations

The redesigned experience should avoid:
- remote Unsplash-style photography
- heavy imagery that changes the tone section by section
- large media assets that weaken performance or visual consistency

## Section-Level Design Requirements

## Homepage hero requirements

- strong headline with large editorial measure
- short paragraph with controlled line length
- one primary CTA and one secondary CTA
- right-side abstract composition that communicates:
  - a gift artifact
  - a destination or cultural node
  - a confidence / match / risk signal
- no massive blank right-side voids on wide screens
- no equal competition between every floating element

## Capability band requirements

- exactly three top-level proof cards unless implementation reveals a compelling reason for a fourth
- clear scan path on mobile and desktop
- product language should stay human and advisory, not overly technical

## Process preview requirements

- make the journey obvious before users enter the workflow page
- visually connect previewed steps to the actual gifting route
- preserve the real order of actions already used by the product

## Gifting route shell requirements

- the editorial rail must explain where the user is and what this step accomplishes
- the interactive workspace remains the primary action area
- step cards should feel lighter, cleaner, and less dashboard-like than today
- support panels must remain visually subordinate to the primary workflow

## Result experience requirements

- recommendation-first ordering
- summary judgment appears before dense evidence
- warnings remain prominent, but not alarmist
- advanced enhancement content remains available without dominating the first read

## Responsive Behavior

### Homepage

- hero collapses into a narrative-first single column on smaller screens
- abstract visual composition becomes a compact stacked block below the copy
- capability cards and result preview cards become clean vertical sequences
- CTA cluster remains visible without forcing extra scrolling before the primary action

### Gifting route

- desktop two-zone composition becomes a top narrative strip plus single-column workspace on mobile
- no desktop-only sticky assumptions should break smaller layouts
- dense cards should reduce padding and visual ornament before reducing readability

## State Design

All core states should be visually unified across both routes:
- empty state
- image selected state
- recognition in progress
- analysis in progress
- analysis complete
- error / retry surfaces

Requirements:
- one consistent feedback language
- loading feels composed and premium, not raw utility
- errors remain accessible, readable, and actionable

## Accessibility

The redesign must preserve or improve:
- semantic heading order
- button and link semantics
- focus visibility
- keyboard navigation
- readable contrast for text and controls
- motion restraint for users sensitive to animation

Editorial styling must not hide structure or clarity.

## Testing And Validation

Implementation should validate at least the following:

### Route behavior
- `app/[locale]/page.tsx` again renders the intended richer homepage experience
- locale switching continues to work
- homepage CTAs correctly navigate or scroll
- gifting route remains reachable and coherent

### Workflow integrity
- gift input, country selection, and analysis remain in the intended order
- result rendering conditions remain unchanged in meaning
- advanced enhancement surfaces still appear where expected

### Visual / structural checks
- no dependency on remote hero photography
- mobile layout remains readable and deliberate
- desktop layout maintains one clear focal point per section

### Test alignment
- existing homepage tests should either pass again through structural restoration or be updated to reflect the approved new section names while preserving the same user-facing intent
- any test updates should target stable product behavior, not fragile DOM trivia

## Implementation Notes

- Prefer rebuilding `app/[locale]/page.tsx` on top of the richer homepage architecture already present in the repository rather than extending the current simplified hero page.
- Reuse existing workflow components where possible to reduce logic risk.
- Keep the redesign focused on the two routes and their shared presentation system.
- If small component extractions are needed to keep files understandable, they are acceptable as part of the redesign.

## Risks And Mitigations

### Risk: visual redesign accidentally turns into business-logic churn
Mitigation:
- keep controller boundaries intact
- avoid changing API-facing behavior

### Risk: homepage and gifting route diverge again
Mitigation:
- centralize tokens and shared shell language
- keep route-specific differences structural, not stylistic

### Risk: editorial styling harms usability
Mitigation:
- preserve clear hierarchy, readable line length, and strong control affordances
- validate mobile and keyboard usability

### Risk: implementation only “skins” the current structure
Mitigation:
- restore a full homepage information architecture
- redesign the gifting route shell, not just colors and shadows

## Acceptance Criteria

The redesign is successful when all of the following are true:

1. `/${locale}` feels like a complete premium homepage, not a detached splash hero.
2. `/${locale}` and `/${locale}/gifting` clearly belong to the same product system.
3. The analysis flow logic still behaves the same from the user’s perspective.
4. The experience no longer depends on external photography for its primary look.
5. Mobile and desktop layouts both feel intentional rather than compressed or stretched.
6. The workflow and results remain easy to understand despite the stronger editorial presentation.
7. Tests and route expectations are brought back into alignment with the actual product shape.
