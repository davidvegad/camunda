FROM eclipse-temurin:21-jdk

# Instala netcat-openbsd
RUN apt-get update && apt-get install -y netcat-openbsd

# Directorio de trabajo
WORKDIR /app

# Copia el .jar y el script
COPY target/bpmn-engine-core-*.jar app.jar
COPY wait-for-it.sh wait-for-it.sh

# Da permisos de ejecución
RUN chmod +x wait-for-it.sh

# No usar ENTRYPOINT ni CMD aquí, porque el docker-compose usará "command"
