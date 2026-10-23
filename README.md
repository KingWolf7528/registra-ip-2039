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
- Node.js LTS + npm, Git y GitHub

## Cómo ejecutar

```bash
npm install     # instala las dependencias
npm run dev     # inicia el servidor en http://localhost:5173
```

## Estructura

```
registra-ip/
├── public/          # archivos estáticos (favicon, íconos)
├── src/
│   ├── components/  # Layout.jsx y RutaProtegida.jsx
│   ├── pages/       # Registro.jsx y Dashboard.jsx
│   ├── utils/       # sesion.js (localStorage)
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

Explicación de cada comando usado en la instalación: [docs/COMANDOS.md](docs/COMANDOS.md)
