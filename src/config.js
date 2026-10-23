// Configuración compartida de REGISTRA-IP.

// URL del servidor (registra-ip-server). Se puede cambiar con VITE_API_URL.
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

// Personalización obligatoria: OBRA-<últimos 4 dígitos de la boleta>-###
// Boleta 2024602039 → OBRA-2039-001, OBRA-2039-002, ...
export const PREFIJO_FOLIO = 'OBRA-2039'

export const CATEGORIAS = [
  'Diseño gráfico',
  'Fotografía',
  'Ilustración',
  'Literatura',
  'Música',
  'Cine y video',
  'Otro',
]

// Archivos aceptados en el paso 1.
export const TAMANO_MAXIMO = 10 * 1024 * 1024 // 10 MB (igual que el servidor)
export const TIPOS_ACEPTADOS = 'image/*,application/pdf,audio/*,video/*,text/plain'

// Personalización obligatoria de la Práctica 04: leyenda del certificado.
export const REGISTRADO_POR = 'Pineda Flores Christopher Javier'

export const TITULO_MINIMO = 5
export const DESCRIPCION_MAXIMA = 500
