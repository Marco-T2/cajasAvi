# Instrucciones para integrar con tu Docker existente

## Opción 1: Usar una base de datos existente (db1 o db2)

### Paso 1: Crear la base de datos en tu contenedor existente

Conecta a tu contenedor db1 o db2 y crea la base de datos:

```bash
# Conectarte al contenedor
docker exec -it <nombre_contenedor_db1> mysql -u root -prootpass

# Crear la base de datos
CREATE DATABASE cajas_avi_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Salir
exit;
```

### Paso 2: Ejecutar el script SQL

```bash
# Copiar el script a tu contenedor
docker cp server/database.mysql.sql <nombre_contenedor_db1>:/tmp/init.sql

# Ejecutar el script
docker exec -it <nombre_contenedor_db1> mysql -u root -prootpass cajas_avi_db < /tmp/init.sql
```

O desde dentro del contenedor:
```bash
docker exec -it <nombre_contenedor_db1> mysql -u root -prootpass cajas_avi_db -e "source /tmp/init.sql"
```

### Paso 3: Agregar el servicio API a tu docker-compose.yml

Agrega este servicio a tu `docker-compose.yml`:

```yaml
  api-cajas:
    build:
      context: ./server
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=db1          # O db2 si prefieres
      - DB_PORT=3306
      - DB_NAME=cajas_avi_db
      - DB_USER=root
      - DB_PASSWORD=rootpass
      - PORT=3000
      - CORS_ORIGIN=http://localhost:5173,http://localhost:5174
    depends_on:
      - db1
    networks: [webnet]
    volumes:
      - ./server:/app
      - /app/node_modules
```

### Paso 4: Construir y ejecutar

```bash
docker-compose up -d api-cajas
```

## Opción 2: Crear una nueva base de datos (db3)

Si prefieres una base de datos separada, agrega esto a tu docker-compose.yml:

```yaml
  db3:
    image: mariadb:11
    environment:
      - MARIADB_ROOT_PASSWORD=rootpass
      - MARIADB_DATABASE=cajas_avi_db
      - MARIADB_USER=cajas
      - MARIADB_PASSWORD=cajaspass
    volumes:
      - db3_data:/var/lib/mysql
      - ./server/database.mysql.sql:/docker-entrypoint-initdb.d/01-init.sql
    networks: [webnet]

  api-cajas:
    build:
      context: ./server
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=db3
      - DB_PORT=3306
      - DB_NAME=cajas_avi_db
      - DB_USER=cajas
      - DB_PASSWORD=cajaspass
      - PORT=3000
      - CORS_ORIGIN=http://localhost:5173,http://localhost:5174
    depends_on:
      - db3
    networks: [webnet]
    volumes:
      - ./server:/app
      - /app/node_modules

volumes:
  db3_data:
```

## Verificar que funciona

1. **Verificar que la API está corriendo:**
```bash
curl http://localhost:3000/api/health
```

2. **Verificar desde Adminer:**
   - Ve a http://localhost:8081
   - Conecta con las credenciales de tu base de datos
   - Deberías ver las tablas: `tipos_cajas`, `clientes`, `movimientos_cajas`, `saldos_clientes`

## Configurar el frontend

Una vez que la API esté corriendo, necesitas modificar el frontend para que use la API en lugar de LocalStorage. Te paso los archivos necesarios después.

## Cloudflare Tunnel

Si tienes Cloudflare Tunnel configurado, puedes agregar la API así:

```yaml
# En tu configuración de Cloudflare Tunnel
- hostname: api-cajas.tudominio.com
  service: http://api-cajas:3000
```


