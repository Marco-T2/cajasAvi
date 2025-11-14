export type TipoCaja = {
  id: string
  codigo: string
  nombre: string
  color: string
  activo: boolean
}

export type Cliente = {
  id: string
  nombre: string
  contacto?: string
  activo: boolean
}

export type MovimientoCaja = {
  id: string
  clienteId: string
  tipoCajaId: string
  cantidad: number
  fecha: string
  hora: string
  tipo: 'entrega' | 'devolucion' | 'retiro' | 'ajuste'
  motivo?: string
  observaciones?: string
}

export type SaldoCliente = {
  clienteId: string
  tipoCajaId: string
  cantidad: number
}


