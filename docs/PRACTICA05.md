# Práctica 05 — Galería de obras con filtros y búsqueda

**Alumno:** Pineda Flores Christopher Javier · **Boleta:** 2024602039

## Qué se construyó

| Archivo | Qué hace |
|---------|----------|
| `src/pages/Galeria.jsx` | Página `/galeria`: buscador, filtro por categoría, orden por fecha, contador de resultados y grid de obras. |
| `src/components/galeria/ObraTarjeta.jsx` | Tarjeta de cada obra con **miniatura** (si es imagen) o **ícono según el tipo** (PDF 📕, audio 🎵, video 🎬, texto 📝), más título, autor, categoría, folio y fecha. |
| `src/components/galeria/ObraModal.jsx` | **Vista de detalle en modal** (`<dialog>`) con todos los metadatos y el botón **Descargar certificado** de la Práctica 04. |
| `src/utils/galeria.js` | `filtrarObras()` combina búsqueda + categoría + orden. `normalizar()` ignora acentos y mayúsculas. `tipoArchivo()` decide si se muestra miniatura o ícono. |
| `registra-ip-server/scripts/sembrar-obras.js` | Registra las **10 obras de prueba** con folio `OBRA-2039-###` (`npm run sembrar`). |

- **Grid responsivo:** `grid-template-columns: repeat(auto-fill, minmax(220px, 1fr))`. Se ven 4 columnas en escritorio y 2 en celular, sin media queries para el número de columnas.
- **Búsqueda en vivo:** filtra por **título o autor** mientras se escribe, sin botón "Buscar".
- **Filtro por categoría:** botones tipo *chip* (`aria-pressed`) con el número de obras de cada categoría. "Diseño", "Fotografía", "Escritura" y "Cine" de la práctica corresponden a Diseño gráfico, Fotografía, Literatura y Cine y video.
- **Orden:** un `<select>` con "Más recientes primero" y "Más antiguas primero", según la fecha de registro.
- **Combinados:** los tres criterios se aplican juntos, en este orden: búsqueda → categoría → orden.

## Personalización: 10 obras de prueba

| Folio\* | Título | Categoría | Tipo | Fecha | Autor |
|---------|--------|-----------|------|-------|-------|
| OBRA-2039-0xx | Atardecer en Xochimilco | Fotografía | PNG | 04-ago-2026 | Pineda Flores Christopher Javier |
| OBRA-2039-0xx | Logotipo para Café Raíz | Diseño gráfico | PNG | 12-ago-2026 | Pineda Flores Christopher Javier |
| OBRA-2039-0xx | Cuento: La última trajinera | Literatura | PDF | 21-ago-2026 | Pineda Flores Christopher Javier |
| OBRA-2039-0xx | Ilustración: Ajolote guardián | Ilustración | PNG | 02-sep-2026 | María López Ruiz |
| OBRA-2039-0xx | Son de la lluvia (demo) | Música | WAV | 10-sep-2026 | Pineda Flores Christopher Javier |
| OBRA-2039-0xx | Storyboard: Metro Balderas | Cine y video | PNG | 18-sep-2026 | Diego Hernández Soto |
| OBRA-2039-0xx | Fotografía: Mercado de Jamaica | Fotografía | PNG | 27-sep-2026 | Pineda Flores Christopher Javier |
| OBRA-2039-0xx | Poema: Ciudad de agua | Literatura | TXT | 05-oct-2026 | Valeria Cruz Ramírez |
| OBRA-2039-0xx | Cartel Festival de Diseño 2026 | Diseño gráfico | PNG | 12-oct-2026 | Pineda Flores Christopher Javier |
| OBRA-2039-0xx | Cortometraje: Lluvia en Coyoacán (póster) | Cine y video | PNG | 19-oct-2026 | Pineda Flores Christopher Javier |

\* El servidor asigna el número consecutivo después de las obras que ya existían (por ejemplo, de la 004 a la 013).

