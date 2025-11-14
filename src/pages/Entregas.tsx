import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import Card from '../components/Card'
import Button from '../components/Button'
import Modal from '../components/Modal'
import Input from '../components/Input'
import Select from '../components/Select'
import { Plus } from 'lucide-react'
import { getClientes, getTiposCajas, saveMovimiento, getMovimientos } from '../services/storage'
import { MovimientoCaja, Cliente, TipoCaja } from '../types'
import './Movimientos.css'

export default function Entregas() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [entregas, setEntregas] = useState<MovimientoCaja[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [tiposCajas, setTiposCajas] = useState<TipoCaja[]>([])
  
  const [formData, setFormData] = useState({
    clienteId: '',
    tipoCajaId: '',
    cantidad: '',
    fecha: format(new Date(), 'yyyy-MM-dd'),
    hora: format(new Date(), 'HH:mm'),
    observaciones: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const movs = getMovimientos()
    setEntregas(movs.filter(m => m.tipo === 'entrega').sort((a, b) => {
      const dateA = new Date(`${a.fecha}T${a.hora}`)
      const dateB = new Date(`${b.fecha}T${b.hora}`)
      return dateB.getTime() - dateA.getTime()
    }))
    setClientes(getClientes().filter(c => c.activo))
    setTiposCajas(getTiposCajas().filter(t => t.activo))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.clienteId || !formData.tipoCajaId || !formData.cantidad) {
      alert('Por favor complete todos los campos requeridos')
      return
    }

    const movimiento: MovimientoCaja = {
      id: Date.now().toString(),
      clienteId: formData.clienteId,
      tipoCajaId: formData.tipoCajaId,
      cantidad: parseInt(formData.cantidad),
      fecha: formData.fecha,
      hora: formData.hora,
      tipo: 'entrega',
      observaciones: formData.observaciones || undefined
    }

    saveMovimiento(movimiento)
    loadData()
    setIsModalOpen(false)
    setFormData({
      clienteId: '',
      tipoCajaId: '',
      cantidad: '',
      fecha: format(new Date(), 'yyyy-MM-dd'),
      hora: format(new Date(), 'HH:mm'),
      observaciones: ''
    })
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Entregas de Cajas</h1>
          <p>Registra las entregas de cajas a los clientes</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          Nueva Entrega
        </Button>
      </div>

      <Card>
        <div className="movimientos-table">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Cliente</th>
                <th>Tipo de Caja</th>
                <th>Cantidad</th>
                <th>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {entregas.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                    No hay entregas registradas
                  </td>
                </tr>
              ) : (
                entregas.map(entrega => {
                  const cliente = clientes.find(c => c.id === entrega.clienteId)
                  const tipoCaja = tiposCajas.find(t => t.id === entrega.tipoCajaId)
                  
                  return (
                    <tr key={entrega.id}>
                      <td>{format(new Date(entrega.fecha), 'dd/MM/yyyy')}</td>
                      <td>{entrega.hora}</td>
                      <td>{cliente?.nombre || 'N/A'}</td>
                      <td>
                        <span className="tipo-caja-badge" style={{ backgroundColor: tipoCaja?.color + '20', color: tipoCaja?.color }}>
                          {tipoCaja?.codigo || 'N/A'}
                        </span>
                      </td>
                      <td>{entrega.cantidad}</td>
                      <td>{entrega.observaciones || '-'}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nueva Entrega"
      >
        <form onSubmit={handleSubmit} className="form">
          <Select
            label="Cliente *"
            value={formData.clienteId}
            onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })}
            options={clientes.map(c => ({ value: c.id, label: c.nombre }))}
          />
          
          <Select
            label="Tipo de Caja *"
            value={formData.tipoCajaId}
            onChange={(e) => setFormData({ ...formData, tipoCajaId: e.target.value })}
            options={tiposCajas.map(t => ({ value: t.id, label: `${t.codigo} - ${t.nombre}` }))}
          />
          
          <Input
            label="Cantidad *"
            type="number"
            min="1"
            value={formData.cantidad}
            onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
          />
          
          <div className="form-row">
            <Input
              label="Fecha *"
              type="date"
              value={formData.fecha}
              onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
            />
            
            <Input
              label="Hora *"
              type="time"
              value={formData.hora}
              onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
            />
          </div>
          
          <Input
            label="Observaciones"
            value={formData.observaciones}
            onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
            placeholder="Notas adicionales..."
          />
          
          <div className="form-actions">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Guardar Entrega
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}


