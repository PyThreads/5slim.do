# Usa una imagen ligera de Node 21 con npm
FROM node:21-slim

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

COPY ./  /app

ENV NEXT_PUBLIC_TIME_ZONE=America/Santo_Domingo
ENV NEXT_PUBLIC_API_URL=https://api.5slim.do/api/v1
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyD7Ma19YzVnx-a4KxPNyWfNqyrTLWqUlxI

# Instala dependencias solo de producción si estás en producción
RUN npm install --force && npm run build


# Comando por defecto para iniciar la app
CMD ["npm", "start"]
