FROM node:22-alpine

#installing dependencies
RUN apk add --no-cache \
    g++ \
    openjdk17 \
    python3 

WORKDIR /app

COPY package*.json ./

RUN npm i 

COPY . .

EXPOSE 8000

CMD [ "node", "index.js" ]