import { Link } from 'react-router-dom'
import { PREFIJO_FOLIO } from '../../config.js'

// Confirmación local: la obra todavía no se envía al servidor.
function PasoConfirmacion({ titulo, onNueva }) {
  return (
    <div className="paso confirmacion" role="status">
      <span className="confirmacion__icono" aria-hidden="true">
        ✓
      </span>
      <p>«{titulo.trim() || 'Tu obra'}» está lista para registrarse. Recibirá un folio con el formato</p>
      <p className="folio">{PREFIJO_FOLIO}-###</p>
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
