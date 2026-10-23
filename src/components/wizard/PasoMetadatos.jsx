import { CATEGORIAS, DESCRIPCION_MAXIMA } from '../../config.js'

function PasoMetadatos({ titulo, categoria, descripcion, onCambiar }) {
  const cambiar = (e) => onCambiar(e.target.name, e.target.value)

  return (
    <div className="paso formulario">
      <div className="campo campo--completo">
        <label htmlFor="titulo">
          Título de la obra <abbr title="obligatorio">*</abbr>
        </label>
        <input id="titulo" name="titulo" type="text" value={titulo} onChange={cambiar} maxLength={120} />
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
          maxLength={DESCRIPCION_MAXIMA}
        />
      </div>
    </div>
  )
}

export default PasoMetadatos
