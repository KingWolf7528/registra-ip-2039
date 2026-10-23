import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ObraTarjeta from '../components/galeria/ObraTarjeta.jsx'
import { obtenerObras } from '../utils/api.js'
import { filtrarObras } from '../utils/galeria.js'

/*
 * ISO 9241-110:2020 — Principios de diálogo · AUTODESCRIPTIVIDAD
 * Mientras llega GET /obras se muestra un loader (tarjetas "esqueleto" +
 * "Cargando obras…" con role="status"), y si el servidor falla, un mensaje
 * claro con "Reintentar". Así el usuario siempre sabe qué está pasando.
 */

function Esqueleto() {
  return (
    <ul className="galeria__grid" aria-hidden="true">
      {Array.from({ length: 8 }, (_, i) => (
        <li key={i} className="obra-tarjeta obra-tarjeta--esqueleto">
          <span className="obra-tarjeta__media" />
          <span className="obra-tarjeta__cuerpo">
            <span className="esqueleto-linea esqueleto-linea--corta" />
            <span className="esqueleto-linea" />
            <span className="esqueleto-linea esqueleto-linea--media" />
          </span>
        </li>
      ))}
    </ul>
  )
}

function Galeria() {
  const [obras, setObras] = useState([])
  const [estado, setEstado] = useState('cargando') // cargando | listo | error
  const [intento, setIntento] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    let activo = true
    setEstado('cargando')
    obtenerObras()
      .then((lista) => {
        if (!activo) return
        setObras(lista)
        setEstado('listo')
      })
      .catch(() => activo && setEstado('error'))
    return () => {
      activo = false
    }
  }, [intento])

  // Por ahora solo se ordena de la más reciente a la más antigua.
  const resultados = useMemo(() => filtrarObras(obras, {}), [obras])

  return (
    <div className="galeria">
      <div className="seccion__encabezado">
        <div>
          <h1 className="titulo">Galería de obras</h1>
          <p className="subtitulo">Todas las obras registradas en REGISTRA-IP.</p>
        </div>
        <Link to="/obras/nueva" className="boton">
          + Registrar obra
        </Link>
      </div>

      {/* Retroalimentación de estado (ISO 9241-110, autodescriptividad) */}
      <div className="galeria__estado" role="status" aria-live="polite">
        {estado === 'cargando' && (
          <p>
            <span className="cargando cargando--chico" aria-hidden="true" /> Cargando obras…
          </p>
        )}
        {estado === 'listo' && (
          <p>
            <strong>{obras.length}</strong> obras registradas · más recientes primero
          </p>
        )}
      </div>

      {estado === 'cargando' && <Esqueleto />}

      {estado === 'error' && (
        <div className="errores__caja" role="alert">
          <p>
            <strong>No se pudo conectar con el servidor.</strong> Verifica que esté encendido (
            <code>npm start</code> en registra-ip-server).
          </p>
          <button type="button" className="boton" onClick={() => setIntento((n) => n + 1)}>
            Reintentar
          </button>
        </div>
      )}

      {estado === 'listo' && resultados.length === 0 && (
        <div className="tarjeta galeria__vacio">
          <p className="galeria__vacio-icono" aria-hidden="true">
            🔍
          </p>
          <p>Todavía no hay obras registradas.</p>
        </div>
      )}

      {estado === 'listo' && resultados.length > 0 && (
        <ul className="galeria__grid">
          {resultados.map((obra) => (
            <ObraTarjeta
              key={obra.folio}
              obra={obra}
              onAbrir={(o) => navigate(`/obras/${o.folio}`)}
            />
          ))}
        </ul>
      )}

    </div>
  )
}

export default Galeria
