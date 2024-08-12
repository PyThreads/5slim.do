# Usar la imagen base de Python 3.10
FROM node:21

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de la aplicación al contenedor
COPY ./app /app

RUN npm install && npm run build

# Comando de inicio de la aplicación Python
CMD ["npm", "start"]
