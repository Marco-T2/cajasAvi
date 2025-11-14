#!/bin/bash

# Script de despliegue para Raspberry Pi
# Este script se ejecuta automáticamente cuando hay cambios en GitHub

set -e

echo "🚀 Iniciando despliegue..."

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Ruta del proyecto (ajusta según tu configuración)
PROJECT_PATH="/ruta/a/tu/proyecto/cajasAvi"
cd "$PROJECT_PATH" || exit 1

echo -e "${YELLOW}📥 Actualizando código desde GitHub...${NC}"
git pull origin main

echo -e "${YELLOW}📦 Instalando dependencias del frontend...${NC}"
if [ -f "package.json" ]; then
  npm install
fi

echo -e "${YELLOW}📦 Instalando dependencias del backend...${NC}"
if [ -d "server" ]; then
  cd server
  if [ -f "package.json" ]; then
    npm install
  fi
  cd ..
fi

echo -e "${YELLOW}🏗️ Construyendo frontend...${NC}"
npm run build

echo -e "${YELLOW}🐳 Reiniciando servicios Docker...${NC}"
if command -v docker-compose &> /dev/null; then
  if docker-compose ps | grep -q "api-cajas"; then
    docker-compose restart api-cajas
    echo -e "${GREEN}✅ Servicio api-cajas reiniciado${NC}"
  fi
elif command -v docker &> /dev/null; then
  if docker ps | grep -q "api-cajas"; then
    docker restart api-cajas
    echo -e "${GREEN}✅ Contenedor api-cajas reiniciado${NC}"
  fi
fi

echo -e "${GREEN}✅ Despliegue completado exitosamente${NC}"

