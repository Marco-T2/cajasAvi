import { TipoCaja, Cliente, MovimientoCaja, SaldoCliente } from '../types'

const STORAGE_KEYS = {
  TIPOS_CAJAS: 'tipos_cajas',
  CLIENTES: 'clientes',
  MOVIMIENTOS: 'movimientos_cajas',
  SALDOS: 'saldos_clientes'
}

// Tipos de cajas por defecto
const TIPOS_CAJAS_DEFAULT: TipoCaja[] = [
  { id: '1', codigo: 'NEG', nombre: 'Negras', color: '#1e293b', activo: true },
  { id: '2', codigo: 'VER', nombre: 'Verdes', color: '#10b981', activo: true },
  { id: '3', codigo: 'ORU', nombre: 'Oruro', color: '#f59e0b', activo: true }
]

// Inicializar datos por defecto
const initializeDefaults = () => {
  if (!localStorage.getItem(STORAGE_KEYS.TIPOS_CAJAS)) {
    localStorage.setItem(STORAGE_KEYS.TIPOS_CAJAS, JSON.stringify(TIPOS_CAJAS_DEFAULT))
  }
  if (!localStorage.getItem(STORAGE_KEYS.CLIENTES)) {
    localStorage.setItem(STORAGE_KEYS.CLIENTES, JSON.stringify([]))
  }
  if (!localStorage.getItem(STORAGE_KEYS.MOVIMIENTOS)) {
    localStorage.setItem(STORAGE_KEYS.MOVIMIENTOS, JSON.stringify([]))
  }
  if (!localStorage.getItem(STORAGE_KEYS.SALDOS)) {
    localStorage.setItem(STORAGE_KEYS.SALDOS, JSON.stringify([]))
  }
}

initializeDefaults()

// Tipos de Cajas
export const getTiposCajas = (): TipoCaja[] => {
  const data = localStorage.getItem(STORAGE_KEYS.TIPOS_CAJAS)
  return data ? JSON.parse(data) : TIPOS_CAJAS_DEFAULT
}

export const saveTipoCaja = (tipoCaja: TipoCaja): void => {
  const tipos = getTiposCajas()
  const index = tipos.findIndex(t => t.id === tipoCaja.id)
  if (index >= 0) {
    tipos[index] = tipoCaja
  } else {
    tipos.push(tipoCaja)
  }
  localStorage.setItem(STORAGE_KEYS.TIPOS_CAJAS, JSON.stringify(tipos))
}

export const deleteTipoCaja = (id: string): void => {
  const tipos = getTiposCajas().filter(t => t.id !== id)
  localStorage.setItem(STORAGE_KEYS.TIPOS_CAJAS, JSON.stringify(tipos))
}

// Clientes
export const getClientes = (): Cliente[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CLIENTES)
  return data ? JSON.parse(data) : []
}

export const saveCliente = (cliente: Cliente): void => {
  const clientes = getClientes()
  const index = clientes.findIndex(c => c.id === cliente.id)
  if (index >= 0) {
    clientes[index] = cliente
  } else {
    clientes.push(cliente)
  }
  localStorage.setItem(STORAGE_KEYS.CLIENTES, JSON.stringify(clientes))
}

export const deleteCliente = (id: string): void => {
  const clientes = getClientes().filter(c => c.id !== id)
  localStorage.setItem(STORAGE_KEYS.CLIENTES, JSON.stringify(clientes))
}

// Movimientos
export const getMovimientos = (): MovimientoCaja[] => {
  const data = localStorage.getItem(STORAGE_KEYS.MOVIMIENTOS)
  return data ? JSON.parse(data) : []
}

export const saveMovimiento = (movimiento: MovimientoCaja): void => {
  const movimientos = getMovimientos()
  movimientos.push(movimiento)
  localStorage.setItem(STORAGE_KEYS.MOVIMIENTOS, JSON.stringify(movimientos))
  
  // Actualizar saldo
  updateSaldo(movimiento)
}

const updateSaldo = (movimiento: MovimientoCaja): void => {
  const saldos = getSaldos()
  const key = `${movimiento.clienteId}-${movimiento.tipoCajaId}`
  const index = saldos.findIndex(s => 
    s.clienteId === movimiento.clienteId && s.tipoCajaId === movimiento.tipoCajaId
  )
  
  let cantidad = 0
  if (index >= 0) {
    cantidad = saldos[index].cantidad
  }
  
  switch (movimiento.tipo) {
    case 'entrega':
      cantidad += movimiento.cantidad
      break
    case 'devolucion':
      cantidad -= movimiento.cantidad
      break
    case 'retiro':
      cantidad -= movimiento.cantidad
      break
    case 'ajuste':
      cantidad = movimiento.cantidad
      break
  }
  
  const saldo: SaldoCliente = {
    clienteId: movimiento.clienteId,
    tipoCajaId: movimiento.tipoCajaId,
    cantidad: Math.max(0, cantidad)
  }
  
  if (index >= 0) {
    saldos[index] = saldo
  } else {
    saldos.push(saldo)
  }
  
  localStorage.setItem(STORAGE_KEYS.SALDOS, JSON.stringify(saldos))
}

export const getSaldos = (): SaldoCliente[] => {
  const data = localStorage.getItem(STORAGE_KEYS.SALDOS)
  return data ? JSON.parse(data) : []
}

export const getSaldoCliente = (clienteId: string, tipoCajaId: string): number => {
  const saldos = getSaldos()
  const saldo = saldos.find(s => 
    s.clienteId === clienteId && s.tipoCajaId === tipoCajaId
  )
  return saldo ? saldo.cantidad : 0
}


