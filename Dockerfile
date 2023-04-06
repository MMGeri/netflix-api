FROM node:lts-alpine as builder

WORKDIR .

COPY ./package.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 10020

CMD [ "npm", "run", "start"]