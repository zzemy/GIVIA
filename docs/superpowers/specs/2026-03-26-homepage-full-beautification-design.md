# Homepage Full Beautification Design

## Summary

This redesign upgrades the homepage into a cohesive **international concierge-style gifting advisor** experience. The goal is not just to make the page prettier, but to make it feel calmer, more premium, more orderly, and easier to use from the first screen to the final recommendation.

The chosen direction is **International Concierge Lounge**:
- premium brand presence first
- gifting-advisor clarity second
- AI/system cues only as restrained support

This spec covers homepage hierarchy, visual-system unification, section-by-section redesign, interaction refinements, responsive behavior, accessibility, and validation criteria. It is intentionally focused on the homepage route and its immediate workflow/result surfaces, not backend logic or unrelated product changes.

## Scope

In scope:
- `app/[locale]/page.tsx`
- homepage hero, workflow, support panels, feedback states, and result surfaces
- shared homepage design tokens and presentational structure
- UI hierarchy, spacing, typography, motion, and control styling tied to the homepage

Out of scope:
- API contract changes
- AI recognition/analysis business logic changes
- storage schema changes
- new product capabilities unrelated to homepage presentation and flow clarity

## Problems in the current homepage

### 1. The page already looks polished, but not fully unified
The current homepage has many individually strong sections, but they do not always feel like they belong to one premium system. The hero reads as luxury advisor, the workflow reads as functional dashboard, and some result surfaces read as risk console.

### 2. Too many blocks compete with similar visual weight
Large rounded cards, glowing borders, overlays, and accent treatments appear in many places with comparable intensity. This weakens hierarchy and makes it harder to tell what matters most first.

### 3. The workflow order is functionally complete but visually fragmented
Users can complete the journey, but the main task path is not as obvious as it should be. Supporting tools, history, enhancement settings, and result details sometimes compete with the core gifting-decision path.

### 4. Controls and panels are not fully systematized
Buttons, select inputs, helper panels, badges, and dense detail cards are all good enough on their own, but their border strength, background depth, spacing rhythm, and emphasis levels are not yet fully normalized.

### 5. Results still feel more like structured output than advisor guidance
The result area contains strong detail, but the experience should read as: “Here is the advisor’s judgment” before “Here are all the metrics and evidence.”

### 6. Loading and feedback states feel more utility-first than premium
The current progress and error panels work, but they should feel more integrated with the calm, premium homepage system.

## Design goals

1. Create one obvious focal point in the first viewport.
2. Make the homepage feel like a premium cross-border gifting advisor rather than a technical dashboard.
3. Establish a reliable primary / secondary / tertiary visual hierarchy across all panels.
4. Make the workflow read as one guided concierge journey.
5. Improve page orderliness through consistent spacing, card hierarchy, control styling, and calmer motion.
6. Reframe results as recommendation-first advisor output.
7. Preserve the existing functional journey to keep implementation focused and low-risk.
8. Maintain a balanced experience in both Chinese and English.

## Non-goals

- No redesign of the AI analysis logic itself.
- No major refactor of controller/data-fetching behavior unless presentation work clearly requires a small boundary cleanup.
- No new analytics, billing, or unrelated product modules.
- No expansion of locale scope beyond the currently supported experience.

## Chosen direction: International Concierge Lounge

### Positioning statement
GIVIA should feel like a premium advisory product for culturally appropriate gifting decisions across markets: calm, trustworthy, polished, and intentional.

### Tone mix
- **Primary:** international luxury concierge / private advisory lounge
- **Secondary:** cultural judgment and recipient-fit expertise
- **Accent only:** AI intelligence, recognition, and system precision

### Core visual principle
Every major viewport should have one clearly dominant action or conclusion. If two or more blocks feel equally important at first glance, the section is visually wrong.

## Information architecture

## Section 1: Header and hero

### Required structure
The hero remains a split layout, but with stricter hierarchy:
- **Left primary zone:** one brand promise, one supporting paragraph, one dominant CTA, one supporting CTA, compact trust proof
- **Right advisor zone:** a quieter credibility stack that previews how GIVIA reasons about gifting decisions

### What changes
- Keep the sticky header, but reduce its competition with the hero message.
- Keep locale switching, but style it as quiet utility rather than a co-headline element.
- Reduce the amount of equally strong hero chrome, especially chips and decorative emphasis bands.
- Preserve the interactive preview, but make it feel like a refined advisor console instead of a second competing hero.

### Hero content behavior
The hero should answer one question immediately: **why should I trust this product to guide a cross-cultural gift decision?**
Feature enumeration can appear later in the page.

## Section 2: Capability / trust layer

### Required structure
The current “decision layers” area remains, but shifts from a loud carousel-like showcase into a calmer method-and-trust band.

