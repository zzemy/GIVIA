# Homepage Layout System Unification Design

## Summary

This redesign turns the homepage into one coherent product system instead of a collection of individually polished sections. The goal is to fix the specific layout, spacing, hierarchy, and responsiveness problems visible on wide screens and mobile while preserving the existing dark premium GIVIA identity.

The chosen direction is **Calm Global Advisory System**:
- one unified dark-luxury visual system
- restrained champagne highlights instead of heavy mixed gradients
- stronger layout discipline on wide screens
- cleaner single-column behavior on mobile
- recommendation-first reading order in the results experience

This spec is intentionally limited to homepage presentation, structure, and responsive behavior. It does not change the business logic of recognition, analysis, storage, or APIs.

## Scope

In scope:
- `app/[locale]/page.tsx`
- homepage hero, capability band, workflow shell, support lane, feedback, and results surfaces
- homepage visual tokens and shared layout rules
- spacing, typography, chip/badge treatment, gradient usage, and responsive behavior

Out of scope:
- backend or API changes
- analysis algorithm changes
- storage changes
- new product modules unrelated to homepage presentation

## Problems in the current homepage

### 1. Wide-screen composition is too loose
The page container is wide enough to feel premium, but several sections do not add inner width constraints. On large displays, this creates stretched text, weak focal points, and visible “dead air” between columns.

### 2. The hero area lacks a consistent structural rhythm
The hero uses a strong left card and a strong right card, but they do not share a clean baseline or density level. The left side grows too tall, the right side carries too much weight, and the section can feel top-heavy and under-composed.

### 3. Supporting panels compete with the primary workflow
The logistics/payment assistant is useful, but on desktop it can look like an isolated second destination rather than a subordinate support lane. This becomes more noticeable as the left workflow cards change height.

### 4. Surface styling is not yet fully systematized
Different cards use different combinations of glass, gradients, glow, and border strength. Each panel is acceptable in isolation, but together they weaken the feeling of one unified premium system.

### 5. Some fixed heights create awkward empty space
The impact-card area and parts of the hero rely on fixed heights and “fill available height” behavior. This causes avoidable blank zones, especially when the content itself is not tall enough to justify the container.

### 6. Mobile behavior still feels like a reduced desktop layout
Some sections keep desktop composition logic on small screens, especially the impact-card showcase and a few dense support panels. This makes mobile feel visually noisy rather than intentionally simplified.

### 7. Badge and pill components are not robust for Chinese text
Short labels such as `实时生效` can break awkwardly because the current pill sizing and wrapping rules are not strict enough for compact Chinese UI text.

### 8. Gradients are doing too much work
Several areas rely on layered gradients to create premium tone. Instead of feeling elegant, this can make transitions look foggy or mismatched when multiple gradient systems meet in the same viewport.

## Design goals

1. Build one coherent homepage visual system with clear layout rules.
2. Make wide screens feel intentional, dense enough, and properly balanced.
3. Remove empty-space failures caused by fixed heights or weak column composition.
4. Keep the dark premium brand identity, but simplify gradients and accent usage.
5. Make the workflow read as the obvious primary path.
6. Make results read as advisor judgment first and supporting evidence second.
7. Make mobile feel intentionally redesigned rather than merely compressed.
8. Prevent badge and chip text from breaking awkwardly in Chinese and English.

## Non-goals

- No feature expansion
- No major controller refactor beyond presentational boundary cleanup
- No redesign of copy strategy beyond minor wording needed to support hierarchy
- No experimentation with loud visual styles that break the brand tone

## Chosen direction: Calm Global Advisory System

### Positioning statement
GIVIA should feel like a composed cross-border gifting advisor with premium restraint. The homepage should communicate confidence through structure, order, and high-quality spacing rather than through visual intensity.

### Tone mix
- **Primary:** refined global advisory lounge
- **Secondary:** cross-cultural decision support
- **Accent only:** AI intelligence and system status

### Core visual principle
The page should derive its premium feeling from proportion, spacing, typography, and surface discipline. Decorative effects must support hierarchy, not replace it.

## Layout system

### Width tiers
The homepage should use three width behaviors:

- **Bleed layer**
  Used only for the sticky header and ambient background effects.

- **Feature width**
  Used for the hero, workflow shell, and results shell. This remains generous on desktop, but must include inner max-width constraints so content does not become visually loose on 1728px or 1920px displays.

- **Reading width**
  Used for dense text and subsection intros. Long copy should never span the full feature width.

