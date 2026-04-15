# Storyboard Layout App

A React and Vite workspace for planning Storyline screens, previewing layout patterns, and exporting handoff-ready production materials.

## Features

- build storyboard slides across multiple screen types
- switch layouts while preserving authored content where possible
- preview Storyline-friendly layouts in real time
- export current slide specs, production briefs, and PPTX output
- import storyboard JSON with validation and safe defaults

## Local development

### Requirements

- Node.js 20.19 or newer
- npm 10 or newer

### Install

```bash
npm install
```

### Start the app

```bash
npm run dev
```

### Quality checks

```bash
npm run check
```

This runs linting, tests, and the production build.

### End-to-end tests

```bash
npx playwright install chromium
npm run e2e
```

This runs the Playwright smoke tests against the live app.

## Main scripts

- `npm run dev` — start the Vite dev server
- `npm test` — run the Vitest suite
- `npm run lint` — run ESLint
- `npm run build` — create the production bundle
- `npm run build:analyze` — inspect bundle composition
- `npm run e2e` — run Playwright end-to-end smoke tests
- `npm run e2e:headed` — run the browser suite with a visible window

## Project structure

- [src/App.jsx](src/App.jsx) — main workspace shell and app orchestration
- [src/components/StoryboardSidebar.jsx](src/components/StoryboardSidebar.jsx) — authoring controls and export actions
- [src/components/slideModel.js](src/components/slideModel.js) — slide defaults, import parsing, and validation logic
- [src/components/storyline](src/components/storyline) — preview, production brief, and layout rendering components
- [src/components/storyline/pptx](src/components/storyline/pptx) — PPTX export pipeline

## Deployment

This repo is now set up for GitHub Pages deployment.

After pushing to your default branch:

- open your GitHub repository settings
- go to Pages
- ensure the build source is GitHub Actions
- wait for the deployment workflow to finish

Your live app will then be available from the Pages URL shown in GitHub.

## Production hardening

The active roadmap is tracked in [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md).

## Status

Current baseline is verified for:

- linting
- unit and integration tests
- production build generation
