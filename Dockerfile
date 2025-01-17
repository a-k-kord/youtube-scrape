FROM node:14.15.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install && npm run build

COPY . .

EXPOSE 8080

CMD [ "node", "server.js" ]
