// Genera el certificado de registro de autoría (PDF tipo diploma).
// Hoja A4 horizontal (297 × 210 mm). Ver el boceto en docs/boceto-certificado.png
// y las decisiones de diseño en docs/PRACTICA04.md.
import { jsPDF } from 'jspdf'
import QRCode from 'qrcode'
import { REGISTRADO_POR } from '../config.js'

// ---------- Retícula (mm) ----------
const ANCHO = 297
const ALTO = 210
const CENTRO = ANCHO / 2
const MARGEN = 10 // del borde de la hoja al marco exterior
const MARGEN_INTERNO = 26 // del borde de la hoja al contenido
const QR_TAMANO = 36

// ---------- Paleta (oscura para que también se lea en blanco y negro) ----------
const PRIMARIO = [96, 32, 57] // #602039, color derivado de la boleta
const TEXTO = [28, 27, 31] // #1c1b1f
const SUAVE = [95, 91, 102] // #5f5b66

// ---------- Escala tipográfica (pt) ----------
// 1 título · 2 nombre de la obra · 3 autor · 4 cuerpo · 5 etiquetas y pie
const T = { titulo: 30, obra: 24, autor: 18, cuerpo: 11, dato: 11, etiqueta: 7.5, pie: 7 }

function formatearFecha(iso) {
  return new Date(iso).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// Texto centrado con separación entre letras (jsPDF no centra bien con charSpace).
function textoEspaciado(doc, texto, y, espacio) {
  const ancho = doc.getTextWidth(texto) + espacio * (texto.length - 1)
  doc.text(texto, CENTRO - ancho / 2, y, { charSpace: espacio })
}

function dibujarMarco(doc) {
  doc.setDrawColor(...PRIMARIO)
  // Marco exterior grueso + interior fino: el clásico doble filete de diploma.
  doc.setLineWidth(1.2)
  doc.rect(MARGEN, MARGEN, ANCHO - 2 * MARGEN, ALTO - 2 * MARGEN)
  doc.setLineWidth(0.3)
  doc.rect(MARGEN + 3, MARGEN + 3, ANCHO - 2 * (MARGEN + 3), ALTO - 2 * (MARGEN + 3))

  // Pequeños cuadros en las esquinas como ornamento sobrio.
  doc.setFillColor(...PRIMARIO)
  const e = MARGEN + 3
  for (const [x, y] of [
    [e, e],
    [ANCHO - e, e],
    [e, ALTO - e],
    [ANCHO - e, ALTO - e],
  ]) {
    doc.rect(x - 1.5, y - 1.5, 3, 3, 'F')
  }
}

function separador(doc, y, ancho = 50) {
  doc.setDrawColor(...PRIMARIO)
  doc.setLineWidth(0.4)
  doc.line(CENTRO - ancho / 2, y, CENTRO - 3, y)
  doc.line(CENTRO + 3, y, CENTRO + ancho / 2, y)
  // Rombo central
  doc.setFillColor(...PRIMARIO)
  doc.triangle(CENTRO - 1.6, y, CENTRO, y - 1.6, CENTRO + 1.6, y, 'F')
  doc.triangle(CENTRO - 1.6, y, CENTRO, y + 1.6, CENTRO + 1.6, y, 'F')
}

function dato(doc, etiqueta, valor, x, y, opciones = {}) {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(T.etiqueta)
  doc.setTextColor(...SUAVE)
  doc.text(etiqueta.toUpperCase(), x, y, { charSpace: 0.4 })
  doc.setFont(opciones.fuente ?? 'helvetica', opciones.estilo ?? 'normal')
  doc.setFontSize(opciones.tamano ?? T.dato)
  doc.setTextColor(...(opciones.color ?? TEXTO))
  const lineas = doc.splitTextToSize(valor, opciones.ancho ?? 80)
  doc.text(lineas.slice(0, 2), x, y + 5.5)
}

async function dibujarQR(doc, folio) {
  // QR negro sobre blanco: máximo contraste para que cualquier cámara lo lea.
  const imagen = await QRCode.toDataURL(folio, {
    errorCorrectionLevel: 'M',
    margin: 1,
    width: 600,
    color: { dark: '#000000', light: '#ffffff' },
  })
  const x = ANCHO - MARGEN_INTERNO - QR_TAMANO
  const y = 128
  doc.addImage(imagen, 'PNG', x, y, QR_TAMANO, QR_TAMANO)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.setTextColor(...TEXTO)
  doc.text(folio, x + QR_TAMANO / 2, y + QR_TAMANO + 4.5, { align: 'center' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(T.pie)
  doc.setTextColor(...SUAVE)
  doc.text('Escanea para verificar el folio', x + QR_TAMANO / 2, y + QR_TAMANO + 8.5, {
    align: 'center',
  })
}

/**
 * Construye el certificado de una obra.
 * @param {object} obra  Obra tal como la regresa GET /obras
 * @returns {Promise<jsPDF>} documento listo para .save() u .output()
 */
export async function generarCertificado(obra) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4', compress: true })
  doc.setProperties({
    title: `Certificado ${obra.folio} — ${obra.titulo}`,
    subject: 'Certificado de Registro de Autoría',
    author: REGISTRADO_POR,
    creator: 'REGISTRA-IP',
    keywords: obra.folio,
  })

  dibujarMarco(doc)

  // ---- Encabezado: marca (nivel 5, se lee al final) ----
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(...PRIMARIO)
  textoEspaciado(doc, 'REGISTRA-IP', 28, 2.2)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(T.etiqueta + 0.5)
  doc.setTextColor(...SUAVE)
  doc.text('Registro y verificación de autoría', CENTRO, 33, { align: 'center' })

  // ---- 1. Título (lo primero que se lee) ----
  doc.setFont('times', 'bold')
  doc.setFontSize(T.titulo)
  doc.setTextColor(...PRIMARIO)
  doc.text('Certificado de Registro de Autoría', CENTRO, 50, { align: 'center' })
  separador(doc, 57)

  // ---- 2. Nombre de la obra ----
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(T.cuerpo)
  doc.setTextColor(...SUAVE)
  doc.text('Se hace constar que la obra', CENTRO, 69, { align: 'center' })

  doc.setFont('times', 'bolditalic')
  doc.setFontSize(T.obra)
  doc.setTextColor(...TEXTO)
  const lineasObra = doc.splitTextToSize(`«${obra.titulo}»`, 200).slice(0, 2)
  doc.text(lineasObra, CENTRO, 81, { align: 'center', lineHeightFactor: 1.15 })
  let y = 81 + (lineasObra.length - 1) * 10

  // ---- 3. Autor ----
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(T.cuerpo)
  doc.setTextColor(...SUAVE)
  doc.text(`de la categoría ${obra.categoria}, quedó registrada a nombre de`, CENTRO, y + 11, {
    align: 'center',
  })
  doc.setFont('times', 'bold')
  doc.setFontSize(T.autor)
  doc.setTextColor(...PRIMARIO)
  doc.text(obra.autor, CENTRO, y + 21, { align: 'center' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(T.cuerpo)
  doc.setTextColor(...SUAVE)
  doc.text(`el ${formatearFecha(obra.fechaRegistro)}.`, CENTRO, y + 28, { align: 'center' })

  // ---- 4. Datos de control (columna izquierda) ----
  const xDatos = MARGEN_INTERNO
  dato(doc, 'Folio', obra.folio, xDatos, 136, { estilo: 'bold', tamano: 15, color: PRIMARIO })
  dato(doc, 'Fecha de registro', formatearFecha(obra.fechaRegistro), xDatos, 152)
  dato(doc, 'Archivo', obra.archivo?.nombreOriginal ?? '—', xDatos, 166, { ancho: 70 })

  // ---- Firma: leyenda personalizada "Registrado por" (centro) ----
  doc.setDrawColor(...TEXTO)
  doc.setLineWidth(0.3)
  doc.line(CENTRO - 42, 162, CENTRO + 42, 162)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(...TEXTO)
  doc.text(`Registrado por: ${REGISTRADO_POR}`, CENTRO, 167.5, { align: 'center' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(T.etiqueta + 0.5)
  doc.setTextColor(...SUAVE)
  doc.text('Responsable del sistema REGISTRA-IP', CENTRO, 172, { align: 'center' })

  // ---- QR del folio (columna derecha) ----
  await dibujarQR(doc, obra.folio)

  // ---- Pie ----
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(T.pie)
  doc.setTextColor(...SUAVE)
  doc.text(
    `Documento generado el ${new Date().toLocaleString('es-MX')} · REGISTRA-IP, proyecto de Diseño de Interfaces de Usuario. ` +
      'Acredita el registro en este sistema; no sustituye el registro ante INDAUTOR.',
    CENTRO,
    ALTO - MARGEN - 6,
    { align: 'center', maxWidth: ANCHO - 2 * MARGEN_INTERNO },
  )

  return doc
}

export async function descargarCertificado(obra) {
  const doc = await generarCertificado(obra)
  doc.save(`certificado-${obra.folio}.pdf`)
}
