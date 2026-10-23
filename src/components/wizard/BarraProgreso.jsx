import { PASOS } from '../../utils/wizardObra.js'

// Cuatro círculos conectados por una línea. Los pasos ya completados
// muestran ✓ y se pueden pulsar para regresar.
function BarraProgreso({ pasoActual, onIrA }) {
  const porcentaje = ((pasoActual - 1) / (PASOS.length - 1)) * 100

  return (
    <nav className="progreso" aria-label="Progreso del registro">
      <p className="progreso__texto">
        Paso {pasoActual} de {PASOS.length}: <strong>{PASOS[pasoActual - 1]}</strong>
      </p>
      <div className="progreso__linea">
        <div className="progreso__pista" aria-hidden="true">
          <div className="progreso__relleno" style={{ width: `${porcentaje}%` }} />
        </div>
        <ol className="progreso__pasos">
          {PASOS.map((nombre, i) => {
            const numero = i + 1
            const estado =
              numero < pasoActual ? 'completo' : numero === pasoActual ? 'actual' : 'pendiente'
            const contenido = (
              <>
                <span className="progreso__circulo">{estado === 'completo' ? '✓' : numero}</span>
                <span className="progreso__nombre">{nombre}</span>
              </>
            )
            return (
              <li
                key={nombre}
                className={`progreso__paso progreso__paso--${estado}`}
                aria-current={estado === 'actual' ? 'step' : undefined}
              >
                {estado === 'completo' && onIrA ? (
                  <button
                    type="button"
                    className="progreso__boton"
                    onClick={() => onIrA(numero)}
                    aria-label={`Regresar al paso ${numero}: ${nombre}`}
                  >
                    {contenido}
                  </button>
                ) : (
                  <span className="progreso__boton">{contenido}</span>
                )}
              </li>
            )
        })}
        </ol>
      </div>
    </nav>
  )
}

export default BarraProgreso
