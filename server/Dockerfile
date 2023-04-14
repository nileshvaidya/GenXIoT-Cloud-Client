FROM node:18

WORKDIR /app

COPY ./package*.json /app/

RUN npm install

COPY . .

# for typescript
RUN npm run build
# COPY ormconfig.json ./dist/
COPY .env ./dist/
WORKDIR /app/dist

EXPOSE 8080

CMD ["node", "src/server.js"]