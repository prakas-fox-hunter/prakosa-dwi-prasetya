# Voice Chat Project Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a Voice Chat project card below Swagger API that opens a local `/voice-chat` page with microphone waveform, live transcript behavior, and free in-browser audio-file transcription.

**Architecture:** Extend the existing project-example data array, add a Vue Router route, and create a focused browser-native voice view. Web Audio API drives the waveform, Web Speech API supplies final and interim microphone transcript text, and Transformers.js runs a multilingual Whisper pipeline for uploaded audio. Avoid API keys and server-side transcription.

**Tech Stack:** Vue 3, TypeScript, Vue Router, Vite, Node test runner.

**Spec:** `docs/superpowers/specs/2026-10-23-voice-chat-project-design.md`

## Global Constraints

- Keep the existing Indonesian/English locale behavior.
- Do not add an external service or API integration.
- Do not modify or remove existing project cards.
- Microphone access must be explicit and stoppable.
- Uploaded audio must stay in the browser; no API key or backend endpoint is introduced.
- Audio and transcript content must not be written to localStorage or IndexedDB; transcript download is allowed only after an explicit user click.
- Treat uploaded files as untrusted data; never execute them or pass them to a shell.

## Review Focus

- Card order: Voice Chat must follow Swagger API.
- Route integrity: existing routes must continue to resolve.
- Build integrity: TypeScript and Vite build must pass.

### Task 1: Add the Voice Chat project entry

**Files:**
- Modify: `src/utils/projectExamples.ts`
- Test: `test/projectExamples.test.ts`

- [ ] Write a failing test asserting the third entry is `{ slug: 'voice-chat', icon: 'voice-chat', route: '/voice-chat' }` and keeps the `Try it` action.
- [ ] Run the focused test and verify it fails because the entry is missing.
- [ ] Extend the project icon union and `demoProjectExamples` with the Voice Chat entry after Swagger.
- [ ] Run the focused test and verify it passes.

### Task 2: Add the local page and route

**Files:**
- Create: `src/views/VoiceChatView.vue`
- Modify: `src/router/index.ts`
- Modify: `src/views/HomeView.vue`

- [ ] Add the `/voice-chat` route and render a Voice Chat page with start/stop controls, waveform bars, transcript output, and capability/permission errors.
- [ ] Update the card icon branch so the new entry has an accessible Voice Chat icon and label.
- [ ] Implement microphone lifecycle cleanup on stop and component unmount.
- [ ] Add an accessible file picker and drag-and-drop zone for common audio formats.
- [ ] Load a free multilingual Whisper model lazily, convert the uploaded audio to mono float audio, and append the transcription to the visible chat transcript.
- [ ] Show model/transcription progress and actionable errors for unsupported files or browser failures.
- [ ] Keep transcript data in memory only and offer explicit clipboard copy plus an explicit local `.txt` save action.
- [ ] Validate allowed audio type, 25 MB maximum size, 15-minute maximum duration, and metadata decoding before creating the transcription object URL; clean up all temporary resources on success and failure.
- [ ] Run the full test suite and production build.

### Task 3: Verify the running application

**Files:**
- No source changes.

- [ ] Request `/` and `/voice-chat` from the local Vite server and verify both return HTTP 200.
- [ ] Check `git diff` and report the changed files.

### Follow-up: Embed Voice Chat in Web Monitoring

- Add Voice Chat to the Monitoring sidebar menu and render the existing voice UI inside the dashboard content area.
- Remove the Voice Chat card from the Project Example section; access remains available from the Monitoring sidebar.
- Keep `/voice-chat` as a compatibility redirect to the embedded menu.
- Preserve the in-memory transcript, explicit clipboard copy, explicit transcript download, and untrusted-audio validation behavior.
- Verify the full test suite, production build, HTTP routes, and `git diff --check`.
