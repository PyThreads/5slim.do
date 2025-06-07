# Usa una imagen ligera de Node 21 con npm
FROM node:21-slim

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

COPY ./  /app

# Instala dependencias solo de producción si estás en producción
RUN npm install --force && npm run build


# Comando por defecto para iniciar la app
CMD ["npm", "start"]
