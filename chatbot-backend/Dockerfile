FROM node:20
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
RUN rm -f /app/credentials.json /app/token.json
RUN npm install
EXPOSE 4000
CMD ["node", "server.js"]
