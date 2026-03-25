# Source Naming Normalization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Normalize business source naming and directory layout across `app/`, `components/`, and `lib/` without changing product behavior.

**Architecture:** File names should describe responsibility consistently, and `lib/` should be organized by domain instead of historical phase labels. Import paths are updated in one coordinated pass, then validated with lint and TypeScript.

**Tech Stack:** Next.js App Router, React 19, TypeScript, ESLint

---

### Task 1: Normalize component file names

**Files:**
- Modify: `components/experience/*`
- Modify: `components/gifting/*`
- Modify: importers under `app/`, `components/`

- [ ] Rename PascalCase component files to kebab-case.
- [ ] Keep exported React component names PascalCase.
- [ ] Update all imports.

### Task 2: Normalize home helper naming

**Files:**
- Modify: `components/gifting/home/home-page-helpers.ts`
- Modify: importers under `components/gifting/home/`

- [ ] Rename generic `page-helpers.ts` to `home-page-helpers.ts`.
- [ ] Update all local imports.

### Task 3: Regroup lib by domain

**Files:**
- Create/Modify: `lib/config/*`, `lib/storage/*`, `lib/types/*`, `lib/enhancements/*`, `lib/analysis/*`, `lib/domain/*`
- Modify: all importers under `app/`, `components/`, `lib/`

- [ ] Move config, storage, types, enhancements, and analysis files into domain directories.
- [ ] Replace `p0/p1/p2` names with stable responsibility-based names.
- [ ] Update all imports.

### Task 4: Validate normalization

**Files:**
- Modify: touched files as needed

- [ ] Run ESLint on `app`, `components`, and `lib`.
- [ ] Run TypeScript type-check.
- [ ] Summarize the final normalized structure.
