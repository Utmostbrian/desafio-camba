import RoundEndScreen from './components/RoundEndScreen'
import NoSeDiceCategory from './screens/categories/NoSeDice'
import TriviaCategory from './screens/categories/Trivia'
import LeyendaCategory from './screens/categories/AdivinaLeyenda'

// Tasks 9-13 each replace one of these stub entries with the real
// category screen-sequence component (Intro -> Game -> RoundEnd).
const CATEGORY_SCREENS = {
  'no-se-dice': NoSeDiceCategory,
  'escucha-la-cancion': null,
  'adivina-la-leyenda': LeyendaCategory,
  trivia: TriviaCategory,
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
