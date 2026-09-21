import { useEffect, useState } from 'react'

const STAGE_WIDTH = 1440
const STAGE_HEIGHT = 1024

function computeScale() {
  return Math.max(window.innerWidth / STAGE_WIDTH, window.innerHeight / STAGE_HEIGHT)
}

// The app is built against a fixed 1440x1024 base layout. We scale the whole
// `.stage` up or down uniformly so it always COVERS the full viewport (no
// letterboxing bars), matching the design's intent of using all available
// screen space. `.app-shell`'s `overflow: hidden` crops whatever small
// sliver falls outside the viewport on non-1440:1024 aspect ratios.
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
