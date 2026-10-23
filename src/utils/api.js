// Llamadas al servidor registra-ip-server.
import { API_URL, PREFIJO_FOLIO } from '../config.js'

async function leerRespuesta(respuesta) {
  const cuerpo = await respuesta.json().catch(() => ({}))
  if (!respuesta.ok) {
    const errores = cuerpo.errores ?? [`El servidor respondió ${respuesta.status}.`]
    throw new Error(errores.join('\n'))
  }
  return cuerpo
}

export async function obtenerObras() {
  return leerRespuesta(await fetch(`${API_URL}/obras`))
}

// Busca una obra por su folio (null si no existe).
export async function obtenerObra(folio) {
  const obras = await obtenerObras()
  return obras.find((obra) => obra.folio === folio) ?? null
}

// Calcula el siguiente folio OBRA-2039-### a partir de las obras existentes.
export async function siguienteFolio() {
  const obras = await obtenerObras()
  const regex = new RegExp(`^${PREFIJO_FOLIO}-(\\d{3})$`)
  const mayor = obras.reduce((max, obra) => {
    const m = regex.exec(obra.folio)
    return m ? Math.max(max, Number(m[1])) : max
  }, 0)
  return `${PREFIJO_FOLIO}-${String(mayor + 1).padStart(3, '0')}`
}

// Envía el archivo y los metadatos como multipart/form-data.
export async function registrarObra({ archivo, titulo, categoria, descripcion }, usuario) {
  const folio = await siguienteFolio()
  const datos = new FormData()
  // Primero los campos de texto y al final el archivo.
  datos.append('folio', folio)
  datos.append('titulo', titulo.trim())
  datos.append('categoria', categoria)
  datos.append('descripcion', descripcion.trim())
  datos.append('autor', usuario.nombre)
  datos.append('correoAutor', usuario.correo)
  datos.append('archivo', archivo)

  // Importante: NO poner 'Content-Type'; el navegador agrega el boundary.
  const respuesta = await fetch(`${API_URL}/obras`, { method: 'POST', body: datos })
  return leerRespuesta(respuesta)
}

export function urlArchivo(obra) {
  return `${API_URL}${obra.archivo.url}`
}
