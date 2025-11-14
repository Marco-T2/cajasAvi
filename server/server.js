import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool, { testConnection } from './db.js';
import { tiposCajasRoutes } from './routes/tiposCajas.js';
import { clientesRoutes } from './routes/clientes.js';
import { movimientosRoutes } from './routes/movimientos.js';
import { saldosRoutes } from './routes/saldos.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/tipos-cajas', tiposCajasRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/movimientos', movimientosRoutes);
app.use('/api/saldos', saldosRoutes);

// Ruta de salud
app.get('/api/health', async (req, res) => {
  const dbConnected = await testConnection();
  res.json({
    status: 'ok',
    database: dbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: err.message
  });
});

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`🚀 Servidor API corriendo en http://localhost:${PORT}`);
  console.log(`📊 Endpoints disponibles:`);
  console.log(`   - GET  /api/health`);
  console.log(`   - GET  /api/tipos-cajas`);
  console.log(`   - GET  /api/clientes`);
  console.log(`   - GET  /api/movimientos`);
  console.log(`   - GET  /api/saldos`);
  
  // Probar conexión a la base de datos
  await testConnection();
});


