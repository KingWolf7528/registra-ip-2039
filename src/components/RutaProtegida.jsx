import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { obtenerUsuario } from '../utils/sesion.js'

// Envuelve las rutas privadas: si no hay sesión guardada en localStorage,
// redirige a /registro; si la hay, deja pasar a la ruta hija (<Outlet />).
function RutaProtegida() {
  const location = useLocation()
  const usuario = obtenerUsuario()

  if (!usuario) {
    return <Navigate to="/registro" replace state={{ desde: location.pathname }} />
  }

  return <Outlet />
}

export default RutaProtegida
