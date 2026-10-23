// Lógica de la galería: búsqueda, filtro y orden (sin React, fácil de probar).

// Quita acentos y pasa a minúsculas: "Fotografía" → "fotografia".
// ISO 9241-110 · Robustez ante errores de uso (antes "tolerancia a errores"):
// el usuario encuentra la obra aunque escriba sin acentos o con otras mayúsculas.
export function normalizar(texto = '') {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export const ORDENES = {
  recientes: 'Más recientes primero',
  antiguas: 'Más antiguas primero',
}

/**
 * Aplica búsqueda (título o autor), filtro de categoría y orden por fecha.
 * Los tres criterios se combinan: primero se filtra y al final se ordena.
 */
export function filtrarObras(obras, { busqueda = '', categoria = '', orden = 'recientes' }) {
  const termino = normalizar(busqueda)
  const resultado = obras.filter((obra) => {
    const coincideTexto =
      !termino ||
      normalizar(obra.titulo).includes(termino) ||
      normalizar(obra.autor).includes(termino)
    const coincideCategoria = !categoria || obra.categoria === categoria
    return coincideTexto && coincideCategoria
  })
  const signo = orden === 'antiguas' ? 1 : -1
  return resultado.sort(
    (a, b) => signo * (new Date(a.fechaRegistro) - new Date(b.fechaRegistro)),
  )
}

// Clasifica el archivo para decidir si se muestra miniatura o ícono.
export function tipoArchivo(obra) {
  const tipo = obra.archivo?.tipo ?? ''
  if (tipo.startsWith('image/')) return 'imagen'
  if (tipo === 'application/pdf') return 'pdf'
  if (tipo.startsWith('audio/')) return 'audio'
  if (tipo.startsWith('video/')) return 'video'
  if (tipo.startsWith('text/')) return 'texto'
  return 'otro'
}

export const ICONOS = {
  pdf: { icono: '📕', texto: 'Documento PDF' },
  audio: { icono: '🎵', texto: 'Audio' },
  video: { icono: '🎬', texto: 'Video' },
  texto: { icono: '📝', texto: 'Texto' },
  otro: { icono: '📦', texto: 'Archivo' },
}
