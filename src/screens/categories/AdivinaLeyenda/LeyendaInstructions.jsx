import TornCard from '../../../components/TornCard'
import PillButton from '../../../components/PillButton'

export default function LeyendaInstructions({ onStart }) {
  return (
    <div className="category-intro">
      <TornCard>
        <h3>Explicación</h3>
        <p>
          En este juego no hay que ser opa, Ok? Uno de los dos jugadores debe darse la vuelta y
          esperar a que el otro jugador vea el dibujo de la leyenda en pantalla, luego el jugador
          que se dio la vuelta debe adivinar la leyenda a través de mímicas del jugador que lo ve.
          Cualquiera de los dos puede ganar, todo depende de que el otro jugador adivine o no.
        </p>
      </TornCard>
      <TornCard>
        <h3>Instrucciones</h3>
        <ol>
          <li>Jueguen piedra papel o tijera para saber quien adivina y quien hace la mímica</li>
          <li>El jugador que adivina se debe dar la vuelta</li>
          <li>El jugador que ve la imagen tiene 20s para recordar la leyenda y saber hacer la mímica</li>
          <li>Puede ganar cualquiera de los dos, todo depende si el otro jugador adivina o no</li>
        </ol>
        <p>Tiempo para adivinar: 35s</p>
        <PillButton label="¡Inicia!" onClick={onStart} />
      </TornCard>
    </div>
  )
}
