import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Entregas from './pages/Entregas'
import Devoluciones from './pages/Devoluciones'
import Retiros from './pages/Retiros'
import Ajustes from './pages/Ajustes'
import Clientes from './pages/Clientes'
import TiposCajas from './pages/TiposCajas'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/entregas" element={<Entregas />} />
          <Route path="/devoluciones" element={<Devoluciones />} />
          <Route path="/retiros" element={<Retiros />} />
          <Route path="/ajustes" element={<Ajustes />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/tipos-cajas" element={<TiposCajas />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App


