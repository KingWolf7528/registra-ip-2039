import { useEffect, useState } from 'react'

// Crea una URL temporal para mostrar una imagen local antes de subirla
// y la libera cuando ya no se usa (evita fugas de memoria).
export function useVistaPrevia(archivo) {
  const [url, setUrl] = useState(null)

  useEffect(() => {
    if (!archivo || !archivo.type.startsWith('image/')) {
      setUrl(null)
      return undefined
    }
    const nueva = URL.createObjectURL(archivo)
    setUrl(nueva)
    return () => URL.revokeObjectURL(nueva)
  }, [archivo])

  return url
}
