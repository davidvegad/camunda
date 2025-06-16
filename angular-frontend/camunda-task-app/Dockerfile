# Etapa de build
FROM node:20 AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build -- --configuration production

# Etapa de producción
FROM nginx:alpine
COPY --from=build /app/dist/camunda-task-app/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
