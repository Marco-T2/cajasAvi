# Servidor API - Control de Cajas AVI

Backend API para conectar la aplicación con tu base de datos Docker.

## Configuración

1. **Copia el archivo de configuración:**
```bash
cp .env.example .env
```

2. **Edita el archivo `.env` con tus credenciales de Docker:**
```env
DB_HOST=localhost          # O la IP de tu contenedor Docker
DB_PORT=5432               # Puerto de PostgreSQL (3306 para MySQL)
DB_NAME=cajas_avi          # Nombre de tu base de datos
DB_USER=postgres           # Usuario de la base de datos
DB_PASSWORD=tu_password    # Contraseña

PORT=3000                  # Puerto del servidor API
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
```

3. **Crea las tablas en tu base de datos Docker:**

Para PostgreSQL:
```bash
psql -h localhost -U postgres -d cajas_avi -f database.sql
```

O ejecuta el script `database.sql` en tu contenedor Docker.

Para MySQL:
```bash
mysql -h localhost -u root -p cajas_avi < database.mysql.sql
```

## Instalación

```bash
npm install
```

## Ejecutar

**Desarrollo:**
```bash
npm run dev
```

**Producción:**
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

## Endpoints

- `GET /api/health` - Estado del servidor y conexión a BD
- `GET /api/tipos-cajas` - Listar tipos de cajas
- `POST /api/tipos-cajas` - Crear tipo de caja
- `GET /api/clientes` - Listar clientes
- `POST /api/clientes` - Crear cliente
- `GET /api/movimientos` - Listar movimientos
- `POST /api/movimientos` - Crear movimiento
- `GET /api/saldos` - Listar saldos
- `GET /api/saldos/cliente/:id` - Saldos de un cliente

## Conexión con Docker

Si tu base de datos está en un contenedor Docker, asegúrate de:

1. **Exponer el puerto:** `docker run -p 5432:5432 ...`
2. **Usar la IP correcta:** Si Docker está en otra máquina, usa esa IP en `DB_HOST`
3. **Verificar red Docker:** Si la API también está en Docker, usa el nombre del servicio como `DB_HOST`