### What changes
- Keep the idea of multi-layer judgment.
- Reduce the sense that this section is competing with the workflow for attention.
- Emphasize “how the advisor thinks” rather than “look at many moving cards.”
- Make controls and indicators calmer and less visually dominant.

### Intent
This section should reinforce credibility and brand sophistication, not interrupt the user’s transition into the workflow.

## Section 3: Guided workflow

### Required structure
The homepage workflow becomes a true **Guided Concierge Workflow** with clear order:
1. workflow progress overview
2. gift input
3. country / scene / audience context
4. analysis and optional advanced add-ons
5. assistant and secondary support
6. history / favorites as tertiary follow-up surfaces

### Layout intent
On large screens, the workflow should establish a strong primary lane and a clearly subordinate support lane.

#### Primary lane
- `StepGiftInput`
- `StepCountry`
- `StepAnalysis`

#### Support lane
- logistics/payment assistant
- brief helper/support context only

#### Tertiary area below
- history
- favorite gift list

### What changes
- Move the country/context step into the main guided path so the sequence reads in the same order users think.
- Make the analysis step feel like the culmination of the guided path rather than just another card.
- Lower the visual pressure of auxiliary tools so users never mistake them for required primary actions.
- Make the workflow shell breathe more through larger section spacing and clearer column ratios.

## Section 4: Feedback states

### Required structure
Loading, in-progress, and error states remain inline with the homepage, but should feel like part of the same premium advisory system.

### What changes
- Loading copy should feel reassuring, composed, and refined.
- Progress indicators should be calmer and more premium.
- Error panels should remain visible and accessible, but harmonize with the dark-luxury system.

### Intent
State feedback should support trust and perceived product quality, not feel bolted on.

## Section 5: Results experience

### Required structure
Results are reordered into a recommendation-first advisor memo:
1. **advisor summary / judgment**
2. **recommended path or safer alternatives**
3. **supporting analysis details**
4. **enhancement / advanced evidence panels**
5. **cautions, packaging, greeting-card, and execution details**

### Result tone
Results should feel like a professional gifting recommendation sheet: clear judgment first, evidence second, dense detail last.

### What changes
- The summary block becomes the clear visual anchor.
- Recommendation cards become more coherent with the premium system instead of feeling like standalone option tiles.
- Metrics remain available, but no longer dominate the first impression.
- High-risk and taboo warnings stay prominent, but read like professional cautions rather than alarm-console outputs.

## Visual language system

## Palette
The visual system should use this balance:
- **Base:** midnight navy, deep blue-black, graphite
- **Premium highlight:** champagne, warm gold tint, ivory warmth
- **Secondary intelligence accent:** restrained sky / cyan signal
- **Support neutrals:** slate, mist, desaturated blue-gray

### Usage rules
- Warm premium accents are for hero emphasis, primary CTAs, premium labels, and top-level conclusions.
- Cyan stays available for intelligence/system cues, but should not dominate most panels.
- Avoid mixing multiple bright accent modes at equal strength in the same viewport.

## Surface hierarchy

The homepage should use a strict three-tier surface system.

### Tier 1: primary surfaces
Used for:
- hero lead card
- major result summary
- core conclusion surfaces

Characteristics:
- deepest atmosphere
- richest gradient layering
- strongest but still controlled shadow
- warm highlight bias
- largest internal spacing

### Tier 2: secondary surfaces
Used for:
- workflow shell
- recommendation panels
- major support cards

Characteristics:
- calmer gradient or translucent fill
- lower contrast borders
- less glow than primary surfaces
- clear separation from tertiary content

### Tier 3: quiet surfaces
Used for:
- input groups
- meta panels
- status labels
- supporting evidence blocks
- helper summaries

Characteristics:
- minimal glow
- restrained fill
- consistent inner padding
- used to organize information without shouting

## Typography and spacing

### Typography intent
Typography should feel premium and deliberate while staying practical for bilingual product use.

### Rules
- Hero headline remains the strongest type moment on the page.
- Section titles should clearly outrank labels and helper copy.
- Micro-labels may use uppercase tracking, but only where they provide structural value.
- Chinese typography should feel confident and open, not cramped.
- English helper copy should keep elegance without becoming too airy or scattered.

### Spacing rhythm
- Increase separation between major sections.
- Normalize panel padding so similar surfaces feel truly related.
- Reduce crowded badge bands and redundant spacing patterns.
- Preserve enough density for utility, but bias toward calm readability.

## Controls and component language

### Buttons
- The primary CTA should feel unmistakably dominant.
- Secondary buttons should remain polished but clearly subordinate.
- Button treatment should feel like one system across hero, workflow, and results.