### Grid rules
- The hero should move to a stable 12-column composition on large screens.
- The workflow should use a primary lane and a subordinate support lane with a controlled ratio.
- Result panels should prioritize one large lead surface followed by denser secondary rows.
- Tertiary surfaces such as history and saved lists should sit below the main workflow instead of competing beside it.

### Wide-screen behavior
- Reduce perceived emptiness by limiting effective line length and tightening column ratios.
- Avoid isolated floating cards by grouping related panels under one structural shell.
- Prefer content-driven height over large fixed-height containers unless the section truly requires a stage-like presentation.

## Visual system

## Palette
The color system should stay close to the current brand identity:
- **Base:** deep navy, midnight blue, graphite blue-black
- **Warm premium accent:** champagne / soft gold
- **Cool support accent:** restrained sky / cyan for intelligence and status
- **Neutrals:** slate, blue-gray, muted ivory text

### Usage rules
- Champagne is the primary premium signal.
- Cyan is reserved for information/status moments, not used as a second competing brand color.
- Strong gradients should be rare and structurally placed.
- Most surfaces should be solid or near-solid dark fills with restrained highlight treatment.

## Surface hierarchy

The homepage should use a disciplined four-level surface system.

### Tier 1: Lead surfaces
Used for:
- hero primary card
- major results summary

Characteristics:
- darkest and richest background treatment
- subtle warm edge lighting
- strongest spacing and shadow
- limited decorative gradient use

### Tier 2: Section surfaces
Used for:
- hero advisor card
- workflow shell
- recommendation and analysis panels

Characteristics:
- stable dark fill
- low-contrast border
- restrained inner highlight
- consistent radius family

### Tier 3: Utility surfaces
Used for:
- input groups
- helper summaries
- metrics tiles
- support blocks

Characteristics:
- quieter fill
- minimal glow
- tighter padding
- used for organization, not emphasis

### Tier 4: Chips and pills
Used for:
- badges
- tags
- status indicators
- compact counts

Characteristics:
- fixed min-height
- nowrap by default
- compact horizontal padding
- no awkward text collapse

## Gradient policy

The redesign should explicitly reduce gradient noise.

Allowed uses:
- one hero highlight wash
- one subtle highlight in lead result summary
- small accent lines or progress bars

Disallowed uses:
- multiple competing gradient directions inside one card
- fog-like overlays that reduce edge clarity
- strong gradient fills on tertiary utility surfaces

The premium effect should come from dark solid planes, measured contrast, and warm accent details.

## Typography and text behavior

### Headline rules
- The hero headline remains the strongest type moment.
- Section titles should be clear and weighty, but not oversized.
- Supporting copy should use shorter line lengths on large screens.

### Chinese typography rules
- Keep Chinese headings compact but open.
- Avoid excessive tracking on Chinese body text.
- Short UI labels should not wrap vertically or break across characters.

### Badge and pill rules
- Apply `white-space: nowrap` by default.
- Set minimum inline size for short-status pills.
- Reduce font size or horizontal padding only after nowrap is guaranteed.
- Avoid narrow circular containers for multi-character labels.

## Section-by-section design

## Section 1: Header and hero

### Structure
- Sticky header stays full width but becomes calmer and thinner.
- Hero becomes a true 12-column split:
  - left narrative zone: 7 columns
  - right advisor zone: 5 columns

### Required changes
- Reduce the visual competition between header controls and the hero headline.
- Remove excess vertical expansion from the left hero card.
- Let CTA and trust blocks sit closer to the headline instead of being pushed downward by fill-height behavior.
- Keep the right-hand advisor explanation and demo, but compress them into a more cohesive information stack.

### Intent
The first screen should feel complete and balanced on wide screens, with no large unexplained blank area below the left narrative card.

## Section 2: Impact / capability band

### Structure
This remains a credibility layer, but becomes calmer and more controlled.

### Required changes
- Lower the theatrical feel of the stacked cards on desktop.
- Reduce rotation, side displacement, and opacity extremes.
- On mobile, replace the desktop stack illusion with a single focused card and light pagination behavior.
- Keep the concept of multi-layer gifting judgment, but present it as a refined methodology band instead of a heavy carousel.

### Intent
This section should reinforce trust without becoming the visual center of the page.

## Section 3: Guided workflow shell

### Structure
The workflow stays the main action lane:
1. progress overview
2. gift input
3. country / audience context
4. analysis
5. support assistant
6. history / saved items

### Large-screen layout
- Primary lane: gift input, country step, analysis
- Support lane: logistics/payment assistant and concise contextual support
- Tertiary content: history and saved list below the shell

