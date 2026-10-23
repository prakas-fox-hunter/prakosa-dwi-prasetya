# Voice Chat Project Card Design

## Intent

Add a third Project Example card named **Voice Chat** below **Swagger API**. Selecting it must navigate to a new local `/voice-chat` page with a browser-based voice prototype.

## Scope

- Add the card to the existing `demoProjectExamples` data structure.
- Add a matching Vue Router route and a Voice Chat page that follows the portfolio shell style.
- Show an animated audio-resonance waveform driven by microphone input.
- Use Web Speech API to display final and interim transcript text while the user speaks.
- Provide start/stop controls and clear microphone/browser capability errors.
- Provide file selection and drag-and-drop audio upload for transcription.
- Run a free multilingual Whisper model in the browser and append the result to the transcript chat.
- Require explicit browser microphone permission; do not add an API key or external voice service.
- Preserve the existing monitoring and Swagger cards and both Indonesian/English labels.
- This is a browser-native prototype; speech recognition quality and availability depend on the browser and connection.
- The first upload downloads the selected Whisper model into the browser cache; subsequent uploads reuse it when available.

## Approaches

1. Add only a visual card: rejected because the requested button must open a page.
2. Link to an external voice service: rejected because no external destination was supplied and it would add an unapproved dependency.
3. Add a local `/voice-chat` route and browser-native voice page: selected because it is self-contained, requires no API key, and directly demonstrates the requested waveform and transcript.

## Success criteria

- The Project Example section renders Voice Chat after Swagger API.
- The card links to `/voice-chat`.
- Visiting `/voice-chat` renders a page without changing existing routes.
- Starting the session requests microphone access, animates the waveform, and updates visible transcript text.
- Stopping the session releases the microphone and stops animation.
- Selecting or dropping a supported audio file shows progress and appends a transcription message when complete.
- Unsupported files and transcription failures show actionable errors without crashing the page.
- The app keeps audio and transcript data in memory only; it provides clipboard copy and an explicit `.txt` download action, but does not use browser storage or autosave.
- Before model processing, audio is limited to approved audio MIME types/extensions, 25 MB, and 15 minutes, and browser metadata parsing must succeed.
- The app must never execute an uploaded file or pass it to a shell; malformed files are rejected and processing resources are released.
- These checks are defense-in-depth, not an antivirus scan or a guarantee that a file is malware-free.
- Existing project example tests and the production build pass.

## Monitoring integration follow-up

Voice Chat is now an embedded menu inside the Web Monitoring dashboard rather than a separate Project Example card or top-level page. The dashboard renders the existing Voice Chat view in embedded mode, and the former `/voice-chat` URL redirects to that menu for backwards compatibility.
