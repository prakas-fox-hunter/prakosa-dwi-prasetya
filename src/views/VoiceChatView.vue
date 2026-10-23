<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { RouterLink } from 'vue-router'
import type { AutomaticSpeechRecognitionPipeline, ProgressInfo } from '@huggingface/transformers'

const props = withDefaults(defineProps<{ embedded?: boolean }>(), {
  embedded: false,
})

type SpeechRecognitionResultEventLike = Event & {
  resultIndex?: number
  results: {
    length: number
    [index: number]: {
      isFinal: boolean
      [index: number]: { transcript: string }
    }
  }
}

type SpeechRecognitionLike = {
  continuous: boolean
  interimResults: boolean
  lang: string
  onend: (() => void) | null
  onerror: ((event: Event & { error?: string }) => void) | null
  onresult: ((event: SpeechRecognitionResultEventLike) => void) | null
  start: () => void
  stop: () => void
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike

const isListening = ref(false)
const transcript = ref('')
const interimTranscript = ref('')
const errorMessage = ref('')
const waveformBars = ref(Array.from({ length: 36 }, () => 10))
const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const isTranscribingUpload = ref(false)
const uploadProgress = ref(0)
const uploadStatus = ref('')
const uploadError = ref('')
const transcriptActionStatus = ref('')
const isTranscriptMenuOpen = ref(false)

const MAX_AUDIO_FILE_SIZE = 25 * 1024 * 1024
const MAX_AUDIO_DURATION_SECONDS = 15 * 60
const AUDIO_EXTENSIONS = /\.(flac|m4a|mp3|ogg|wav|webm)$/i
const AUDIO_MIME_TYPES = new Set([
  'audio/flac',
  'audio/mp4',
  'audio/mpeg',
  'audio/ogg',
  'audio/wav',
  'audio/webm',
  'audio/x-flac',
  'audio/x-m4a',
  'audio/x-wav',
])

let recognition: SpeechRecognitionLike | null = null
let audioContext: AudioContext | null = null
let analyser: AnalyserNode | null = null
let mediaStream: MediaStream | null = null
let animationFrame = 0
let shouldRestart = false
let recognitionStarted = false
let transcriberPromise: Promise<AutomaticSpeechRecognitionPipeline> | null = null
const TRANSCRIPTION_MODEL = 'Xenova/whisper-base'

const displayedTranscript = computed(() => `${transcript.value} ${interimTranscript.value}`.trim())

async function copyTranscript() {
  const text = transcript.value.trim()
  if (!text) return

  transcriptActionStatus.value = ''
  try {
    await navigator.clipboard.writeText(text)
    transcriptActionStatus.value = 'Berhasil disalin ke clipboard.'
  } catch {
    transcriptActionStatus.value = 'Clipboard tidak tersedia. Pilih teks transkrip secara manual.'
  }
}

function saveTranscript() {
  const text = transcript.value.trim()
  if (!text) return

  const file = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = url
  link.download = 'voice-chat-transcript.txt'
  link.click()
  URL.revokeObjectURL(url)
  transcriptActionStatus.value = 'Berhasil disimpan sebagai file teks.'
}

function clearTranscript() {
  transcript.value = ''
  interimTranscript.value = ''
  transcriptActionStatus.value = 'Transkrip dibersihkan.'
  isTranscriptMenuOpen.value = false
}

async function handleCopyAction() {
  isTranscriptMenuOpen.value = false
  await copyTranscript()
}

function handleSaveAction() {
  isTranscriptMenuOpen.value = false
  saveTranscript()
}

function isAudioFile(file: File) {
  if (file.type) return AUDIO_MIME_TYPES.has(file.type.toLowerCase())
  return AUDIO_EXTENSIONS.test(file.name)
}

function readAudioDuration(file: File) {
  const audio = document.createElement('audio')
  const audioUrl = URL.createObjectURL(file)

  return new Promise<number>((resolve, reject) => {
    const cleanup = () => {
      audio.onloadedmetadata = null
      audio.onerror = null
      audio.removeAttribute('src')
      audio.load()
      URL.revokeObjectURL(audioUrl)
    }

    audio.preload = 'metadata'
    audio.onloadedmetadata = () => {
      const duration = audio.duration
      cleanup()
      if (!Number.isFinite(duration) || duration <= 0) {
        reject(new Error('Durasi audio tidak dapat divalidasi.'))
        return
      }
      resolve(duration)
    }
    audio.onerror = () => {
      cleanup()
      reject(new Error('File audio rusak atau formatnya tidak didukung browser.'))
    }
    audio.src = audioUrl
  })
}

function getTranscriber() {
  if (!transcriberPromise) {
    transcriberPromise = import('@huggingface/transformers').then(({ pipeline }) =>
      pipeline('automatic-speech-recognition', TRANSCRIPTION_MODEL, {
        progress_callback: (progress: ProgressInfo) => {
          if ('progress' in progress && typeof progress.progress === 'number') {
            uploadProgress.value = Math.round(progress.progress)
          }
        },
      }),
    )
  }

  return transcriberPromise
}

async function transcribeAudioFile(file: File) {
  if (isTranscribingUpload.value) return

  uploadError.value = ''
  uploadStatus.value = ''
  uploadProgress.value = 0

  if (!isAudioFile(file)) {
    uploadError.value = 'Tipe file ditolak. Pilih MP3, WAV, M4A, OGG, FLAC, atau WebM.'
    return
  }

  if (file.size > MAX_AUDIO_FILE_SIZE) {
    uploadError.value = 'Ukuran file audio terlalu besar. Batasnya 25 MB.'
    return
  }

  let audioUrl: string | null = null
  isTranscribingUpload.value = true
  try {
    const duration = await readAudioDuration(file)
    if (duration > MAX_AUDIO_DURATION_SECONDS) {
      throw new Error('Durasi audio terlalu panjang. Batasnya 15 menit.')
    }

    audioUrl = URL.createObjectURL(file)
    uploadStatus.value = 'Memuat model Whisper Base gratis...'
    const transcriber = await getTranscriber()
    uploadStatus.value = `Mentranskripsikan ${file.name}...`
    const result = await transcriber(audioUrl, {
      language: 'indonesian',
      task: 'transcribe',
      chunk_length_s: 30,
      stride_length_s: 5,
    })
    const text = typeof result === 'object' && result !== null && 'text' in result ? String(result.text).trim() : ''
    if (!text) throw new Error('Tidak ada ucapan yang berhasil dikenali dari file audio tersebut.')
    transcript.value = `${transcript.value.trim()}\n\n[${file.name}]\n${text}`.trim()
    uploadStatus.value = 'Transkripsi selesai.'
  } catch (error) {
    uploadError.value = error instanceof Error ? error.message : 'Transkripsi audio gagal.'
    uploadStatus.value = ''
  } finally {
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    isTranscribingUpload.value = false
  }
}

function handleFileInput(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) void transcribeAudioFile(file)
  input.value = ''
}

