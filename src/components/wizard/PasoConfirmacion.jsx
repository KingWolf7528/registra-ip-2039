import { Link } from 'react-router-dom'
import { urlArchivo } from '../../utils/api.js'

function PasoConfirmacion({ envio, onReintentar, onAtras, onNueva }) {
  if (envio.estado === 'enviando') {
    return (
      <div className="paso confirmacion" role="status">
        <span className="cargando" aria-hidden="true" />
        <p>Registrando tu obra en el servidor…</p>
      </div>
    )
  }

  if (envio.estado === 'error') {
    return (
      <div className="paso confirmacion">
        <div className="errores__caja" role="alert">
          <strong>No se pudo registrar la obra.</strong>
          <ul>
            {envio.errores.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
        <p className="paso__ayuda">
          Revisa que el servidor esté encendido (<code>npm start</code> en registra-ip-server). Tus
          datos siguen guardados.
        </p>
        <div className="wizard__acciones">
          <button type="button" className="boton boton--secundario" onClick={onAtras}>
            Atrás
          </button>
          <button type="button" className="boton" onClick={onReintentar}>
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  const { obra } = envio
  return (
    <div className="paso confirmacion" role="status">
      <span className="confirmacion__icono" aria-hidden="true">
        ✓
      </span>
      <p>Tu obra quedó registrada con el folio</p>
      <p className="folio">{obra.folio}</p>
      <p className="paso__ayuda">
        «{obra.titulo}» · {obra.categoria} ·{' '}
        <a href={urlArchivo(obra)} target="_blank" rel="noreferrer">
          ver archivo guardado
        </a>
      </p>
      <div className="wizard__acciones wizard__acciones--centro">
        <button type="button" className="boton boton--secundario" onClick={onNueva}>
          Registrar otra obra
        </button>
        <Link to="/dashboard" className="boton">
          Ir al dashboard
        </Link>
      </div>
    </div>
  )
}

export default PasoConfirmacion
