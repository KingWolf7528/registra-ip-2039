import { PREFIJO_FOLIO } from '../../config.js'
import { formatearTamano } from '../../utils/wizardObra.js'
import { useVistaPrevia } from '../../utils/useVistaPrevia.js'

function PasoVistaPrevia({ estado, usuario, onEditar }) {
  const { archivo, titulo, categoria, descripcion } = estado
  const vistaPrevia = useVistaPrevia(archivo)

  return (
    <div className="paso">
      <p className="paso__ayuda">
        Revisa que todo esté correcto. Al confirmar, la obra se enviará al servidor y recibirá un
        folio con el formato <code>{PREFIJO_FOLIO}-###</code>.
      </p>

      <div className="resumen">
        <div className="resumen__media">
          {vistaPrevia ? (
            <img src={vistaPrevia} alt={`Vista previa de ${titulo}`} />
          ) : (
            <span aria-hidden="true">📄</span>
          )}
        </div>

        <dl className="resumen__datos">
          <div>
            <dt>Título</dt>
            <dd>{titulo.trim() || <em>Sin título</em>}</dd>
          </div>
          <div>
            <dt>Categoría</dt>
            <dd>
              {categoria ? <span className="etiqueta">{categoria}</span> : <em>Sin categoría</em>}
            </dd>
          </div>
          <div className="resumen__completo">
            <dt>Descripción</dt>
            <dd>{descripcion.trim() || <em>Sin descripción</em>}</dd>
          </div>
          <div>
            <dt>Archivo</dt>
            <dd>
              {archivo ? `${archivo.name} (${formatearTamano(archivo.size)})` : <em>Sin archivo</em>}
            </dd>
          </div>
          <div>
            <dt>Autor</dt>
            <dd>{usuario.nombre}</dd>
          </div>
        </dl>
      </div>

      <div className="resumen__editar">
        <button type="button" className="boton boton--texto" onClick={() => onEditar(1)}>
          Editar archivo
        </button>
        <button type="button" className="boton boton--texto" onClick={() => onEditar(2)}>
          Editar metadatos
        </button>
      </div>
    </div>
  )
}

export default PasoVistaPrevia
