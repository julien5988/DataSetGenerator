FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

COPY Server.js /usr/src/app/server.js


EXPOSE 3000

CMD ["node", "server.js"]
