import { useState } from 'react'
import SplashScreen from './screens/SplashScreen'
import WheelScreen from './screens/WheelScreen'
import CategoryRouter from './CategoryRouter'

const STAGES = { SPLASH: 'splash', WHEEL: 'wheel', CATEGORY: 'category' }

export default function App() {
  const [stage, setStage] = useState(STAGES.SPLASH)
  const [categoryId, setCategoryId] = useState(null)

  return (
    <div className="app-shell">
      <div className="stage">
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