### Required changes
- Tighten the overall shell width and internal rhythm.
- Keep the assistant visibly subordinate to the main steps.
- Make the support lane feel attached to the workflow section instead of floating beside it.

### Intent
Users should immediately understand what is required versus optional.

## Section 4: Results

### Structure
Results should be reordered into three reading layers:

1. **Decision layer**
   advisor summary and overall judgment

2. **Action layer**
   recommended path, substitute direction, packaging/message execution

3. **Evidence layer**
   risk reasons, matched rules, metrics, enhancement evidence

### Required changes
- Make the summary surface the strongest element in the result area.
- Reduce the “many equal cards” feeling.
- Group detail panels more tightly by purpose.
- Keep warnings prominent, but style them like professional caution notes rather than alarm panels.

### Intent
The results experience should read like an executive gifting memo, not a scattered dashboard dump.

## Section 5: Mobile behavior

### Rules
- Header becomes denser and less tall.
- Hero stacks vertically with tighter spacing.
- Trust chips and pills may wrap to the next line, but not break inside a word or Chinese phrase.
- Workflow becomes a clean single-column stack.
- Support panels appear later and more compactly.
- Impact cards switch from layered showcase to focused single-card browsing.
- Results cards reduce simultaneous density and emphasize reading order.

### Intent
Mobile should feel intentionally authored, not like a squeezed desktop page.

## Component responsibilities

### Global system
- `app/globals.css`
  - global homepage typography safeguards
  - nowrap rules for compact pills
  - any reusable utility classes needed for balanced line length or text wrapping

- `components/gifting/home/home-design-tokens.ts`
  - homepage surface, text, control, accent, width, and spacing tokens
  - shared border/shadow/radius policy

### Homepage structure
- `app/[locale]/page.tsx`
  - section shell width behavior
  - top-level spacing rhythm

- `components/gifting/home/sections/home-hero-section.tsx`
  - hero grid rebuild
  - header calming
  - right-side advisor block compression
  - impact card layout adjustments

- `components/gifting/home/sections/workflow-panels.tsx`
  - primary/support lane structure
  - workflow shell spacing and ratios

- `components/gifting/home/sections/results-section.tsx`
  - recommendation-first result ordering
  - improved result shell grouping

### Supporting presentational surfaces
- `components/gifting/interactive-flow-demo.tsx`
  - calmer demo styling
  - better mobile density

- `components/gifting/home/sections/workflow-support-panels.tsx`
  - support-lane hierarchy and density
  - pill robustness

- `components/gifting/home/cards/country-step-summary-card.tsx`
  - fix pill wrapping and compact utility card rhythm

- `components/gifting/home/sections/results-summary-panel.tsx`
  - strengthen lead summary surface

- `components/gifting/home/sections/results-detail-panels.tsx`
  - regroup dense analysis cards
  - normalize card hierarchy and progress-meter styling

- `components/gifting/home/sections/results-enhancement-panels.tsx`
  - reduce visual fragmentation from enhancement panels

## Validation criteria

### Wide-screen validation
- At 1440px, 1728px, and 1920px widths, no section should appear visually under-filled.
- Text blocks should maintain readable line lengths.
- The support lane should not appear detached from the workflow.
- The hero should not leave a large dead zone caused by mismatched card heights.

### Desktop validation
- Hero, workflow, and results should feel like one family of surfaces.
- Gradients should feel rare, intentional, and consistent.
- Card borders, radii, and shadow depth should follow one system.

### Mobile validation
- At 375px, 390px, and 430px widths, no pills or badges should break inside Chinese text.
- No horizontal overflow.
- The impact-card experience should remain clean and legible.
- Support panels should not overwhelm the main path.

### Accessibility and usability
- Preserve adequate text contrast on all dark surfaces.
- Keep controls obviously interactive.
- Maintain clear focus states.
- Preserve existing workflow order and primary CTA clarity.

## Implementation notes

- Favor content-driven height over large fixed-height staging whenever possible.
- Prefer system tokens over one-off per-panel styling.
- Preserve current product meaning and copy intent unless hierarchy requires a small wording adjustment.
- Keep motion restrained and supportive, especially after reducing gradient intensity.

## Open questions resolved during brainstorming

- The brand direction should remain fixed and unified rather than visually reinvented.
- The premium feel should come from harmony and restraint, not from heavier decoration.
- Gradient use should be reduced, not expanded.
- The redesign must explicitly solve wide-screen imbalance and mobile awkwardness, not just add visual polish.