function handleDrop(event: DragEvent) {
  isDragging.value = false
  const file = event.dataTransfer?.files[0]
  if (file) void transcribeAudioFile(file)
}

function getSpeechRecognitionConstructor() {
  const speechWindow = window as typeof window & {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }

  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition
}

function animateWaveform() {
  if (!analyser) return

  const data = new Uint8Array(analyser.frequencyBinCount)
  analyser.getByteFrequencyData(data)
  waveformBars.value = waveformBars.value.map((_, index) => {
    const sample = data[Math.floor((index / waveformBars.value.length) * data.length)] ?? 0
    return Math.max(8, Math.round((sample / 255) * 72))
  })
  animationFrame = requestAnimationFrame(animateWaveform)
}

async function startAudioVisualization() {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error('Microphone access is not supported by this browser.')
  }

  mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
  audioContext = new AudioContext()
  analyser = audioContext.createAnalyser()
  analyser.fftSize = 128
  audioContext.createMediaStreamSource(mediaStream).connect(analyser)
  animateWaveform()
}

function stopAudioVisualization() {
  cancelAnimationFrame(animationFrame)
  animationFrame = 0
  mediaStream?.getTracks().forEach((track) => track.stop())
  mediaStream = null
  analyser = null
  void audioContext?.close()
  audioContext = null
  waveformBars.value = waveformBars.value.map(() => 10)
}

