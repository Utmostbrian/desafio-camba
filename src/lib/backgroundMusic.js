// Module-level singleton so any component can start/pause/mute the
// background track without prop-drilling through the whole screen tree.
// Deliberately not a React hook/context — there's exactly one audio
// element for the whole app, for its whole lifetime.

const TRACK_URL = '/audio/portada.mp3'
const VOLUME = 0.25

let audio = null
let muted = false

function ensureAudio() {
  if (!audio) {
    audio = new Audio(TRACK_URL)
    audio.loop = true
    audio.volume = VOLUME
    // preload='auto' asks the browser to buffer the whole file up front,
    // which is what keeps the native `loop` restart gapless — a partially
    // buffered file can stall for a beat right at the loop point.
    audio.preload = 'auto'
  }
  return audio
}

function safePlay(el) {
  try {
    const result = el.play()
    if (result && typeof result.catch === 'function') {
      // Autoplay can be blocked by browser policy, and play() isn't
      // implemented at all in jsdom (used by the test suite) — either
      // way, silently no-op rather than crash.
      result.catch(() => {})
    }
  } catch {
    // Same as above, for environments where play() throws synchronously.
  }
}

export function playBackgroundMusic() {
  const el = ensureAudio()
  if (!muted) safePlay(el)
}

function safePause(el) {
  // pause() isn't implemented in jsdom (used by the test suite) and
  // throws there — same defensive pattern as safePlay.
  try {
    el.pause()
  } catch {
    // ignore
  }
}

export function pauseBackgroundMusic() {
  if (audio) safePause(audio)
}

export function toggleMuteBackgroundMusic() {
  const el = ensureAudio()
  muted = !muted
  if (muted) {
    safePause(el)
  } else {
    safePlay(el)
  }
  return muted
}

export function isBackgroundMusicMuted() {
  return muted
}
