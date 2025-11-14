# Scripts de Despliegue

Este directorio contiene scripts para automatizar el despliegue en Raspberry Pi.

## Archivos

- `deploy.sh` - Script principal de despliegue
- `webhook-server.js` - Servidor webhook para recibir notificaciones de GitHub
- `webhook-pm2.json` - Configuración PM2 para el webhook server

## Uso

### Despliegue Manual

```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

### Webhook Server

```bash
cd scripts
npm install express
node webhook-server.js
```

### Con PM2

```bash
npm install -g pm2
cd scripts
pm2 start webhook-pm2.json
```

Ver `../DEPLOY.md` para instrucciones completas.

