# Editorial Redesign for Steps Two and Three

## Context

The current workflow has a clear first chapter:

- Step 1 identifies the gift itself and produces an initial object draft.

But the current Step 2 and Step 3 do not continue that same editorial logic. Step 2 is still shaped like a fixed country-and-template form, and Step 3 is still shaped like a parameter confirmation panel. This breaks the narrative continuity of the experience.

The redesign should treat Step 2 and Step 3 as the continuation of the same authored process:

- Step 1: understand the object
- Step 2: understand the recipient
- Step 3: understand the arrival scene

The target style is editorial, restrained, and narrative-driven, closer to an editor's notebook than a conventional wizard form.

## Goals

- Preserve the refined editorial tone established in Step 1.
- Replace rigid template-heavy interactions with AI-guided narrative drafting.
- Make Step 2 and Step 3 feel like two chapters of the same dossier, not separate utility forms.
- Keep important structured variables available, but reduce the feeling of filling out a long mechanical questionnaire.
- Let AI participate continuously as an editorial guide rather than a final-stage generator only.

## Non-Goals

- No implementation changes in this phase.
- No backend behavioral redesign in this document.
- No attempt to redesign the final report page in this pass.
- No free-form chatbot takeover that removes information structure entirely.

## Recommended Information Architecture

### Step 1

Step 1 remains the object-identification chapter.

- The user uploads or describes the gift.
- The system helps establish the gift's object draft.
- The chapter ends when the object itself is legible.

### Step 2

Step 2 becomes `Recipient dossier`.

Primary question:

- Who is this gift actually for?

This chapter focuses on recipient identity and relationship context rather than country/template selection as the dominant frame.

Key information to collect here:

- recipient role or identity type
- relationship distance
- age band
- occupational or social context
- hierarchy or status sensitivity
- communication style
- budget boundary
- taboo or caution clues
- prior interaction context

The page should read like an editorial character study. The user is not merely selecting options. The system should help them construct a coherent profile of the recipient.

### Step 3

Step 3 becomes `Arrival composition`.

Primary question:

- In what exact situation will this gesture arrive?

This chapter focuses on the delivery scene and interpretive conditions rather than repeating the recipient profile.

Key information to collect here:

- purpose of gifting
- occasion or event
- public versus private delivery
- first contact versus ongoing relationship
- timing
- formality
- packaging or presentation expectations
- message tone
- cultural sensitivity signals
- delivery constraints and reputational risks

This page should feel like drafting the manner of arrival, not toggling analysis features.

## Editorial Style Direction

The chosen tone is `editor's notebook`.

Desired qualities:

- calm
- precise
- literate
- restrained
- spacious
- observant

Avoid:

- generic dashboard styling
- bright utility cards with equal visual weight
- overly rigid multi-select template systems
- chat-bot UI patterns that turn the product into a messaging app

The visual language should continue the chapter-based editorial layout used in Step 1.

## Interaction Model

### Core Principle

AI should participate as an editorial co-writer, not as a detached generator and not as a full conversational chat interface.

### AI Responsibilities

AI should continuously do three jobs in Steps 2 and 3:

1. identify missing context
2. surface tact and sensitivity considerations
3. progressively synthesize the user's inputs into short narrative drafts

### Step 2 AI Output

In Step 2, AI produces a living `recipient sketch`.

This sketch should summarize:

- who the recipient appears to be
- what kind of relationship exists
- what social or emotional boundaries matter
- which missing details would materially affect later recommendations

### Step 3 AI Output

In Step 3, AI produces a living `arrival draft`.

This draft should summarize:

- the nature of the gifting situation
- how public or intimate the delivery is
- what tone would feel proportionate
- where cultural or reputational misreads may happen

## Field Strategy

Not every detail should appear as a hard field.

### Keep Explicit and Structured

These variables should remain visible and intentionally structured because they strongly affect downstream reasoning:

- country or destination
- relationship type
- recipient identity type
- age band
- occupation or social context
- budget
- formality
- purpose
- public/private mode
- time or timing context

