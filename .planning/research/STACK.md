# Stack Research: v1.2 Notes, Browser & Platform Growth

**Researched:** 2026-04-09
**Scope:** Notes search/organization, careful Browser expansion, and app-distribution groundwork

## Current Stack Strengths

- React 19 + Vite 8 + TypeScript 6 already support the current shell/app runtime cleanly.
- Notes and Browser already have isolated feature modules, which makes incremental expansion feasible.
- The internal platform layer already models app identity, settings participation, and storage namespaces.
- Playwright coverage already exists for launcher-path app flows, which is a strong base for `v1.2` verification.

## Recommended Stack Direction

- Keep the existing frontend stack; no framework change is needed for `v1.2`.
- Keep Notes search and organization local-first. Start with in-browser indexing/filtering over existing note content rather than adding backend search infrastructure.
- Keep Browser expansion metadata- and truthfulness-driven. New navigation should still route through an explicit browsing model that can decide between embedded and external handling.
- Keep app-distribution groundwork repo-driven at first. Prefer checked-in app metadata/manifests and validation helpers before any server-backed marketplace or installation backend.

## Likely Additions

- Notes:
  - local note metadata for folders and/or tags
  - search helpers over title/body and note metadata
- Browser:
  - URL parsing/normalization helper
  - browser history/recent-destination state, likely local and app-scoped
  - expanded destination policy model beyond fixed curated cards
- Platform:
  - app manifest schema for submitted apps
  - validation utilities for submission metadata
  - catalog data source and selectors

## What Not To Add Yet

- Full backend sync/accounts for Notes
- Rich-text editor framework unless requirements explicitly force it
- Full browser-engine claims or Safari parity
- Arbitrary app install escape hatches before submission and catalog foundations are proven
