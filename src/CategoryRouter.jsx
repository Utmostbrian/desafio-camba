import RoundEndScreen from './components/RoundEndScreen'

// Tasks 9-13 each replace one of these stub entries with the real
// category screen-sequence component (Intro -> Game -> RoundEnd).
const CATEGORY_SCREENS = {
  'no-se-dice': null,
  'escucha-la-cancion': null,
  'adivina-la-leyenda': null,
  trivia: null,
  enchoque: null,
}

export default function CategoryRouter({ categoryId, onRoundComplete }) {
  const CategoryScreen = CATEGORY_SCREENS[categoryId]
  if (CategoryScreen) {
    return <CategoryScreen onRoundComplete={onRoundComplete} />
  }
  // Stub fallback until the real category component is wired in.
  return (
    <RoundEndScreen
      message={`(stub) Categoría "${categoryId}" — pendiente de implementar`}
      onBackToWheel={onRoundComplete}
    />
  )
}
