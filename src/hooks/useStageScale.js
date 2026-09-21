import { useEffect, useState } from 'react'

const STAGE_WIDTH = 1440
const STAGE_HEIGHT = 1024

function computeScale() {
  return Math.min(window.innerWidth / STAGE_WIDTH, window.innerHeight / STAGE_HEIGHT, 1)
}

// The app is built against a fixed 1440x1024 base layout. On viewports
// smaller than that, we scale the whole `.stage` down uniformly (never up)
// so it fits without cropping, instead of relying on `.app-shell`'s
// `overflow: hidden` to just clip the extra content.
export function useStageScale() {
  const [scale, setScale] = useState(() => (typeof window === 'undefined' ? 1 : computeScale()))

  useEffect(() => {
    function handleResize() {
      setScale(computeScale())
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return scale
}
