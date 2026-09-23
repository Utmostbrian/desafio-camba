import { getSharedAudioContext } from './backgroundMusic'

// One-shot sound effects, played through the shared AudioContext (see
// backgroundMusic.js) instead of a plain <audio> element. A plain element's
// play() call is blocked by the browser autoplay policy whenever it isn't
// triggered directly by a user gesture — which a countdown expiring via
// setTimeout never is. The shared context is already running by the time
// any of these fire (it's resumed on the splash tap), so scheduling a
// buffer on it plays immediately no matter what triggered the call.

const bufferCache = new Map()

async function loadBuffer(ctx, url) {
  if (bufferCache.has(url)) return bufferCache.get(url)
  const promise = (async () => {
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    return ctx.decodeAudioData(arrayBuffer)
  })()
  bufferCache.set(url, promise)
  return promise
}

// Returns the AudioBufferSourceNode (or null on failure) so a caller that
// needs to cut a longer clip short — e.g. the roulette spin sound, which
// runs longer than the spin animation itself — can call source.stop().
export async function playSfx(url, { volume = 1, fadeOutSeconds = 0 } = {}) {
  const ctx = getSharedAudioContext()
  if (!ctx) return null
  try {
    if (ctx.state === 'suspended') await ctx.resume()
    const buffer = await loadBuffer(ctx, url)
    const source = ctx.createBufferSource()
    source.buffer = buffer
    const gain = ctx.createGain()
    gain.gain.value = volume
    source.connect(gain)
    gain.connect(ctx.destination)
    source.start(0)
    return { source, gain, ctx, fadeOutSeconds }
  } catch {
    // Decorative sound effect — never let a playback failure break the app.
    return null
  }
}

// Stops a handle from playSfx early, optionally fading out first (avoids
// an audible click from cutting a clip off mid-waveform).
export function stopSfx(handle) {
  if (!handle) return
  const { source, gain, ctx, fadeOutSeconds } = handle
  try {
    if (fadeOutSeconds > 0) {
      const now = ctx.currentTime
      gain.gain.cancelScheduledValues(now)
      gain.gain.setValueAtTime(gain.gain.value, now)
      gain.gain.linearRampToValueAtTime(0, now + fadeOutSeconds)
      source.stop(now + fadeOutSeconds)
    } else {
      source.stop()
    }
  } catch {
    // Already stopped/ended — nothing to do.
  }
}
