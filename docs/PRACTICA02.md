# Práctica 02 — Paleta, layout, registro y ruta protegida

**Alumno:** Pineda Flores Christopher Javier · **Boleta:** 2024602039

## 1. Color primario derivado de la boleta

| Dato | Valor |
|------|-------|
| Últimos 6 dígitos de la boleta | `602039` |
| Color hexadecimal | **`#602039`** |
| RGB | 96, 32, 57 |
| HSL | 337°, 50 %, 25 % (vino / borgoña) |
| Luminancia relativa | ≈ 0.038 |

## 2. Análisis de contraste (WCAG 2.x) sobre blanco `#FFFFFF`

Fórmula: `contraste = (L_clara + 0.05) / (L_oscura + 0.05) = (1.0 + 0.05) / (0.038 + 0.05) ≈ 11.91 : 1`

| Nivel | Mínimo requerido | #602039 sobre blanco | Resultado |
|-------|------------------|----------------------|-----------|
| AA texto normal | 4.5 : 1 | 11.91 : 1 | ✅ Cumple |
| AA texto grande | 3 : 1 | 11.91 : 1 | ✅ Cumple |
| AAA texto normal | 7 : 1 | 11.91 : 1 | ✅ Cumple |
| AA componentes de interfaz | 3 : 1 | 11.91 : 1 | ✅ Cumple |

Verificado en <https://webaim.org/resources/contrastchecker/?fcolor=602039&bcolor=FFFFFF>.

**¿Se ajustó el tono?** No. El contraste depende de la *luminosidad*, no del matiz. Con una luminosidad HSL de 25 % el color ya es muy oscuro, por eso contrasta fuertemente con el blanco (y el texto blanco sobre el encabezado tiene el mismo 11.91:1). Si la boleta hubiera generado un color claro, la corrección correcta sería bajar su luminosidad **conservando el matiz (H)**, para que siga reconociéndose como el mismo color de marca.

**Teoría del color:** el vino/borgoña es un color cálido de baja luminosidad que transmite seriedad, formalidad y autoridad, adecuado para una plataforma de registro de autoría. Las variantes se construyeron sobre el **mismo matiz (≈337°)** cambiando solo la luminosidad (esquema monocromático), y el color de éxito es un verde de 160°, casi el **complementario** del primario (337° − 180° = 157°), para que destaque sin chocar.

## 3. Guía de estilo (definida en `src/App.css`)

| Variable | Color | Contraste sobre blanco | Uso |
|----------|-------|------------------------|-----|
| `--color-primario` | `#602039` | 11.91 : 1 | Encabezado, títulos, botones |
| `--color-primario-hover` | `#8a3a57` | 7.44 : 1 | Hover y foco |
| `--color-primario-suave` | `#f5e9ee` | solo fondo | Etiquetas (texto primario encima: 10.08 : 1) |
| `--color-exito` | `#1f7a5c` | 5.25 : 1 | Mensajes de éxito |
| `--color-error` | `#b42318` | 6.57 : 1 | Errores de validación |
| `--color-texto` | `#1c1b1f` | 17.13 : 1 | Texto principal |
| `--color-texto-suave` | `#5f5b66` | 6.61 : 1 | Texto secundario |

- **Tipografía:** fuente del sistema (`system-ui, Segoe UI, Roboto…`), tamaños 14 / 16 / 20 / 28 px, interlineado 1.5.
- **Espaciados:** escala de 4 px (`--esp-1` = 4 px … `--esp-12` = 48 px).
- **Responsivo:** Flexbox en encabezado y dashboard, Grid en formulario y paleta, y media query `max-width: 599px` (menos de 600 px) que apila el menú, el formulario y la tarjeta de bienvenida.

## 4. Funcionamiento

| Archivo | Qué hace |
|---------|----------|
| `src/main.jsx` | Envuelve la app con `<BrowserRouter>` para habilitar rutas. |
| `src/App.jsx` | Define las rutas: `/registro` pública y `/dashboard` dentro de `<RutaProtegida>`. |
| `src/components/Layout.jsx` | Encabezado "REGISTRA-IP", navegación, `<Outlet />` para la página actual y pie. |
| `src/pages/Registro.jsx` | Formulario (nombre, correo, `<select>` de tipo de creador) validado con `useState`. Errores en un contenedor `aria-live="polite"` y en cada campo con `aria-invalid` + `aria-describedby`. Si todo es válido guarda en `localStorage` con la clave `registraIpUsuario` y redirige a `/dashboard`. |
| `src/utils/sesion.js` | Funciones para guardar, leer y borrar la sesión en `localStorage`. |
| `src/components/RutaProtegida.jsx` | Si no hay sesión, redirige a `/registro` con `<Navigate>`; si la hay, muestra la ruta hija con `<Outlet />`. |
| `src/pages/Dashboard.jsx` | Saludo personalizado con los datos del creador, botón **Cerrar sesión** (borra la clave y regresa a `/registro`) y muestra de la paleta. |

## 5. Pruebas realizadas

| Caso | Resultado esperado |
|------|--------------------|
| Enviar el formulario vacío | Se rechaza; aparecen 3 errores y se anuncian por `aria-live`. |
| Correo `juan@correo` (sin dominio) | Se rechaza: "Escribe un correo válido…". |
| Nombre de 2 letras | Se rechaza: "al menos 3 caracteres". |
| Datos válidos | Se guarda `registraIpUsuario` y entra a `/dashboard`. |
| Entrar a `/dashboard` sin sesión | Redirige a `/registro`. |
| Cerrar sesión | Borra la clave y regresa a `/registro`; `/dashboard` vuelve a estar bloqueado. |
| Ventana < 600 px (DevTools → modo móvil) | Menú, formulario y tarjetas en una sola columna. |
