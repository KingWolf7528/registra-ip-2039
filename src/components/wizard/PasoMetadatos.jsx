import { CATEGORIAS, DESCRIPCION_MAXIMA, TITULO_MINIMO } from '../../config.js'
import { validarMetadatos } from '../../utils/wizardObra.js'

function PasoMetadatos({ titulo, categoria, descripcion, onCambiar }) {
  const errores = validarMetadatos({ titulo, categoria, descripcion })
  // Mostramos el error de un campo solo cuando el usuario ya escribió algo,
  // para no regañarlo antes de empezar. El botón "Siguiente" sí se bloquea.
  const mostrar = {
    titulo: titulo.length > 0 && errores.titulo,
    descripcion: errores.descripcion,
  }
  const cambiar = (e) => onCambiar(e.target.name, e.target.value)

  return (
    <div className="paso formulario">
      <div className="campo campo--completo">
        <label htmlFor="titulo">
          Título de la obra <abbr title="obligatorio">*</abbr>
        </label>
        <input
          id="titulo"
          name="titulo"
          type="text"
          value={titulo}
          onChange={cambiar}
          maxLength={120}
          aria-invalid={Boolean(mostrar.titulo)}
          aria-describedby="ayuda-titulo"
        />
        <p id="ayuda-titulo" className={mostrar.titulo ? 'campo__error' : 'campo__ayuda'}>
          {mostrar.titulo || `Mínimo ${TITULO_MINIMO} caracteres (${titulo.trim().length}/${TITULO_MINIMO}).`}
        </p>
      </div>

      <div className="campo campo--completo">
        <label htmlFor="categoria">
          Categoría <abbr title="obligatorio">*</abbr>
        </label>
        <select id="categoria" name="categoria" value={categoria} onChange={cambiar}>
          <option value="">Selecciona una categoría</option>
          {CATEGORIAS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="campo campo--completo">
        <label htmlFor="descripcion">Descripción (opcional)</label>
        <textarea
          id="descripcion"
          name="descripcion"
          rows={4}
          value={descripcion}
          onChange={cambiar}
          aria-invalid={Boolean(mostrar.descripcion)}
          aria-describedby="ayuda-descripcion"
        />
        <p id="ayuda-descripcion" className={mostrar.descripcion ? 'campo__error' : 'campo__ayuda'}>
          {mostrar.descripcion || `${descripcion.length}/${DESCRIPCION_MAXIMA} caracteres.`}
        </p>
      </div>
    </div>
  )
}

export default PasoMetadatos
