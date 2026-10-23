// Manejo de la sesión del creador en localStorage.
export const CLAVE_SESION = 'registraIpUsuario'

export function guardarUsuario(usuario) {
  localStorage.setItem(CLAVE_SESION, JSON.stringify(usuario))
}

// Devuelve el usuario guardado o null si no hay sesión válida.
export function obtenerUsuario() {
  try {
    const guardado = localStorage.getItem(CLAVE_SESION)
    if (!guardado) return null
    const usuario = JSON.parse(guardado)
    return usuario && usuario.nombre && usuario.correo ? usuario : null
  } catch {
    // Si el valor está corrupto o el navegador bloquea el almacenamiento,
    // se trata como "sin sesión".
    return null
  }
}

export function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION)
}
