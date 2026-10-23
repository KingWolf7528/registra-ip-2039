// Estado único del wizard "Registrar obra".
// Todos los pasos leen y escriben aquí, por eso al ir "Atrás" no se pierde nada.

export const PASOS = ['Archivo', 'Metadatos', 'Vista previa', 'Confirmación']

export const estadoInicial = {
  paso: 1,
  archivo: null, // objeto File elegido por el usuario
  titulo: '',
  categoria: '',
  descripcion: '',
}

export function wizardReducer(estado, accion) {
  switch (accion.type) {
    case 'SIGUIENTE':
      return { ...estado, paso: Math.min(estado.paso + 1, PASOS.length) }
    case 'ATRAS':
      return { ...estado, paso: Math.max(estado.paso - 1, 1) }
    case 'IR_A':
      // Solo se puede saltar hacia atrás (a pasos ya completados).
      return accion.paso < estado.paso ? { ...estado, paso: accion.paso } : estado
    case 'SET_ARCHIVO':
      return { ...estado, archivo: accion.archivo }
    case 'SET_CAMPO':
      return { ...estado, [accion.campo]: accion.valor }
    case 'REINICIAR':
      return estadoInicial
    default:
      return estado
  }
}

export function formatearTamano(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}
