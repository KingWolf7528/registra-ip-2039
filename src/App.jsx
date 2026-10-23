import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import RutaProtegida from './components/RutaProtegida.jsx'
import Registro from './pages/Registro.jsx'
import Dashboard from './pages/Dashboard.jsx'
import RegistrarObra from './pages/RegistrarObra.jsx'
import ObraDetalle from './pages/ObraDetalle.jsx'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/registro" replace />} />
        <Route path="/registro" element={<Registro />} />

        {/* Rutas privadas: solo con sesión iniciada */}
        <Route element={<RutaProtegida />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/obras/nueva" element={<RegistrarObra />} />
          <Route path="/obras/:folio" element={<ObraDetalle />} />
        </Route>

        <Route path="*" element={<Navigate to="/registro" replace />} />
      </Route>
    </Routes>
  )
}

export default App
