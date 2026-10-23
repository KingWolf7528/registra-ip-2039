import { useEffect, useReducer, useRef } from 'react'
import BarraProgreso from '../components/wizard/BarraProgreso.jsx'
import PasoArchivo from '../components/wizard/PasoArchivo.jsx'
import PasoMetadatos from '../components/wizard/PasoMetadatos.jsx'
import PasoVistaPrevia from '../components/wizard/PasoVistaPrevia.jsx'
import PasoConfirmacion from '../components/wizard/PasoConfirmacion.jsx'
import { PASOS, estadoInicial, validarPaso, wizardReducer } from '../utils/wizardObra.js'
import { registrarObra } from '../utils/api.js'
import { obtenerUsuario } from '../utils/sesion.js'

// Wizard de 4 pasos. Un solo useReducer en el componente padre guarda
// todo lo capturado; los pasos solo reciben datos y avisan cambios.
function RegistrarObra() {
  const [estado, dispatch] = useReducer(wizardReducer, estadoInicial)
  const usuario = obtenerUsuario()
  const tituloPaso = useRef(null)
  const primerRender = useRef(true)

  // Al cambiar de paso, llevamos el foco al título (lectores de pantalla y teclado).
  useEffect(() => {
    if (primerRender.current) {
      primerRender.current = false
      return
    }
    tituloPaso.current?.focus()
  }, [estado.paso])

  const { paso, envio } = estado
  const { valido, pendientes } = validarPaso(estado, paso)

  async function confirmar() {
    dispatch({ type: 'ENVIO_INICIO' })
    try {
      const obra = await registrarObra(estado, usuario)
      dispatch({ type: 'ENVIO_EXITO', obra })
    } catch (err) {
      // fetch lanza TypeError cuando el servidor no responde (apagado o sin red).
      const mensajes =
        err instanceof TypeError
          ? ['No hay conexión con el servidor (http://localhost:4000).']
          : err.message.split('\n')
      dispatch({ type: 'ENVIO_ERROR', errores: mensajes })
    }
  }

  return (
    <section className="tarjeta wizard" aria-labelledby="titulo-wizard">
      <h1 id="titulo-wizard" className="titulo">
        Registrar obra
      </h1>
      <BarraProgreso
        pasoActual={paso}
        onIrA={envio.estado === 'inactivo' ? (n) => dispatch({ type: 'IR_A', paso: n }) : null}
      />

      <h2 ref={tituloPaso} tabIndex={-1} className="wizard__paso-titulo">
        {paso}. {PASOS[paso - 1]}
      </h2>

      {paso === 1 && (
        <PasoArchivo
          archivo={estado.archivo}
          onCambiar={(archivo) => dispatch({ type: 'SET_ARCHIVO', archivo })}
        />
      )}
      {paso === 2 && (
        <PasoMetadatos
          titulo={estado.titulo}
          categoria={estado.categoria}
          descripcion={estado.descripcion}
          onCambiar={(campo, valor) => dispatch({ type: 'SET_CAMPO', campo, valor })}
        />
      )}
      {paso === 3 && (
        <PasoVistaPrevia
          estado={estado}
          usuario={usuario}
          onEditar={(n) => dispatch({ type: 'IR_A', paso: n })}
        />
      )}
      {paso === 4 && (
        <PasoConfirmacion
          envio={envio}
          onReintentar={confirmar}
          onAtras={() => dispatch({ type: 'ATRAS' })}
          onNueva={() => dispatch({ type: 'REINICIAR' })}
        />
      )}

      {paso < 4 && (
        <>
          {/* Explica por qué "Siguiente" está deshabilitado. */}
          <div className="wizard__pendientes" aria-live="polite">
            {!valido && (
              <p>
                <strong>Para continuar:</strong> {pendientes.join(' ')}
              </p>
            )}
          </div>

          <div className="wizard__acciones">
            <button
              type="button"
              className="boton boton--secundario"
              onClick={() => dispatch({ type: 'ATRAS' })}
              disabled={paso === 1}
            >
              ← Atrás
            </button>
            {paso < 3 ? (
              <button
                type="button"
                className="boton"
                onClick={() => dispatch({ type: 'SIGUIENTE' })}
                disabled={!valido}
              >
                Siguiente →
              </button>
            ) : (
              <button type="button" className="boton" onClick={confirmar}>
                Confirmar y registrar
              </button>
            )}
          </div>
        </>
      )}
    </section>
  )
}

export default RegistrarObra
