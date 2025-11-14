import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET - Obtener todos los clientes
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM clientes ORDER BY nombre'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Obtener un cliente por ID
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM clientes WHERE id = ?',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Crear un nuevo cliente
router.post('/', async (req, res) => {
  try {
    const { id, nombre, contacto, activo } = req.body;
    const clienteId = id || Date.now().toString();
    
    await pool.query(
      `INSERT INTO clientes (id, nombre, contacto, activo)
       VALUES (?, ?, ?, ?)`,
      [clienteId, nombre, contacto || null, activo !== undefined ? activo : true]
    );
    
    const result = await pool.query('SELECT * FROM clientes WHERE id = ?', [clienteId]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Actualizar un cliente
router.put('/:id', async (req, res) => {
  try {
    const { nombre, contacto, activo } = req.body;
    await pool.query(
      `UPDATE clientes
       SET nombre = ?, contacto = ?, activo = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [nombre, contacto || null, activo, req.params.id]
    );
    
    const result = await pool.query('SELECT * FROM clientes WHERE id = ?', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Eliminar un cliente
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clientes WHERE id = ?', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    await pool.query('DELETE FROM clientes WHERE id = ?', [req.params.id]);
    res.json({ message: 'Cliente eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as clientesRoutes };
