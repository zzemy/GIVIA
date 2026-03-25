# AI Prompt and Taboo Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the AI integration so prompt templates, model adapters, safety guardrails, and taboo/rule content are separated into stable layers while preserving current route behavior.

**Architecture:** Introduce a new `lib/ai` boundary for prompts, adapters, guards, and schemas, plus a new `lib/domain/taboo` boundary backed by `data/taboos/*.json`. Migrate existing route logic in three phases so behavior stays working while prompt tuning becomes isolated from route and analysis code.

**Tech Stack:** Next.js App Router, TypeScript, Jest, Testing Library, existing DashScope API integration, JSON data files

---

## File Structure Map

### Existing files to modify
- `app/api/cultural-generate/route.ts` — currently contains large prompt strings, model call orchestration, repair flow, parsing, and validation; will be slimmed down to orchestration.
- `app/api/vision-recognize/route.ts` — currently contains prompt strings and provider-specific request/response handling; will be slimmed down to orchestration.
- `app/api/analysis/run/route.ts` — currently coordinates AI analysis output with fallback logic; will be updated to call new AI boundaries.
- `lib/analysis/llm-risk-enhancement.ts` — currently builds prompts and calls the model; will be converted to use prompt/adapters/guards.
- `lib/analysis/analysis-runner.ts` — will be updated to use the new enhancement boundary cleanly.
- `data/country-rules.json` — source material for taboo/rule migration; may remain temporarily during transition.
- `lib/enhancements/knowledge-graph.ts` — source material for taboo knowledge migration; may remain temporarily during transition.

### New files to create
- `lib/ai/adapters/types.ts`
- `lib/ai/adapters/dashscope.ts`
- `lib/ai/prompts/shared.ts`
- `lib/ai/prompts/analysis.ts`
- `lib/ai/prompts/vision.ts`
- `lib/ai/prompts/repair.ts`
- `lib/ai/guards/input-sanitizer.ts`
- `lib/ai/guards/prompt-injection.ts`
- `lib/ai/guards/safe-json.ts`
- `lib/ai/guards/output-validator.ts`
- `lib/ai/schemas/analysis-schema.ts`
- `lib/ai/schemas/vision-schema.ts`
- `lib/domain/taboo/taboo-types.ts`
- `lib/domain/taboo/taboo-loader.ts`
- `lib/domain/taboo/taboo-merge.ts`
- `data/taboos/global/core.json`
- `data/taboos/global/injection-blacklist.json`
- `data/taboos/countries/CN.json`
- `data/taboos/countries/JP.json`
- `data/taboos/countries/FR.json`
- `data/taboos/countries/US.json`

### New tests to create
- `lib/ai/prompts/analysis.test.ts`
- `lib/ai/prompts/vision.test.ts`
- `lib/ai/guards/input-sanitizer.test.ts`
- `lib/ai/guards/prompt-injection.test.ts`
- `lib/ai/guards/safe-json.test.ts`
- `lib/ai/guards/output-validator.test.ts`
- `lib/domain/taboo/taboo-loader.test.ts`
- `lib/domain/taboo/taboo-merge.test.ts`
- `app/api/analysis/run/route.test.ts`
- `app/api/vision-recognize/route.test.ts`
- `app/api/cultural-generate/route.test.ts`

---

### Task 1: Create the AI adapter boundary

**Files:**
- Create: `lib/ai/adapters/types.ts`
- Create: `lib/ai/adapters/dashscope.ts`
- Modify: `app/api/cultural-generate/route.ts`
- Modify: `app/api/vision-recognize/route.ts`
- Modify: `lib/analysis/llm-risk-enhancement.ts`
- Test: `app/api/vision-recognize/route.test.ts`
- Test: `app/api/cultural-generate/route.test.ts`

- [ ] **Step 1: Write the failing adapter contract test stubs**

Create minimal failing tests that assert the adapter returns normalized text output and normalized error objects for provider failures.

Run:
```bash
pnpm exec jest --runInBand --runTestsByPath app/api/vision-recognize/route.test.ts app/api/cultural-generate/route.test.ts
```
Expected: FAIL because adapter modules do not exist yet.

