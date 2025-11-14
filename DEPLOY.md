# Guía de Despliegue Automático en Raspberry Pi

Esta guía te ayudará a configurar el despliegue automático desde GitHub a tu Raspberry Pi.

## 📋 Opciones de Despliegue

### Opción 1: GitHub Actions (Recomendado)

GitHub Actions ejecuta el despliegue desde los servidores de GitHub usando SSH.

#### Configuración:

1. **Agrega los secrets en GitHub:**
   - Ve a tu repositorio: `Settings > Secrets and variables > Actions`
   - Agrega los siguientes secrets:
     - `PI_HOST`: IP o dominio de tu Raspberry Pi
     - `PI_USER`: Usuario SSH (ej: `pi` o `ubuntu`)
     - `PI_SSH_KEY`: Tu clave SSH privada (sin contraseña recomendado)
     - `PI_PORT`: Puerto SSH (default: 22)
     - `PI_DEPLOY_PATH`: Ruta donde está el proyecto (ej: `/home/pi/projects`)

2. **Genera una clave SSH sin contraseña:**
```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions
# NO pongas contraseña cuando te lo pida
```

3. **Copia la clave pública a tu Pi:**
```bash
ssh-copy-id -i ~/.ssh/github_actions.pub pi@tu-pi-ip
```

4. **Copia el contenido de la clave privada:**
```bash
cat ~/.ssh/github_actions
# Copia todo el contenido y pégalo en el secret PI_SSH_KEY
```

5. **El workflow se ejecutará automáticamente** cuando hagas push a `main`

### Opción 2: Webhook Server (Alternativa)

Un servidor webhook que escucha notificaciones de GitHub y ejecuta el despliegue.

#### Configuración en Raspberry Pi:

1. **Instala las dependencias:**
```bash
cd /ruta/a/cajasAvi
npm install express  # Solo para el webhook server
```

2. **Configura el script de despliegue:**
```bash
chmod +x scripts/deploy.sh
# Edita scripts/deploy.sh y ajusta PROJECT_PATH
```

3. **Inicia el servidor webhook:**

**Opción A: Con PM2 (recomendado para producción)**
```bash
npm install -g pm2
cd scripts
pm2 start webhook-pm2.json
pm2 save
pm2 startup  # Sigue las instrucciones para iniciar en boot
```

**Opción B: Con systemd**
```bash
sudo nano /etc/systemd/system/cajas-webhook.service
```

Contenido del servicio:
```ini
[Unit]
Description=Cajas AVI Webhook Server
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/ruta/a/cajasAvi/scripts
ExecStart=/usr/bin/node webhook-server.js
Restart=always
Environment="WEBHOOK_PORT=3001"
Environment="WEBHOOK_SECRET=tu_secreto_aqui"

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable cajas-webhook
sudo systemctl start cajas-webhook
```

4. **Configura el webhook en GitHub:**
   - Ve a tu repositorio: `Settings > Webhooks > Add webhook`
   - **Payload URL**: `http://tu-pi-ip:3001/webhook`
   - **Content type**: `application/json`
   - **Secret**: (opcional, pero recomendado - usa el mismo que en el servidor)
   - **Events**: Selecciona "Just the push event"
   - Guarda

5. **Abre el puerto en el firewall (si es necesario):**
```bash
sudo ufw allow 3001/tcp
```

### Opción 3: Polling con Cron (Más simple, menos eficiente)

Ejecuta el script de despliegue periódicamente.

```bash
# Edita el crontab
crontab -e

# Agrega esta línea para verificar cada 5 minutos
*/5 * * * * cd /ruta/a/cajasAvi && git fetch && [ $(git rev-parse HEAD) != $(git rev-parse origin/main) ] && git pull && npm run build && docker-compose restart api-cajas
```

## 🔧 Configuración del Proyecto en el Pi

1. **Clona el repositorio:**
```bash
cd /ruta/deseada
git clone https://github.com/Marco-T2/cajasAvi.git
cd cajasAvi
```

2. **Instala dependencias:**
```bash
npm install
cd server && npm install && cd ..
```

3. **Configura las variables de entorno:**
```bash
cp server/.env.example server/.env
nano server/.env  # Edita con tus credenciales
```

4. **Configura Docker** (si usas Docker):
   - Agrega el servicio `api-cajas` a tu `docker-compose.yml`
   - Ejecuta: `docker-compose up -d api-cajas`

## 🔐 Seguridad

- **Nunca subas archivos `.env` a GitHub** (ya está en .gitignore)
- **Usa claves SSH sin contraseña** para GitHub Actions
- **Configura un secreto** para el webhook
- **Considera usar HTTPS** con un certificado SSL (Let's Encrypt)

## 🐛 Troubleshooting

### El despliegue no se ejecuta:
- Verifica que el workflow esté en `.github/workflows/deploy.yml`
- Revisa los logs de GitHub Actions
- Verifica que los secrets estén configurados correctamente

### El webhook no responde:
- Verifica que el servidor esté corriendo: `pm2 list` o `systemctl status cajas-webhook`
- Revisa los logs: `pm2 logs` o `journalctl -u cajas-webhook`
- Verifica que el puerto esté abierto: `netstat -tulpn | grep 3001`

### Error de permisos:
- Asegúrate de que el usuario tenga permisos en la carpeta del proyecto
- Verifica permisos de ejecución: `chmod +x scripts/deploy.sh`

## 📝 Notas

- El despliegue automático solo funciona para la rama `main`
- Los cambios en otras ramas no activarán el despliegue
- Puedes ejecutar el despliegue manualmente desde GitHub Actions si es necesario

