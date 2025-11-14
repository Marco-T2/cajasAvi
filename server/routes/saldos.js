import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET - Obtener todos los saldos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, c.nombre as cliente_nombre, t.codigo as tipo_caja_codigo, t.nombre as tipo_caja_nombre
       FROM saldos_clientes s
       JOIN clientes c ON s.cliente_id = c.id
       JOIN tipos_cajas t ON s.tipo_caja_id = t.id
       ORDER BY c.nombre, t.codigo`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Obtener saldo de un cliente específico
router.get('/cliente/:clienteId', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, t.codigo as tipo_caja_codigo, t.nombre as tipo_caja_nombre
       FROM saldos_clientes s
       JOIN tipos_cajas t ON s.tipo_caja_id = t.id
       WHERE s.cliente_id = ?
       ORDER BY t.codigo`,
      [req.params.clienteId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Obtener saldo específico de cliente y tipo de caja
router.get('/cliente/:clienteId/tipo/:tipoCajaId', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT cantidad FROM saldos_clientes WHERE cliente_id = ? AND tipo_caja_id = ?',
      [req.params.clienteId, req.params.tipoCajaId]
    );
    const cantidad = result.rows.length > 0 ? result.rows[0].cantidad : 0;
    res.json({ cantidad });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as saldosRoutes };
