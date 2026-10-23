# Práctica 03 — Wizard de registro de obras + backend con multer

**Alumno:** Pineda Flores Christopher Javier · **Boleta:** 2024602039

## Personalización: folios

Cada obra recibe un folio **`OBRA-2039-###`** (2039 = últimos 4 dígitos de la boleta): `OBRA-2039-001`, `OBRA-2039-002`, …

- El prefijo está en `src/config.js` (`PREFIJO_FOLIO`) y en `registra-ip-server/obras.js`.
- Al confirmar, el frontend consulta `GET /obras`, calcula el siguiente número y lo envía en el `FormData`.
- El servidor valida el formato con `/^OBRA-2039-\d{3}$/`. Si dos personas registran al mismo tiempo y el folio ya existe, asigna el siguiente libre. Así nunca se repite.
- El archivo se guarda con su folio como nombre: `uploads/OBRA-2039-001.png`. Los metadatos van en `data/obras/OBRA-2039-001.json`.

## Arquitectura

```
Documents/Proyectos/
├── registra-ip/            ← frontend (React + Vite)   http://localhost:5173
└── registra-ip-server/     ← backend (Express)          http://localhost:4000
    ├── server.js           cors(), multer.diskStorage → uploads/, rutas
    ├── obras.js            folios, validación, guardado y lectura de JSON
    ├── uploads/            archivos reales de las obras
    └── data/obras/         un JSON de metadatos por obra
```

| Endpoint | Qué hace |
|----------|----------|
| `POST /obras` | `multer.single("archivo")` recibe el archivo; valida los metadatos (folio, título, categoría, descripción, autor); renombra el archivo con el folio y escribe el JSON. Responde **201** con la obra o **400** con `{ errores: [...] }`. |
| `GET /obras` | Lee todos los JSON de `data/obras/` y regresa la lista ordenada por folio. |

## Wizard (`src/pages/RegistrarObra.jsx`)

| Paso | Componente | Requisito para avanzar |
|------|-----------|------------------------|
| 1. Archivo | `PasoArchivo.jsx` | Archivo seleccionado (imagen, PDF, audio, video o texto; ≤ 10 MB) |
| 2. Metadatos | `PasoMetadatos.jsx` | Título de **mínimo 5 caracteres** y **categoría** seleccionada |
| 3. Vista previa | `PasoVistaPrevia.jsx` | Resumen de todo lo capturado; botón **Confirmar y registrar** |
| 4. Confirmación | `PasoConfirmacion.jsx` | Muestra el folio generado por el servidor (o el error con **Reintentar**) |

- **Un solo estado:** `useReducer(wizardReducer, estadoInicial)` en el componente padre guarda `paso`, `archivo`, `titulo`, `categoria`, `descripcion` y el estado del envío. Los pasos solo reciben datos por props y avisan cambios con `dispatch`. Por eso **Atrás** no pierde nada: el estado nunca se borra al cambiar de pantalla.
- **Barra de progreso:** `BarraProgreso.jsx` dibuja 4 círculos unidos por una línea que se llena. Los pasos completados muestran ✓ y se pueden pulsar para regresar. El paso actual tiene `aria-current="step"`, y arriba dice "Paso X de 4".
- **Validación por paso:** `validarPaso(estado, paso)` en `src/utils/wizardObra.js`. El botón **Siguiente** tiene `disabled={!valido}`, y debajo un contenedor `aria-live="polite"` explica qué falta. Además, el reducer vuelve a validar en la acción `SIGUIENTE`: aunque alguien forzara el clic, no avanza.
- **Envío:** `src/utils/api.js` arma un `FormData` (campos de texto + `archivo`) y hace `fetch(POST /obras)`. No se pone `Content-Type` a mano porque el navegador agrega el *boundary* del multipart.
- **Accesibilidad:** al cambiar de paso, el foco se mueve al título del paso. Los errores se anuncian con `aria-live`, y la zona para arrastrar el archivo es un `<label>` del `<input type="file">`, así que también funciona con teclado.

## ¿Por qué validar por paso y no todo al final? (defensa oral)

1. **El error se corrige donde se cometió.** Si el título es muy corto, el usuario lo ve mientras está en la pantalla del título. Si se validara al final, tendría que regresar dos pantallas a buscar qué estaba mal.
2. **Menor carga cognitiva.** Cada pantalla pide pocas cosas y dice exactamente qué falta ("Para continuar: …"). El usuario no enfrenta una lista de errores de un formulario que ya no ve.
3. **La vista previa es confiable.** Como no se puede llegar al paso 3 con datos inválidos, el resumen siempre muestra información correcta. Confirmar es un solo clic sin sorpresas.
4. **Se evitan envíos inútiles.** Nunca se sube un archivo pesado al servidor para que luego lo rechace por un título vacío. Se ahorra tiempo y datos.
5. **Prevención de errores (heurística de Nielsen #5).** Deshabilitar *Siguiente* evita el error en vez de reportarlo después. El texto de ayuda explica por qué está deshabilitado.
6. **El servidor valida de nuevo.** El frontend da buena experiencia, pero el backend no confía en él: `obras.js` vuelve a revisar todo y responde 400 si algo falla.

## Pruebas

| Caso | Resultado |
|------|-----------|
| Paso 1 sin archivo | **Siguiente** deshabilitado: "Selecciona el archivo de tu obra." |
| Paso 1 con un `.exe` | Bloqueado: "Formato no permitido…" |
| Paso 2 con título "Ata" (3 caracteres) | Bloqueado: "…al menos 5 caracteres (llevas 3)." |
| Paso 2 con título válido pero sin categoría | Bloqueado: "Selecciona una categoría." |
| Atrás desde el paso 2 y volver | Se conservan archivo, título, categoría y descripción |
| Obra 1: imagen PNG, Fotografía | Folio **OBRA-2039-001** |
| Obra 2: PDF, Literatura, sin descripción | Folio **OBRA-2039-002** |
| Obra 3: MP3, Música | Folio **OBRA-2039-003** |
| Confirmar con el servidor apagado | "No hay conexión con el servidor"; botones **Atrás** y **Reintentar**, datos intactos |
| Dashboard | Tabla con las obras de `GET /obras` y enlace a cada archivo |
