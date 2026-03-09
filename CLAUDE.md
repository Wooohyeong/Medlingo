# CLAUDE.md — Medlingo (MedDaily) Codebase Guide

This file provides AI assistants with an overview of the codebase structure, conventions, and development workflows.

---

## Project Overview

**MedDaily** is an offline-first medical study Progressive Web App (PWA) for Korean medical students. It features:
- Spaced repetition scheduling (SM-2 algorithm)
- Custom question import (JSON/CSV)
- Full data backup/restore
- Offline functionality via Service Worker
- Hash-based single-page routing
- All data persisted in IndexedDB (no backend)

**Stack:** Pure TypeScript + DOM APIs, no framework, no bundler, Node.js tooling only.

---

## Directory Structure

```
/
├── src/                    # TypeScript source (compiled to build/)
│   ├── core/               # Business logic modules
│   │   ├── types.ts        # All domain type definitions
│   │   ├── db.ts           # IndexedDB abstraction layer
│   │   ├── scheduler.ts    # SM-2 spaced repetition algorithm
│   │   ├── selection.ts    # Quiz question selection logic
│   │   ├── io.ts           # JSON/CSV parsing, backup validation
│   │   ├── settings.ts     # User preferences schema & defaults
│   │   └── date.ts         # ISO date string utilities
│   ├── data/
│   │   └── questions.sample.ts  # Bundled sample medical questions
│   └── main.ts             # SPA entry point, routing, UI rendering
├── public/                 # Static assets (served as-is)
│   ├── icons/              # PWA icons (192px, 512px SVG)
│   └── data/
│       └── questions.sample.json  # Source sample question data
├── scripts/                # Node.js build/dev scripts
│   ├── build.mjs           # Production build (TS compile + asset copy to dist/)
│   ├── dev-server.mjs      # Development HTTP server (port 5173)
│   └── clean.mjs           # Removes dist/, build/, .tmp-tests/
├── tests/                  # Unit tests (Node built-in runner)
│   ├── io.test.mjs         # Import/export parsing tests
│   ├── scheduler.test.mjs  # Spaced repetition algorithm tests
│   └── selection.test.mjs  # Quiz selection logic tests
├── index.html              # Root HTML (inline CSS, #app mount point)
├── manifest.webmanifest    # PWA manifest
├── sw.js                   # Service Worker (cache-first offline strategy)
├── package.json
└── tsconfig.json
```

---

## Key Commands

```bash
npm run dev        # Compile TS + start dev server at http://localhost:5173
npm run build      # Clean + compile TS + copy assets to dist/
npm run preview    # Serve production dist/ at http://localhost:4173
npm test           # Compile TS + run unit tests
npm run clean      # Delete dist/, build/, .tmp-tests/
npm run build:ts   # TypeScript compile only (output to build/)
```

> **Note:** There is no hot reload. After editing `.ts` files, re-run `npm run build:ts` (or restart `npm run dev`) to see changes.

---

## Architecture

### Single-Page Application (SPA)

`src/main.ts` is the entire frontend application. It:
- Reads `window.location.hash` for routing
- Renders route content by updating `document.getElementById('app').innerHTML`
- Manages in-memory state (questions map, progress map, settings)
- Bootstraps by: loading IndexedDB data → registering service worker → rendering UI

**Hash routes:**
| Hash | View |
|------|------|
| `#home` | Dashboard — summary stats and navigation |
| `#daily` | Today's quiz (due + new questions) |
| `#review` | Overdue review mode |
| `#manager` | Question import/export/management |
| `#stats` | Statistics dashboard |
| `#settings` | User settings |

### No Framework

The app uses **imperative DOM manipulation** via `innerHTML`. There is no React, Vue, or any component framework. UI updates replace inner HTML of the `#app` div. Event listeners are attached after each render.

### Data Flow

```
IndexedDB (persistent storage)
       ↓ load on boot
In-memory Maps (questions, progress, settings)
       ↓ selection algorithm
Daily Quiz (due-first, topic-balanced new questions)
       ↓ user answers
Progress updates → saved back to IndexedDB
```

---

## Core Modules

### `src/core/types.ts`
Central type definitions for the entire app. Key types:

```typescript
Question      // Medical question: stem, choices (A-D), answer, explanation, subject/topic/tags
Choice        // { key: string, text: string }
Progress      // Spaced repetition state: seenCount, correctCount, ease, interval, dueDate, lapseCount
Settings      // dailySize, wrongFirst, dueFirst, selectedSetIds, includeAllSets
DailyStats    // { solved: number, correct: number } keyed by ISO date
StudyLog      // Individual answer record with timestamp and correctness
WrongNote     // Error tracking per question with WrongNoteRecord[]
QuizItem      // { question: Question, progress?: Progress }
FullBackup    // Complete export: version '1.0', all questions + progress + logs + wrong notes
```

### `src/core/db.ts`
IndexedDB wrapper with 6 object stores. All operations return Promises.

**Stores:**
| Store | Key | Purpose |
|-------|-----|---------|
| `progress` | `questionId` | Spaced repetition scheduling state |
| `daily` | ISO date string | Daily solve/correct counts |
| `settings` | `'settings'` | Single settings object |
| `customQuestions` | `id` | User-imported questions |
| `studyLogs` | auto-generated id | Complete answer history |
| `wrongNotes` | `questionId` | Error tracking per question |

