import { useRef, useState } from 'react'
import SplashScreen from './screens/SplashScreen'
import WheelScreen from './screens/WheelScreen'
import CategoryRouter from './CategoryRouter'
import { useStageScale } from './hooks/useStageScale'

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
          <SplashScreen onContinue={() => setStage(STAGES.WHEEL)} />
        )}
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