- [ ] **Step 2: Add provider-agnostic adapter types**

Implement `lib/ai/adapters/types.ts` with request/response interfaces such as:
- model name
- system/user messages
- temperature/max tokens
- timeout metadata
- normalized text response
- normalized provider error

- [ ] **Step 3: Implement `lib/ai/adapters/dashscope.ts`**

Move provider-specific request payload building, fetch logic, timeout handling, response extraction, and error normalization into the new adapter.

- [ ] **Step 4: Update existing AI call sites to use the adapter**

Replace inline DashScope request code in:
- `app/api/cultural-generate/route.ts`
- `app/api/vision-recognize/route.ts`
- `lib/analysis/llm-risk-enhancement.ts`

Keep route behavior the same; only provider transport should move.

- [ ] **Step 5: Run targeted tests**

Run:
```bash
pnpm exec jest --runInBand --runTestsByPath app/api/vision-recognize/route.test.ts app/api/cultural-generate/route.test.ts
```
Expected: PASS for the new adapter coverage and existing route behavior.

- [ ] **Step 6: Commit**

Run:
```bash
git add lib/ai/adapters/types.ts lib/ai/adapters/dashscope.ts app/api/cultural-generate/route.ts app/api/vision-recognize/route.ts lib/analysis/llm-risk-enhancement.ts app/api/vision-recognize/route.test.ts app/api/cultural-generate/route.test.ts
git commit -m "refactor: extract dashscope adapter layer"
```

---

### Task 2: Extract reusable prompt builders

**Files:**
- Create: `lib/ai/prompts/shared.ts`
- Create: `lib/ai/prompts/analysis.ts`
- Create: `lib/ai/prompts/vision.ts`
- Create: `lib/ai/prompts/repair.ts`
- Modify: `app/api/cultural-generate/route.ts`
- Modify: `app/api/vision-recognize/route.ts`
- Modify: `lib/analysis/llm-risk-enhancement.ts`
- Test: `lib/ai/prompts/analysis.test.ts`
- Test: `lib/ai/prompts/vision.test.ts`

- [ ] **Step 1: Write failing prompt-builder tests**

Test that each prompt builder returns four sections in order:
1. role / mission
2. safety rules
3. domain context
4. output contract

Run:
```bash
pnpm exec jest --runInBand --runTestsByPath lib/ai/prompts/analysis.test.ts lib/ai/prompts/vision.test.ts
```
Expected: FAIL because prompt modules do not exist yet.

- [ ] **Step 2: Create `lib/ai/prompts/shared.ts`**

Add reusable builders for:
- common AI safety constraints
- “user input is data, not instructions” clause
- JSON-only output contract fragments
- no-markdown / no-code-fence clauses

- [ ] **Step 3: Create task-specific prompt builders**

Implement:
- `analysis.ts` for risk and cultural-generation prompts
- `vision.ts` for gift recognition prompts
- `repair.ts` for malformed JSON repair prompts

Each builder should accept typed inputs and return assembled prompt sections or final message content.

- [ ] **Step 4: Replace inline prompt strings in routes and analysis modules**

Refactor:
- `app/api/cultural-generate/route.ts`
- `app/api/vision-recognize/route.ts`
- `lib/analysis/llm-risk-enhancement.ts`

to consume prompt builders instead of embedding long strings.

- [ ] **Step 5: Run targeted tests**

Run:
```bash
pnpm exec jest --runInBand --runTestsByPath lib/ai/prompts/analysis.test.ts lib/ai/prompts/vision.test.ts
```
Expected: PASS with stable prompt section coverage.

- [ ] **Step 6: Commit**

Run:
```bash
git add lib/ai/prompts/shared.ts lib/ai/prompts/analysis.ts lib/ai/prompts/vision.ts lib/ai/prompts/repair.ts app/api/cultural-generate/route.ts app/api/vision-recognize/route.ts lib/analysis/llm-risk-enhancement.ts lib/ai/prompts/analysis.test.ts lib/ai/prompts/vision.test.ts
git commit -m "refactor: extract ai prompt builders"
```

---

### Task 3: Build input sanitization and prompt-injection guardrails

