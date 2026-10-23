import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import ObraTarjeta from '../components/galeria/ObraTarjeta.jsx'
import { CATEGORIAS } from '../config.js'
import { obtenerObras } from '../utils/api.js'
import { ORDENES, filtrarObras } from '../utils/galeria.js'

/*
 * ===================== CRITERIOS ISO 9241 APLICADOS =====================
 *
 * 1) ISO 9241-110:2020 — Principios de diálogo · AUTODESCRIPTIVIDAD
 *    (el sistema informa en todo momento qué está pasando).
 *    - Mientras llega GET /obras se muestra un loader: tarjetas "esqueleto"
 *      con animación + texto "Cargando obras…" (role="status", aria-busy).
 *    - Contador vivo "Mostrando X de Y obras" (aria-live="polite") que cambia
 *      al buscar o filtrar, y un estado vacío que explica por qué no hay
 *      resultados y ofrece "Limpiar filtros".
 *    - Si el servidor no responde, mensaje claro + botón "Reintentar".
 *    Por qué: sin retroalimentación el usuario no sabe si la app se colgó,
 *    si no hay obras o si su búsqueda fue demasiado estricta.
 *
 * 2) ISO 9241-171:2008 (accesibilidad del software) y ISO 9241-410 (dispositivos
 *    de entrada) · ÁREA MÍNIMA DE TOQUE de 44 × 44 px en todos los elementos
 *    interactivos de la galería (buscador, botones de categoría, selector de
 *    orden, tarjetas, botón cerrar del modal). Ver la variable --toque-min en
 *    App.css. 44 px es el valor de referencia visto en clase (coincide con
 *    WCAG 2.5.5 y las guías de iOS).
 *    Por qué: en celular el dedo cubre ~1 cm; objetivos más chicos provocan
 *    toques equivocados, sobre todo en usuarios con temblor o poca precisión.
 *
 * Extra (ISO 9241-110 · CONTROLABILIDAD y ROBUSTEZ ANTE ERRORES DE USO):
 *    - Búsqueda sin distinguir acentos ni mayúsculas ("fotografia" encuentra
 *      "Fotografía").
 *    - Los filtros se guardan en la URL (?q=&cat=&orden=): el botón "Atrás"
 *      y recargar la página conservan la búsqueda, y se puede compartir.
 * =======================================================================
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
  const [params, setParams] = useSearchParams()

  const busqueda = params.get('q') ?? ''
  const categoria = params.get('cat') ?? ''
  const orden = params.get('orden') === 'antiguas' ? 'antiguas' : 'recientes'

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

  function actualizar(clave, valor) {
    const nuevos = new URLSearchParams(params)
    if (valor) nuevos.set(clave, valor)
    else nuevos.delete(clave)
    setParams(nuevos, { replace: true })
  }

  const resultados = useMemo(
    () => filtrarObras(obras, { busqueda, categoria, orden }),
    [obras, busqueda, categoria, orden],
  )

  const conteo = useMemo(() => {
    const c = {}
    for (const obra of obras) c[obra.categoria] = (c[obra.categoria] ?? 0) + 1
    return c
  }, [obras])

  const hayFiltros = Boolean(busqueda || categoria)

  return (
    <div className="galeria">
      <div className="seccion__encabezado">
        <div>
          <h1 className="titulo">Galería de obras</h1>
          <p className="subtitulo">Busca, filtra y ordena las obras registradas en REGISTRA-IP.</p>
        </div>
        <Link to="/obras/nueva" className="boton">
          + Registrar obra
        </Link>
      </div>

      <section className="tarjeta filtros" aria-label="Búsqueda y filtros">
        <div className="filtros__fila">
          <div className="campo filtros__busqueda">
            <label htmlFor="busqueda">Buscar por título o autor</label>
            <input
              id="busqueda"
              type="search"
              placeholder="Ej. atardecer, Pineda…"
              value={busqueda}
              onChange={(e) => actualizar('q', e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="campo filtros__orden">
            <label htmlFor="orden">Ordenar por fecha de registro</label>
            <select id="orden" value={orden} onChange={(e) => actualizar('orden', e.target.value)}>
              {Object.entries(ORDENES).map(([valor, texto]) => (
                <option key={valor} value={valor}>
                  {texto}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="filtros__categorias" role="group" aria-label="Filtrar por categoría">
          <button
            type="button"
            className="chip"
            aria-pressed={!categoria}
            onClick={() => actualizar('cat', '')}
          >
            Todas {estado === 'listo' && <span className="chip__conteo">{obras.length}</span>}
          </button>
          {CATEGORIAS.map((c) => (
            <button
              key={c}
              type="button"
              className="chip"
              aria-pressed={categoria === c}
              onClick={() => actualizar('cat', categoria === c ? '' : c)}
            >
              {c} {estado === 'listo' && <span className="chip__conteo">{conteo[c] ?? 0}</span>}
            </button>
          ))}
        </div>
      </section>

      {/* Retroalimentación de estado (ISO 9241-110, autodescriptividad) */}
      <div className="galeria__estado" role="status" aria-live="polite">
        {estado === 'cargando' && (
          <p>
            <span className="cargando cargando--chico" aria-hidden="true" /> Cargando obras…
          </p>
        )}
        {estado === 'listo' && (
          <p>
            Mostrando <strong>{resultados.length}</strong> de {obras.length} obras
            {busqueda && (
              <>
                {' '}
                que coinciden con «<strong>{busqueda}</strong>»
              </>
            )}
            {categoria && (
              <>
                {' '}
                en <strong>{categoria}</strong>
              </>
            )}
            {' · '}
            {ORDENES[orden].toLowerCase()}
            {hayFiltros && (
              <button type="button" className="boton boton--texto" onClick={() => setParams({})}>
                Limpiar filtros
              </button>
            )}
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
          <p>
            {obras.length === 0
              ? 'Todavía no hay obras registradas.'
              : 'Ninguna obra coincide con la búsqueda y el filtro actuales.'}
          </p>
          {hayFiltros && (
            <button type="button" className="boton" onClick={() => setParams({})}>
              Limpiar filtros
            </button>
          )}
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
