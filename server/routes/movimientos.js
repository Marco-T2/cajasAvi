import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Función para actualizar saldo después de un movimiento
const updateSaldo = async (clienteId, tipoCajaId, cantidad, tipo) => {
  // Obtener saldo actual
  const saldoResult = await pool.query(
    'SELECT cantidad FROM saldos_clientes WHERE cliente_id = ? AND tipo_caja_id = ?',
    [clienteId, tipoCajaId]
  );
  
  let nuevoSaldo = saldoResult.rows.length > 0 ? saldoResult.rows[0].cantidad : 0;
  
  // Calcular nuevo saldo según el tipo de movimiento
  switch (tipo) {
    case 'entrega':
      nuevoSaldo += cantidad;
      break;
    case 'devolucion':
    case 'retiro':
      nuevoSaldo -= cantidad;
      break;
    case 'ajuste':
      nuevoSaldo = cantidad;
      break;
  }
  
  nuevoSaldo = Math.max(0, nuevoSaldo);
  
  // Actualizar o insertar saldo (MySQL syntax)
  await pool.query(
    `INSERT INTO saldos_clientes (cliente_id, tipo_caja_id, cantidad, updated_at)
     VALUES (?, ?, ?, CURRENT_TIMESTAMP)
     ON DUPLICATE KEY UPDATE cantidad = ?, updated_at = CURRENT_TIMESTAMP`,
    [clienteId, tipoCajaId, nuevoSaldo, nuevoSaldo]
  );
};

// GET - Obtener todos los movimientos
router.get('/', async (req, res) => {
  try {
    const { tipo, cliente_id, tipo_caja_id, fecha_desde, fecha_hasta } = req.query;
    let query = `
      SELECT m.*, c.nombre as cliente_nombre, t.codigo as tipo_caja_codigo, t.nombre as tipo_caja_nombre
      FROM movimientos_cajas m
      JOIN clientes c ON m.cliente_id = c.id
      JOIN tipos_cajas t ON m.tipo_caja_id = t.id
      WHERE 1=1
    `;
    const params = [];
    
    if (tipo) {
      query += ` AND m.tipo = ?`;
      params.push(tipo);
    }
    if (cliente_id) {
      query += ` AND m.cliente_id = ?`;
      params.push(cliente_id);
    }
    if (tipo_caja_id) {
      query += ` AND m.tipo_caja_id = ?`;
      params.push(tipo_caja_id);
    }
    if (fecha_desde) {
      query += ` AND m.fecha >= ?`;
      params.push(fecha_desde);
    }
    if (fecha_hasta) {
      query += ` AND m.fecha <= ?`;
      params.push(fecha_hasta);
    }
    
    query += ' ORDER BY m.fecha DESC, m.hora DESC LIMIT 100';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Obtener un movimiento por ID
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT m.*, c.nombre as cliente_nombre, t.codigo as tipo_caja_codigo
       FROM movimientos_cajas m
       JOIN clientes c ON m.cliente_id = c.id
       JOIN tipos_cajas t ON m.tipo_caja_id = t.id
       WHERE m.id = ?`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Movimiento no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Crear un nuevo movimiento
router.post('/', async (req, res) => {
  try {
    const { id, cliente_id, tipo_caja_id, cantidad, fecha, hora, tipo, motivo, observaciones } = req.body;
    
    // Validar que el cliente y tipo de caja existan
    const clienteCheck = await pool.query('SELECT id FROM clientes WHERE id = ?', [cliente_id]);
    if (clienteCheck.rows.length === 0) {
      return res.status(400).json({ error: 'Cliente no encontrado' });
    }
    
    const tipoCajaCheck = await pool.query('SELECT id FROM tipos_cajas WHERE id = ?', [tipo_caja_id]);
    if (tipoCajaCheck.rows.length === 0) {
      return res.status(400).json({ error: 'Tipo de caja no encontrado' });
    }
    
    // Validar saldo para devoluciones y retiros
    if (tipo === 'devolucion' || tipo === 'retiro') {
      const saldoResult = await pool.query(
        'SELECT cantidad FROM saldos_clientes WHERE cliente_id = ? AND tipo_caja_id = ?',
        [cliente_id, tipo_caja_id]
      );
      const saldoActual = saldoResult.rows.length > 0 ? saldoResult.rows[0].cantidad : 0;
      if (cantidad > saldoActual) {
        return res.status(400).json({ 
          error: `Saldo insuficiente. Saldo disponible: ${saldoActual}` 
        });
      }
    }
    
    const movimientoId = id || Date.now().toString();
    
    // Insertar movimiento
    await pool.query(
      `INSERT INTO movimientos_cajas 
       (id, cliente_id, tipo_caja_id, cantidad, fecha, hora, tipo, motivo, observaciones)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        movimientoId,
        cliente_id,
        tipo_caja_id,
        cantidad,
        fecha,
        hora,
        tipo,
        motivo || null,
        observaciones || null
      ]
    );
    
    // Actualizar saldo
    await updateSaldo(cliente_id, tipo_caja_id, cantidad, tipo);
    
    const result = await pool.query('SELECT * FROM movimientos_cajas WHERE id = ?', [movimientoId]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as movimientosRoutes };
