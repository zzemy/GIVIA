# Locale Simplification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce the product's active locale support to Chinese and English only, removing incomplete Japanese and French entry points.

**Architecture:** Tighten the locale contract at the shared type, route, and homepage-controller layers. Then align the visible language switcher and tests to the reduced locale set so runtime behavior and UI affordances stay consistent.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Jest, Testing Library

---

### Task 1: Tighten the locale contract

**Files:**
- Modify: `components/gifting/home/types.ts`
- Modify: `app/[locale]/layout.tsx`
- Modify: `app/[locale]/page.tsx`

- [ ] **Step 1: Update the shared locale union**
- [ ] **Step 2: Restrict static params to `zh` and `en`**
- [ ] **Step 3: Restrict runtime locale validation to `zh` and `en`**
- [ ] **Step 4: Run targeted tests for the localized page**
- [ ] **Step 5: Commit if the slice is stable**

### Task 2: Align homepage behavior and language switcher

**Files:**
- Modify: `components/gifting/home/hooks/use-home-page-controller.tsx`
- Modify: `components/gifting/home/sections/home-hero-section.tsx`

- [ ] **Step 1: Remove unused `ja/fr` message branches**
- [ ] **Step 2: Reduce the language switcher options to Chinese and English**
- [ ] **Step 3: Verify the analysis request language still matches supported locales**
- [ ] **Step 4: Run tests covering the language switch buttons**
- [ ] **Step 5: Commit if the slice is stable**

### Task 3: Update automated checks

**Files:**
- Modify: `app/[locale]/page.test.tsx`

- [ ] **Step 1: Update assertions to reflect the two-language switcher**
- [ ] **Step 2: Run the localized page test file**
- [ ] **Step 3: Run lint on touched files**
- [ ] **Step 4: Commit the final patch**
