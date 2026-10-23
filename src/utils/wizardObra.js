// Estado único del wizard "Registrar obra".
// Todos los pasos leen y escriben aquí, por eso al ir "Atrás" no se pierde nada.
import {
  CATEGORIAS,
  DESCRIPCION_MAXIMA,
  TAMANO_MAXIMO,
  TITULO_MINIMO,
} from '../config.js'

export const PASOS = ['Archivo', 'Metadatos', 'Vista previa', 'Confirmación']

export const estadoInicial = {
  paso: 1,
  archivo: null, // objeto File elegido por el usuario
  titulo: '',
  categoria: '',
  descripcion: '',
  envio: { estado: 'inactivo', obra: null, errores: [] }, // inactivo | enviando | exito | error
}

export function wizardReducer(estado, accion) {
  switch (accion.type) {
    case 'SIGUIENTE':
      // Regla de oro: no se avanza si el paso actual no es válido.
      if (!validarPaso(estado, estado.paso).valido) return estado
      return { ...estado, paso: Math.min(estado.paso + 1, PASOS.length) }
    case 'ATRAS':
      // Desde la confirmación con error se regresa a la vista previa
      // conservando todo lo capturado.
      return {
        ...estado,
        paso: Math.max(estado.paso - 1, 1),
        envio: estadoInicial.envio,
      }
    case 'IR_A':
      // Solo se puede saltar hacia atrás (a pasos ya completados).
      return accion.paso < estado.paso ? { ...estado, paso: accion.paso } : estado
    case 'SET_ARCHIVO':
      return { ...estado, archivo: accion.archivo }
    case 'SET_CAMPO':
      return { ...estado, [accion.campo]: accion.valor }
    case 'ENVIO_INICIO':
      return { ...estado, paso: 4, envio: { estado: 'enviando', obra: null, errores: [] } }
    case 'ENVIO_EXITO':
      return { ...estado, envio: { estado: 'exito', obra: accion.obra, errores: [] } }
    case 'ENVIO_ERROR':
      return { ...estado, envio: { estado: 'error', obra: null, errores: accion.errores } }
    case 'REINICIAR':
      return estadoInicial
    default:
      return estado
  }
}

// ---------- Validaciones por paso ----------

export function validarArchivo(archivo) {
  if (!archivo) return ['Selecciona el archivo de tu obra.']
  const errores = []
  if (archivo.size === 0) errores.push('El archivo está vacío.')
  if (archivo.size > TAMANO_MAXIMO) errores.push('El archivo supera el límite de 10 MB.')
  const tipo = archivo.type || ''
  const aceptado =
    /^(image|audio|video)\//.test(tipo) || tipo === 'application/pdf' || tipo === 'text/plain'
  if (!aceptado) errores.push('Formato no permitido: usa imagen, PDF, audio, video o texto.')
  return errores
}

export function validarMetadatos({ titulo, categoria, descripcion }) {
  const errores = {}
  const largo = titulo.trim().length
  if (largo === 0) errores.titulo = 'El título es obligatorio.'
  else if (largo < TITULO_MINIMO)
    errores.titulo = `El título debe tener al menos ${TITULO_MINIMO} caracteres (llevas ${largo}).`
  if (!CATEGORIAS.includes(categoria)) errores.categoria = 'Selecciona una categoría.'
  if (descripcion.length > DESCRIPCION_MAXIMA)
    errores.descripcion = `La descripción no puede pasar de ${DESCRIPCION_MAXIMA} caracteres.`
  return errores
}

// Devuelve { valido, pendientes } para el paso indicado.
export function validarPaso(estado, paso) {
  let pendientes = []
  if (paso === 1) pendientes = validarArchivo(estado.archivo)
  if (paso === 2) pendientes = Object.values(validarMetadatos(estado))
  return { valido: pendientes.length === 0, pendientes }
}

export function formatearTamano(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}
