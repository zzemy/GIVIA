# Locale Simplification Design

**Date:** 2026-03-26

## Goal
Reduce the product's public language surface from four locales (`zh`, `en`, `ja`, `fr`) to two supported locales (`zh`, `en`) so the UI no longer exposes incomplete Japanese/French experiences.

## Decision
Adopt a two-locale product surface for the current stage:
- Keep: `zh`, `en`
- Remove from active support: `ja`, `fr`

## Scope
1. Remove Japanese and French from the visible language switcher.
2. Restrict route-level locale validation to `zh | en`.
3. Restrict static locale generation to `zh | en`.
4. Remove now-unused `ja/fr` branching from homepage locale/message selection.
5. Update tests to assert the two-locale behavior.

## Non-Goals
- Deleting historical message JSON files.
- Building full i18n infrastructure.
- Translating all content into additional languages.

## UX Behavior
- Users can switch between Chinese and English from the homepage header.
- Unsupported locale URLs should no longer be treated as first-class supported locales.
- The homepage should render consistently in only Chinese or English.

## Technical Design
- Narrow the shared `Locale` type to `'zh' | 'en'`.
- Update App Router locale guards (`app/[locale]/layout.tsx`, `app/[locale]/page.tsx`) to accept only those locales.
- Simplify homepage controller message lookup to Chinese-vs-English only.
- Simplify the header language switch buttons to two options.
- Keep the API request language behavior aligned with the reduced locale set.

## Risks
- Some tests or components may still contain dormant `ja/fr` references after the type change.
- Existing direct links to `/ja` or `/fr` will no longer be supported as product locales.

## Validation
- Unit tests for localized page rendering should pass.
- Lint should pass on touched files.
