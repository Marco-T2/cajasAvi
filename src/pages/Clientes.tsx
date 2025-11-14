import { useState, useEffect } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'
import Modal from '../components/Modal'
import Input from '../components/Input'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { getClientes, saveCliente, deleteCliente } from '../services/storage'
import { Cliente } from '../types'
import './Clientes.css'

export default function Clientes() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)
  const [clientes, setClientes] = useState<Cliente[]>([])
  
  const [formData, setFormData] = useState({
    nombre: '',
    contacto: '',
    activo: true
  })

  useEffect(() => {
    loadClientes()
  }, [])

  const loadClientes = () => {
    setClientes(getClientes())
  }

  const handleOpenModal = (cliente?: Cliente) => {
    if (cliente) {
      setEditingCliente(cliente)
      setFormData({
        nombre: cliente.nombre,
        contacto: cliente.contacto || '',
        activo: cliente.activo
      })
    } else {
      setEditingCliente(null)
      setFormData({
        nombre: '',
        contacto: '',
        activo: true
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingCliente(null)
    setFormData({
      nombre: '',
      contacto: '',
      activo: true
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nombre.trim()) {
      alert('El nombre del cliente es requerido')
      return
    }

    const cliente: Cliente = {
      id: editingCliente?.id || Date.now().toString(),
      nombre: formData.nombre.trim(),
      contacto: formData.contacto.trim() || undefined,
      activo: formData.activo
    }

    saveCliente(cliente)
    loadClientes()
    handleCloseModal()
  }

  const handleDelete = (id: string) => {
    if (confirm('¿Está seguro de eliminar este cliente?')) {
      deleteCliente(id)
      loadClientes()
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Clientes</h1>
          <p>Gestiona la información de tus clientes</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus size={18} />
          Nuevo Cliente
        </Button>
      </div>

      <Card>
        <div className="clientes-grid">
          {clientes.length === 0 ? (
            <div className="empty-state">
              <p>No hay clientes registrados</p>
            </div>
          ) : (
            clientes.map(cliente => (
              <div key={cliente.id} className="cliente-card">
                <div className="cliente-info">
                  <h3>{cliente.nombre}</h3>
                  {cliente.contacto && (
                    <p className="cliente-contacto">{cliente.contacto}</p>
                  )}
                  <span className={`cliente-status ${cliente.activo ? 'activo' : 'inactivo'}`}>
                    {cliente.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div className="cliente-actions">
                  <button
                    className="icon-button"
                    onClick={() => handleOpenModal(cliente)}
                    title="Editar"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    className="icon-button icon-button-danger"
                    onClick={() => handleDelete(cliente.id)}
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
      >
        <form onSubmit={handleSubmit} className="form">
          <Input
            label="Nombre *"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            placeholder="Nombre del cliente"
            required
          />
          
          <Input
            label="Contacto"
            value={formData.contacto}
            onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
            placeholder="Teléfono, email, etc."
          />
          
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.activo}
                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
              />
              <span>Cliente activo</span>
            </label>
          </div>
          
          <div className="form-actions">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingCliente ? 'Actualizar' : 'Guardar'} Cliente
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}


