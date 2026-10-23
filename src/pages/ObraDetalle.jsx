import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { obtenerObra, urlArchivo } from '../utils/api.js'
import { formatearTamano } from '../utils/wizardObra.js'
import { descargarCertificado } from '../utils/generarCertificado.js'

function formatearFecha(iso) {
  return new Date(iso).toLocaleString('es-MX', { dateStyle: 'long', timeStyle: 'short' })
}

// Vista de detalle de una obra: /obras/:folio
function ObraDetalle() {
  const { folio } = useParams()
  const navigate = useNavigate()
  const [obra, setObra] = useState(null)
  const [estado, setEstado] = useState('cargando') // cargando | listo | no-existe | error
  const [generando, setGenerando] = useState(false)
  const [errorPdf, setErrorPdf] = useState('')

  useEffect(() => {
    let activo = true
    obtenerObra(folio)
      .then((encontrada) => {
        if (!activo) return
        setObra(encontrada)
        setEstado(encontrada ? 'listo' : 'no-existe')
      })
      .catch(() => activo && setEstado('error'))
    return () => {
      activo = false
    }
  }, [folio])

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

  if (estado === 'cargando') {
    return <p className="subtitulo">Cargando obra {folio}…</p>
  }
  if (estado !== 'listo') {
    return (
      <section className="tarjeta">
        <h1 className="titulo">
          {estado === 'no-existe' ? 'Obra no encontrada' : 'Sin conexión con el servidor'}
        </h1>
        <p className="subtitulo">
          {estado === 'no-existe'
            ? `No existe ninguna obra con el folio ${folio}.`
            : 'Enciende el servidor con npm start en registra-ip-server y recarga la página.'}
        </p>
        <Link to="/dashboard" className="boton">
          Volver al dashboard
        </Link>
      </section>
    )
  }

  const esImagen = obra.archivo.tipo?.startsWith('image/')

  return (
    <div className="dashboard">
      <button type="button" className="volver boton--texto" onClick={() => navigate(-1)}>
        ← Volver
      </button>

      <section className="tarjeta detalle" aria-labelledby="titulo-obra">
        <div className="detalle__media">
          {esImagen ? (
            <img src={urlArchivo(obra)} alt={`Obra «${obra.titulo}»`} />
          ) : (
            <span aria-hidden="true">📄</span>
          )}
        </div>

        <div className="detalle__info">
          <p className="folio-chico">{obra.folio}</p>
          <h1 id="titulo-obra" className="titulo">
            {obra.titulo}
          </h1>
          <p>
            <span className="etiqueta">{obra.categoria}</span>
          </p>
          {obra.descripcion && <p className="detalle__descripcion">{obra.descripcion}</p>}

          <dl className="datos">
            <div>
              <dt>Autor</dt>
              <dd>{obra.autor}</dd>
            </div>
            <div>
              <dt>Fecha de registro</dt>
              <dd>{formatearFecha(obra.fechaRegistro)}</dd>
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
        </div>
      </section>

      <section className="tarjeta certificado" aria-labelledby="titulo-certificado">
        <div>
          <h2 id="titulo-certificado" className="titulo">
            Certificado de registro
          </h2>
          <p className="subtitulo">
            PDF tipo diploma con el folio <strong>{obra.folio}</strong>, los datos de la obra y un
            código QR para verificarlo.
          </p>
          {errorPdf && (
            <p className="campo__error" role="alert">
              {errorPdf}
            </p>
          )}
        </div>
        <button type="button" className="boton" onClick={descargar} disabled={generando}>
          {generando ? 'Generando…' : '⬇ Descargar certificado'}
        </button>
      </section>
    </div>
  )
}

export default ObraDetalle
