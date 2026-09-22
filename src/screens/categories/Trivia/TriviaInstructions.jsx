import TornCard from '../../../components/TornCard'
import PillButton from '../../../components/PillButton'

export default function TriviaInstructions({ onStart }) {
  return (
    <div className="category-intro">
      <TornCard showDecorations={false}>
        <h3>Explicación</h3>
        <p>
          En está trivia se realizaran diferentes tipos de preguntas de cultura general con
          opción múltiple, su deber es responder rápidamente 5 preguntas, quien haya obtenido
          mayor puntaje gana.
        </p>
      </TornCard>
      <TornCard showDecorations={false}>
        <h3>Instrucciones</h3>
        <ol>
          <li>Lee atentamente las preguntas</li>
          <li>alza la mano para responder</li>
          <li>el primero en responder se lleva 2pt por pregunta</li>
        </ol>
        <p>Tiempo de cada pregunta: 15s</p>
        <PillButton label="¡Inicia!" onClick={onStart} />
      </TornCard>
    </div>
  )
}
