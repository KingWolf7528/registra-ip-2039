import { Link, NavLink, Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div className="layout">
      <header className="encabezado">
        <div className="encabezado__contenido">
          <Link to="/" className="marca">
            REGISTRA-IP <span>· Registro de autoría</span>
          </Link>
          <nav className="nav" aria-label="Navegación principal">
            <NavLink to="/registro">Registro</NavLink>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/galeria">Galería</NavLink>
            <NavLink to="/obras/nueva">Registrar obra</NavLink>
          </nav>
        </div>
      </header>

      <main className="contenido">
        <Outlet />
      </main>

      <footer className="pie">
        <div className="pie__contenido">
          REGISTRA-IP · Diseño de Interfaces de Usuario · Pineda Flores
          Christopher Javier (2024602039)
        </div>
      </footer>
    </div>
  )
}

export default Layout
