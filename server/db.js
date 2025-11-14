import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de la conexión a MySQL/MariaDB
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'db1',
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME || 'cajas_avi_db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'rootpass',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Función para probar la conexión
export const testConnection = async () => {
  try {
    const [rows] = await pool.query('SELECT NOW() as now');
    console.log('✅ Conexión exitosa a MySQL/MariaDB:', rows[0]);
    return true;
  } catch (error) {
    console.error('❌ Error al conectar:', error.message);
    return false;
  }
};

// Wrapper para mantener compatibilidad con el código existente
// Convierte los resultados de MySQL a formato similar a PostgreSQL (con .rows)
const originalQuery = pool.query.bind(pool);
pool.query = async function(sql, params) {
  try {
    const [rows, fields] = await originalQuery(sql, params);
    // Retornar en formato compatible con PostgreSQL (con .rows)
    return { rows, fields };
  } catch (error) {
    throw error;
  }
};

export default pool;
