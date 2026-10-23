# REGISTRA-IP

**Nombre:** Pineda Flores Christopher Javier
**Boleta:** 2024602039

REGISTRA-IP — Registro y verificación de autoría. Proyecto de la materia Diseño de Interfaces de Usuario.

## Color de marca

`#602039` — derivado de los últimos 6 dígitos de la boleta. Contraste 11.91:1 sobre blanco (cumple WCAG AA y AAA). Análisis completo en [docs/PRACTICA02.md](docs/PRACTICA02.md).

## Tecnologías

- [React](https://react.dev) — biblioteca para construir interfaces
- [Vite](https://vite.dev) — servidor de desarrollo y empaquetador
- [React Router](https://reactrouter.com) — navegación entre páginas y ruta protegida
- [jsPDF](https://github.com/parallax/jsPDF) y [qrcode](https://github.com/soldair/node-qrcode) — certificado PDF con código QR
- Node.js LTS + npm, Git y GitHub

## Cómo ejecutar

Se necesitan dos terminales: el **backend** ([registra-ip-server-2039](https://github.com/KingWolf7528/registra-ip-server-2039)) y este **frontend**.

```bash
# Terminal 1 — backend (carpeta hermana registra-ip-server)
cd ../registra-ip-server
npm install
npm start       # http://localhost:4000

# Terminal 2 — frontend
npm install     # instala las dependencias
npm run dev     # inicia el servidor en http://localhost:5173
```

## Estructura

```
registra-ip/
├── public/          # archivos estáticos (favicon, íconos)
├── src/
│   ├── components/  # Layout, RutaProtegida, ObrasRegistradas, wizard/ y galeria/ (tarjeta y modal)
│   ├── pages/       # Registro, Dashboard, RegistrarObra (wizard), ObraDetalle y Galeria
│   ├── utils/       # sesion, wizardObra, api, generarCertificado y galeria (búsqueda/filtros)
│   ├── config.js    # URL del API, prefijo de folio OBRA-2039 y categorías
│   ├── App.jsx      # definición de rutas
│   ├── App.css      # guía de estilo: colores, tipografía, espaciados
│   ├── main.jsx     # punto de entrada con <BrowserRouter>
│   └── index.css    # estilos globales mínimos
├── index.html       # página base que carga main.jsx
├── package.json     # nombre, scripts y dependencias del proyecto
└── vite.config.js   # configuración de Vite (plugin de React)
```

## Prácticas

| # | Tema | Estado |
|---|------|--------|
| 01 | Instalación del entorno y proyecto base | ✅ |
| 02 | Paleta de color, layout responsivo, registro y ruta protegida | ✅ |
| 03 | Wizard de registro de obras + backend con multer (folios `OBRA-2039-###`) | ✅ |
| 04 | Certificado PDF tipo diploma con QR del folio (jsPDF + qrcode) | ✅ |
| 05 | Galería con búsqueda, filtro por categoría, orden por fecha y criterios ISO 9241 | ✅ |

Explicación de cada comando usado en la instalación: [docs/COMANDOS.md](docs/COMANDOS.md)