function setupRecognition() {
  const SpeechRecognition = getSpeechRecognitionConstructor()
  if (!SpeechRecognition) {
    throw new Error('Browser speech recognition is not supported. Please use a recent Edge or Chrome browser.')
  }

  recognition = new SpeechRecognition()
  recognition.continuous = true
  recognition.interimResults = true
  recognition.lang = 'id-ID'
  recognition.onresult = (event) => {
    let interim = ''
    for (let index = event.resultIndex ?? 0; index < event.results.length; index += 1) {
      const result = event.results[index]
      if (!result) continue
      const alternative = result[0]
      if (!alternative) continue
      if (result.isFinal) transcript.value += `${alternative.transcript.trim()} `
      else interim += alternative.transcript
    }
    interimTranscript.value = interim
  }
  recognition.onerror = (event) => {
    if (event.error !== 'aborted') errorMessage.value = `Speech recognition error: ${event.error ?? 'unknown error'}.`
  }
  recognition.onend = () => {
    recognitionStarted = false
    if (shouldRestart) {
      recognition?.start()
      recognitionStarted = true
    }
  }
}

async function startVoiceChat() {
  errorMessage.value = ''
  try {
    setupRecognition()
    await startAudioVisualization()
    shouldRestart = true
    recognition?.start()
    recognitionStarted = true
    isListening.value = true
  } catch (error) {
    stopVoiceChat()
    errorMessage.value = error instanceof Error ? error.message : 'Unable to start Voice Chat.'
  }
}

function stopVoiceChat() {
  shouldRestart = false
  if (recognitionStarted) recognition?.stop()
  recognitionStarted = false
  recognition = null
  isListening.value = false
  interimTranscript.value = ''
  stopAudioVisualization()
}

onBeforeUnmount(stopVoiceChat)
</script>

<template>
  <main class="voice-chat-page" :class="{ 'is-embedded': props.embedded }">
    <section class="voice-chat-shell" aria-labelledby="voice-chat-title">
      <RouterLink v-if="!props.embedded" class="voice-chat-back" to="/">&larr; Kembali ke portfolio</RouterLink>
      <p class="voice-chat-eyebrow">ANTARMUKA SUARA</p>
      <h1 id="voice-chat-title">Voice Chat</h1>
      <p class="voice-chat-intro">Bicara secara alami dan lihat suara kamu berubah menjadi teks secara real-time.</p>

      <div class="voice-visualizer" :class="{ 'is-listening': isListening }" aria-label="Audio resonance visualization" role="img">
        <span v-for="(height, index) in waveformBars" :key="index" class="voice-bar" :style="{ height: `${height}px` }"></span>
      </div>

      <div class="voice-controls">
        <button class="voice-button voice-button-primary" type="button" :disabled="isListening" @click="startVoiceChat">
          {{ isListening ? 'Mendengarkan...' : 'Mulai berbicara' }}
        </button>
        <button class="voice-button voice-button-secondary" type="button" :disabled="!isListening" @click="stopVoiceChat">
          Berhenti
        </button>
      </div>

      <section
        class="audio-upload"
        :class="{ 'is-dragging': isDragging }"
        aria-labelledby="audio-upload-title"
        @dragenter.prevent="isDragging = true"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop"
      >
        <input
          ref="fileInput"
          class="audio-file-input"
          type="file"
          accept="audio/*"
          aria-label="Pilih file audio untuk ditranskripsikan"
          @change="handleFileInput"
        />
        <p id="audio-upload-title" class="audio-upload-title">Transkripsikan rekaman audio</p>
        <p class="audio-upload-copy">Pilih file audio atau tarik dan lepaskan ke area ini. Maksimal 25 MB atau 15 menit.</p>
        <button class="voice-button voice-button-secondary" type="button" :disabled="isTranscribingUpload" @click="fileInput?.click()">
          {{ isTranscribingUpload ? 'Memproses...' : 'Pilih file audio' }}
        </button>
        <progress v-if="isTranscribingUpload && uploadProgress > 0" class="audio-progress" max="100" :value="uploadProgress">
          {{ uploadProgress }}%
        </progress>
        <p v-if="uploadStatus" class="audio-status" aria-live="polite">{{ uploadStatus }}</p>
        <p v-if="uploadError" class="voice-error" role="alert">{{ uploadError }}</p>
        <p class="audio-security-note">File hanya divalidasi dan dibaca di browser; tidak dijalankan atau dikirim ke server.</p>
      </section>

      <p v-if="errorMessage" class="voice-error" role="alert">{{ errorMessage }}</p>
      <section class="voice-transcript-panel" aria-live="polite" aria-atomic="false">
        <div class="voice-transcript-heading">
          <p class="voice-transcript-label">Transkrip</p>
          <div class="transcript-actions">
            <button
              class="transcript-actions-trigger"
              type="button"
              aria-haspopup="menu"
              :aria-expanded="isTranscriptMenuOpen"
              aria-label="Buka aksi transkrip"
              @click="isTranscriptMenuOpen = !isTranscriptMenuOpen"
              @keydown.esc="isTranscriptMenuOpen = false"
            >
              <span>Actions</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m7 10 5 5 5-5" />
              </svg>
            </button>
            <div v-if="isTranscriptMenuOpen" class="transcript-actions-menu" role="menu" @click.stop>
              <button
                class="transcript-menu-item"
                type="button"
                role="menuitem"
                :disabled="!transcript.trim()"
                @click="handleCopyAction"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="8" y="8" width="11" height="12" rx="2" />
                  <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2" />
                </svg>
                <span>Copy</span>
              </button>
              <button
                class="transcript-menu-item"
                type="button"
                role="menuitem"
                :disabled="!transcript.trim()"
                @click="handleSaveAction"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3v11m0 0 4-4m-4 4-4-4" />
                  <path d="M5 16v2a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-2" />
                </svg>
                <span>Save</span>
              </button>
              <button class="transcript-menu-item transcript-menu-item-danger" type="button" role="menuitem" :disabled="!transcript.trim()" @click="clearTranscript">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 7h16m-10 4v6m4-6v6M9 7V4h6v3m-9 0 1 13h10l1-13" />
                </svg>
                <span>Clear</span>
              </button>
            </div>
          </div>
        </div>
        <p class="voice-transcript">{{ displayedTranscript || 'Ucapan kamu akan tampil di sini.' }}</p>
        <p v-if="transcriptActionStatus" class="transcript-action-status" aria-live="polite">{{ transcriptActionStatus }}</p>
      </section>
      <p class="voice-chat-note">Browser akan meminta izin mikrofon. Model Whisper Base gratis diunduh saat pertama kali digunakan dan diproses di browser.</p>
    </section>
  </main>
