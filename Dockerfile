FROM node:14

WORKDIR /opt/cafeteria-server

COPY . .

RUN npm ci

CMD ["npm", "start"]
