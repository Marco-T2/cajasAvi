import { useState, useEffect } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'
import Modal from '../components/Modal'
import Input from '../components/Input'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { getTiposCajas, saveTipoCaja, deleteTipoCaja } from '../services/storage'
import { TipoCaja } from '../types'
import './TiposCajas.css'

export default function TiposCajas() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTipo, setEditingTipo] = useState<TipoCaja | null>(null)
  const [tiposCajas, setTiposCajas] = useState<TipoCaja[]>([])
  
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    color: '#2563eb',
    activo: true
  })

  useEffect(() => {
    loadTiposCajas()
  }, [])

  const loadTiposCajas = () => {
    setTiposCajas(getTiposCajas())
  }

  const handleOpenModal = (tipo?: TipoCaja) => {
    if (tipo) {
      setEditingTipo(tipo)
      setFormData({
        codigo: tipo.codigo,
        nombre: tipo.nombre,
        color: tipo.color,
        activo: tipo.activo
      })
    } else {
      setEditingTipo(null)
      setFormData({
        codigo: '',
        nombre: '',
        color: '#2563eb',
        activo: true
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTipo(null)
    setFormData({
      codigo: '',
      nombre: '',
      color: '#2563eb',
      activo: true
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.codigo.trim() || !formData.nombre.trim()) {
      alert('El código y nombre son requeridos')
      return
    }

    // Verificar que el código no esté duplicado (excepto si es edición)
    const codigoExists = tiposCajas.some(
      t => t.codigo.toUpperCase() === formData.codigo.toUpperCase().trim() && 
      t.id !== editingTipo?.id
    )
    
    if (codigoExists) {
      alert('Ya existe un tipo de caja con ese código')
      return
    }

    const tipoCaja: TipoCaja = {
      id: editingTipo?.id || Date.now().toString(),
      codigo: formData.codigo.toUpperCase().trim(),
      nombre: formData.nombre.trim(),
      color: formData.color,
      activo: formData.activo
    }

    saveTipoCaja(tipoCaja)
    loadTiposCajas()
    handleCloseModal()
  }

  const handleDelete = (id: string) => {
    if (confirm('¿Está seguro de eliminar este tipo de caja?')) {
      deleteTipoCaja(id)
      loadTiposCajas()
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Tipos de Cajas</h1>
          <p>Gestiona los diferentes tipos de cajas disponibles</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus size={18} />
          Nuevo Tipo
        </Button>
      </div>

      <Card>
        <div className="tipos-grid">
          {tiposCajas.length === 0 ? (
            <div className="empty-state">
              <p>No hay tipos de cajas registrados</p>
            </div>
          ) : (
            tiposCajas.map(tipo => (
              <div key={tipo.id} className="tipo-card">
                <div className="tipo-color" style={{ backgroundColor: tipo.color }}></div>
                <div className="tipo-info">
                  <h3>{tipo.codigo}</h3>
                  <p>{tipo.nombre}</p>
                  <span className={`tipo-status ${tipo.activo ? 'activo' : 'inactivo'}`}>
                    {tipo.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div className="tipo-actions">
                  <button
                    className="icon-button"
                    onClick={() => handleOpenModal(tipo)}
                    title="Editar"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    className="icon-button icon-button-danger"
                    onClick={() => handleDelete(tipo.id)}
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
        title={editingTipo ? 'Editar Tipo de Caja' : 'Nuevo Tipo de Caja'}
      >
        <form onSubmit={handleSubmit} className="form">
          <Input
            label="Código *"
            value={formData.codigo}
            onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
            placeholder="Ej: NEG, VER, ORU"
            maxLength={10}
            required
          />
          
          <Input
            label="Nombre *"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            placeholder="Ej: Negras, Verdes, Oruro"
            required
          />
          
          <div className="color-group">
            <label className="input-label">Color *</label>
            <div className="color-input-wrapper">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="color-input"
              />
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="color-text-input"
                placeholder="#2563eb"
              />
            </div>
          </div>
          
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.activo}
                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
              />
              <span>Tipo activo</span>
            </label>
          </div>
          
          <div className="form-actions">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingTipo ? 'Actualizar' : 'Guardar'} Tipo
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}