**Files:**
- Create: `lib/ai/guards/input-sanitizer.ts`
- Create: `lib/ai/guards/prompt-injection.ts`
- Modify: `app/api/cultural-generate/route.ts`
- Modify: `app/api/vision-recognize/route.ts`
- Modify: `app/api/analysis/run/route.ts`
- Modify: `lib/analysis/llm-risk-enhancement.ts`
- Test: `lib/ai/guards/input-sanitizer.test.ts`
- Test: `lib/ai/guards/prompt-injection.test.ts`

- [ ] **Step 1: Write failing guardrail tests**

Cover cases such as:
- very long user text
- embedded control characters
- “ignore previous instructions” injection phrase
- “reveal system prompt” phrase
- harmless gift description text that should pass

Run:
```bash
pnpm exec jest --runInBand --runTestsByPath lib/ai/guards/input-sanitizer.test.ts lib/ai/guards/prompt-injection.test.ts
```
Expected: FAIL because guard modules do not exist yet.

- [ ] **Step 2: Implement input sanitization**

In `lib/ai/guards/input-sanitizer.ts`, add helpers to:
- trim and normalize whitespace
- remove dangerous control characters
- cap lengths per field
- normalize missing/empty values

- [ ] **Step 3: Implement prompt-injection detection**

In `lib/ai/guards/prompt-injection.ts`, add helpers to:
- detect suspicious override phrases
- score risk severity
- mark sanitized payloads for strict handling

Do not auto-block all suspicious content; preserve useful user data while raising risk signals.

- [ ] **Step 4: Apply guardrails before prompt assembly**

Update all model-bound routes/modules so sanitized input, not raw input, is passed into prompt builders.

- [ ] **Step 5: Run targeted tests**

Run:
```bash
pnpm exec jest --runInBand --runTestsByPath lib/ai/guards/input-sanitizer.test.ts lib/ai/guards/prompt-injection.test.ts
```
Expected: PASS.

- [ ] **Step 6: Commit**

Run:
```bash
git add lib/ai/guards/input-sanitizer.ts lib/ai/guards/prompt-injection.ts app/api/cultural-generate/route.ts app/api/vision-recognize/route.ts app/api/analysis/run/route.ts lib/analysis/llm-risk-enhancement.ts lib/ai/guards/input-sanitizer.test.ts lib/ai/guards/prompt-injection.test.ts
git commit -m "feat: add ai input sanitization and injection guards"
```

---

### Task 4: Add safe JSON extraction and schema validation

**Files:**
- Create: `lib/ai/guards/safe-json.ts`
- Create: `lib/ai/guards/output-validator.ts`
- Create: `lib/ai/schemas/analysis-schema.ts`
- Create: `lib/ai/schemas/vision-schema.ts`
- Modify: `app/api/cultural-generate/route.ts`
- Modify: `app/api/vision-recognize/route.ts`
- Modify: `lib/analysis/llm-risk-enhancement.ts`
- Test: `lib/ai/guards/safe-json.test.ts`
- Test: `lib/ai/guards/output-validator.test.ts`

- [ ] **Step 1: Write failing safe-output tests**

Cover cases such as:
- valid raw JSON
- markdown code fences around JSON
- HTML/script wrappers
- unexpected keys
- overlong strings
- wrong enum values

Run:
```bash
pnpm exec jest --runInBand --runTestsByPath lib/ai/guards/safe-json.test.ts lib/ai/guards/output-validator.test.ts
```
Expected: FAIL because modules do not exist yet.

- [ ] **Step 2: Implement safe JSON extraction**

In `lib/ai/guards/safe-json.ts`, extract JSON conservatively and reject executable/markup wrappers.

- [ ] **Step 3: Implement schemas and output validation**

Create:
- `lib/ai/schemas/analysis-schema.ts`
- `lib/ai/schemas/vision-schema.ts`
- `lib/ai/guards/output-validator.ts`

Enforce:
- required keys
- type checks
- enum checks
- string length caps
- whitelist-only fields

- [ ] **Step 4: Refactor routes to validate before use**

Ensure model output is validated before:
- merging with deterministic rule outputs
- returning to the client
- saving as intermediate repair state

