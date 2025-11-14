#!/usr/bin/env node

/**
 * Servidor webhook simple para recibir notificaciones de GitHub
 * Ejecuta el script de despliegue cuando hay un push a main
 * 
 * Instalación:
 * npm install express
 * 
 * Uso:
 * node scripts/webhook-server.js
 * 
 * Configura en GitHub:
 * Settings > Webhooks > Add webhook
 * Payload URL: http://tu-pi-ip:3001/webhook
 * Content type: application/json
 * Secret: (opcional, pero recomendado)
 */

const express = require('express');
const { exec } = require('child_process');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = process.env.WEBHOOK_PORT || 3001;
const SECRET = process.env.WEBHOOK_SECRET || ''; // Configura un secreto en GitHub
const DEPLOY_SCRIPT = path.join(__dirname, 'deploy.sh');

app.use(express.json());

// Middleware para verificar el secreto (si está configurado)
const verifySecret = (req, res, next) => {
  if (!SECRET) {
    return next();
  }

  const signature = req.headers['x-hub-signature-256'];
  if (!signature) {
    return res.status(401).send('Missing signature');
  }

  const hmac = crypto.createHmac('sha256', SECRET);
  const digest = 'sha256=' + hmac.update(JSON.stringify(req.body)).digest('hex');

  if (signature !== digest) {
    return res.status(401).send('Invalid signature');
  }

  next();
};

app.post('/webhook', verifySecret, (req, res) => {
  const event = req.headers['x-github-event'];
  const ref = req.body.ref;

  console.log(`📨 Evento recibido: ${event}, Branch: ${ref}`);

  // Solo procesar pushes a main
  if (event === 'push' && ref === 'refs/heads/main') {
    console.log('🚀 Iniciando despliegue automático...');
    
    exec(`bash ${DEPLOY_SCRIPT}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error en despliegue: ${error}`);
        return res.status(500).json({ error: 'Deployment failed', message: error.message });
      }
      
      console.log(stdout);
      if (stderr) {
        console.error(stderr);
      }
      
      res.json({ 
        success: true, 
        message: 'Deployment triggered successfully',
        output: stdout 
      });
    });
  } else {
    res.json({ message: 'Event ignored', event, ref });
  }
});

// Endpoint de salud
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'webhook-server' });
});

app.listen(PORT, () => {
  console.log(`🎣 Webhook server escuchando en puerto ${PORT}`);
  console.log(`📡 Configura en GitHub: http://tu-pi-ip:${PORT}/webhook`);
});

