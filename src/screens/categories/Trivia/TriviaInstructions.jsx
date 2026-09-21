import TornCard from '../../../components/TornCard'
import PillButton from '../../../components/PillButton'

export default function TriviaInstructions({ onStart }) {
  return (
    <div className="category-intro">
      <TornCard>
        <h3>Explicación</h3>
        <p>Trivia de cultura general cruceña, opción múltiple, 5 preguntas. Gana quien más puntaje.</p>
      </TornCard>
      <TornCard>
        <h3>Instrucciones</h3>
        <p>Lean la pregunta, alcen la mano. El primero en responder se lleva 2pt por pregunta.</p>
        <p>Tiempo de cada pregunta: 15s</p>
        <PillButton label="¡Inicia!" onClick={onStart} />
      </TornCard>
    </div>
  )
}
