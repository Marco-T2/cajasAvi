# Control de Cajas AVI

Sistema web para el control y gestión de cajas de pollo faenado entregadas a clientes.

## 🚀 Características

- ✅ Gestión de tipos de cajas (NEG, VER, ORU y personalizados)
- ✅ Gestión de clientes
- ✅ Registro de entregas de cajas
- ✅ Registro de devoluciones de cajas
- ✅ Registro de retiros por mal estado
- ✅ Ajustes manuales de saldos
- ✅ Dashboard con estadísticas y movimientos recientes
- ✅ Cálculo automático de saldos por cliente y tipo de caja
- ✅ Interfaz moderna y responsive (optimizada para móviles)
- ✅ API REST con Node.js/Express
- ✅ Soporte para MySQL/MariaDB (Docker)

## 📋 Requisitos

- Node.js 18+ 
- npm o yarn
- Docker y Docker Compose (para la base de datos)

## 🛠️ Instalación

### Frontend

1. Instala las dependencias:
```bash
npm install
```

2. Inicia el servidor de desarrollo:
```bash
npm run dev
```

3. Abre tu navegador en `http://localhost:5173`

### Backend API

1. Ve a la carpeta del servidor:
```bash
cd server
npm install
```

2. Configura las variables de entorno:
```bash
cp .env.example .env
# Edita .env con tus credenciales de base de datos
```

3. Inicia el servidor:
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## 🐳 Configuración con Docker

Ver el archivo `INSTRUCCIONES_DOCKER.md` para integrar con tu configuración Docker existente.

### Opción rápida:

1. Agrega el servicio `api-cajas` a tu `docker-compose.yml` (ver `docker-compose.cajas.yml`)
2. Crea la base de datos y ejecuta el script SQL:
```bash
docker exec -i <contenedor_db> mysql -u root -prootpass < server/database.mysql.sql
```
3. Inicia el servicio:
```bash
docker-compose up -d api-cajas
```

## 📱 Uso

### Tipos de Cajas
- Por defecto incluye: Negras (NEG), Verdes (VER) y Oruro (ORU)
- Puedes agregar nuevos tipos de cajas con código, nombre y color personalizado

### Clientes
- Registra los clientes que reciben cajas
- Puedes agregar información de contacto

### Entregas
- Registra cada entrega de cajas a un cliente
- Incluye fecha, hora, tipo de caja y cantidad
- El sistema actualiza automáticamente el saldo

### Devoluciones
- Registra las devoluciones de cajas
- El sistema valida que no se devuelvan más cajas de las que tiene el cliente
- Permite múltiples devoluciones el mismo día

### Retiros
- Registra retiros de cajas por mal estado
- Requiere especificar el motivo del retiro
- Reduce el saldo del cliente

### Ajustes
- Permite ajustar manualmente los saldos
- Útil para correcciones de inventario o inventarios físicos

## 🏗️ Construcción para producción

### Frontend
```bash
npm run build
```
Los archivos se generarán en la carpeta `dist`.

### Backend
```bash
cd server
npm start
```

## 🛠️ Tecnologías

### Frontend
- React 18
- TypeScript
- Vite
- React Router
- date-fns
- Lucide React (iconos)

### Backend
- Node.js
- Express
- MySQL2 (para MariaDB/MySQL)
- CORS

### Base de Datos
- MySQL/MariaDB
- Docker

## 📁 Estructura del Proyecto

```
cajasAvi/
├── src/                    # Código fuente del frontend
│   ├── components/         # Componentes reutilizables
│   ├── pages/              # Páginas de la aplicación
│   ├── services/           # Servicios (API/LocalStorage)
│   └── types/              # Tipos TypeScript
├── server/                 # Backend API
│   ├── routes/             # Rutas de la API
│   ├── db.js               # Configuración de base de datos
│   └── server.js            # Servidor Express
├── public/                 # Archivos estáticos
└── dist/                   # Build de producción
```

## 🔌 API Endpoints

- `GET /api/health` - Estado del servidor y conexión a BD
- `GET /api/tipos-cajas` - Listar tipos de cajas
- `POST /api/tipos-cajas` - Crear tipo de caja
- `GET /api/clientes` - Listar clientes
- `POST /api/clientes` - Crear cliente
- `GET /api/movimientos` - Listar movimientos
- `POST /api/movimientos` - Crear movimiento
- `GET /api/saldos` - Listar saldos
- `GET /api/saldos/cliente/:id` - Saldos de un cliente

## 📝 Notas

- Por defecto, el frontend usa LocalStorage para almacenamiento local
- Para producción, configura la API para usar la base de datos MySQL/MariaDB
- La integración con WhatsApp para fotos puede agregarse en el futuro

## 📄 Licencia

Este proyecto es de uso privado.