### Inputs and selectors
- Inputs, selects, toggles, and helper selectors should share one control language.
- Focus states must feel premium and visible, not default-browser or overly neon.
- Dense option groups should look curated and evenly spaced.

### Chips, badges, and helper blocks
- Reduce the number of chips that look equally actionable.
- Keep chips where they improve comprehension, not as decoration.
- Quiet metadata should visually recede behind the main action or conclusion.

## Motion and interaction

### Motion style
Motion should feel smooth, premium, and restrained.

### Rules
- Keep subtle entrance motion for major blocks.
- Reduce hover lift/glow intensity where many cards currently feel equally animated.
- Keep delightful interaction feedback, but remove motion that competes with reading order.
- Preserve instructional motion only when it improves comprehension.

## Background and texture

The current global/world-map cue remains, but becomes quieter.

### Rules
- Lower grid visibility.
- Lower background map opacity.
- Let foreground surfaces establish hierarchy.
- Keep enough ambient intelligence to communicate cross-border scope without slipping back into dashboard aesthetics.

## Responsive behavior

### Desktop
- Hero keeps the split layout with a dominant message zone.
- Workflow clearly reads as primary lane + support lane.
- Result summary anchors the top of the results.

### Tablet
- Workflow may reduce to stacked groups, but the main journey must stay visually first.
- Secondary and tertiary panels should drop below core action regions without confusion.

### Mobile
- Hero becomes a clean vertical narrative: promise → support text → primary CTA → credibility summary.
- Decorative chips and less essential detail should compress or reduce.
- Workflow should read in real task order without side-by-side ambiguity.
- Result summary and recommended path must appear before dense supporting evidence.

## Accessibility requirements

- Preserve sufficient contrast across dark, gold-tinted, and cyan-accent surfaces.
- Keep visible focus states on all interactive controls.
- Do not communicate critical meaning through color alone.
- Maintain readable text size and spacing on smaller screens.
- Ensure hierarchy changes still make sense to keyboard and screen-reader users.

## Component and code organization impact

### Primary files expected to change
- `components/gifting/home/home-design-tokens.ts`
- `components/gifting/home/sections/home-hero-section.tsx`
- `components/gifting/home/sections/home-background.tsx`
- `components/gifting/home/sections/workflow-panels.tsx`
- `components/gifting/home/sections/workflow-support-panels.tsx`
- `components/gifting/home/sections/page-feedback.tsx`
- `components/gifting/home/sections/results-section.tsx`
- `components/gifting/home/sections/results-summary-panel.tsx`
- `components/gifting/home/sections/results-recommendations-panel.tsx`
- `components/gifting/home/sections/results-detail-panels.tsx`
- step/card components whose local styles are inconsistent with the unified surface system

### Refactoring direction
- Keep controller/data hooks stable where possible.
- Prefer extracting shared surface/control helpers over repeating one-off class changes.
- Prefer presentational cleanup and structure normalization over new business logic.
- If any existing section file grows too large during redesign, split out focused presentational subcomponents.

## Validation requirements

Implementation is successful only if all of the following are true:

1. The first viewport has one obvious focal point within 2–3 seconds.
2. The homepage reads as a premium gifting advisor, not a technical dashboard.
3. Primary, secondary, and tertiary surfaces are visually distinct across the full page.
4. The workflow sequence is easier to scan and feels like one guided journey.
5. Assistant/history/support modules no longer compete with the main task path.
6. Results clearly present the advisor judgment before dense supporting detail.
7. Buttons, inputs, and helper panels feel like one system.
8. Desktop, tablet, and mobile all preserve hierarchy and calmness.
9. Existing core functionality remains intact.

## Testing expectations

### Functional validation
- Hero primary CTA still scrolls to the workflow correctly.
- Secondary hero CTA still orients the user correctly.
- Locale switching still works for the supported homepage experience.
- Recognition, country selection, analysis, and result rendering still complete successfully.
- High-risk and taboo scenarios still render their cautions correctly.

### UI validation
- Compare desktop/tablet/mobile screenshots for hierarchy consistency.
- Verify that tiered surfaces remain clearly differentiated.
- Check that workflow and result sections feel calmer and more ordered after the redesign.
- Verify that support panels remain useful without taking over the page.

### Code quality
- Keep ESLint, tests, and production build passing.
- Avoid unnecessary business-logic refactors while beautifying.
- Keep section/component boundaries understandable and maintainable.

## Final design conclusion

The homepage will be rebuilt as a **premium international concierge-style cross-cultural gifting advisor**: calmer, more ordered, more elegant, more trustworthy, and more usable. The redesign should make the product feel intentionally designed from top to bottom rather than a collection of individually polished modules.
