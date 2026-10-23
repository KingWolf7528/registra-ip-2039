// Lógica de la galería (sin React, fácil de probar).

// Ordena de la obra más reciente a la más antigua.
export function filtrarObras(obras) {
  return [...obras].sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro))
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
