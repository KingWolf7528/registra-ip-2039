import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { obtenerObras, urlArchivo } from '../utils/api.js'

// Lista de obras obtenida con GET /obras.
function ObrasRegistradas() {
  const [obras, setObras] = useState([])
  const [estado, setEstado] = useState('cargando') // cargando | listo | error

  useEffect(() => {
    let activo = true
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
  }, [])

  return (
    <section className="tarjeta" aria-labelledby="titulo-obras">
      <div className="seccion__encabezado">
        <h2 id="titulo-obras" className="titulo">
          Obras registradas
        </h2>
        <div className="seccion__acciones">
          <Link to="/galeria" className="boton boton--secundario">
            Ver galería
          </Link>
          <Link to="/obras/nueva" className="boton">
            + Registrar obra
          </Link>
        </div>
      </div>

      {estado === 'cargando' && <p className="subtitulo">Cargando obras…</p>}
      {estado === 'error' && (
        <p className="errores__caja" role="alert">
          No se pudo conectar con el servidor. Enciéndelo con <code>npm start</code> en
          registra-ip-server.
        </p>
      )}
      {estado === 'listo' && obras.length === 0 && (
        <p className="subtitulo">Aún no hay obras. ¡Registra la primera!</p>
      )}
      {estado === 'listo' && obras.length > 0 && (
        <div className="tabla-contenedor">
          <table className="tabla">
            <thead>
              <tr>
                <th scope="col">Folio</th>
                <th scope="col">Título</th>
                <th scope="col">Categoría</th>
                <th scope="col">Autor</th>
                <th scope="col">Fecha</th>
                <th scope="col">Archivo</th>
                <th scope="col">Certificado</th>
              </tr>
            </thead>
            <tbody>
              {obras.map((obra) => (
                <tr key={obra.folio}>
                  <td>
                    <Link to={`/obras/${obra.folio}`} className="folio-chico">
                      {obra.folio}
                    </Link>
                  </td>
                  <td>
                    <Link to={`/obras/${obra.folio}`}>{obra.titulo}</Link>
                  </td>
                  <td>{obra.categoria}</td>
                  <td>{obra.autor}</td>
                  <td>{new Date(obra.fechaRegistro).toLocaleDateString('es-MX')}</td>
                  <td>
                    <a href={urlArchivo(obra)} target="_blank" rel="noreferrer">
                      Ver
                    </a>
                  </td>
                  <td>
                    <Link to={`/obras/${obra.folio}`}>Detalle y PDF</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default ObrasRegistradas
