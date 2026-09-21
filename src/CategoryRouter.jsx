import RoundEndScreen from './components/RoundEndScreen'
import NoSeDiceCategory from './screens/categories/NoSeDice'
import TriviaCategory from './screens/categories/Trivia'
import LeyendaCategory from './screens/categories/AdivinaLeyenda'
import CancionCategory from './screens/categories/EscuchaCancion'
import EnchoqueCategory from './screens/categories/Enchoque'
import MencionaLugaresCategory from './screens/categories/MencionaLugares'

// All 6 categories are real screen-sequence components (Intro -> Game -> RoundEnd).
const CATEGORY_SCREENS = {
  'no-se-dice': NoSeDiceCategory,
  'escucha-la-cancion': CancionCategory,
  'adivina-la-leyenda': LeyendaCategory,
  trivia: TriviaCategory,
  enchoque: EnchoqueCategory,
  'menciona-3-lugares': MencionaLugaresCategory,
}

export default function CategoryRouter({ categoryId, onRoundComplete }) {
  const CategoryScreen = CATEGORY_SCREENS[categoryId]
  if (CategoryScreen) {
    return <CategoryScreen onRoundComplete={onRoundComplete} />
  }
  // Defensive fallback for an unknown category id.
  return (
    <RoundEndScreen
      message={`(stub) Categoría "${categoryId}" — pendiente de implementar`}
      onBackToWheel={onRoundComplete}
    />
  )
}
