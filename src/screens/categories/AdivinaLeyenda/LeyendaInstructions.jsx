import TornCard from '../../../components/TornCard'
import PillButton from '../../../components/PillButton'

export default function LeyendaInstructions({ onStart }) {
  return (
    <div className="category-intro">
      <TornCard>
        <h2>Adivina la Leyenda!</h2>
        <p>La típicas de las típicas</p>
      </TornCard>
      <TornCard>
        <h3>Explicación</h3>
        <p>Un jugador se da vuelta. El otro ve el dibujo de la leyenda y debe hacer mímica sin hablar.</p>
        <h3>Instrucciones</h3>
        <ol>
          <li>Piedra, papel o tijera decide quién adivina y quién mimica.</li>
          <li>El que adivina se da vuelta.</li>
          <li>El que ve la imagen tiene 20s para memorizarla y empezar a mimicar.</li>
        </ol>
        <p>Tiempo para adivinar: 35s</p>
        <PillButton label="¡Inicia!" onClick={onStart} />
      </TornCard>
    </div>
  )
}
