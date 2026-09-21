// Module-level singleton so any component can start/pause/mute the
// background track without prop-drilling through the whole screen tree.
// Deliberately not a React hook/context — there's exactly one audio
// graph for the app's whole lifetime.
//
// Uses the Web Audio API (AudioBufferSourceNode with loop = true) instead
// of a plain <audio loop> element: a decoded AudioBuffer loops at the
// exact sample with no re-seek/re-decode at the boundary, so there's no
// audible click/gap when it restarts — the gap people hear with
// <audio loop> comes from the element re-buffering at the loop point,
// not from silence in the file itself.
//
// AudioBufferSourceNode can only be started once, so "pause"/"resume"
// here just ramps a GainNode to/from 0 instead of stopping the source —
// the track keeps advancing silently while "paused", which is fine for
// ambient background music.

const TRACK_URL = '/audio/portada.mp3'
const VOLUME = 0.25
const FADE_SECONDS = 0.05

let ctx = null
let gainNode = null
let sourceNode = null
let bufferPromise = null
let muted = false
let pausedForForeground = false
let started = false

function getAudioContextClass() {
  return typeof window !== 'undefined'
    ? window.AudioContext || window.webkitAudioContext
    : undefined
}

function ensureContext() {
  if (ctx) return ctx
  const AudioContextClass = getAudioContextClass()
  if (!AudioContextClass) return null // not supported (e.g. jsdom in tests)
  ctx = new AudioContextClass()
  gainNode = ctx.createGain()
  gainNode.gain.value = 0
  gainNode.connect(ctx.destination)
  return ctx
}

async function loadBuffer() {
  if (bufferPromise) return bufferPromise
  bufferPromise = (async () => {
    const response = await fetch(TRACK_URL)
    const arrayBuffer = await response.arrayBuffer()
    return ctx.decodeAudioData(arrayBuffer)
  })()
  return bufferPromise
}

function targetVolume() {
  return muted || pausedForForeground ? 0 : VOLUME
}

function applyVolume() {
  if (!ctx || !gainNode) return
  const now = ctx.currentTime
  gainNode.gain.cancelScheduledValues(now)
  gainNode.gain.setValueAtTime(gainNode.gain.value, now)
  gainNode.gain.linearRampToValueAtTime(targetVolume(), now + FADE_SECONDS)
}

async function start() {
  const audioCtx = ensureContext()
  if (!audioCtx) return
  try {
    if (audioCtx.state === 'suspended') await audioCtx.resume()
    if (started) {
      applyVolume()
      return
    }
    const buffer = await loadBuffer()
    // A second call could have started the source while this one was
    // awaiting the fetch/decode above — never start two sources.
    if (started) {
      applyVolume()
      return
    }
    sourceNode = audioCtx.createBufferSource()
    sourceNode.buffer = buffer
    sourceNode.loop = true
    sourceNode.connect(gainNode)
    sourceNode.start(0)
    started = true
    applyVolume()
  } catch {
    // Autoplay blocked, network error, unsupported format, decode failure,
    // or no Web Audio support at all — background music is decorative,
    // never let it break the app.
  }
}

export function playBackgroundMusic() {
  pausedForForeground = false
  start()
}

export function pauseBackgroundMusic() {
  pausedForForeground = true
  applyVolume()
}

export function toggleMuteBackgroundMusic() {
  muted = !muted
  if (!started) start()
  applyVolume()
  return muted
}

export function isBackgroundMusicMuted() {
  return muted
}