</template>

<style scoped>
.voice-chat-page {
  min-height: 100vh;
  padding: 3rem 1.5rem;
  background: #101b2a;
  color: #f7f4ec;
}

.voice-chat-page.is-embedded {
  min-height: 0;
  padding: 0;
  background: transparent;
}

.voice-chat-shell {
  width: min(760px, 100%);
  margin: 0 auto;
}

.voice-chat-page.is-embedded .voice-chat-shell {
  width: 100%;
}

.voice-chat-page.is-embedded .voice-chat-eyebrow {
  margin-top: 0;
}

.voice-chat-page.is-embedded h1 {
  font-size: clamp(2rem, 5vw, 3.4rem);
}

.voice-chat-back {
  color: #adc4d8;
  text-decoration: none;
}

.voice-chat-eyebrow {
  margin: 5rem 0 1rem;
  color: #f0a46b;
  font-size: 0.75rem;
  letter-spacing: 0.2em;
}

h1 {
  margin: 0;
  font-size: clamp(3rem, 10vw, 7rem);
  line-height: 0.95;
}

.voice-chat-intro {
  max-width: 32rem;
  color: #c7d3dd;
  font-size: 1.1rem;
  line-height: 1.7;
}

.voice-visualizer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  min-height: 12rem;
  margin: 3rem 0 2rem;
  padding: 2rem 1rem;
  border: 1px solid rgb(172 196 216 / 25%);
  border-radius: 1.5rem;
  background: radial-gradient(circle, rgb(54 118 159 / 35%), transparent 68%);
}

.voice-bar {
  width: 0.3rem;
  min-height: 0.5rem;
  border-radius: 999px;
  background: #f0a46b;
  transition: height 80ms ease, opacity 200ms ease;
  opacity: 0.65;
}

.voice-visualizer.is-listening .voice-bar {
  opacity: 1;
  box-shadow: 0 0 1rem rgb(240 164 107 / 45%);
}

