import { useRef, useState } from 'react'
import SplashScreen from './screens/SplashScreen'
import WheelScreen from './screens/WheelScreen'
import CategoryRouter from './CategoryRouter'
import MusicToggle from './components/MusicToggle'
import { useStageScale } from './hooks/useStageScale'
import { playBackgroundMusic } from './lib/backgroundMusic'

const STAGES = { SPLASH: 'splash', WHEEL: 'wheel', CATEGORY: 'category' }

export default function App() {
  const [stage, setStage] = useState(STAGES.SPLASH)
  const [categoryId, setCategoryId] = useState(null)
  const stageRef = useRef(null)
  const scale = useStageScale()

  return (
    <div className="app-shell">
      <div className="stage" ref={stageRef} style={{ transform: `scale(${scale})` }}>
        {stage === STAGES.SPLASH && (
          <SplashScreen
            onContinue={() => {
              // The tap that leaves the splash is the app's first user
              // gesture — autoplay is blocked before that on every
              // browser that enforces the autoplay policy.
              playBackgroundMusic()
              setStage(STAGES.WHEEL)
            }}
          />
        )}
        {stage !== STAGES.SPLASH && <MusicToggle />}
        {stage === STAGES.WHEEL && (
          <WheelScreen
            onCategorySelected={(id) => {
              setCategoryId(id)
              setStage(STAGES.CATEGORY)
            }}
          />
        )}
        {stage === STAGES.CATEGORY && (
          <CategoryRouter
            categoryId={categoryId}
            onRoundComplete={() => setStage(STAGES.WHEEL)}
          />
        )}
      </div>
    </div>
  )
}
