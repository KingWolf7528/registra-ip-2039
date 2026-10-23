import { urlArchivo } from '../../utils/api.js'
import { ICONOS, tipoArchivo } from '../../utils/galeria.js'

// Tarjeta de la galería: miniatura (si es imagen) o ícono según el tipo de archivo.
function ObraTarjeta({ obra, onAbrir }) {
  const tipo = tipoArchivo(obra)
  const fecha = new Date(obra.fechaRegistro).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <li>
      <button
        type="button"
        className="obra-tarjeta"
        onClick={() => onAbrir(obra)}
        aria-label={`${obra.titulo}, ${obra.categoria}, de ${obra.autor}. Ver detalle`}
      >
        <span className={`obra-tarjeta__media obra-tarjeta__media--${tipo}`}>
          {tipo === 'imagen' ? (
            <img src={urlArchivo(obra)} alt="" loading="lazy" />
          ) : (
            <span className="obra-tarjeta__icono" aria-hidden="true">
              {ICONOS[tipo].icono}
              <small>{ICONOS[tipo].texto}</small>
            </span>
          )}
        </span>
        <span className="obra-tarjeta__cuerpo">
          <span className="obra-tarjeta__folio">{obra.folio}</span>
          <span className="obra-tarjeta__titulo">{obra.titulo}</span>
          <span className="obra-tarjeta__autor">{obra.autor}</span>
          <span className="obra-tarjeta__pie">
            <span className="etiqueta">{obra.categoria}</span>
            <span className="obra-tarjeta__fecha">{fecha}</span>
          </span>
        </span>
      </button>
    </li>
  )
}

export default ObraTarjeta