.voice-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.voice-button {
  padding: 0.85rem 1.25rem;
  border: 1px solid transparent;
  border-radius: 999px;
  cursor: pointer;
  font: inherit;
}

.voice-button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.voice-button-primary {
  background: #f0a46b;
  color: #101b2a;
}

.voice-button-secondary {
  border-color: #adc4d8;
  background: transparent;
  color: #f7f4ec;
}

.voice-error {
  margin-top: 1rem;
  color: #ffb4ab;
}

.audio-upload {
  margin-top: 2rem;
  padding: 1.5rem;
  border: 1px dashed rgb(172 196 216 / 55%);
  border-radius: 1.25rem;
  background: rgb(255 255 255 / 4%);
  text-align: center;
  transition: border-color 160ms ease, background 160ms ease;
}

.audio-upload.is-dragging {
  border-color: #f0a46b;
  background: rgb(240 164 107 / 12%);
}

.audio-file-input {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

.audio-upload-title {
  margin: 0;
  color: #f7f4ec;
  font-size: 1.1rem;
  font-weight: 700;
}

.audio-upload-copy,
.audio-status {
  color: #c7d3dd;
  line-height: 1.6;
}

.audio-security-note {
  margin: 1rem 0 0;
  color: #9fb1bf;
  font-size: 0.78rem;
  line-height: 1.5;
}

.audio-progress {
  display: block;
  width: min(100%, 26rem);
  height: 0.45rem;
  margin: 1rem auto 0;
  accent-color: #f0a46b;
}

.voice-transcript-panel {
  min-height: 9rem;
  margin-top: 2rem;
  padding: 1.5rem;
  border-left: 3px solid #f0a46b;
  background: rgb(255 255 255 / 6%);
}

.voice-transcript-label {
  margin: 0;
  color: #f0a46b;
  font-size: 0.75rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.voice-transcript {
  margin-bottom: 0;
  color: #f7f4ec;
  font-size: 1.25rem;
  line-height: 1.7;
}

.voice-transcript-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.transcript-actions {
  position: relative;
  margin-top: -0.45rem;
}

.transcript-actions-trigger,
.transcript-menu-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid rgb(172 196 216 / 35%);
  border-radius: 0.7rem;
  font: inherit;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: border-color 160ms ease, background 160ms ease, color 160ms ease;
}

.transcript-actions-trigger {
  min-height: 2.2rem;
  padding: 0.45rem 0.7rem;
  background: rgb(172 196 216 / 10%);
  color: #d9e6ee;
}

.transcript-actions-trigger:hover,
.transcript-actions-trigger[aria-expanded='true'] {
  border-color: #f0a46b;
  background: rgb(240 164 107 / 16%);
  color: #ffd8b8;
}

.transcript-actions-trigger svg {
  width: 0.9rem;
  height: 0.9rem;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.transcript-actions-menu {
  position: absolute;
  z-index: 2;
  top: calc(100% + 0.45rem);
  right: 0;
  display: grid;
  min-width: 9rem;
  padding: 0.35rem;
  border: 1px solid rgb(172 196 216 / 25%);
  border-radius: 0.8rem;
  background: #17283a;
  box-shadow: 0 1rem 2rem rgb(0 0 0 / 25%);
}

.transcript-menu-item {
  width: 100%;
  justify-content: flex-start;
  padding: 0.55rem 0.65rem;
  border-color: transparent;
  background: transparent;
  color: #d9e6ee;
  text-align: left;
}

.transcript-menu-item:hover:not(:disabled) {
  border-color: rgb(240 164 107 / 35%);
  background: rgb(240 164 107 / 14%);
  color: #ffd8b8;
}

.transcript-menu-item-danger:hover:not(:disabled) {
  border-color: rgb(255 180 171 / 35%);
  background: rgb(255 180 171 / 12%);
  color: #ffb4ab;
}

.transcript-actions-trigger:disabled,
.transcript-menu-item:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.transcript-menu-item svg {
  width: 1rem;
  height: 1rem;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.transcript-action-status {
  margin-bottom: 0;
  color: #b9d7c1;
  font-size: 0.85rem;
}

.voice-chat-note {
  color: #9fb1bf;
  font-size: 0.85rem;
  line-height: 1.6;
}
</style>
