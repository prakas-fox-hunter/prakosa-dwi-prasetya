import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'

const routerSource = readFileSync(new URL('../src/router/index.ts', import.meta.url), 'utf8')
const homeSource = readFileSync(new URL('../src/views/HomeView.vue', import.meta.url), 'utf8')
const voiceChatUrl = new URL('../src/views/VoiceChatView.vue', import.meta.url)
const voiceChatSource = existsSync(voiceChatUrl) ? readFileSync(voiceChatUrl, 'utf8') : ''

test('keeps the old Voice Chat URL as a compatibility redirect into Monitoring', () => {
  assert.match(routerSource, /path:\s*['"]\/voice-chat['"]/) 
  assert.match(routerSource, /redirect:\s*['"]\/dummy-monitoring\?menu=voice-chat['"]|redirect:\s*\(.*voice-chat/s)
})

test('does not render Voice Chat as a Project Example card', () => {
  assert.doesNotMatch(homeSource, /voiceChatProject|project-example-icon-voice/)
})

test('Voice Chat uses microphone audio and live speech recognition', () => {
  assert.match(voiceChatSource, /getUserMedia/)
  assert.match(voiceChatSource, /Microphone access is not supported/)
  assert.match(voiceChatSource, /AudioContext/)
  assert.match(voiceChatSource, /SpeechRecognition|webkitSpeechRecognition/)
  assert.match(voiceChatSource, /interimResults/)
  assert.match(voiceChatSource, /resultIndex/)
  assert.match(voiceChatSource, /Mulai berbicara/)
})

test('Voice Chat transcribes selected or dropped audio in the browser', () => {
  assert.match(voiceChatSource, /@huggingface\/transformers/)
  assert.match(voiceChatSource, /Xenova\/whisper-base/)
  assert.match(voiceChatSource, /type="file"/)
  assert.match(voiceChatSource, /accept="audio\//)
  assert.match(voiceChatSource, /@drop\.prevent/)
  assert.match(voiceChatSource, /automatic-speech-recognition/)
  assert.match(voiceChatSource, /URL\.revokeObjectURL/)
  assert.match(voiceChatSource, /transcript/) 
})

test('Voice Chat can copy or explicitly save the transcript without browser persistence', () => {
  assert.match(voiceChatSource, /navigator\.clipboard\.writeText/)
  assert.match(voiceChatSource, />Copy</)
  assert.match(voiceChatSource, />Save</)
  assert.match(voiceChatSource, />Clear</)
  assert.match(voiceChatSource, /clearTranscript/)
  assert.match(voiceChatSource, /aria-haspopup="menu"/)
  assert.match(voiceChatSource, /role="menu"/)
  assert.match(voiceChatSource, /new Blob/)
  assert.match(voiceChatSource, /download = ['"]voice-chat-transcript\.txt['"]/)
  assert.doesNotMatch(voiceChatSource, /localStorage|indexedDB|IndexedDB/)
})

test('Voice Chat validates audio before model processing and cleans up metadata resources', () => {
  assert.match(voiceChatSource, /MAX_AUDIO_FILE_SIZE/)
  assert.match(voiceChatSource, /loadedmetadata/)
  assert.match(voiceChatSource, /preload = ['"]metadata['"]|preload = ['"]metadata['"]/)
  assert.match(voiceChatSource, /audio\.onerror/)
  assert.match(voiceChatSource, /Ukuran file audio/)
  assert.match(voiceChatSource, /URL\.revokeObjectURL/)
  assert.match(voiceChatSource, /isTranscribingUpload\.value\) return/)
})
