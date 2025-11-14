import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET - Obtener todos los tipos de cajas
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tipos_cajas ORDER BY codigo'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Obtener un tipo de caja por ID
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tipos_cajas WHERE id = ?',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tipo de caja no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Crear un nuevo tipo de caja
router.post('/', async (req, res) => {
  try {
    const { id, codigo, nombre, color, activo } = req.body;
    const tipoId = id || Date.now().toString();
    
    await pool.query(
      `INSERT INTO tipos_cajas (id, codigo, nombre, color, activo)
       VALUES (?, ?, ?, ?, ?)`,
      [tipoId, codigo, nombre, color, activo !== undefined ? activo : true]
    );
    
    const result = await pool.query('SELECT * FROM tipos_cajas WHERE id = ?', [tipoId]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Ya existe un tipo de caja con ese código' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// PUT - Actualizar un tipo de caja
router.put('/:id', async (req, res) => {
  try {
    const { codigo, nombre, color, activo } = req.body;
    await pool.query(
      `UPDATE tipos_cajas
       SET codigo = ?, nombre = ?, color = ?, activo = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [codigo, nombre, color, activo, req.params.id]
    );
    
    const result = await pool.query('SELECT * FROM tipos_cajas WHERE id = ?', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tipo de caja no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Eliminar un tipo de caja
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tipos_cajas WHERE id = ?', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tipo de caja no encontrado' });
    }
    
    await pool.query('DELETE FROM tipos_cajas WHERE id = ?', [req.params.id]);
    res.json({ message: 'Tipo de caja eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as tiposCajasRoutes };
