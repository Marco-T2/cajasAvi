import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Card from '../components/Card'
import { getMovimientos, getClientes, getTiposCajas, getSaldos } from '../services/storage'
import { MovimientoCaja } from '../types'
import { Package, RotateCcw, Trash2, TrendingUp } from 'lucide-react'
import './Dashboard.css'

export default function Dashboard() {
  const [movimientos, setMovimientos] = useState<MovimientoCaja[]>([])
  const [stats, setStats] = useState({
    totalEntregas: 0,
    totalDevoluciones: 0,
    totalRetiros: 0,
    totalClientes: 0
  })

  useEffect(() => {
    const movs = getMovimientos()
    const clientes = getClientes()
    const tiposCajas = getTiposCajas()
    const saldos = getSaldos()
    
    setMovimientos(movs.sort((a, b) => {
      const dateA = new Date(`${a.fecha}T${a.hora}`)
      const dateB = new Date(`${b.fecha}T${b.hora}`)
      return dateB.getTime() - dateA.getTime()
    }).slice(0, 10))

    setStats({
      totalEntregas: movs.filter(m => m.tipo === 'entrega').length,
      totalDevoluciones: movs.filter(m => m.tipo === 'devolucion').length,
      totalRetiros: movs.filter(m => m.tipo === 'retiro').length,
      totalClientes: clientes.filter(c => c.activo).length
    })
  }, [])

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      entrega: 'Entrega',
      devolucion: 'Devolución',
      retiro: 'Retiro',
      ajuste: 'Ajuste'
    }
    return labels[tipo] || tipo
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'entrega':
        return <Package size={16} />
      case 'devolucion':
        return <RotateCcw size={16} />
      case 'retiro':
        return <Trash2 size={16} />
      default:
        return <TrendingUp size={16} />
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Resumen del control de cajas</p>
      </div>

      <div className="stats-grid">
        <Card>
          <div className="stat-card">
            <div className="stat-icon stat-icon-primary">
              <Package size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Entregas</p>
              <p className="stat-value">{stats.totalEntregas}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="stat-card">
            <div className="stat-icon stat-icon-success">
              <RotateCcw size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Devoluciones</p>
              <p className="stat-value">{stats.totalDevoluciones}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="stat-card">
            <div className="stat-icon stat-icon-danger">
              <Trash2 size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Retiros</p>
              <p className="stat-value">{stats.totalRetiros}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="stat-card">
            <div className="stat-icon stat-icon-info">
              <TrendingUp size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Clientes Activos</p>
              <p className="stat-value">{stats.totalClientes}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Movimientos Recientes">
        <div className="movimientos-table">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Cliente</th>
                <th>Tipo</th>
                <th>Cantidad</th>
                <th>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                    No hay movimientos registrados
                  </td>
                </tr>
              ) : (
                movimientos.map(mov => {
                  const clientes = getClientes()
                  const tiposCajas = getTiposCajas()
                  const cliente = clientes.find(c => c.id === mov.clienteId)
                  const tipoCaja = tiposCajas.find(t => t.id === mov.tipoCajaId)
                  
                  return (
                    <tr key={mov.id}>
                      <td>
                        {format(new Date(mov.fecha), 'dd/MM/yyyy', { locale: es })}
                      </td>
                      <td>{mov.hora}</td>
                      <td>{cliente?.nombre || 'N/A'}</td>
                      <td>
                        <span className={`movimiento-badge movimiento-badge-${mov.tipo}`}>
                          {getTipoIcon(mov.tipo)}
                          {getTipoLabel(mov.tipo)} - {tipoCaja?.codigo || 'N/A'}
                        </span>
                      </td>
                      <td>{mov.cantidad}</td>
                      <td>{mov.observaciones || '-'}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

