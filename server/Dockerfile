FROM node:20-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos
COPY . .

# Exponer el puerto
EXPOSE 3000

# Comando para desarrollo (con watch)
CMD ["npm", "run", "dev"]

# Para producción usar:
# CMD ["npm", "start"]


