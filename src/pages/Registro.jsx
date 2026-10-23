import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { guardarUsuario } from '../utils/sesion.js'

const TIPOS_CREADOR = ['Diseñador', 'Fotógrafo', 'Escritor', 'Cineasta']
const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const VACIO = { nombre: '', correo: '', tipo: '' }

// Devuelve un objeto { campo: 'mensaje' } solo con los campos inválidos.
function validar(datos) {
  const errores = {}
  if (!datos.nombre.trim()) {
    errores.nombre = 'El nombre es obligatorio.'
  } else if (datos.nombre.trim().length < 3) {
    errores.nombre = 'El nombre debe tener al menos 3 caracteres.'
  }
  if (!datos.correo.trim()) {
    errores.correo = 'El correo es obligatorio.'
  } else if (!REGEX_CORREO.test(datos.correo.trim())) {
    errores.correo = 'Escribe un correo válido, por ejemplo nombre@dominio.com.'
  }
  if (!datos.tipo) {
    errores.tipo = 'Selecciona tu tipo de creador.'
  }
  return errores
}

function Registro() {
  const navigate = useNavigate()
  const [datos, setDatos] = useState(VACIO)
  const [errores, setErrores] = useState({})
  const [enviado, setEnviado] = useState(false)

  function manejarCambio(e) {
    const { name, value } = e.target
    const nuevos = { ...datos, [name]: value }
    setDatos(nuevos)
    // Después del primer intento, revalidamos en vivo para que el
    // mensaje desaparezca en cuanto el campo se corrige.
    if (enviado) setErrores(validar(nuevos))
  }

  function manejarEnvio(e) {
    e.preventDefault()
    setEnviado(true)
    const encontrados = validar(datos)
    setErrores(encontrados)
    if (Object.keys(encontrados).length > 0) return

    const usuario = {
      nombre: datos.nombre.trim(),
      correo: datos.correo.trim().toLowerCase(),
      tipo: datos.tipo,
      fechaRegistro: new Date().toISOString(),
    }
    guardarUsuario(usuario)
    navigate('/dashboard', { replace: true })
  }

  const listaErrores = Object.values(errores)

  return (
    <section className="tarjeta" aria-labelledby="titulo-registro">
      <h1 id="titulo-registro" className="titulo">
        Registro de creador
      </h1>
      <p className="subtitulo">
        Registra tus datos para proteger y verificar la autoría de tus obras.
        Los campos marcados con <abbr title="obligatorio">*</abbr> son
        obligatorios.
      </p>

      <form className="formulario" onSubmit={manejarEnvio} noValidate>
        {/* Contenedor de errores: los lectores de pantalla lo anuncian
            cuando cambia, sin interrumpir lo que el usuario está haciendo. */}
        <div className="errores" aria-live="polite" aria-atomic="true">
          {listaErrores.length > 0 && (
            <div className="errores__caja">
              <strong>
                Revisa {listaErrores.length === 1 ? 'el campo' : 'los campos'}{' '}
                marcado{listaErrores.length === 1 ? '' : 's'}:
              </strong>
              <ul>
                {listaErrores.map((msg) => (
                  <li key={msg}>{msg}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="campo campo--completo">
          <label htmlFor="nombre">
            Nombre completo <abbr title="obligatorio">*</abbr>
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            autoComplete="name"
            value={datos.nombre}
            onChange={manejarCambio}
            aria-invalid={Boolean(errores.nombre)}
            aria-describedby={errores.nombre ? 'error-nombre' : undefined}
            required
          />
          {errores.nombre && (
            <p id="error-nombre" className="campo__error">
              {errores.nombre}
            </p>
          )}
        </div>

        <div className="campo">
          <label htmlFor="correo">
            Correo electrónico <abbr title="obligatorio">*</abbr>
          </label>
          <input
            id="correo"
            name="correo"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={datos.correo}
            onChange={manejarCambio}
            aria-invalid={Boolean(errores.correo)}
            aria-describedby={errores.correo ? 'error-correo' : undefined}
            required
          />
          {errores.correo && (
            <p id="error-correo" className="campo__error">
              {errores.correo}
            </p>
          )}
        </div>

        <div className="campo">
          <label htmlFor="tipo">
            Tipo de creador <abbr title="obligatorio">*</abbr>
          </label>
          <select
            id="tipo"
            name="tipo"
            value={datos.tipo}
            onChange={manejarCambio}
            aria-invalid={Boolean(errores.tipo)}
            aria-describedby={errores.tipo ? 'error-tipo' : undefined}
            required
          >
            <option value="">Selecciona una opción</option>
            {TIPOS_CREADOR.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
          {errores.tipo && (
            <p id="error-tipo" className="campo__error">
              {errores.tipo}
            </p>
          )}
        </div>

        <div className="formulario__acciones">
          <button type="submit" className="boton">
            Registrarme
          </button>
        </div>
      </form>
    </section>
  )
}

export default Registro
