import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import Card from '../components/Card'
import Button from '../components/Button'
import Modal from '../components/Modal'
import Input from '../components/Input'
import Select from '../components/Select'
import { Plus } from 'lucide-react'
import { getClientes, getTiposCajas, saveMovimiento, getMovimientos, getSaldoCliente } from '../services/storage'
import { MovimientoCaja, Cliente, TipoCaja } from '../types'
import './Movimientos.css'

export default function Ajustes() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [ajustes, setAjustes] = useState<MovimientoCaja[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [tiposCajas, setTiposCajas] = useState<TipoCaja[]>([])
  const [saldoActual, setSaldoActual] = useState(0)
  
  const [formData, setFormData] = useState({
    clienteId: '',
    tipoCajaId: '',
    cantidad: '',
    fecha: format(new Date(), 'yyyy-MM-dd'),
    hora: format(new Date(), 'HH:mm'),
    motivo: '',
    observaciones: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (formData.clienteId && formData.tipoCajaId) {
      const saldo = getSaldoCliente(formData.clienteId, formData.tipoCajaId)
      setSaldoActual(saldo)
    } else {
      setSaldoActual(0)
    }
  }, [formData.clienteId, formData.tipoCajaId])

  const loadData = () => {
    const movs = getMovimientos()
    setAjustes(movs.filter(m => m.tipo === 'ajuste').sort((a, b) => {
      const dateA = new Date(`${a.fecha}T${a.hora}`)
      const dateB = new Date(`${b.fecha}T${b.hora}`)
      return dateB.getTime() - dateA.getTime()
    }))
    setClientes(getClientes().filter(c => c.activo))
    setTiposCajas(getTiposCajas().filter(t => t.activo))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.clienteId || !formData.tipoCajaId || !formData.cantidad || !formData.motivo) {
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
      tipo: 'ajuste',
      motivo: formData.motivo,
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
      motivo: '',
      observaciones: ''
    })
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Ajustes de Saldos</h1>
          <p>Realiza ajustes manuales a los saldos de cajas</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          Nuevo Ajuste
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
                <th>Nuevo Saldo</th>
                <th>Motivo</th>
                <th>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {ajustes.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                    No hay ajustes registrados
                  </td>
                </tr>
              ) : (
                ajustes.map(ajuste => {
                  const cliente = clientes.find(c => c.id === ajuste.clienteId)
                  const tipoCaja = tiposCajas.find(t => t.id === ajuste.tipoCajaId)
                  
                  return (
                    <tr key={ajuste.id}>
                      <td>{format(new Date(ajuste.fecha), 'dd/MM/yyyy')}</td>
                      <td>{ajuste.hora}</td>
                      <td>{cliente?.nombre || 'N/A'}</td>
                      <td>
                        <span className="tipo-caja-badge" style={{ backgroundColor: tipoCaja?.color + '20', color: tipoCaja?.color }}>
                          {tipoCaja?.codigo || 'N/A'}
                        </span>
                      </td>
                      <td>{ajuste.cantidad}</td>
                      <td>{ajuste.motivo || '-'}</td>
                      <td>{ajuste.observaciones || '-'}</td>
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
        title="Nuevo Ajuste"
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
          
          {formData.clienteId && formData.tipoCajaId && (
            <div className="info-box">
              <strong>Saldo actual:</strong> {saldoActual} cajas
            </div>
          )}
          
          <Input
            label="Nuevo Saldo *"
            type="number"
            min="0"
            value={formData.cantidad}
            onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
          />
          
          <Input
            label="Motivo del Ajuste *"
            value={formData.motivo}
            onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
            placeholder="Ej: Corrección de inventario, inventario físico, etc."
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
              Guardar Ajuste
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}


