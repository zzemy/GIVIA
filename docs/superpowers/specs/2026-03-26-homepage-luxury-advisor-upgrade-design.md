# Homepage Luxury Advisor Upgrade Design

## Summary

This redesign upgrades the homepage from a feature-dense AI dashboard feel into a premium cross-border gifting advisor experience. The homepage should communicate one dominant idea: GIVIA is a trusted cultural gifting advisor that helps users choose gifts with confidence across markets.

The chosen direction is **Luxury Advisor System**:
- premium brand presence first
- gifting advisory clarity second
- AI/system feeling only as a restrained supporting layer

This spec covers homepage information hierarchy, visual language, component responsibilities, interaction changes, responsive behavior, accessibility, and validation requirements. It is intentionally focused on the homepage experience and does not include unrelated backend or prompt-architecture changes.

## Problems in the current homepage

### 1. First screen lacks a single focal point
The current hero introduces too many equally strong ideas at once: logo/navigation, hero copy, trust chips, city chips, the interactive demo, and a second capability carousel immediately below. Users see richness, but not a single dominant promise.

### 2. Too many surfaces share the same visual weight
Large rounded cards, bright cyan accents, glow treatments, borders, and glass layers appear across hero, workflow, feedback, and result surfaces with similar intensity. This makes the page feel busy and weakens hierarchy.

### 3. The tone leans too much toward a risk dashboard
The product is about premium gifting judgment, but the current visual language often feels closer to an operations panel or risk console. This reduces warmth, sophistication, and trust in the “advisor” positioning.

### 4. Results emphasize metrics before judgment
The result area contains useful structured detail, but the experience still reads as score panels and risk blocks first. For a gifting product, the recommendation should feel like a consultant’s opinion sheet: recommendation first, reasoning second, cautions last.

## Design goals

1. Create a clear premium first impression within the first screen.
2. Make the workflow easier to scan by establishing strong primary/secondary hierarchy.
3. Shift the emotional tone from “AI dashboard” to “luxury gifting advisor”.
4. Keep the intelligence/system feel, but demote it to a support role.
5. Improve readability, calmness, and perceived product quality on desktop and mobile.
6. Preserve the current functional journey so implementation remains focused and low-risk.

## Non-goals

- No redesign of the AI analysis logic itself.
- No major changes to API contracts.
- No expansion of product scope beyond the homepage and its immediate flow surfaces.
- No reintroduction of many language options; locale support remains aligned with the existing simplified direction.

## Chosen direction: Luxury Advisor System

### Positioning statement
GIVIA should feel like a high-end advisory product for cross-border gifting decisions, not a generic AI tool or warning console.

### Tone mix
- **Primary:** premium brand / luxury editorial calm
- **Secondary:** cultural gifting expertise and judgment
- **Accent only:** AI intelligence / system precision

### Core visual principle
Every screen should answer: “what is the most important thing the user should notice first?” If more than one block competes for that role, the layout is wrong.

## Information architecture

## Section 1: Hero

### Required structure
The hero becomes a two-zone layout:
- **Left primary zone:** one message, one supporting paragraph, one primary CTA, one secondary CTA
- **Right credibility zone:** a compact stacked panel showing 3 advisory capabilities (recipient culture lens, gift risk scan, timing/etiquette guidance)

### What changes
- Keep sticky header, but visually lighten it so it does not compete with the hero content.
- Remove excess emphasis from secondary chips and floating supporting elements.
- Reduce the number of equally loud highlight treatments in the first viewport.
- Make the primary CTA clearly dominant.
- Keep trust proof, but compress it into fewer, better-curated signals.

### Hero content behavior
The first-screen message should lead with confidence and clarity rather than enumerating features. Supporting content can explain the multi-step intelligence later in the page.

## Section 2: Workflow and trust area

### Required structure
The page section after the hero should establish a three-level hierarchy:
1. **Primary:** guided workflow area
2. **Secondary:** assistant/supporting explanation
3. **Tertiary:** history/examples/support panels

### Layout intent
The workflow should feel like the main stage where the user takes action. Supporting cards should visually step back through lower contrast, lower glow, lighter borders, and smaller visual mass.

### What changes
- Keep the current workflow progression logic, but reduce cross-panel competition.
- Rebalance widths so the main task panel feels central rather than one card among equals.
- Treat assistant/history panels as supporting context, not the core offer.
- Increase vertical rhythm between major blocks so the page breathes more.

## Section 3: Result experience

### Required structure
Results should be re-sequenced into this order:
1. **Top recommendation / judgment summary**
2. **Why it fits / why it is risky**
3. **Contextual detail panels**
4. **Caution, taboo, and next-step notes**

### Result tone
The results should feel like a premium advisor memo. Score panels still exist, but they should support the recommendation rather than dominate the entire section.

### What changes
- Recommendation block becomes the visual anchor.
- Explanatory reasoning becomes easier to read in narrative form.
- Risk and taboo information remain prominent when needed, but are framed as professional cautions rather than alarm-console output.
- Dense metrics and supporting tags are visually quieter than the headline recommendation.

## Visual language system

### Palette
The new palette should follow this balance:
- **Base:** midnight navy / deep blue-black
- **Primary highlight:** warm champagne / soft gold tint
- **Secondary accent:** restrained cool blue / cyan
- **Support neutrals:** slate, mist, desaturated blue-gray

### Usage rules
- Warm highlight is for premium emphasis, premium CTA states, and top-priority surfaces.
- Cyan remains available for intelligence/system signaling, but only as an accent.
- Avoid using bright cyan as the dominant color across most panels.

