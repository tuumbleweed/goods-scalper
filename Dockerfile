FROM node:15

WORKDIR /mnt/ts-node-starter

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm i

COPY ./ ./
RUN npm run build