### Capture More Narratively

These variables should be collected through guided prompts, AI synthesis, or lighter editorial inputs rather than many exposed controls:

- personality impression
- prior interaction nuances
- caution signals
- desired emotional impression
- packaging expectations
- note-writing style
- whether the user wants to appear warm, restrained, celebratory, apologetic, formal, or discreet

## Proposed Page Structure

### Step 2 Layout

Step 2 should be redesigned as a single editorial panel, not stacked generic cards.

Recommended structure:

- left primary area: `Recipient stage`
- right secondary area: `Profile notes`
- bottom or integrated margin: `AI checkpoint`

Left primary area:

- chapter heading
- recipient-centered lead copy
- key identity and relationship controls
- a sense that the user is building a dossier, not completing a utility form

Right secondary area:

- narrative prompts
- lighter profile fields
- contextual notes
- compact AI-assisted synthesis blocks

AI checkpoint:

- dynamic missing-context prompts
- tact warnings
- summary progression

### Step 3 Layout

Step 3 should follow the same grammar but with different content emphasis.

Recommended structure:

- left primary area: `Arrival stage`
- right secondary area: `Scene notes`
- bottom or integrated margin: `AI checkpoint`

Left primary area:

- purpose
- occasion
- delivery mode
- public/private context
- timing

Right secondary area:

- packaging expectations
- tone of note or wording
- sensitivity prompts
- scenario-specific supporting details

AI checkpoint:

- contradictions between recipient profile and delivery context
- suggestions about proportional tone
- warnings about cultural mismatch or excessive intimacy
- a synthesized arrival summary

## Recommended Product Language Shift

The current Step 2 naming and framing should be replaced.

Examples:

- `Step 2` should move away from labels like `Cultural Context` if the page is still mostly acting like a country selector.
- `Step 2` should instead read more like `Recipient dossier` or `人物侧写`.
- `Step 3` should move away from `Confirm Analysis Matrix`.
- `Step 3` should instead read more like `Arrival composition` or `送达编排`.

The language should signal authored progression, not technical setup.

## Why This Structure Is Recommended

This split is recommended because it matches a believable editorial workflow:

- first understand the object
- then understand the person
- then understand the manner of arrival

It also avoids the main failure mode of trying to collect every detail in Step 2 at once, which would create a long rigid form and flatten the narrative rhythm.

By separating recipient-building from arrival-planning:

- the user experiences forward movement
- AI has a cleaner structure for synthesis
- each step has a distinct narrative purpose
- the overall experience feels authored rather than assembled

## Risks and Tradeoffs

### Risk: Too Much Formality

If the redesign becomes too literary, the interface may become beautiful but less clear.

Mitigation:

- keep high-impact structured fields visible
- let AI narration support, not replace, clarity

### Risk: Too Much Hidden Structure

If too many inputs are folded into narrative prompts, users may feel they cannot control the system.

Mitigation:

- preserve explicit controls for important variables
- let AI summarize rather than obscure user choices

### Risk: AI Becomes Decorative

If AI only writes elegant summaries, it may not materially help decision quality.

Mitigation:

- require AI to identify missing details
- require AI to flag tact problems
- require AI to explain why a missing clue matters

## Implementation Intent

When implementation begins, Step 2 and Step 3 should be treated as structural rewrites, not cosmetic refreshes.

Expected implications:

- Step 2 component likely needs a new layout and information hierarchy
- Step 3 component likely needs a new layout and content model
- existing fixed template emphasis should be reduced or refactored
- AI checkpoint patterns from Step 1 can be adapted, but their behavior must become more participatory and context-aware

## Final Recommendation

Proceed with a full editorial redesign using this chapter split:

- Step 1: object draft
- Step 2: recipient dossier
- Step 3: arrival composition

Maintain the same aesthetic family as Step 1, but deepen the narrative feel in Steps 2 and 3 through:

- chapter continuity
- editor's notebook styling
- AI-guided synthesis
- a stronger distinction between explicit structured variables and narrative inputs