### Surface treatment
- Fewer glowing surfaces overall
- Softer gradients
- Lower border contrast on secondary cards
- Larger corner radii, but with clearer visual ranking between primary and secondary cards
- More negative space around important content

### Texture and background
The current world-map/global-system language can remain, but should be quieter:
- reduce visible grid noise
- reduce background competition with foreground cards
- keep ambient intelligence mood without making the screen feel technical-first

## Typography and spacing

### Typography intent
Typography should feel more editorial and premium while staying readable in Chinese and English.

### Rules
- Larger hero headline with stronger line discipline
- Better contrast between headline, body, label, and metadata text
- Reduce excessive all-caps styling where it does not add value
- Keep uppercase micro-labels only for true structural labels
- Ensure Chinese typography keeps a confident but not cramped rhythm

### Spacing rhythm
Adopt calmer spacing throughout:
- larger spacing between major sections
- clearer internal padding in primary cards
- tighter grouping inside supporting metadata clusters
- avoid many small badges and chips fighting for attention in the same band

## Motion and interaction

### Motion style
Motion should feel deliberate and premium, not flashy.

### Rules
- Keep subtle entrance motion for major blocks
- Reduce decorative movement that competes with comprehension
- Preserve hover feedback, but with smaller lift/glow values
- Carousel/capability motion should support comprehension, not steal focus from the hero promise

### CTA behavior
- Primary CTA remains the clearest interaction in the hero
- Secondary CTA should provide orientation, not compete as an equal action
- Workflow entry should remain obvious on desktop and mobile

## Responsive behavior

### Desktop
- Hero preserves split layout with a clear dominant left message zone
- Workflow area keeps a primary lane and a supporting lane
- Results should avoid becoming a wall of equal cards

### Tablet
- Hero may compress to stacked segments if needed, but must keep recommendation hierarchy
- Supporting panels should drop below the primary action region

### Mobile
- Hero becomes a clear stacked narrative: message → CTA → credibility summary
- Supporting chips and decorative elements should be reduced or hidden if they hurt scan speed
- Results should surface recommendation summary first before detailed panels

## Component and code organization impact

This redesign should stay aligned with the existing componentized homepage structure while improving boundaries where needed.

### Existing components to evolve
- `components/gifting/home/sections/home-hero-section.tsx`
- `components/gifting/home/sections/workflow-panels.tsx`
- `components/gifting/home/sections/page-feedback.tsx`
- `components/gifting/home/sections/results-section.tsx`
- `components/gifting/home/sections/results-detail-panels.tsx`
- `components/gifting/home/sections/home-background.tsx`

### Expected refactoring direction
- Extract style/system constants if card hierarchy or palette tokens become repeated.
- Prefer smaller presentational subcomponents over adding more branching logic inside already-large sections.
- Keep controller/data hooks stable where possible; redesign should primarily reshape presentation and content order.
- If result ranking requires a new top summary component, create a focused component rather than expanding `results-section.tsx` excessively.

## Content strategy

### Homepage copy
The copy should sound like advisor guidance, not feature documentation. Prefer language about confidence, judgment, cultural understanding, recipient fit, and polished execution.

### Result copy
Results should always read as analysis derived from the user’s provided input and context. Recommendation phrasing should stay disciplined and avoid generic filler, overclaiming, or unsafe output patterns.

## Feedback, error, and loading states

### Loading
Loading should feel calm and premium:
- keep progress visibility
- reduce technical/noisy phrasing where possible
- reassure users that analysis is in progress without making the page feel unstable

### Error
Error panels should remain clear and accessible, but visually harmonize with the premium system. They should be serious without breaking the entire brand tone.

## Accessibility requirements

- Preserve sufficient text/background contrast after palette changes.
- Keep focus states visible across dark and warm-highlight surfaces.
- Do not communicate critical meaning through color alone.
- Ensure the reweighted hierarchy also works for keyboard and screen-reader users.
- Maintain readable type scale and spacing on small screens.

## Validation requirements

Implementation will be considered successful if it produces all of the following:

1. The first screen has one obvious focal point within 2–3 seconds of viewing.
2. The page reads as a premium gifting advisor rather than a technical dashboard.
3. Workflow, support, and result modules no longer compete with equal visual weight.
4. Recommendation-first result reading order is obvious on both desktop and mobile.
5. Existing core interactions still work without regression.
6. Chinese and English layouts both remain balanced after spacing and typography changes.

## Testing expectations

### Functional validation
- Verify hero CTA still scrolls/enters the workflow correctly.
- Verify language switching still updates the homepage correctly for supported locales.
- Verify workflow entry, analysis, and result rendering still work end to end.
- Verify recommendation and detail sections render correctly for low, medium, and high-risk results.

### UI validation
- Compare desktop, tablet, and mobile screenshots for hierarchy consistency.
- Validate that primary/secondary/tertiary cards remain visually distinct.
- Check that loading/error states feel integrated with the new design system.

### Code quality
- Keep ESLint, type-check, and relevant tests passing.
- Avoid creating new oversized section files while redesigning.

## Implementation boundaries for the next planning phase

The implementation plan should focus on:
1. homepage visual system and layout refactor
2. result sequencing and presentation hierarchy
3. responsive and accessibility cleanup
4. verification of supported locale presentation

The plan should not expand into unrelated backend work unless a direct frontend dependency is discovered during implementation.