Los archivos los genera el propio script: imágenes PNG dibujadas píxel por píxel, un PDF de una página, un audio WAV con una melodía y un poema en TXT. Se suben por el mismo `POST /obras` que usa el wizard.

## Criterios ISO 9241 aplicados (defensa oral)

### 1. Retroalimentación del estado — ISO 9241-110:2020, principio de **autodescriptividad**

El sistema siempre informa qué está pasando:

- **Mientras carga** `GET /obras`: tarjetas "esqueleto" animadas y el texto "Cargando obras…" con `role="status"`.
- **Al buscar o filtrar:** contador vivo "Mostrando **2** de 13 obras que coinciden con «pineda» en **Diseño gráfico** · más recientes primero", anunciado con `aria-live="polite"`.
- **Sin resultados:** un estado vacío que explica por qué no hay obras y ofrece **Limpiar filtros**.
- **Si falla el servidor:** un mensaje claro con el botón **Reintentar**.

**Por qué:** sin retroalimentación, una pantalla en blanco no distingue entre "está cargando", "no hay obras" y "se cayó el servidor". El usuario no sabe si esperar, cambiar su búsqueda o reportar un error.

### 2. Área mínima de toque de 44 × 44 px — accesibilidad táctil (ISO 9241-171 · ISO 9241-410)

Todos los elementos interactivos de la galería miden al menos **44 × 44 px**: buscador, chips de categoría, selector de orden, tarjetas, botones del modal y la ✕ de cerrar. Se controla con la variable `--toque-min: 44px` en `App.css`. Se verificó con una prueba automática que recorre todos los controles: ninguno mide menos de 44 px.

**Por qué:** la yema del dedo cubre alrededor de 1 cm. Los objetivos pequeños o muy juntos provocan toques equivocados, sobre todo en celular y en personas con temblor o poca precisión motriz. ISO 9241-171 pide que los controles sean fáciles de activar, e ISO 9241-410 trata el diseño para dispositivos de entrada como la pantalla táctil. El valor de 44 px es la referencia vista en clase y coincide con WCAG 2.5.5 y las guías de iOS.

### Extra: controlabilidad y robustez ante errores de uso (ISO 9241-110)

- La búsqueda **ignora acentos y mayúsculas**: "fotografia" encuentra "Fotografía" y "PINEDA" encuentra "Pineda".
- Los filtros se guardan en la **URL** (`/galeria?q=lluvia&cat=Cine+y+video&orden=antiguas`). El botón **Atrás**, recargar la página o compartir el enlace conservan la búsqueda.
- El modal se cierra con **Esc**, con la ✕ o al hacer clic fuera, y el foco regresa a la tarjeta que se abrió.
- El estado seleccionado de los chips se marca con **✓ además del color**, así que no depende solo del color.

## Pruebas combinadas

| Búsqueda | Categoría | Orden | Resultado esperado |
|----------|-----------|-------|--------------------|
| *(vacía)* | Todas | Más recientes | Todas las obras, de la más nueva a la más antigua |
| `FOTOGRAFIA` | Todas | Más recientes | "Fotografía: Mercado de Jamaica" (sin acento y en mayúsculas también funciona) |
| `pineda` | Diseño gráfico | Más recientes | Cartel Festival de Diseño 2026 → Logotipo para Café Raíz |
| *(vacía)* | Cine y video | Más recientes | Cortometraje (19-oct) → Storyboard (18-sep) |
| *(vacía)* | Cine y video | Más antiguas | Storyboard (18-sep) → Cortometraje (19-oct) |
| `lluvia` | Cine y video | Más antiguas | Solo "Cortometraje: Lluvia en Coyoacán" |
| `lluvia` | Música | — | Solo "Son de la lluvia (demo)" |
| `zzz` | Cualquiera | — | Estado vacío con **Limpiar filtros** |
