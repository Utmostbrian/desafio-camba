import TornCard from '../../../components/TornCard'
import PillButton from '../../../components/PillButton'

export default function TriviaInstructions({ onStart }) {
  return (
    <div className="category-intro explicacion-columns">
      <div className="explicacion-column">
        <TornCard showDecorations={false} frame="suave">
          <h3>Explicación</h3>
          <p>
            En está trivia se realizaran diferentes tipos de preguntas de cultura general con
            opción múltiple, su deber es responder rápidamente 5 preguntas, quien haya obtenido
            mayor puntaje gana.
          </p>
        </TornCard>
        <PillButton label="¡Inicia!" onClick={onStart} />
      </div>
      <div className="explicacion-column">
        <TornCard showDecorations={false} frame="suave">
          <h3>Instrucciones</h3>
          <ol>
            <li>Lee atentamente las preguntas</li>
            <li>alza la mano para responder</li>
            <li>el primero en responder se lleva 2pt por pregunta</li>
          </ol>
        </TornCard>
        <p className="explicacion-column__time-label">Tiempo de cada pregunta:</p>
        <p className="explicacion-column__time-value">15s</p>
      </div>
    </div>
  )
}
