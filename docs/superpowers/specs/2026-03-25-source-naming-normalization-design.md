# Source Naming and Structure Normalization Design

**Date:** 2026-03-25
**Scope:** Normalize business source naming and directory structure for `app/`, `components/`, and `lib/`.

## Goal
Make source file names and library directories reflect responsibility rather than historical phase names or mixed naming styles.

## Decisions
- Component file names use `kebab-case`.
- Hook/helper names remain descriptive; helper file names should include their domain when generic names would be ambiguous.
- `lib/` is grouped by domain responsibility:
  - `analysis/`
  - `config/`
  - `domain/`
  - `enhancements/`
  - `storage/`
  - `types/`
- Shared cross-cutting utilities (`asset-path`, `countries`, `i18n`, `utils`) stay at `lib/` root.

## Normalization targets
- Rename PascalCase component files under `components/experience` and `components/gifting`.
- Rename generic home helper file to a domain-specific name.
- Replace `p0/p1/p2` lib naming with stable domain names.
- Move analysis-related implementation into `lib/analysis/`.
- Update all imports and keep behavior unchanged.

## Non-goals
- No changes to `.agents/`.
- No aggressive restructuring of `public/`, `src-tauri/`, or docs beyond recording the new conventions.
- No behavior changes beyond import/path updates.
