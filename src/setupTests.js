import '@testing-library/jest-dom'

// jsdom doesn't implement real media playback — without a stub,
// HTMLMediaElement.prototype.play() throws synchronously instead of
// returning a rejected promise, which breaks any component that calls
// audio.play().catch(...) on mount (e.g. TimeUpOverlay's whip-crack sound).
if (typeof window !== 'undefined') {
  window.HTMLMediaElement.prototype.play = () => Promise.resolve()
}
