import { useRef, useState } from 'react'
import { TIPOS_ACEPTADOS } from '../../config.js'
import { formatearTamano } from '../../utils/wizardObra.js'
import { useVistaPrevia } from '../../utils/useVistaPrevia.js'

function PasoArchivo({ archivo, onCambiar }) {
  const input = useRef(null)
  const [arrastrando, setArrastrando] = useState(false)
  const vistaPrevia = useVistaPrevia(archivo)

  function elegir(lista) {
    if (lista && lista[0]) onCambiar(lista[0])
  }

  return (
    <div className="paso">
      <p className="paso__ayuda">
        Sube el archivo de tu obra: imagen, PDF, audio, video o texto (máximo 10 MB).
      </p>

      <label
        htmlFor="archivo"
        className={`zona-archivo${arrastrando ? ' zona-archivo--activa' : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          setArrastrando(true)
        }}
        onDragLeave={() => setArrastrando(false)}
        onDrop={(e) => {
          e.preventDefault()
          setArrastrando(false)
          elegir(e.dataTransfer.files)
        }}
      >
        <span className="zona-archivo__icono" aria-hidden="true">
          ⬆
        </span>
        <span className="zona-archivo__titulo">
          {archivo ? 'Cambiar archivo' : 'Haz clic para elegir un archivo'}
        </span>
        <span className="zona-archivo__texto">o arrástralo aquí</span>
      </label>
      <input
        ref={input}
        id="archivo"
        name="archivo"
        type="file"
        accept={TIPOS_ACEPTADOS}
        className="solo-lectores"
        onChange={(e) => elegir(e.target.files)}
      />

      {archivo && (
        <div className="archivo-elegido">
          {vistaPrevia ? (
            <img src={vistaPrevia} alt="Vista previa de la obra" className="archivo-elegido__img" />
          ) : (
            <span className="archivo-elegido__icono" aria-hidden="true">
              📄
            </span>
          )}
          <div className="archivo-elegido__datos">
            <strong>{archivo.name}</strong>
            <span>
              {archivo.type || 'tipo desconocido'} · {formatearTamano(archivo.size)}
            </span>
          </div>
          <button
            type="button"
            className="boton boton--texto"
            onClick={() => {
              onCambiar(null)
              if (input.current) input.current.value = ''
            }}
          >
            Quitar
          </button>
        </div>
      )}

    </div>
  )
}

export default PasoArchivo