DB name: `'meddaily'`, version: `2`. No ORM or query layer — only `get`, `getAll`, `put`, `clear` operations.

### `src/core/scheduler.ts`
SM-2 style spaced repetition:
- **Correct:** interval grows (0→1→3→multiplied by ease), ease +0.05 (max 2.8)
- **Wrong:** interval resets to 1, ease -0.2 (min 1.3), lapseCount++
- Default new question: ease=2.3, interval=0, dueDate=today

### `src/core/selection.ts`
Builds the daily quiz from available questions:
1. Pull all overdue/due questions, sorted by due date then accuracy
2. Fill remaining slots with new unseen questions, balanced by `subject:topic` group
3. Fallback: add any remaining questions to reach target size

### `src/core/io.ts`
Import/export logic:
- **JSON import:** accepts `Question[]` or `{ questions: Question[] }`
- **CSV import:** columns: `id, subject, system, topic, difficulty, grade, setId, setName, tags (pipe-delimited), stem, choiceA, choiceB, choiceC, choiceD, answer, explanation`
- **Backup:** validates `FullBackup` schema with version `'1.0'`
- **Deduplication:** `dedupe()` filters out questions with IDs already in the store

### `src/core/settings.ts`
Settings schema with defaults:
```typescript
{ dailySize: 10, wrongFirst: false, dueFirst: true, selectedSetIds: [], includeAllSets: true }
```
`normalizeSettings()` provides backward-compatible migration for saved settings.

### `src/core/date.ts`
Two utilities only:
- `todayStr()` — current date as `YYYY-MM-DD` (sv-SE locale)
- `addDays(dateStr, days)` — date arithmetic returning ISO string

---

## Testing

Uses **Node.js built-in test runner** (`node --test`). No Jest, Mocha, or other test framework.

Tests live in `tests/*.test.mjs` (ES module format). They import compiled JS from `build/` (not source TS), so **always compile before testing** (`npm run build:ts` is run automatically by `npm test`).

**Adding tests:** create a new `.test.mjs` file in `tests/`, import from `'../build/core/<module>.js'`, and use `node:test` + `node:assert`.

---

## Build System

### TypeScript Compilation
- Source: `src/**/*.ts` → Output: `build/` (mirrors source structure)
- Module format: `NodeNext` (ES modules with explicit `.js` extensions in imports)
- Target: `ES2022`, strict mode enabled, DOM lib included

### Production Build (`npm run build`)
```
dist/
├── index.html
├── manifest.webmanifest
├── sw.js
├── public/          ← copied from public/
└── assets/          ← copied from build/ (compiled TS output)
```
The `dist/` directory is ready for static hosting (GitHub Pages, Cloudflare Pages, Netlify).

### Development Server (`npm run dev`)
Custom Node.js HTTP server. Serves from repo root (not `dist/`). Unknown routes fall back to `index.html` for SPA routing. No hot reload.

---

## Service Worker (`sw.js`)

Cache-first strategy:
1. Serve from cache if available
2. Fetch from network if not cached, then cache the response
3. Unknown navigations serve `index.html` (SPA offline fallback)

Cache name: `'meddaily-v2'`. Bump the version string when deploying breaking changes to force cache invalidation.

---

## Conventions

### TypeScript
- **Strict mode** is enabled — no implicit `any`, strict null checks, etc.
- Use `.js` extensions in import paths (TypeScript NodeNext resolution requires this even for `.ts` source files)
- All types defined in `src/core/types.ts` — add new domain types here, not inline

### No Linting/Formatting Tools
There is no ESLint, Prettier, or pre-commit hooks configured. Follow the existing code style manually:
- 2-space indentation
- Single quotes for strings
- Semicolons at end of statements
- Functional style preferred (pure functions with explicit return types)

### UI / Rendering
- All UI text is in **Korean**
- Use `innerHTML` for rendering (consistent with existing patterns)
- Attach event listeners after each `innerHTML` update using `addEventListener`
- No virtual DOM or diffing — full re-renders are acceptable for small views

### Data Persistence
- All persistence goes through `src/core/db.ts` functions
- Never access `indexedDB` directly from `main.ts`
- Write-through: update in-memory state AND save to IndexedDB after user actions

### Question IDs
- IDs must be unique across bundled and custom questions
- `dedupe()` in `io.ts` is responsible for preventing ID collisions on import

---

## Common Pitfalls

1. **Forgetting to recompile:** Changes to `.ts` files won't be reflected until `npm run build:ts` runs.
2. **Import paths:** Always use `.js` extensions in `import` statements in `.ts` files (e.g., `import { foo } from './foo.js'`), even though the source file is `.ts`.
3. **IndexedDB is async:** All `db.ts` functions return Promises — always `await` them.
4. **No bundler:** Assets in `src/` are not bundled. The compiled JS files are served individually. Large imports increase load time.
5. **Service Worker caching:** During development, the service worker may serve stale assets. Use DevTools → Application → Service Workers → "Skip waiting" to force updates.

---

## Sample Data

`public/data/questions.sample.json` contains bundled medical questions (Korean, internal medicine focus). These are also imported as a TypeScript constant in `src/data/questions.sample.ts`.

Question fields:
```
id, subject, system, topic, difficulty, grade, setId, setName, tags[], stem, choices[], answer, explanation
```

---

## No Backend

This is a **100% client-side application**. There is no server, no API, no database server, and no authentication. All data lives in the user's browser IndexedDB. The only network activity is fetching static assets.