- [ ] **Step 5: Run targeted tests**

Run:
```bash
pnpm exec jest --runInBand --runTestsByPath lib/ai/guards/safe-json.test.ts lib/ai/guards/output-validator.test.ts
```
Expected: PASS.

- [ ] **Step 6: Commit**

Run:
```bash
git add lib/ai/guards/safe-json.ts lib/ai/guards/output-validator.ts lib/ai/schemas/analysis-schema.ts lib/ai/schemas/vision-schema.ts app/api/cultural-generate/route.ts app/api/vision-recognize/route.ts lib/analysis/llm-risk-enhancement.ts lib/ai/guards/safe-json.test.ts lib/ai/guards/output-validator.test.ts
git commit -m "feat: validate ai output with safe json guards"
```

---

### Task 5: Create the taboo domain boundary and seed JSON datasets

**Files:**
- Create: `lib/domain/taboo/taboo-types.ts`
- Create: `lib/domain/taboo/taboo-loader.ts`
- Create: `lib/domain/taboo/taboo-merge.ts`
- Create: `data/taboos/global/core.json`
- Create: `data/taboos/global/injection-blacklist.json`
- Create: `data/taboos/countries/CN.json`
- Create: `data/taboos/countries/JP.json`
- Create: `data/taboos/countries/FR.json`
- Create: `data/taboos/countries/US.json`
- Modify: `data/country-rules.json`
- Modify: `lib/enhancements/knowledge-graph.ts`
- Test: `lib/domain/taboo/taboo-loader.test.ts`
- Test: `lib/domain/taboo/taboo-merge.test.ts`

- [ ] **Step 1: Write failing taboo-domain tests**

Cover:
- global taboo loading
- country-specific taboo loading
- merge behavior for global + country datasets
- stable normalization of rule shape

Run:
```bash
pnpm exec jest --runInBand --runTestsByPath lib/domain/taboo/taboo-loader.test.ts lib/domain/taboo/taboo-merge.test.ts
```
Expected: FAIL because new domain files do not exist yet.

- [ ] **Step 2: Define taboo types**

Create `lib/domain/taboo/taboo-types.ts` with typed structures for:
- taboo item
- trigger list
- explanation snippets
- metadata fields such as country, severity, tags

- [ ] **Step 3: Seed the new JSON files**

Start with a thin migration slice rather than moving all knowledge at once. Create enough data to cover the currently most visible countries and global rules.

- [ ] **Step 4: Implement loader and merge helpers**

In:
- `lib/domain/taboo/taboo-loader.ts`
- `lib/domain/taboo/taboo-merge.ts`

Add logic to load, normalize, and merge taboo datasets for downstream prompt and analysis usage.

- [ ] **Step 5: Wire the new taboo domain into AI prompt/context building**

Update prompt assembly and relevant analysis orchestration to consume the taboo domain layer instead of reaching directly into mixed legacy sources.

- [ ] **Step 6: Run targeted tests**

Run:
```bash
pnpm exec jest --runInBand --runTestsByPath lib/domain/taboo/taboo-loader.test.ts lib/domain/taboo/taboo-merge.test.ts
```
Expected: PASS.

- [ ] **Step 7: Commit**

Run:
```bash
git add lib/domain/taboo/taboo-types.ts lib/domain/taboo/taboo-loader.ts lib/domain/taboo/taboo-merge.ts data/taboos/global/core.json data/taboos/global/injection-blacklist.json data/taboos/countries/CN.json data/taboos/countries/JP.json data/taboos/countries/FR.json data/taboos/countries/US.json data/country-rules.json lib/enhancements/knowledge-graph.ts lib/domain/taboo/taboo-loader.test.ts lib/domain/taboo/taboo-merge.test.ts
git commit -m "refactor: extract taboo domain data layer"
```

---

### Task 6: Integrate the new architecture into the analysis pipeline

**Files:**
- Modify: `app/api/analysis/run/route.ts`
- Modify: `lib/analysis/analysis-runner.ts`
- Modify: `lib/analysis/llm-risk-enhancement.ts`
- Modify: `app/api/cultural-generate/route.ts`
- Modify: `app/api/vision-recognize/route.ts`
- Test: `lib/analysis/analysis-runner.test.ts`
- Test: `lib/analysis/llm-risk-enhancement.test.ts`
- Test: `app/api/analysis/run/route.test.ts`

