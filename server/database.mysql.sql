-- Script de creación de base de datos para MySQL
-- Ejecuta este script en tu base de datos Docker MySQL

-- Tabla de Tipos de Cajas
CREATE TABLE IF NOT EXISTS tipos_cajas (
    id VARCHAR(50) PRIMARY KEY,
    codigo VARCHAR(10) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    color VARCHAR(20) NOT NULL,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de Clientes
CREATE TABLE IF NOT EXISTS clientes (
    id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    contacto VARCHAR(200),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de Movimientos de Cajas
CREATE TABLE IF NOT EXISTS movimientos_cajas (
    id VARCHAR(50) PRIMARY KEY,
    cliente_id VARCHAR(50) NOT NULL,
    tipo_caja_id VARCHAR(50) NOT NULL,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    tipo ENUM('entrega', 'devolucion', 'retiro', 'ajuste') NOT NULL,
    motivo TEXT,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (tipo_caja_id) REFERENCES tipos_cajas(id) ON DELETE CASCADE
);

-- Tabla de Saldos (calculados automáticamente)
CREATE TABLE IF NOT EXISTS saldos_clientes (
    cliente_id VARCHAR(50) NOT NULL,
    tipo_caja_id VARCHAR(50) NOT NULL,
    cantidad INTEGER DEFAULT 0 CHECK (cantidad >= 0),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (cliente_id, tipo_caja_id),
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (tipo_caja_id) REFERENCES tipos_cajas(id) ON DELETE CASCADE
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_movimientos_cliente ON movimientos_cajas(cliente_id);
CREATE INDEX idx_movimientos_tipo_caja ON movimientos_cajas(tipo_caja_id);
CREATE INDEX idx_movimientos_fecha ON movimientos_cajas(fecha DESC);
CREATE INDEX idx_movimientos_tipo ON movimientos_cajas(tipo);

-- Insertar tipos de cajas por defecto
INSERT INTO tipos_cajas (id, codigo, nombre, color, activo) VALUES
    ('1', 'NEG', 'Negras', '#1e293b', true),
    ('2', 'VER', 'Verdes', '#10b981', true),
    ('3', 'ORU', 'Oruro', '#f59e0b', true)
ON DUPLICATE KEY UPDATE codigo=codigo;


