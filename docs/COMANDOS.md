# Práctica 01 — Comandos usados y qué hace cada uno

| Comando | Qué hace |
|---------|----------|
| `node -v` | Muestra la versión de Node.js instalada (debe ser 20.x o superior). Node permite ejecutar JavaScript fuera del navegador. |
| `npm -v` | Muestra la versión de npm, el gestor de paquetes que viene con Node y descarga las librerías del proyecto. |
| `git config --global user.name "..."` | Guarda mi nombre como autor de todos los commits que haga en esta computadora. |
| `git config --global user.email "..."` | Guarda mi correo como autor de los commits; GitHub lo usa para ligarlos a una cuenta. |
| `npm create vite@latest registra-ip -- --template react` | Descarga la herramienta `create-vite` y genera la carpeta `registra-ip` con una plantilla de React. El `--` separa las opciones de npm de las de create-vite. |
| `cd registra-ip` | Cambia la terminal a la carpeta del proyecto. |
| `npm install` | Lee `package.json` y descarga las dependencias (React, Vite, etc.) en `node_modules`. También crea `package-lock.json` con las versiones exactas. |
| `npm run dev` | Ejecuta el script `dev` de `package.json`, que inicia el servidor de desarrollo de Vite en `http://localhost:5173` con recarga automática. |
| `code .` | Abre la carpeta actual (`.`) en Visual Studio Code. |
| `git init` | Convierte la carpeta en un repositorio de Git (crea la carpeta oculta `.git`). |
| `git add .` | Agrega todos los archivos al área de preparación (*staging*). `.gitignore` evita que se suba `node_modules`. |
| `git commit -m "..."` | Guarda una "foto" de los archivos preparados con un mensaje que describe el cambio. |
| `git branch -M main` | Renombra la rama actual a `main`. |
| `git remote add origin <URL>` | Registra el repositorio de GitHub con el nombre `origin`. |
| `git push -u origin main` | Sube los commits de `main` a GitHub; `-u` deja ligada la rama para que después baste con `git push`. |

## Extensiones de VS Code

- **ES7+ React/Redux/React-Native snippets**: atajos para escribir componentes (por ejemplo `rafce`).
- **Prettier**: formatea el código automáticamente con un estilo uniforme.
- **ESLint**: detecta errores y malas prácticas mientras escribes.