- [ ] **Step 1: Write or extend failing integration tests**

Add coverage for:
- successful sanitized AI path
- malformed AI output fallback path
- prompt-injection-like input path
- deterministic fallback when validation fails

Run:
```bash
pnpm exec jest --runInBand --runTestsByPath lib/analysis/analysis-runner.test.ts lib/analysis/llm-risk-enhancement.test.ts app/api/analysis/run/route.test.ts
```
Expected: FAIL until the integration is updated.

- [ ] **Step 2: Update the analysis runner path**

Ensure `lib/analysis/analysis-runner.ts` and `lib/analysis/llm-risk-enhancement.ts` use:
- sanitized input
- prompt builders
- adapter calls
- output validation
- taboo domain context

- [ ] **Step 3: Update API routes to be thin orchestrators**

Slim `app/api/analysis/run/route.ts`, `app/api/cultural-generate/route.ts`, and `app/api/vision-recognize/route.ts` so they orchestrate only:
- request validation
- domain assembly
- AI service call
- response serialization

- [ ] **Step 4: Run integration tests**

Run:
```bash
pnpm exec jest --runInBand --runTestsByPath lib/analysis/analysis-runner.test.ts lib/analysis/llm-risk-enhancement.test.ts app/api/analysis/run/route.test.ts
```
Expected: PASS.

- [ ] **Step 5: Commit**

Run:
```bash
git add app/api/analysis/run/route.ts lib/analysis/analysis-runner.ts lib/analysis/llm-risk-enhancement.ts app/api/cultural-generate/route.ts app/api/vision-recognize/route.ts lib/analysis/analysis-runner.test.ts lib/analysis/llm-risk-enhancement.test.ts app/api/analysis/run/route.test.ts
git commit -m "refactor: route ai analysis through prompt and guard layers"
```

---

### Task 7: Final regression, lint, and cleanup

**Files:**
- Modify: any touched files above as needed
- Test: all newly created and updated tests

- [ ] **Step 1: Run the focused AI test suite**

Run:
```bash
pnpm exec jest --runInBand --runTestsByPath \
  lib/ai/prompts/analysis.test.ts \
  lib/ai/prompts/vision.test.ts \
  lib/ai/guards/input-sanitizer.test.ts \
  lib/ai/guards/prompt-injection.test.ts \
  lib/ai/guards/safe-json.test.ts \
  lib/ai/guards/output-validator.test.ts \
  lib/domain/taboo/taboo-loader.test.ts \
  lib/domain/taboo/taboo-merge.test.ts \
  lib/analysis/analysis-runner.test.ts \
  lib/analysis/llm-risk-enhancement.test.ts \
  app/api/analysis/run/route.test.ts \
  app/api/vision-recognize/route.test.ts \
  app/api/cultural-generate/route.test.ts
```
Expected: PASS.

- [ ] **Step 2: Run lint on all touched boundaries**

Run:
```bash
pnpm lint app/api lib/ai lib/domain data/taboos
```
Expected: PASS.

- [ ] **Step 3: Manually verify the key invariants**

Check that:
- prompt text is no longer embedded in routes
- user input is sanitized before prompt assembly
- output is validated before business use
- taboo data is loaded from dedicated JSON files
- routes remain functionally thin

- [ ] **Step 4: Commit final cleanup**

Run:
```bash
git add app/api lib/ai lib/domain data/taboos
git commit -m "test: cover ai prompt and taboo architecture migration"
```

---

## Notes for the Implementer
- Do not rewrite all AI behavior in one patch. Land the architecture in phases.
- Preserve deterministic fallback behavior at every stage.
- Keep user-provided text clearly separated from instruction text in all prompt builders.
- Prefer narrow, typed helper functions over giant utility files.
- When migrating taboo data, move a thin validated subset first, then expand.
- Avoid introducing remote-config complexity in this phase.
- If a route test is difficult to add immediately, first extract a pure helper from the route and test that helper, then add route coverage after the route shrinks.
