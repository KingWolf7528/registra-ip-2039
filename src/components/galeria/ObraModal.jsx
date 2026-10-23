import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { urlArchivo } from '../../utils/api.js'
import { descargarCertificado } from '../../utils/generarCertificado.js'
import { ICONOS, tipoArchivo } from '../../utils/galeria.js'
import { formatearTamano } from '../../utils/wizardObra.js'

// Vista de detalle en modal. Se usa <dialog> nativo con showModal():
// atrapa el foco dentro, se cierra con Esc y devuelve el foco a la tarjeta.
function ObraModal({ obra, onCerrar }) {
  const dialogo = useRef(null)
  const [generando, setGenerando] = useState(false)
  const [errorPdf, setErrorPdf] = useState('')
  const tipo = tipoArchivo(obra)

  useEffect(() => {
    // No se cierra en la limpieza del efecto: React (modo estricto) monta,
    // desmonta y vuelve a montar, y cerrar aquí dispararía onClose → onCerrar.
    const d = dialogo.current
    if (d && !d.open) d.showModal()
  }, [])

  async function descargar() {
    setGenerando(true)
    setErrorPdf('')
    try {
      await descargarCertificado(obra)
    } catch (err) {
      console.error(err)
      setErrorPdf('No se pudo generar el certificado. Intenta de nuevo.')
    } finally {
      setGenerando(false)
    }
  }

  return (
    <dialog
      ref={dialogo}
      className="modal"
      aria-labelledby="modal-titulo"
      onClose={onCerrar}
      onClick={(e) => {
        // Clic en el fondo oscuro (fuera del contenido) cierra el modal.
        if (e.target === dialogo.current) dialogo.current.close()
      }}
    >
      <div className="modal__contenido">
        <button
          type="button"
          className="modal__cerrar"
          onClick={() => dialogo.current.close()}
          aria-label="Cerrar detalle"
        >
          ✕
        </button>

        <div className="modal__media">
          {tipo === 'imagen' ? (
            <img src={urlArchivo(obra)} alt={`Obra «${obra.titulo}»`} />
          ) : (
            <span aria-hidden="true">{ICONOS[tipo].icono}</span>
          )}
        </div>

        <div className="modal__info">
          <p className="folio-chico">{obra.folio}</p>
          <h2 id="modal-titulo" className="titulo">
            {obra.titulo}
          </h2>
          <p>
            <span className="etiqueta">{obra.categoria}</span>
          </p>
          {obra.descripcion && <p className="detalle__descripcion">{obra.descripcion}</p>}

          <dl className="datos">
            <div>
              <dt>Autor</dt>
              <dd>{obra.autor}</dd>
            </div>
            {obra.correoAutor && (
              <div>
                <dt>Correo del autor</dt>
                <dd>{obra.correoAutor}</dd>
              </div>
            )}
            <div>
              <dt>Fecha de registro</dt>
              <dd>
                {new Date(obra.fechaRegistro).toLocaleString('es-MX', {
                  dateStyle: 'long',
                  timeStyle: 'short',
                })}
              </dd>
            </div>
            <div>
              <dt>Archivo</dt>
              <dd>
                <a href={urlArchivo(obra)} target="_blank" rel="noreferrer">
                  {obra.archivo.nombreOriginal}
                </a>
              </dd>
            </div>
            <div>
              <dt>Tipo y tamaño</dt>
              <dd>
                {obra.archivo.tipo} · {formatearTamano(obra.archivo.tamano)}
              </dd>
            </div>
          </dl>

          {errorPdf && (
            <p className="campo__error" role="alert">
              {errorPdf}
            </p>
          )}

          <div className="modal__acciones">
            <button type="button" className="boton" onClick={descargar} disabled={generando}>
              {generando ? 'Generando…' : '⬇ Descargar certificado'}
            </button>
            <Link to={`/obras/${obra.folio}`} className="boton boton--secundario">
              Abrir página de la obra
            </Link>
          </div>
        </div>
      </div>
    </dialog>
  )
}

export default ObraModal
