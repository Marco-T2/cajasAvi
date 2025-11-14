import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, RotateCcw, Trash2, Settings, Users, Box } from 'lucide-react'
import './Layout.css'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/entregas', icon: Package, label: 'Entregas' },
    { path: '/devoluciones', icon: RotateCcw, label: 'Devoluciones' },
    { path: '/retiros', icon: Trash2, label: 'Retiros' },
    { path: '/ajustes', icon: Settings, label: 'Ajustes' },
    { path: '/clientes', icon: Users, label: 'Clientes' },
    { path: '/tipos-cajas', icon: Box, label: 'Tipos de Cajas' }
  ]

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>📦 Control de Cajas</h1>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map(item => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}


