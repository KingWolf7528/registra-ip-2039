import { Link, useNavigate } from 'react-router-dom'
import { cerrarSesion, obtenerUsuario } from '../utils/sesion.js'

// Muestra de la guía de estilo con la razón de contraste sobre blanco.
const PALETA = [
  { nombre: 'Primario (boleta)', variable: '--color-primario', hex: '#602039', contraste: '11.91:1' },
  { nombre: 'Primario hover', variable: '--color-primario-hover', hex: '#8a3a57', contraste: '7.44:1' },
  { nombre: 'Primario suave', variable: '--color-primario-suave', hex: '#f5e9ee', contraste: 'solo fondo' },
  { nombre: 'Éxito', variable: '--color-exito', hex: '#1f7a5c', contraste: '5.25:1' },
  { nombre: 'Error', variable: '--color-error', hex: '#b42318', contraste: '6.57:1' },
  { nombre: 'Texto', variable: '--color-texto', hex: '#1c1b1f', contraste: '17.13:1' },
]

function Dashboard() {
  const navigate = useNavigate()
  const usuario = obtenerUsuario()

  function salir() {
    cerrarSesion()
    navigate('/registro', { replace: true })
  }

  // RutaProtegida ya garantiza que existe; esto es solo por seguridad.
  if (!usuario) return null

  const fecha = new Date(usuario.fechaRegistro).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="dashboard">
      <section className="tarjeta bienvenida" aria-labelledby="saludo">
        <div>
          <h1 id="saludo" className="titulo">
            ¡Hola, {usuario.nombre}!
          </h1>
          <p className="subtitulo">
            Bienvenido a tu panel de REGISTRA-IP. Ya puedes empezar a registrar
            tus obras.
          </p>
          <dl className="datos">
            <div>
              <dt>Nombre</dt>
              <dd>{usuario.nombre}</dd>
            </div>
            <div>
              <dt>Correo</dt>
              <dd>{usuario.correo}</dd>
            </div>
            <div>
              <dt>Tipo de creador</dt>
              <dd>
                <span className="etiqueta">{usuario.tipo}</span>
              </dd>
            </div>
            <div>
              <dt>Registrado el</dt>
              <dd>{fecha}</dd>
            </div>
          </dl>
        </div>
        <div className="bienvenida__acciones">
          <Link to="/obras/nueva" className="boton">
            Registrar obra
          </Link>
          <button type="button" className="boton boton--secundario" onClick={salir}>
            Cerrar sesión
          </button>
        </div>
      </section>

      <section className="tarjeta" aria-labelledby="titulo-paleta">
        <h2 id="titulo-paleta" className="titulo">
          Paleta REGISTRA-IP
        </h2>
        <p className="subtitulo">
          Color primario derivado de la boleta 2024602039 → <code>#602039</code>.
          Contraste sobre blanco: 11.91:1 (cumple WCAG AA y AAA).
        </p>
        <ul className="paleta">
          {PALETA.map((color) => (
            <li key={color.variable} className="paleta__item">
              <span
                className="paleta__muestra"
                style={{ background: `var(${color.variable})` }}
                aria-hidden="true"
              />
              <strong>{color.nombre}</strong>
              <code>{color.hex}</code>
              <span className="paleta__contraste">{color.contraste}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default Dashboard
